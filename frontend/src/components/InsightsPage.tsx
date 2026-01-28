'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Sparkles, 
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Send,
  Loader2,
  RefreshCw,
  MessageSquare,
  ChevronRight
} from 'lucide-react'
import { aiApi, Insight } from '@/lib/api'
import { cn, getInsightColor } from '@/lib/utils'

// Mock insights for when API is not available
const mockInsights: Insight[] = [
  {
    type: 'success',
    category: 'timing',
    title: 'Melhor Horário Identificado',
    description: 'Seu melhor desempenho ocorre às 10:00 com R$ 680 de profit médio. Este é o horário onde você tem maior concentração e assertividade.',
    action: 'Concentre suas operações entre 09:30 e 11:00'
  },
  {
    type: 'warning',
    category: 'timing',
    title: 'Horário de Baixa Performance',
    description: 'Você apresenta maior perda às 15:00 (-R$ 280 em média). Isso pode estar relacionado ao cansaço ou volatilidade do fechamento.',
    action: 'Considere parar de operar após as 14:30'
  },
  {
    type: 'info',
    category: 'symbol',
    title: 'Especialista em WINZ24',
    description: 'Win rate de 67.7% em WINZ24 com lucro total de R$ 1.450. Você demonstra consistência neste ativo.',
    action: 'Considere aumentar posições gradualmente'
  },
  {
    type: 'warning',
    category: 'psychology',
    title: 'Padrão de Revenge Trading Detectado',
    description: 'Sequências de 4 losses consecutivos foram identificadas, indicando possível trading emocional após perdas.',
    action: 'Implemente pausa obrigatória de 30min após 2 losses'
  },
]

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>(mockInsights)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'insights' | 'chat'>('insights')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchInsights()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const result = await aiApi.getQuickAnalysis()
      if (result.insights && result.insights.length > 0) {
        setInsights(result.insights)
      }
    } catch (error) {
      console.log('Using mock insights')
    } finally {
      setLoading(false)
    }
  }

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return

    const userMessage = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setChatLoading(true)

    try {
      const result = await aiApi.chat(userMessage)
      setChatMessages(prev => [...prev, { role: 'assistant', content: result.response }])
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, não consegui processar sua pergunta. Verifique se a API está configurada corretamente.' 
      }])
    } finally {
      setChatLoading(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />
      case 'danger':
        return <XCircle className="w-5 h-5 text-danger" />
      case 'info':
        return <Info className="w-5 h-5 text-primary" />
      default:
        return <Sparkles className="w-5 h-5 text-primary" />
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Insights IA</h1>
          <p className="text-gray-400">Análise inteligente das suas operações</p>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="px-4 py-2.5 bg-surface border border-border/50 hover:border-primary/50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          Atualizar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-surface border border-border/50 rounded-lg relative z-10">
        <button
          onClick={() => setActiveTab('insights')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 text-sm font-medium',
            activeTab === 'insights'
              ? 'bg-primary text-background'
              : 'text-gray-400 hover:text-white hover:bg-surface-light/50'
          )}
        >
          <Brain className="w-4 h-4" />
          Análises
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 text-sm font-medium',
            activeTab === 'chat'
              ? 'bg-primary text-background'
              : 'text-gray-400 hover:text-white hover:bg-surface-light/50'
          )}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 relative z-10"
          >
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Analisando seus trades...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-surface border border-border/50 rounded-2xl p-6 hover:border-border/70 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(insight.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2">{insight.title}</h3>
                        <p className="text-sm text-gray-400 mb-4">{insight.description}</p>
                        {insight.action && (
                          <div className="flex items-start gap-2 pt-4 border-t border-border/30">
                            <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-300">{insight.action}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface border border-border/50 rounded-2xl overflow-hidden relative z-10"
          >
            {/* Chat Messages */}
            <div className="h-[520px] overflow-y-auto p-6 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-24">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Converse com a IA</h3>
                  <p className="text-gray-400 max-w-md mx-auto mb-6">
                    Faça perguntas sobre suas operações e receba análises personalizadas
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      'Qual meu melhor horário?',
                      'Como melhorar win rate?',
                      'Analise minha gestão de risco',
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setChatInput(suggestion)}
                        className="px-4 py-2 bg-surface-light border border-border/50 hover:border-primary/50 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] p-4 rounded-lg',
                      message.role === 'user'
                        ? 'bg-primary text-background'
                        : 'bg-surface-light border border-border/30 text-white'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/30">
                        <Brain className="w-4 h-4 text-primary" />
                        <span className="text-xs text-gray-400 font-medium">TradeStars IA</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {chatLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-surface-light border border-border/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-gray-400 text-sm">Analisando...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border/50">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Pergunte algo sobre suas operações..."
                  className="flex-1 bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleSendChat}
                  disabled={!chatInput.trim() || chatLoading}
                  className="bg-primary hover:bg-primary/90 text-background px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
