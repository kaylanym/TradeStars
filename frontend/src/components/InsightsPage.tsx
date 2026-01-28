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
  MessageSquare
} from 'lucide-react'
import { aiApi, Insight } from '@/lib/api'
import { cn, getInsightColor } from '@/lib/utils'

// Mock insights for when API is not available
const mockInsights: Insight[] = [
  {
    type: 'success',
    category: 'timing',
    title: '⏰ Melhor Horário: 10:00',
    description: 'Você lucra mais às 10:00 (R$ 680.00 de profit). Este é o horário onde você tem maior concentração e assertividade.',
    action: 'Concentre suas operações entre 09:30 e 11:00 para maximizar resultados.'
  },
  {
    type: 'warning',
    category: 'timing',
    title: '🚫 Evite às 15:00',
    description: 'Você perde mais às 15:00 (R$ 280.00 de loss). Isso pode estar relacionado ao cansaço ou à volatilidade do fechamento.',
    action: 'Considere parar de operar após as 14:30 ou fazer uma pausa antes desse horário.'
  },
  {
    type: 'danger',
    category: 'symbol',
    title: '❌ Baixo Win Rate em PETR4',
    description: 'Seu win rate em PETR4 é de apenas 44% (11/25 trades). Você está perdendo dinheiro consistentemente nesse ativo.',
    action: 'Pare de operar PETR4 ou estude mais o comportamento desse ativo antes de voltar a operar.'
  },
  {
    type: 'success',
    category: 'symbol',
    title: '⭐ Especialista em WINZ24',
    description: 'Win rate de 67.7% em WINZ24! Lucro total: R$ 1.450,00. Você claramente entende bem esse ativo.',
    action: 'Continue focando em WINZ24, considere aumentar gradualmente o tamanho das posições.'
  },
  {
    type: 'warning',
    category: 'psychology',
    title: '🧠 Possível Revenge Trading',
    description: 'Você teve uma sequência de 4 losses seguidos em alguns dias. Isso pode indicar trading emocional após perdas.',
    action: 'Após 2 losses seguidos, faça uma pausa obrigatória de 30 minutos.'
  },
  {
    type: 'info',
    category: 'risk',
    title: '💰 Limites Sugeridos',
    description: 'Com base no seu histórico, seu loss diário máximo deveria ser R$ 150,00 e sua meta de gain R$ 300,00.',
    action: 'Configure esses limites no seu operacional e respeite-os rigorosamente.'
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
        return <Info className="w-5 h-5 text-secondary" />
      default:
        return <Sparkles className="w-5 h-5 text-primary" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            Insights IA
          </h1>
          <p className="text-gray-400 mt-1">Análise inteligente das suas operações</p>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          Atualizar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-surface rounded-xl border border-border">
        <button
          onClick={() => setActiveTab('insights')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200',
            activeTab === 'insights'
              ? 'bg-primary text-background font-semibold'
              : 'text-gray-400 hover:text-white hover:bg-surface-light'
          )}
        >
          <Sparkles className="w-5 h-5" />
          Insights
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200',
            activeTab === 'chat'
              ? 'bg-primary text-background font-semibold'
              : 'text-gray-400 hover:text-white hover:bg-surface-light'
          )}
        >
          <MessageSquare className="w-5 h-5" />
          Chat com IA
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Analisando seus trades...</p>
                </div>
              </div>
            ) : (
              insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'p-6 rounded-2xl border-l-4',
                    getInsightColor(insight.type)
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{insight.title}</h3>
                      <p className="text-gray-300 mb-3">{insight.description}</p>
                      {insight.action && (
                        <div className="bg-background/50 rounded-xl p-3 border border-border">
                          <p className="text-sm">
                            <span className="text-primary font-medium">💡 Ação:</span>{' '}
                            <span className="text-gray-300">{insight.action}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface rounded-2xl border border-border overflow-hidden"
          >
            {/* Chat Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-20">
                  <Brain className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Chat com IA</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Faça perguntas sobre suas operações, peça dicas de melhoria ou 
                    discuta estratégias com a IA.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {[
                      'Qual meu melhor horário para operar?',
                      'Como melhorar meu win rate?',
                      'Analise minha gestão de risco',
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setChatInput(suggestion)}
                        className="px-4 py-2 bg-surface-light rounded-full text-sm text-gray-300 hover:text-white hover:bg-primary/20 transition-colors"
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
                      'max-w-[80%] p-4 rounded-2xl',
                      message.role === 'user'
                        ? 'bg-primary text-background rounded-br-sm'
                        : 'bg-surface-light text-white rounded-bl-sm'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-primary" />
                        <span className="text-xs text-primary font-medium">TradeStars IA</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {chatLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-surface-light p-4 rounded-2xl rounded-bl-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-gray-400 text-sm">Pensando...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Pergunte algo sobre suas operações..."
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-3 focus:border-primary transition-colors"
                />
                <button
                  onClick={handleSendChat}
                  disabled={!chatInput.trim() || chatLoading}
                  className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pro Upgrade CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl p-6 border border-primary/30"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">🚀 Desbloqueie Insights Avançados</h3>
            <p className="text-gray-400">
              Análises mais profundas, detecção de padrões e recomendações personalizadas com IA.
            </p>
          </div>
          <button className="btn-primary whitespace-nowrap">
            Upgrade Pro
          </button>
        </div>
      </motion.div>
    </div>
  )
}


