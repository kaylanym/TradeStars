'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock,
  DollarSign,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { analyticsApi, DashboardStats, HourlyPerformance, SymbolPerformance, DailyPerformance } from '@/lib/api'
import { formatCurrency, formatPercent, cn } from '@/lib/utils'

// Mock data for when API is not available
const mockStats: DashboardStats = {
  total_trades: 147,
  winning_trades: 89,
  losing_trades: 58,
  win_rate: 60.54,
  total_profit: 4250.00,
  total_loss: 2150.00,
  net_profit: 2100.00,
  average_win: 47.75,
  average_loss: 37.07,
  profit_factor: 1.98,
  best_trade: 350.00,
  worst_trade: -180.00,
  average_duration: 12,
  suggested_daily_loss: 150.00,
  suggested_daily_gain: 300.00
}

const mockHourlyData: HourlyPerformance[] = [
  { hour: 9, hour_label: '09:00', trades: 15, profit: 450, win_rate: 73 },
  { hour: 10, hour_label: '10:00', trades: 22, profit: 680, win_rate: 68 },
  { hour: 11, hour_label: '11:00', trades: 18, profit: 320, win_rate: 55 },
  { hour: 12, hour_label: '12:00', trades: 8, profit: -120, win_rate: 37 },
  { hour: 13, hour_label: '13:00', trades: 12, profit: 150, win_rate: 50 },
  { hour: 14, hour_label: '14:00', trades: 25, profit: 520, win_rate: 64 },
  { hour: 15, hour_label: '15:00', trades: 28, profit: -280, win_rate: 42 },
  { hour: 16, hour_label: '16:00', trades: 19, profit: 380, win_rate: 63 },
]

const mockSymbolData: SymbolPerformance[] = [
  { symbol: 'WINZ24', trades: 65, profit: 1450, win_rate: 67.7, average_profit: 22.3 },
  { symbol: 'WDOZ24', trades: 42, profit: 820, win_rate: 59.5, average_profit: 19.5 },
  { symbol: 'PETR4', trades: 25, profit: -180, win_rate: 44.0, average_profit: -7.2 },
  { symbol: 'VALE3', trades: 15, profit: 10, win_rate: 53.3, average_profit: 0.7 },
]

const mockDailyData: DailyPerformance[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  profit: Math.random() * 400 - 100,
  cumulative: 0,
  trades: Math.floor(Math.random() * 10) + 2,
  win_rate: Math.random() * 40 + 40,
}))

// Calculate cumulative
mockDailyData.reduce((acc, day) => {
  day.cumulative = acc + day.profit
  return day.cumulative
}, 0)

