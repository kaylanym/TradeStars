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
  { name: 'Renda Variável', value: 95000, percentage: 38, color: '#60a5fa' },
  { name: 'Renda Fixa', value: 75000, percentage: 30, color: '#93c5fd' },
  { name: 'FIIs', value: 50000, percentage: 20, color: '#a78bfa' },
  { name: 'Fundos', value: 20000, percentage: 8, color: '#94a3b8' },
  { name: 'Cripto', value: 10000, percentage: 4, color: '#cbd5e1' },
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
          className="bg-surface border border-border/50 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">Patrimônio Total</span>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-2xl font-semibold mb-1 text-white">
            {portfolioData.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <div className="flex items-center gap-1 text-primary text-xs font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>+{portfolioData.dailyChangePercentage}% hoje</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border/50 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">Investido</span>
            <TrendingDown className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-2xl font-semibold mb-1 text-white">
            {portfolioData.invested.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-xs text-gray-500">Capital aportado</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-border/50 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">Lucro Total</span>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-2xl font-semibold mb-1 text-primary">
            +{portfolioData.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-xs text-primary font-medium">+{portfolioData.profitPercentage.toFixed(2)}%</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-border/50 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">Variação Dia</span>
            <ArrowUpRight className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-2xl font-semibold mb-1 text-primary">
            +{portfolioData.dailyChange.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-xs text-primary font-medium">+{portfolioData.dailyChangePercentage}%</span>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface border border-border/50 rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-4 h-4 text-gray-500" />
            <h2 className="text-lg font-semibold text-white">Alocação de Ativos</h2>
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
          className="bg-surface border border-border/50 rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <h2 className="text-lg font-semibold text-white">Performance Mensal</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" strokeWidth={0.5} />
              <XAxis dataKey="month" stroke="#71717a" tick={{ fontSize: 12 }} />
              <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '6px', fontSize: '12px' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Stocks Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border/50 rounded-lg p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Renda Variável</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Ativo</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">Qtd</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">Preço Médio</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">Preço Atual</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">Total</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">Lucro</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.ticker} className="border-b border-border/30 hover:bg-surface-light transition-colors">
                  <td className="py-3 px-3">
                    <div>
                      <p className="font-medium text-sm text-white">{stock.ticker}</p>
                      <p className="text-xs text-gray-500">{stock.name}</p>
                    </div>
                  </td>
                  <td className="text-right py-3 px-3 text-sm text-gray-400">{stock.quantity}</td>
                  <td className="text-right py-3 px-3 text-sm text-gray-400">
                    {stock.avgPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="text-right py-3 px-3 text-sm font-medium text-white">
                    {stock.currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="text-right py-3 px-3 text-sm font-medium text-white">
                    {stock.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="text-right py-3 px-3">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-primary font-medium text-sm">
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
        className="bg-surface border border-border/50 rounded-lg p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Renda Fixa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fixedIncome.map((asset) => (
            <div key={asset.name} className="bg-surface-light border border-border/30 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-sm text-white">{asset.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded mt-1 inline-block">
                    {asset.type}
                  </span>
                </div>
                <p className="text-lg font-semibold text-white">
                  {asset.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs mt-4">
                <div>
                  <p className="text-gray-500">Taxa</p>
                  <p className="font-medium text-primary mt-0.5">{asset.rate}% a.a.</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Vencimento</p>
                  <p className="font-medium text-white mt-0.5">{asset.maturity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
