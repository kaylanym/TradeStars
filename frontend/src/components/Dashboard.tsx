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
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight
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
  LineChart,
  Line
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

  const profitChange = stats.net_profit >= 0 ? '+12.5%' : '-8.3%'
  const isPositive = stats.net_profit >= 0

  return (
    <div className="space-y-8 relative">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Overview</h1>
          <p className="text-gray-400">Acompanhe sua performance em tempo real</p>
        </div>
        <select className="bg-surface border border-border rounded-lg px-4 py-2.5 text-sm font-medium hover:border-primary/50 transition-colors">
          <option>Últimos 30 dias</option>
          <option>Últimos 7 dias</option>
          <option>Este mês</option>
          <option>Este ano</option>
        </select>
      </div>

      {/* Main Performance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-surface via-surface to-surface-light border border-border/50 rounded-3xl p-8 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lucro Líquido - Destaque Principal */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isPositive ? "bg-success animate-pulse" : "bg-danger animate-pulse"
              )} />
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Lucro Líquido
              </span>
            </div>
            <div className="mb-4">
              <h2 className={cn(
                "text-5xl font-bold mb-2",
                isPositive ? "text-success" : "text-danger"
              )}>
                {formatCurrency(stats.net_profit)}
              </h2>
              <div className="flex items-center gap-2">
                {isPositive ? (
                  <ArrowUpRight className="w-5 h-5 text-success" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-danger" />
                )}
                <span className={cn(
                  "text-lg font-semibold",
                  isPositive ? "text-success" : "text-danger"
                )}>
                  {profitChange}
                </span>
                <span className="text-sm text-gray-500">vs período anterior</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm pt-4 border-t border-border/50">
              <div>
                <p className="text-gray-500 mb-1">Total Trades</p>
                <p className="text-xl font-bold">{stats.total_trades}</p>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div>
                <p className="text-gray-500 mb-1">Período</p>
                <p className="text-xl font-bold">30 dias</p>
              </div>
            </div>
          </div>

          {/* Métricas Principais - Limpo */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-primary" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</p>
              </div>
              <p className="text-3xl font-bold mb-1">{formatPercent(stats.win_rate)}</p>
              <p className="text-xs text-gray-500">{stats.winning_trades}W / {stats.losing_trades}L</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-secondary" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">P. Factor</p>
              </div>
              <p className="text-3xl font-bold mb-1">{stats.profit_factor.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Razão Ganho/Perda</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-success" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Média Win</p>
              </div>
              <p className="text-3xl font-bold mb-1">{formatCurrency(stats.average_win)}</p>
              <p className="text-xs text-gray-500">Por operação</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-warning" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Duração</p>
              </div>
              <p className="text-3xl font-bold mb-1">{stats.average_duration}min</p>
              <p className="text-xs text-gray-500">Tempo médio</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Performance Cumulativa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Performance Acumulada</h3>
              <p className="text-sm text-gray-500">Evolução do lucro nos últimos 30 dias</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#71717a"
                fontSize={11}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getDate()}/${date.getMonth() + 1}`
                }}
                tickLine={false}
              />
              <YAxis 
                stroke="#71717a"
                fontSize={11}
                tickFormatter={(value) => `R$ ${value}`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [formatCurrency(value), 'Lucro Acumulado']}
                labelFormatter={(label) => {
                  const date = new Date(label)
                  return date.toLocaleDateString('pt-BR')
                }}
              />
              <Area 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#00d4aa" 
                strokeWidth={2}
                fill="url(#profitGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance por Horário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Performance por Horário</h3>
              <p className="text-sm text-gray-500">Identifique seus melhores períodos</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="hour_label" 
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
              />
              <YAxis 
                stroke="#71717a"
                fontSize={11}
                tickFormatter={(value) => `R$ ${value}`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [formatCurrency(value), 'Lucro']}
              />
              <Bar 
                dataKey="profit" 
                radius={[4, 4, 0, 0]}
                fill="#6366f1"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Symbols Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface border border-border/50 rounded-2xl overflow-hidden relative z-10"
      >
        <div className="px-6 py-5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Top Ativos</h3>
              <p className="text-sm text-gray-500">Performance por ativo negociado</p>
            </div>
            <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium">
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ativo</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trades</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Win Rate</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lucro Médio</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lucro Total</th>
              </tr>
            </thead>
            <tbody>
              {symbolData.map((symbol, index) => (
                <tr 
                  key={symbol.symbol}
                  className="border-b border-border/30 hover:bg-surface-light/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {symbol.symbol.substring(0, 2)}
                        </span>
                      </div>
                      <span className="font-semibold">{symbol.symbol}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-medium">{symbol.trades}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={cn(
                      "font-semibold",
                      symbol.win_rate >= 50 ? "text-success" : "text-danger"
                    )}>
                      {formatPercent(symbol.win_rate)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-medium">
                    {formatCurrency(symbol.average_profit)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className={cn(
                      "font-bold text-base",
                      symbol.profit >= 0 ? "text-success" : "text-danger"
                    )}>
                      {formatCurrency(symbol.profit)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
