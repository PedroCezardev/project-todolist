"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { Trophy, CheckCircle2, Clock, Target, TrendingUp } from "lucide-react"

import { listarTarefas, TarefaData } from "@/services/tarefaService"

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

export default function DashboardPage() {
  const [tarefas, setTarefas] = useState<TarefaData[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Buscar dados do Back4App
  useEffect(() => {
    const fetchData = async () => {
      const dados = await listarTarefas()
      setTarefas(dados)
      setLoading(false)
    }
    fetchData()
  }, [])

  // 2. Cálculos (KPIs) usando useMemo para performance
  const kpis = useMemo(() => {
    const concluidas = tarefas.filter(t => t.concluido)
    const pendentes = tarefas.filter(t => !t.concluido)
    
    const xpTotal = concluidas.reduce((acc, curr) => {
      if (curr.dificuldade === 'Fácil') return acc + 10;
      if (curr.dificuldade === 'Médio') return acc + 30;
      if (curr.dificuldade === 'Difícil') return acc + 50;
      return acc;
    }, 0)

    const taxaConclusao = tarefas.length > 0 
      ? Math.round((concluidas.length / tarefas.length) * 100) 
      : 0

    return { xpTotal, totalConcluidas: concluidas.length, totalPendentes: pendentes.length, taxaConclusao }
  }, [tarefas])

  // 3. Preparar dados para o Gráfico de Pizza (Categorias)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {}
    
    tarefas.filter(t => t.concluido).forEach(t => {
      const cat = t.categoria || 'Sem Categoria'
      counts[cat] = (counts[cat] || 0) + 1
    })

    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }))
  }, [tarefas])

  // 4. Preparar dados para o Gráfico de Barras (XP por Dificuldade)
  const difficultyData = useMemo(() => {
    const data = [
      { name: 'Fácil', xp: 0 },
      { name: 'Médio', xp: 0 },
      { name: 'Difícil', xp: 0 },
    ]

    tarefas.filter(t => t.concluido).forEach(t => {
      if (t.dificuldade === 'Fácil') data[0].xp += 10
      if (t.dificuldade === 'Médio') data[1].xp += 30
      if (t.dificuldade === 'Difícil') data[2].xp += 50
    })

    return data
  }, [tarefas])

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando seus dados...</div>
  }

  return (
    <div className="flex-grow overflow-y-auto bg-gray-50 p-4 md:p-8 rounded-lg">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Dashboard de Proatividade</h1>
          <p className="text-slate-600">Acompanhe sua evolução e ganho de XP.</p>
        </div>
        {/* Grid de KPIs */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* KPI 1: XP Total */}
          <Card className="shadow-md border-l-4 border-l-yellow-400">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">XP Acumulado</CardTitle>
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">{kpis.xpTotal} XP</div>
              <p className="text-xs text-slate-500 mt-1">Pontos totais de tarefas concluídas</p>
            </CardContent>
          </Card>

          {/* KPI 2: Missões Concluídas */}
          <Card className="shadow-md border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">Missões Concluídas</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">{kpis.totalConcluidas}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                {kpis.taxaConclusao}% de aproveitamento
              </div>
            </CardContent>
          </Card>

          {/* KPI 3: Pendências */}
          <Card className="shadow-md border-l-4 border-l-red-400">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">Pendências</CardTitle>
                <Clock className="h-5 w-5 text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">{kpis.totalPendentes}</div>
              <p className="text-xs text-slate-500 mt-1">Tarefas aguardando conclusão</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Gráfico 1: Onde está seu foco? (Categorias) */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Onde está seu foco?</CardTitle>
                <Target className="h-5 w-5 text-slate-500" />
              </div>
              <CardDescription>Distribuição de tarefas concluídas por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                    <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                    Nenhuma tarefa concluída ainda.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico 2: Origem do XP (Dificuldade) */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Origem do seu XP</CardTitle>
                <Trophy className="h-5 w-5 text-slate-500" />
              </div>
              <CardDescription>Quantidade de XP gerado por nível de dificuldade</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="xp" fill="#2D2499" radius={[4, 4, 0, 0]} barSize={50}>
                    {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}