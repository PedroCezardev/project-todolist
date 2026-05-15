"use client"

import React, { useState, useEffect, useMemo, ChangeEvent, useCallback } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
} from '@tanstack/react-table';
// Adicionei o icone Trash2 aqui
import { ChevronDown, PlusCircle, Trophy, CheckCircle2, Circle, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// IMPORTANTE: Adicionei excluirTarefa na importação
import { TarefaData, listarTarefas, criarTarefa, toggleConcluirTarefa, excluirTarefa } from '@/services/tarefaService';

interface ToastMessage {
  severity: 'success' | 'error' | 'warning';
  summary: string;
  detail: string;
}

const tarefaDataPadrao: TarefaData = {
  titulo: '',
  categoria: 'Estudos', // Defina um valor padrão que exista no seu Select
  dificuldade: 'Fácil',
  concluido: false,
};

export default function TarefaTable() {
  const [tarefas, setTarefas] = useState<TarefaData[]>([]);
  const [tarefaDialog, setTarefaDialog] = useState(false);
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<TarefaData>(tarefaDataPadrao);
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  
  const [mensagem, setMensagem] = useState<ToastMessage | null>(null);

  const xpTotal = useMemo(() => {
    return tarefas
      .filter(t => t.concluido)
      .reduce((acc, curr) => {
        if (curr.dificuldade === 'Fácil') return acc + 10;
        if (curr.dificuldade === 'Médio') return acc + 30;
        if (curr.dificuldade === 'Difícil') return acc + 50;
        return acc;
      }, 0);
  }, [tarefas]);

  const showToast = useCallback((msg: ToastMessage) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(null), 3000);
  }, []);

  const carregarTarefas = async () => {
    const dados = await listarTarefas();
    setTarefas(dados);
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  const saveTarefa = async () => {
    if (!tarefaEmEdicao.titulo.trim()) {
      showToast({ severity: 'error', summary: 'Erro', detail: 'O título é obrigatório.' });
      return;
    }

    try {
      await criarTarefa(tarefaEmEdicao);
      showToast({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa criada! +XP disponível.' });
      setTarefaDialog(false);
      setTarefaEmEdicao(tarefaDataPadrao);
      carregarTarefas();
    } catch (error) {
      console.error(error);
      showToast({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar.' });
    }
  };

  const handleToggleConcluir = async (tarefa: TarefaData) => {
    if (!tarefa.objectId) return;

    const novasTarefas = tarefas.map(t => 
        t.objectId === tarefa.objectId ? { ...t, concluido: !t.concluido } : t
    );
    setTarefas(novasTarefas);

    const sucesso = await toggleConcluirTarefa(tarefa.objectId, tarefa.concluido);
    
    if (!sucesso) {
        showToast({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar status.' });
        carregarTarefas(); 
    } else {
        const msg = !tarefa.concluido ? "Tarefa Concluída! XP Ganho! 🚀" : "Tarefa reaberta.";
        showToast({ severity: 'success', summary: 'Sucesso', detail: msg });
    }
  };

  // --- NOVA FUNÇÃO DE EXCLUIR ---
  const handleDelete = async (id?: string) => {
    if (!id) return;
    
    // Confirmação simples
    if (!confirm("Tem certeza que deseja excluir esta missão?")) return;

    // Atualização otimista
    setTarefas(prev => prev.filter(t => t.objectId !== id));

    const sucesso = await excluirTarefa(id);
    if (sucesso) {
        showToast({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa excluída.' });
    } else {
        showToast({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir.' });
        carregarTarefas(); // Reverte se der erro
    }
  }

  const columns: ColumnDef<TarefaData>[] = [
    {
      id: 'status',
      header: 'Status',
      // MELHORIA 1: Status com Texto e Ícone
      cell: ({ row }) => {
        const tarefa = row.original;
        return (
          <div className="flex items-center gap-2">
              <button onClick={() => handleToggleConcluir(tarefa)} className="transition-all active:scale-95">
                {tarefa.concluido ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                    <Circle className="h-6 w-6 text-gray-300 hover:text-gray-400" />
                )}
              </button>
              <span className={`text-sm font-medium ${tarefa.concluido ? 'text-green-600' : 'text-gray-500'}`}>
                {tarefa.concluido ? 'Concluído' : 'Pendente'}
              </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'titulo',
      header: 'Tarefa',
      cell: ({ row }) => (
        <span className={row.original.concluido ? "line-through text-gray-400" : "font-medium"}>
            {row.getValue('titulo')}
        </span>
      ),
    },
    {
      accessorKey: 'categoria',
      header: 'Categoria',
      cell: ({ row }) => <div className="text-sm text-gray-500">{row.getValue('categoria')}</div>,
    },
    {
      accessorKey: 'dificuldade',
      header: 'Nível / XP',
      cell: ({ row }) => {
        const dif = row.getValue('dificuldade') as string;
        let color = "bg-gray-100 text-gray-800";
        let xp = "0 XP";

        if(dif === 'Fácil') { color = "bg-green-100 text-green-800"; xp = "10 XP"; }
        if(dif === 'Médio') { color = "bg-yellow-100 text-yellow-800"; xp = "30 XP"; }
        if(dif === 'Difícil') { color = "bg-red-100 text-red-800"; xp = "50 XP"; }

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${color}`}>
                {dif} ({xp})
            </span>
        )
      },
    },
    // MELHORIA 2: Botão de Excluir
    {
        id: 'actions',
        header: 'Ações',
        cell: ({ row }) => {
            return (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(row.original.objectId)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )
        }
    }
  ];

  const table = useReactTable({
    data: tarefas,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, name: keyof TarefaData) => {
    // Força a tipagem do prev para evitar erro
    setTarefaEmEdicao((prev: TarefaData) => ({ ...prev, [name]: e.target.value }));
  };

  return (
    <div className="w-full space-y-4">
      {mensagem && (
        <div className={`fixed top-4 right-4 p-4 rounded shadow-lg z-50 text-white ${mensagem.severity === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            <strong>{mensagem.summary}</strong>: {mensagem.detail}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Suas Missões</h2>
            <p className="text-muted-foreground">Complete tarefas para ganhar XP!</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full shadow-md">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span className="font-bold text-lg">{xpTotal} XP</span>
            </div>
            <Button onClick={() => setTarefaDialog(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Nova Missão
            </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhuma missão encontrada. Bora proatividar?
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={tarefaDialog} onOpenChange={setTarefaDialog}>
        <DialogContent className='bg-white'>
            <DialogHeader>
                <DialogTitle>Nova Missão</DialogTitle>
                <DialogDescription>Defina sua tarefa e o nível de dificuldade para ganhar XP.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label>Título da Tarefa</Label>
                    <Input 
                        value={tarefaEmEdicao.titulo} 
                        onChange={(e) => onInputChange(e, 'titulo')}
                        placeholder="Ex: Estudar React" 
                    />
                </div>
                {/* MELHORIA 3: Select de Categoria Corrigido */}
                <div className="grid gap-2">
                    <Label>Categoria</Label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={tarefaEmEdicao.categoria} 
                        onChange={(e) => onInputChange(e, 'categoria')}
                    >
                        <option value="Estudos">Estudos</option>
                        <option value="Trabalho">Trabalho</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Pessoal">Pessoal</option>
                    </select>
                </div>
                <div className="grid gap-2">
                    <Label>Dificuldade</Label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={tarefaEmEdicao.dificuldade}
                        onChange={(e) => onInputChange(e, 'dificuldade')}
                    >
                        <option value="Fácil">Fácil (10 XP)</option>
                        <option value="Médio">Médio (30 XP)</option>
                        <option value="Difícil">Difícil (50 XP)</option>
                    </select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setTarefaDialog(false)}>Cancelar</Button>
                <Button onClick={saveTarefa}>Criar Missão</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}