'use client'

import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  PieChart as PieChartIcon,
  Activity,
  ChevronRight,
  Info
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'

// Mock data
const riskMetrics = [
  { category: 'Diversificação', score: 75, max: 100 },
  { category: 'Liquidez', score: 80, max: 100 },
  { category: 'Volatilidade', score: 65, max: 100 },
  { category: 'Retorno/Risco', score: 70, max: 100 },
  { category: 'Proteção', score: 60, max: 100 },
]

const sectorAllocation = [
  { sector: 'Financeiro', percentage: 35, recommended: 25, status: 'over' },
  { sector: 'Commodities', percentage: 25, recommended: 20, status: 'good' },
  { sector: 'Consumo', percentage: 15, recommended: 15, status: 'perfect' },
  { sector: 'Tecnologia', percentage: 10, recommended: 20, status: 'under' },
  { sector: 'Energia', percentage: 10, recommended: 12, status: 'good' },
  { sector: 'Saúde', percentage: 5, recommended: 8, status: 'under' },
]

const recommendations = [
  {
    type: 'warning',
    title: 'Alta concentração no setor financeiro',
    description: 'Você tem 35% do portfolio em ações do setor financeiro. Recomendamos reduzir para até 25%.',
    action: 'Reduzir exposição',
    priority: 'high'
  },
  {
    type: 'info',
    title: 'Oportunidade em Tecnologia',
    description: 'Setor de tecnologia está sub-representado (10% vs 20% recomendado). Considere aumentar exposição.',
    action: 'Avaliar ativos',
    priority: 'medium'
  },
  {
    type: 'success',
    title: 'Boa diversificação em Renda Fixa',
    description: 'Sua alocação em renda fixa está bem balanceada com diferentes vencimentos e indexadores.',
    action: 'Manter estratégia',
    priority: 'low'
  },
  {
    type: 'warning',
    title: 'Baixa liquidez em FIIs',
    description: 'Alguns fundos imobiliários no portfolio têm baixo volume de negociação.',
    action: 'Revisar posições',
    priority: 'medium'
  },
]

const performanceComparison = [
  { month: 'Jan', portfolio: 2.5, ibov: 1.8, cdi: 1.1 },
  { month: 'Fev', portfolio: 3.2, ibov: 2.5, cdi: 1.1 },
  { month: 'Mar', portfolio: 1.8, ibov: 1.2, cdi: 1.0 },
  { month: 'Abr', portfolio: 4.1, ibov: 3.2, cdi: 1.1 },
  { month: 'Mai', portfolio: 5.2, ibov: 4.0, cdi: 1.0 },
  { month: 'Jun', portfolio: 6.5, ibov: 5.1, cdi: 1.1 },
]

export default function AnalysisPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 left-20 w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 right-1/3 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Análise Profunda</h1>
          <p className="text-gray-400">Insights inteligentes sobre seu portfolio</p>
        </div>
        <select className="bg-surface border border-border/50 rounded-lg px-4 py-2.5 text-sm font-medium hover:border-primary/50 transition-colors">
          <option>Últimos 6 meses</option>
          <option>Este ano</option>
          <option>Todo período</option>
        </select>
      </div>

      {/* Score Cards - Clean */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Score Geral</span>
          </div>
          <p className="text-4xl font-bold mb-1">8.5</p>
          <p className="text-xs text-gray-500">Muito Bom</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-surface border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Risco</span>
          </div>
          <p className="text-4xl font-bold mb-1">Médio</p>
          <p className="text-xs text-gray-500">Balanceado</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Retorno Anual</span>
          </div>
          <p className="text-4xl font-bold mb-1 text-success">+38.9%</p>
          <p className="text-xs text-gray-500">vs IBOV +24.2%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-secondary" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sharpe Ratio</span>
          </div>
          <p className="text-4xl font-bold mb-1">1.85</p>
          <p className="text-xs text-gray-500">Excelente</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Risk Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Análise de Risco</h3>
              <p className="text-sm text-gray-500">Métricas de segurança do portfolio</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={riskMetrics}>
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis dataKey="category" stroke="#71717a" fontSize={11} />
              <PolarRadiusAxis stroke="#71717a" />
              <Radar name="Score" dataKey="score" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/50">
            {riskMetrics.map((metric) => (
              <div key={metric.category} className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{metric.category}</span>
                <span className="text-sm font-semibold text-primary">{metric.score}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-surface border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Performance vs Benchmarks</h3>
              <p className="text-sm text-gray-500">Comparação com índices</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={performanceComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#71717a" 
                fontSize={11}
                tickLine={false}
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`${value}%`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Line type="monotone" dataKey="portfolio" stroke="#60a5fa" strokeWidth={2} name="Portfolio" dot={false} />
              <Line type="monotone" dataKey="ibov" stroke="#94a3b8" strokeWidth={2} name="IBOVESPA" dot={false} />
              <Line type="monotone" dataKey="cdi" stroke="#71717a" strokeWidth={2} strokeDasharray="5 5" name="CDI" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Sector Allocation Analysis - Fixed & Clean */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface border border-border/50 rounded-2xl overflow-hidden relative z-10"
      >
        <div className="px-6 py-5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Análise Setorial</h3>
              <p className="text-sm text-gray-500">Distribuição por setor vs recomendado</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {sectorAllocation.map((sector) => {
              const statusConfig = {
                over: { color: 'text-warning', icon: '↑', label: 'Acima' },
                under: { color: 'text-primary', icon: '↓', label: 'Abaixo' },
                good: { color: 'text-gray-400', icon: '•', label: 'Bom' },
                perfect: { color: 'text-success', icon: '✓', label: 'Ideal' }
              }
              const config = statusConfig[sector.status as keyof typeof statusConfig]
              
              // Limitar a barra a 100% para não vazar
              const barWidth = Math.min((sector.percentage / sector.recommended) * 100, 100)

              return (
                <div key={sector.sector} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{sector.sector}</h4>
                      <span className={`text-xs font-medium ${config.color}`}>
                        {config.icon} {config.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{sector.percentage}%</span>
                      <span className="text-xs text-gray-500 ml-2">
                        (meta: {sector.recommended}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-light rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-primary/50"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Recommendations - Clean & Professional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-surface border border-border/50 rounded-2xl p-6 relative z-10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Recomendações Personalizadas</h3>
            <p className="text-sm text-gray-500">Sugestões baseadas em IA</p>
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const typeConfig = {
              warning: { icon: AlertTriangle, color: 'text-warning' },
              info: { icon: Info, color: 'text-primary' },
              success: { icon: CheckCircle, color: 'text-success' }
            }
            const config = typeConfig[rec.type as keyof typeof typeConfig]
            const Icon = config.icon

            const priorityDot = {
              high: 'bg-danger',
              medium: 'bg-warning',
              low: 'bg-gray-500'
            }

            return (
              <div
                key={index}
                className="bg-surface-light/50 border border-border/30 rounded-lg p-5 hover:border-border/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="font-semibold">{rec.title}</h4>
                      <div className={`w-2 h-2 rounded-full ${priorityDot[rec.priority as keyof typeof priorityDot]} flex-shrink-0 mt-1.5`} />
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{rec.description}</p>
                    <button className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                      {rec.action}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
