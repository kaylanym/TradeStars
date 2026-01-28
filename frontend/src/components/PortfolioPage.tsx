'use client'

import { motion } from 'framer-motion'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

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
  { name: 'Renda Variável', value: 95000, percentage: 38, color: '#10b981' },
  { name: 'Renda Fixa', value: 75000, percentage: 30, color: '#3b82f6' },
  { name: 'FIIs', value: 50000, percentage: 20, color: '#8b5cf6' },
  { name: 'Fundos', value: 20000, percentage: 8, color: '#f59e0b' },
  { name: 'Cripto', value: 10000, percentage: 4, color: '#ec4899' },
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
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Wallet className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Meu Portfolio</h1>
            <p className="text-gray-400">Visão geral dos seus investimentos</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Patrimônio Total</span>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold mb-1">
            {portfolioData.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <div className="flex items-center gap-1 text-primary text-sm">
            <ArrowUpRight className="w-4 h-4" />
            <span>+{portfolioData.dailyChangePercentage}% hoje</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Investido</span>
            <TrendingDown className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold mb-1">
            {portfolioData.invested.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-sm text-gray-400">Capital aportado</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Lucro Total</span>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold mb-1 text-primary">
            +{portfolioData.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-sm text-primary">+{portfolioData.profitPercentage.toFixed(2)}%</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Variação Dia</span>
            <ArrowUpRight className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold mb-1 text-primary">
            +{portfolioData.dailyChange.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-sm text-primary">+{portfolioData.dailyChangePercentage}%</span>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Alocação de Ativos</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={assetAllocation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {assetAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
            </RechartsPie>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {assetAllocation.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">{item.name}</p>
                  <p className="text-sm font-semibold">{item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-bold">Performance Mensal</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
              <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Stocks Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-xl p-6"
      >
        <h2 className="text-xl font-bold mb-4">Renda Variável</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Ativo</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Qtd</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Preço Médio</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Preço Atual</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Total</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Lucro</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.ticker} className="border-b border-border/50 hover:bg-surface-light transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold">{stock.ticker}</p>
                      <p className="text-xs text-gray-400">{stock.name}</p>
                    </div>
                  </td>
                  <td className="text-right py-4 px-4">{stock.quantity}</td>
                  <td className="text-right py-4 px-4">
                    {stock.avgPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="text-right py-4 px-4 font-semibold">
                    {stock.currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="text-right py-4 px-4 font-semibold">
                    {stock.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="text-right py-4 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-primary font-semibold">
                        +{stock.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="text-xs text-primary">
                        (+{stock.profitPercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Fixed Income */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-xl p-6"
      >
        <h2 className="text-xl font-bold mb-4">Renda Fixa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fixedIncome.map((asset) => (
            <div key={asset.name} className="bg-surface-light border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{asset.name}</h3>
                  <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                    {asset.type}
                  </span>
                </div>
                <p className="text-xl font-bold">
                  {asset.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm mt-4">
                <div>
                  <p className="text-gray-400">Taxa</p>
                  <p className="font-semibold text-primary">{asset.rate}% a.a.</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400">Vencimento</p>
                  <p className="font-semibold">{asset.maturity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
