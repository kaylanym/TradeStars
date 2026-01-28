import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tradestars-production.up.railway.app'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export interface Trade {
  id: number
  symbol: string
  trade_type: string
  volume: number
  entry_price: number
  exit_price: number | null
  profit: number
  commission: number
  swap: number
  open_time: string
  close_time: string | null
  duration_minutes: number
  source: string
  notes: string | null
}

export interface DashboardStats {
  total_trades: number
  winning_trades: number
  losing_trades: number
  win_rate: number
  total_profit: number
  total_loss: number
  net_profit: number
  average_win: number
  average_loss: number
  profit_factor: number
  best_trade: number
  worst_trade: number
  average_duration: number
  suggested_daily_loss: number
  suggested_daily_gain: number
}

export interface HourlyPerformance {
  hour: number
  hour_label: string
  trades: number
  profit: number
  win_rate: number
}

export interface SymbolPerformance {
  symbol: string
  trades: number
  profit: number
  win_rate: number
  average_profit: number
}

export interface DailyPerformance {
  date: string
  profit: number
  cumulative: number
  trades: number
  win_rate: number
}

export interface Insight {
  type: 'success' | 'warning' | 'danger' | 'info'
  category: string
  title: string
  description: string
  action?: string
}

// API Functions
export const tradesApi = {
  getAll: async (params?: { skip?: number; limit?: number; symbol?: string }) => {
    const response = await api.get('/api/trades/', { params })
    return response.data
  },
  
  uploadCSV: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/trades/upload-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/api/trades/${id}`)
    return response.data
  },
  
  deleteAll: async () => {
    const response = await api.delete('/api/trades/?confirm=true')
    return response.data
  },
}

export const analyticsApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/analytics/dashboard')
    return response.data
  },
  
  getHourlyPerformance: async (): Promise<HourlyPerformance[]> => {
    const response = await api.get('/api/analytics/hourly-performance')
    return response.data
  },
  
  getSymbolPerformance: async (): Promise<SymbolPerformance[]> => {
    const response = await api.get('/api/analytics/symbol-performance')
    return response.data
  },
  
  getDailyPerformance: async (days: number = 30): Promise<DailyPerformance[]> => {
    const response = await api.get('/api/analytics/daily-performance', { params: { days } })
    return response.data
  },
  
  getWeeklyStats: async () => {
    const response = await api.get('/api/analytics/weekly-stats')
    return response.data
  },
  
  getMonthlyStats: async () => {
    const response = await api.get('/api/analytics/monthly-stats')
    return response.data
  },
}

export const integrationsApi = {
  connectMT5: async (credentials: { login: number; password: string; server: string }) => {
    const response = await api.post('/api/integrations/mt5/connect', credentials)
    return response.data
  },
  
  syncMT5: async (credentials: { login: number; password: string; server: string }, days: number = 30) => {
    const response = await api.post('/api/integrations/mt5/sync', credentials, { params: { days } })
    return response.data
  },
  
  getTradingViewSetup: async () => {
    const response = await api.get('/api/integrations/tradingview/setup')
    return response.data
  },

  // MetaAPI - Funciona em qualquer OS!
  getMetaApiSetup: async () => {
    const response = await api.get('/api/integrations/metaapi/setup')
    return response.data
  },

  testMetaApi: async (apiToken: string, accountId: string) => {
    const response = await api.post('/api/integrations/metaapi/test', null, {
      params: { api_token: apiToken, account_id: accountId }
    })
    return response.data
  },

  syncMetaApi: async (apiToken: string, accountId: string, days: number = 30) => {
    const response = await api.post('/api/integrations/metaapi/sync', null, {
      params: { api_token: apiToken, account_id: accountId, days }
    })
    return response.data
  },
}

export const aiApi = {
  getInsights: async (): Promise<{ insights: Insight[]; trades_analyzed: number }> => {
    const response = await api.get('/api/ai/insights')
    return response.data
  },
  
  getQuickAnalysis: async (): Promise<{ insights: Insight[]; trades_analyzed: number }> => {
    const response = await api.get('/api/ai/quick-analysis')
    return response.data
  },
  
  chat: async (message: string): Promise<{ response: string }> => {
    const response = await api.post('/api/ai/chat', null, { params: { message } })
    return response.data
  },
}

export default api

