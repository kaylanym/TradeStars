'use client'

import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  PieChart,
  Activity
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
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Análise de Portfolio</h1>
            <p className="text-gray-400">Insights profundos sobre seus investimentos</p>
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Score Geral</span>
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <p className="text-4xl font-bold gradient-text mb-1">8.5</p>
          <p className="text-xs text-gray-400">Muito Bom</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Risco</span>
            <Activity className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-4xl font-bold text-secondary mb-1">Médio</p>
          <p className="text-xs text-gray-400">Balanceado</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Retorno Anual</span>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-4xl font-bold text-primary mb-1">+38.9%</p>
          <p className="text-xs text-gray-400">vs IBOV +24.2%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Sharpe Ratio</span>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-4xl font-bold mb-1">1.85</p>
          <p className="text-xs text-gray-400">Excelente</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Radar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Análise de Risco</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={riskMetrics}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="category" stroke="#9ca3af" />
              <PolarRadiusAxis stroke="#9ca3af" />
              <Radar name="Seu Portfolio" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
            </RadarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {riskMetrics.map((metric) => (
              <div key={metric.category} className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{metric.category}</span>
                <span className="text-sm font-semibold">{metric.score}/100</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Comparison */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-bold">Performance vs Benchmarks</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="portfolio" stroke="#10b981" strokeWidth={2} name="Seu Portfolio" />
              <Line type="monotone" dataKey="ibov" stroke="#3b82f6" strokeWidth={2} name="IBOVESPA" />
              <Line type="monotone" dataKey="cdi" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" name="CDI" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Sector Allocation Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Análise Setorial</h2>
        </div>

        <div className="space-y-4">
          {sectorAllocation.map((sector) => {
            const statusConfig = {
              over: { color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Acima' },
              under: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Abaixo' },
              good: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'Bom' },
              perfect: { color: 'text-primary', bg: 'bg-primary/20', label: 'Ideal' }
            }
            const config = statusConfig[sector.status as keyof typeof statusConfig]

            return (
              <div key={sector.sector} className="bg-surface-light rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{sector.sector}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{sector.percentage}%</p>
                    <p className="text-xs text-gray-400">Meta: {sector.recommended}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${config.bg.replace('/20', '')}`}
                    style={{ width: `${(sector.percentage / sector.recommended) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-xl p-6"
      >
        <h2 className="text-xl font-bold mb-6">Recomendações Personalizadas</h2>

        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const typeConfig = {
              warning: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
              info: { icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
              success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' }
            }
            const config = typeConfig[rec.type as keyof typeof typeConfig]
            const Icon = config.icon

            const priorityConfig = {
              high: 'bg-red-500',
              medium: 'bg-orange-500',
              low: 'bg-gray-500'
            }

            return (
              <div
                key={index}
                className={`${config.bg} border ${config.border} rounded-lg p-4`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{rec.title}</h3>
                      <span className={`w-2 h-2 rounded-full ${priorityConfig[rec.priority as keyof typeof priorityConfig]}`} />
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{rec.description}</p>
                    <button className="text-sm font-medium text-primary hover:underline">
                      {rec.action} →
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
