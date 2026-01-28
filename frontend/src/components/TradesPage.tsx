'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { tradesApi, Trade } from '@/lib/api'
import { formatCurrency, formatDateTime, cn } from '@/lib/utils'

// Mock trades
const mockTrades: Trade[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  symbol: ['WINZ24', 'WDOZ24', 'PETR4', 'VALE3'][Math.floor(Math.random() * 4)],
  trade_type: Math.random() > 0.5 ? 'BUY' : 'SELL',
  volume: [1, 2, 5][Math.floor(Math.random() * 3)],
  entry_price: Math.random() * 100000 + 10000,
  exit_price: Math.random() * 100000 + 10000,
  profit: Math.random() * 500 - 150,
  commission: Math.random() * 5,
  swap: 0,
  open_time: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  close_time: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  duration_minutes: Math.floor(Math.random() * 60) + 5,
  source: 'CSV',
  notes: null,
}))

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>(mockTrades)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSymbol, setFilterSymbol] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalTrades, setTotalTrades] = useState(mockTrades.length)
  const tradesPerPage = 15

  useEffect(() => {
    fetchTrades()
  }, [currentPage, filterSymbol])

  const fetchTrades = async () => {
    setLoading(true)
    try {
      const result = await tradesApi.getAll({
        skip: (currentPage - 1) * tradesPerPage,
        limit: tradesPerPage,
        symbol: filterSymbol || undefined,
      })
      if (result.trades && result.trades.length > 0) {
        setTrades(result.trades)
        setTotalTrades(result.total)
      }
    } catch (error) {
      console.log('Using mock data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este trade?')) return
    
    try {
      await tradesApi.delete(id)
      setTrades(trades.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting trade')
    }
  }

  const filteredTrades = trades.filter(trade =>
    trade.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const uniqueSymbols = Array.from(new Set(trades.map(t => t.symbol)))
  const totalPages = Math.ceil(totalTrades / tradesPerPage)

  // Stats
  const stats = {
    total: filteredTrades.length,
    wins: filteredTrades.filter(t => t.profit > 0).length,
    losses: filteredTrades.filter(t => t.profit < 0).length,
    profit: filteredTrades.reduce((acc, t) => acc + t.profit, 0),
    winRate: (filteredTrades.filter(t => t.profit > 0).length / filteredTrades.length) * 100 || 0,
  }

  return (
    <div className="space-y-8 relative">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-60 left-40 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-60 right-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Operações</h1>
          <p className="text-gray-400">Histórico completo das suas operações</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-surface border border-border rounded-lg text-sm font-medium hover:border-primary/50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button className="px-4 py-2.5 bg-primary text-background rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Operação
          </button>
        </div>
      </div>

      {/* Stats Section - Clean */}
      <div className="bg-surface border border-border/50 rounded-2xl p-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Total Trades */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total</p>
            </div>
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-1">Operações</p>
          </div>

          {/* Wins */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-4 h-4 text-success" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ganhos</p>
            </div>
            <p className="text-3xl font-bold text-success">{stats.wins}</p>
            <p className="text-xs text-gray-500 mt-1">Operações positivas</p>
          </div>

          {/* Losses */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="w-4 h-4 text-danger" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Perdas</p>
            </div>
            <p className="text-3xl font-bold text-danger">{stats.losses}</p>
            <p className="text-xs text-gray-500 mt-1">Operações negativas</p>
          </div>

          {/* Win Rate */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</p>
            </div>
            <p className="text-3xl font-bold">{stats.winRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">Taxa de acerto</p>
          </div>

          {/* Total Profit */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                stats.profit >= 0 ? "bg-success" : "bg-danger"
              )} />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</p>
            </div>
            <p className={cn(
              "text-3xl font-bold",
              stats.profit >= 0 ? "text-success" : "text-danger"
            )}>
              {formatCurrency(stats.profit)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Lucro total</p>
          </div>
        </div>
      </div>

      {/* Filters Section - Clean */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ativo..."
            className="w-full bg-surface border border-border/50 rounded-lg pl-12 pr-4 py-3 text-sm focus:border-primary/50 focus:outline-none transition-colors"
          />
        </div>
        <select
          value={filterSymbol}
          onChange={(e) => setFilterSymbol(e.target.value)}
          className="bg-surface border border-border/50 rounded-lg px-4 py-3 text-sm min-w-[180px] font-medium hover:border-primary/50 focus:border-primary/50 focus:outline-none transition-colors"
        >
          <option value="">Todos os ativos</option>
          {uniqueSymbols.map(symbol => (
            <option key={symbol} value={symbol}>{symbol}</option>
          ))}
        </select>
        <button className="px-4 py-3 bg-surface border border-border/50 rounded-lg text-sm font-medium hover:border-primary/50 transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Trades Table - Professional */}
      <div className="bg-surface border border-border/50 rounded-2xl overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-surface/50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Data & Hora
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ativo
                </th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Volume
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Entrada
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Saída
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Resultado
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Duração
                </th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTrades.map((trade, index) => (
                  <motion.tr
                    key={trade.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.01 }}
                    className="border-b border-border/30 hover:bg-surface-light/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-300">
                        {new Date(trade.open_time).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {new Date(trade.open_time).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {trade.symbol.substring(0, 2)}
                          </span>
                        </div>
                        <span className="font-semibold">{trade.symbol}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        'inline-block px-3 py-1 text-xs font-semibold',
                        trade.trade_type === 'BUY' 
                          ? 'text-success' 
                          : 'text-danger'
                      )}>
                        {trade.trade_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-medium">{trade.volume}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-mono text-sm text-gray-300">
                        {trade.entry_price?.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-mono text-sm text-gray-300">
                        {trade.exit_price?.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }) || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className={cn(
                        'flex items-center justify-end gap-2 font-bold',
                        trade.profit >= 0 ? 'text-success' : 'text-danger'
                      )}>
                        {trade.profit >= 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        <span>{formatCurrency(trade.profit)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm text-gray-400">{trade.duration_minutes}m</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleDelete(trade.id)}
                        className="p-2 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination - Clean */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
          <p className="text-sm text-gray-500">
            Mostrando <span className="font-medium text-white">{((currentPage - 1) * tradesPerPage) + 1}</span> - <span className="font-medium text-white">{Math.min(currentPage * tradesPerPage, totalTrades)}</span> de <span className="font-medium text-white">{totalTrades}</span> operações
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border/50 hover:bg-surface-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 2 + i
                  }
                  if (currentPage > totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  }
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      'min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-colors',
                      currentPage === pageNum
                        ? 'bg-primary text-background'
                        : 'hover:bg-surface-light text-gray-400'
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border/50 hover:bg-surface-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
