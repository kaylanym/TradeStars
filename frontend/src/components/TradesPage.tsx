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
  MoreHorizontal
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

  const uniqueSymbols = [...new Set(trades.map(t => t.symbol))]
  const totalPages = Math.ceil(totalTrades / tradesPerPage)

  // Stats
  const stats = {
    total: filteredTrades.length,
    wins: filteredTrades.filter(t => t.profit > 0).length,
    losses: filteredTrades.filter(t => t.profit < 0).length,
    profit: filteredTrades.reduce((acc, t) => acc + t.profit, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Trades</h1>
          <p className="text-gray-400 mt-1">Histórico completo das suas operações</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-4 border border-border">
          <p className="text-gray-400 text-sm">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-border">
          <p className="text-gray-400 text-sm">Wins</p>
          <p className="text-2xl font-bold text-success">{stats.wins}</p>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-border">
          <p className="text-gray-400 text-sm">Losses</p>
          <p className="text-2xl font-bold text-danger">{stats.losses}</p>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-border">
          <p className="text-gray-400 text-sm">Resultado</p>
          <p className={cn(
            'text-2xl font-bold',
            stats.profit >= 0 ? 'text-success' : 'text-danger'
          )}>
            {formatCurrency(stats.profit)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ativo..."
            className="w-full bg-surface border border-border rounded-xl pl-12 pr-4 py-3 focus:border-primary transition-colors"
          />
        </div>
        <select
          value={filterSymbol}
          onChange={(e) => setFilterSymbol(e.target.value)}
          className="bg-surface border border-border rounded-xl px-4 py-3 min-w-[150px]"
        >
          <option value="">Todos os ativos</option>
          {uniqueSymbols.map(symbol => (
            <option key={symbol} value={symbol}>{symbol}</option>
          ))}
        </select>
      </div>

      {/* Trades Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-gray-400 font-medium">Data/Hora</th>
                <th className="text-left p-4 text-gray-400 font-medium">Ativo</th>
                <th className="text-left p-4 text-gray-400 font-medium">Tipo</th>
                <th className="text-right p-4 text-gray-400 font-medium">Volume</th>
                <th className="text-right p-4 text-gray-400 font-medium">Entrada</th>
                <th className="text-right p-4 text-gray-400 font-medium">Saída</th>
                <th className="text-right p-4 text-gray-400 font-medium">Resultado</th>
                <th className="text-right p-4 text-gray-400 font-medium">Duração</th>
                <th className="text-center p-4 text-gray-400 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTrades.map((trade, index) => (
                  <motion.tr
                    key={trade.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-border/50 hover:bg-surface-light/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{formatDateTime(trade.open_time)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold">{trade.symbol}</span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        'px-3 py-1 rounded-lg text-xs font-medium',
                        trade.trade_type === 'BUY' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-danger/20 text-danger'
                      )}>
                        {trade.trade_type}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono">
                      {trade.volume}
                    </td>
                    <td className="p-4 text-right font-mono text-gray-300">
                      {trade.entry_price?.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-mono text-gray-300">
                      {trade.exit_price?.toFixed(2) || '-'}
                    </td>
                    <td className="p-4 text-right">
                      <div className={cn(
                        'flex items-center justify-end gap-1 font-semibold',
                        trade.profit >= 0 ? 'text-success' : 'text-danger'
                      )}>
                        {trade.profit >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {formatCurrency(trade.profit)}
                      </div>
                    </td>
                    <td className="p-4 text-right text-gray-400">
                      {trade.duration_minutes} min
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(trade.id)}
                        className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
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

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-gray-400 text-sm">
            Mostrando {((currentPage - 1) * tradesPerPage) + 1} - {Math.min(currentPage * tradesPerPage, totalTrades)} de {totalTrades} trades
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border hover:bg-surface-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
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
                    'w-10 h-10 rounded-lg transition-colors',
                    currentPage === pageNum
                      ? 'bg-primary text-background font-semibold'
                      : 'border border-border hover:bg-surface-light'
                  )}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border hover:bg-surface-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


