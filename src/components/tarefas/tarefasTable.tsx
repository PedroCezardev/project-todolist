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
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
} from '@tanstack/react-table';
import {
  PlusCircle,
  Pencil,
  Sparkles,
  Trophy,
  CheckCircle2,
  Circle,
  Trash2,
  User,
  BookOpen,
  Briefcase,
  Heart,
} from 'lucide-react';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  TarefaData,
  listarTarefas,
  criarTarefa,
  toggleConcluirTarefa,
  excluirTarefa,
  atualizarTarefa,
} from '@/services/tarefaService';

interface ToastMessage {
  severity: 'success' | 'error' | 'warning';
  summary: string;
  detail: string;
}

const tarefaDataPadrao: TarefaData = {
  titulo: '',
  categoria: 'Estudos',
  dificuldade: 'Fácil',
  concluido: false,
};

const CATEGORIAS_INFO = [
  { value: 'Pessoal', icon: User },
  { value: 'Estudos', icon: BookOpen },
  { value: 'Trabalho', icon: Briefcase },
  { value: 'Saúde', icon: Heart },
] as const;

const DIFICULDADES_INFO = [
  { value: 'Fácil', xp: 10, dotClass: 'bg-green-500' },
  { value: 'Médio', xp: 30, dotClass: 'bg-yellow-500' },
  { value: 'Difícil', xp: 50, dotClass: 'bg-red-500' },
] as const;

const getXP = (dif: string) =>
  DIFICULDADES_INFO.find((d) => d.value === dif)?.xp ?? 0;

const getCategoriaIcon = (cat: string) =>
  CATEGORIAS_INFO.find((c) => c.value === cat)?.icon ?? User;

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

  const handleDialogChange = (open: boolean) => {
    setTarefaDialog(open);
    if (!open) {
      setTarefaEmEdicao(tarefaDataPadrao);
    }
  };

  const saveTarefa = async () => {
    if (!tarefaEmEdicao.titulo.trim()) {
      showToast({ severity: 'error', summary: 'Erro', detail: 'O título é obrigatório.' });
      return;
    }

    const isEdicao = !!tarefaEmEdicao.objectId;

    try {
      if (isEdicao && tarefaEmEdicao.objectId) {
        const sucesso = await atualizarTarefa(tarefaEmEdicao.objectId, {
          titulo: tarefaEmEdicao.titulo,
          categoria: tarefaEmEdicao.categoria,
          dificuldade: tarefaEmEdicao.dificuldade,
        });
        if (!sucesso) throw new Error('Falha ao atualizar');
        showToast({ severity: 'success', summary: 'Sucesso', detail: 'Missão atualizada!' });
      } else {
        await criarTarefa(tarefaEmEdicao);
        showToast({ severity: 'success', summary: 'Sucesso', detail: 'Missão criada! +XP disponível.' });
      }
      setTarefaDialog(false);
      setTarefaEmEdicao(tarefaDataPadrao);
      carregarTarefas();
    } catch (error) {
      console.error(error);
      showToast({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar.' });
    }
  };

  const handleSubmitDialog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveTarefa();
  };

  const handleEdit = (tarefa: TarefaData) => {
    setTarefaEmEdicao(tarefa);
    setTarefaDialog(true);
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

  const handleDelete = async (id?: string) => {
    if (!id) return;

    if (!confirm("Tem certeza que deseja excluir esta missão?")) return;

    setTarefas(prev => prev.filter(t => t.objectId !== id));

    const sucesso = await excluirTarefa(id);
    if (sucesso) {
        showToast({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa excluída.' });
    } else {
        showToast({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir.' });
        carregarTarefas();
    }
  }

  const columns: ColumnDef<TarefaData>[] = [
    {
      id: 'status',
      header: 'Status',
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
    {
        id: 'actions',
        header: 'Ações',
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(row.original)}
                        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        title="Editar missão"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(row.original.objectId)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Excluir missão"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
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
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, name: keyof TarefaData) => {
    setTarefaEmEdicao((prev: TarefaData) => ({ ...prev, [name]: e.target.value }));
  };

  const CategoriaIconAtual = getCategoriaIcon(tarefaEmEdicao.categoria);
  const xpAtual = getXP(tarefaEmEdicao.dificuldade);

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
            <Button onClick={() => setTarefaDialog(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                <PlusCircle className="mr-2 h-4 w-4" /> Nova Missão
            </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow overflow-hidden">
        <div className="max-h-[75vh] overflow-auto">
          <table className="w-full caption-bottom text-sm min-w-[800px] lg:min-w-0">
            <TableHeader className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgb(0_0_0_/_0.06)]">
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
          </table>
        </div>
      </div>

      <Dialog open={tarefaDialog} onOpenChange={handleDialogChange}>
        <DialogContent className="bg-white sm:max-w-md p-0 gap-0">
          <form onSubmit={handleSubmitDialog}>
            <DialogHeader className="p-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <DialogTitle className="text-xl">
                    {tarefaEmEdicao.objectId ? 'Editar Missão' : 'Nova Missão'}
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    {tarefaEmEdicao.objectId
                      ? 'Ajuste os detalhes da sua missão'
                      : 'Defina sua tarefa para ganhar XP'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-5 space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="titulo-tarefa"
                  className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                >
                  Título
                </Label>
                <Input
                  id="titulo-tarefa"
                  value={tarefaEmEdicao.titulo}
                  onChange={(e) => onInputChange(e, 'titulo')}
                  placeholder="Ex: Estudar React"
                  autoFocus
                  className="h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Categoria
                  </Label>
                  <Select
                    value={tarefaEmEdicao.categoria}
                    onValueChange={(value) =>
                      setTarefaEmEdicao((prev: TarefaData) => ({ ...prev, categoria: value }))
                    }
                  >
                    <SelectTrigger className="h-10">
                      <span className="flex items-center gap-2">
                        <CategoriaIconAtual className="h-4 w-4 text-gray-500 shrink-0" />
                        <SelectValue />
                      </span>
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {CATEGORIAS_INFO.map(({ value, icon: Icon }) => (
                        <SelectItem key={value} value={value}>
                          <span className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-gray-500" />
                            {value}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Dificuldade
                  </Label>
                  <Select
                    value={tarefaEmEdicao.dificuldade}
                    onValueChange={(value) =>
                      setTarefaEmEdicao((prev: TarefaData) => ({ ...prev, dificuldade: value }))
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {DIFICULDADES_INFO.map(({ value, xp, dotClass }) => (
                        <SelectItem key={value} value={value}>
                          <span className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
                            {value} · {xp} XP
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100 shrink-0">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="text-sm leading-snug">
                  <span className="text-gray-600">Você ganhará </span>
                  <span className="font-bold text-gray-900">{xpAtual} XP</span>
                  <span className="text-gray-600"> ao completar essa missão.</span>
                </div>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 sm:rounded-b-lg">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {tarefaEmEdicao.objectId ? 'Salvar Alterações' : 'Criar Missão'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
