'use client'

import { motion } from 'framer-motion'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight
} from 'lucide-react'
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts'

// Mock data - substituir por dados reais
const portfolioData = {
  total: 250000,
  invested: 180000,
  profit: 70000,
  profitPercentage: 38.89,
  dailyChange: 2500,
  dailyChangePercentage: 1.01
}

const assetAllocation = [
  { name: 'Renda Variável', value: 95000, percentage: 38, color: '#60a5fa' },
  { name: 'Renda Fixa', value: 75000, percentage: 30, color: '#93c5fd' },
  { name: 'FIIs', value: 50000, percentage: 20, color: '#a78bfa' },
  { name: 'Fundos', value: 20000, percentage: 8, color: '#f59e0b' },
  { name: 'Cripto', value: 10000, percentage: 4, color: '#94a3b8' },
]

const stocks = [
  { ticker: 'PETR4', name: 'Petrobras PN', quantity: 500, avgPrice: 28.50, currentPrice: 32.80, total: 16400, profit: 2150, profitPercentage: 15.09 },
  { ticker: 'VALE3', name: 'Vale ON', quantity: 300, avgPrice: 65.20, currentPrice: 71.50, total: 21450, profit: 1890, profitPercentage: 9.66 },
  { ticker: 'ITUB4', name: 'Itaú PN', quantity: 800, avgPrice: 24.10, currentPrice: 26.90, total: 21520, profit: 2240, profitPercentage: 11.62 },
  { ticker: 'BBDC4', name: 'Bradesco PN', quantity: 1000, avgPrice: 14.80, currentPrice: 16.20, total: 16200, profit: 1400, profitPercentage: 9.46 },
  { ticker: 'WEGE3', name: 'WEG ON', quantity: 400, avgPrice: 38.50, currentPrice: 42.30, total: 16920, profit: 1520, profitPercentage: 9.87 },
]

const fixedIncome = [
  { name: 'Tesouro Selic 2029', value: 25000, rate: 13.75, maturity: '01/03/2029', type: 'Tesouro' },
  { name: 'CDB Inter 120% CDI', value: 20000, rate: 13.20, maturity: '15/08/2026', type: 'CDB' },
  { name: 'LCI XP 95% CDI', value: 15000, rate: 10.45, maturity: '20/12/2025', type: 'LCI' },
  { name: 'Tesouro IPCA+ 2035', value: 15000, rate: 6.42, maturity: '15/05/2035', type: 'Tesouro' },
]

const monthlyPerformance = [
  { month: 'Jan', value: 220000 },
  { month: 'Fev', value: 225000 },
  { month: 'Mar', value: 228000 },
  { month: 'Abr', value: 232000 },
  { month: 'Mai', value: 238000 },
  { month: 'Jun', value: 250000 },
]

export default function PortfolioPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Portfolio</h1>
          <p className="text-gray-400">Visão completa dos seus investimentos</p>
        </div>
        <select className="bg-surface border border-border/50 rounded-lg px-4 py-2.5 text-sm font-medium hover:border-primary/50 transition-colors">
          <option>Últimos 6 meses</option>
          <option>Este ano</option>
          <option>Todo período</option>
        </select>
      </div>

      {/* Main Stats - Clean & Professional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-surface via-surface to-surface-light border border-border/50 rounded-2xl p-8 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Patrimônio Total - Destaque */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patrimônio Total
              </span>
            </div>
            <div className="mb-4">
              <h2 className="text-5xl font-bold mb-2">
                {portfolioData.total.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0 
                })}
              </h2>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-success" />
                <span className="text-lg font-semibold text-success">
                  +{portfolioData.dailyChangePercentage}%
                </span>
                <span className="text-sm text-gray-500">hoje</span>
              </div>
            </div>
          </div>

          {/* Métricas Secundárias */}
          <div className="lg:col-span-3 grid grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-gray-500" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Investido</p>
              </div>
              <p className="text-3xl font-bold mb-1">
                {portfolioData.invested.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0 
                })}
              </p>
              <p className="text-xs text-gray-500">Capital aportado</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-success" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Lucro</p>
              </div>
              <p className="text-3xl font-bold mb-1 text-success">
                +{portfolioData.profit.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0 
                })}
              </p>
              <p className="text-xs text-success">+{portfolioData.profitPercentage.toFixed(2)}% retorno</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpRight className="w-4 h-4 text-primary" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hoje</p>
              </div>
              <p className="text-3xl font-bold mb-1 text-primary">
                +{portfolioData.dailyChange.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0 
                })}
              </p>
              <p className="text-xs text-primary">Variação do dia</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Performance</h3>
              <p className="text-sm text-gray-500">Evolução do patrimônio</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyPerformance}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
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
                formatter={(value: any) => [
                  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
                  'Patrimônio'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#60a5fa" 
                strokeWidth={2}
                fill="url(#portfolioGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Asset Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Alocação</h3>
              <p className="text-sm text-gray-500">Distribuição por classe</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <RechartsPie>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [
                    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
                    ''
                  ]}
                />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {assetAllocation.map((asset) => (
                <div key={asset.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-sm" 
                      style={{ backgroundColor: asset.color }}
                    />
                    <span className="text-sm text-gray-300">{asset.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{asset.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stocks Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface border border-border/50 rounded-2xl overflow-hidden relative z-10"
      >
        <div className="px-6 py-5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Renda Variável</h3>
              <p className="text-sm text-gray-500">Suas ações e ETFs</p>
            </div>
            <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium">
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ativo</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantidade</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preço Médio</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preço Atual</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lucro</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.ticker} className="border-b border-border/30 hover:bg-surface-light/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{stock.ticker.substring(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{stock.ticker}</p>
                        <p className="text-xs text-gray-500">{stock.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-medium">{stock.quantity}</td>
                  <td className="py-4 px-6 text-right font-mono text-sm text-gray-300">
                    {stock.avgPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-sm">
                    {stock.currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-4 px-6 text-right font-semibold">
                    {stock.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-bold text-success">
                        +{stock.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="text-xs text-success">
                        +{stock.profitPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Fixed Income Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface border border-border/50 rounded-2xl overflow-hidden relative z-10"
      >
        <div className="px-6 py-5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Renda Fixa</h3>
              <p className="text-sm text-gray-500">Títulos e aplicações</p>
            </div>
            <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium">
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Taxa</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
              </tr>
            </thead>
            <tbody>
              {fixedIncome.map((item, index) => (
                <tr key={index} className="border-b border-border/30 hover:bg-surface-light/50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-semibold">{item.name}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-secondary">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-semibold text-success">{item.rate.toFixed(2)}%</span>
                  </td>
                  <td className="py-4 px-6 text-right text-sm text-gray-400">
                    {item.maturity}
                  </td>
                  <td className="py-4 px-6 text-right font-semibold">
                    {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