const COLORS = ['#00d4aa', '#6366f1', '#f59e0b', '#ef4444']

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [hourlyData, setHourlyData] = useState<HourlyPerformance[]>(mockHourlyData)
  const [symbolData, setSymbolData] = useState<SymbolPerformance[]>(mockSymbolData)
  const [dailyData, setDailyData] = useState<DailyPerformance[]>(mockDailyData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, hourlyRes, symbolRes, dailyRes] = await Promise.all([
          analyticsApi.getDashboard(),
          analyticsApi.getHourlyPerformance(),
          analyticsApi.getSymbolPerformance(),
          analyticsApi.getDailyPerformance(30),
        ])
        
        if (statsRes.total_trades > 0) {
          setStats(statsRes)
          setHourlyData(hourlyRes)
          setSymbolData(symbolRes)
          setDailyData(dailyRes)
        }
      } catch (error) {
        console.log('Using mock data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    color = 'primary' 
  }: { 
    title: string
    value: string
    subtitle?: string
    icon: any
    trend?: 'up' | 'down'
    color?: 'primary' | 'success' | 'danger' | 'warning'
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-2xl p-6 border border-border card-hover"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 className={cn(
            'text-2xl font-bold stat-number',
            color === 'success' && 'text-success',
            color === 'danger' && 'text-danger',
            color === 'warning' && 'text-warning',
            color === 'primary' && 'text-white'
          )}>
            {value}
          </h3>
          {subtitle && (
            <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          color === 'success' && 'bg-success/10',
          color === 'danger' && 'bg-danger/10',
          color === 'warning' && 'bg-warning/10',
          color === 'primary' && 'bg-primary/10'
        )}>
          <Icon className={cn(
            'w-6 h-6',
            color === 'success' && 'text-success',
            color === 'danger' && 'text-danger',
            color === 'warning' && 'text-warning',
            color === 'primary' && 'text-primary'
          )} />
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-1">Visão geral da sua performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-surface border border-border rounded-xl px-4 py-2 text-sm">
            <option>Últimos 30 dias</option>
            <option>Últimos 7 dias</option>
            <option>Este mês</option>
            <option>Este ano</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Lucro Líquido"
          value={formatCurrency(stats.net_profit)}
          subtitle={`${stats.total_trades} operações`}
          icon={stats.net_profit >= 0 ? TrendingUp : TrendingDown}
          color={stats.net_profit >= 0 ? 'success' : 'danger'}
        />
        <StatCard
          title="Win Rate"
          value={formatPercent(stats.win_rate)}
          subtitle={`${stats.winning_trades}W / ${stats.losing_trades}L`}
          icon={Target}
          color={stats.win_rate >= 50 ? 'success' : 'warning'}
        />
        <StatCard
          title="Profit Factor"
          value={stats.profit_factor.toFixed(2)}
          subtitle="Ganho / Perda"
          icon={BarChart3}
          color={stats.profit_factor >= 1 ? 'success' : 'danger'}
        />
        <StatCard
          title="Duração Média"
          value={`${stats.average_duration} min`}
          subtitle="Por operação"
          icon={Clock}
          color="primary"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Gain Médio</p>
              <p className="text-xl font-bold text-success">{formatCurrency(stats.average_win)}</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Melhor trade: <span className="text-success font-medium">{formatCurrency(stats.best_trade)}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Loss Médio</p>
              <p className="text-xl font-bold text-danger">{formatCurrency(stats.average_loss)}</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Pior trade: <span className="text-danger font-medium">{formatCurrency(stats.worst_trade)}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Limites Sugeridos</p>
              <p className="text-sm font-medium text-primary">Baseado no seu histórico</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Loss diário máx:</span>
              <span className="text-danger font-medium">{formatCurrency(stats.suggested_daily_loss)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Meta de gain:</span>
              <span className="text-success font-medium">{formatCurrency(stats.suggested_daily_gain)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative Profit Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold mb-4">Evolução do Lucro</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => value.split('-').slice(1).join('/')}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#12121a', 
                    border: '1px solid #2a2a3a',
                    borderRadius: '12px'
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Lucro Acumulado']}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#00d4aa" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Hourly Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold mb-4">Performance por Horário</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis 
                  dataKey="hour_label" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#12121a', 
                    border: '1px solid #2a2a3a',
                    borderRadius: '12px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'profit') return [formatCurrency(value), 'Lucro']
                    return [value, name]
                  }}
                />
                <Bar 
                  dataKey="profit" 
                  radius={[4, 4, 0, 0]}
                >
                  {hourlyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Symbol Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold mb-4">Performance por Ativo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {symbolData.map((symbol, index) => (
            <div 
              key={symbol.symbol}
              className={cn(
                'p-4 rounded-xl border',
                symbol.profit >= 0 
                  ? 'bg-success/5 border-success/20' 
                  : 'bg-danger/5 border-danger/20'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">{symbol.symbol}</span>
                <span className={cn(
                  'text-sm font-medium px-2 py-1 rounded-lg',
                  symbol.win_rate >= 50 ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                )}>
                  {formatPercent(symbol.win_rate)}
                </span>
              </div>
              <div className={cn(
                'text-xl font-bold',
                symbol.profit >= 0 ? 'text-success' : 'text-danger'
              )}>
                {formatCurrency(symbol.profit)}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {symbol.trades} operações
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}


