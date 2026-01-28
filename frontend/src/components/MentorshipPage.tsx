'use client'

import { motion } from 'framer-motion'
import {
  MessageSquare,
  User,
  Star,
  TrendingUp,
  Send,
  Sparkles,
  Calendar,
  Shield
} from 'lucide-react'

// Mock data
const analyst = {
  name: 'Analista TradeStars',
  title: 'Especialista Certificado em Investimentos',
  avatar: '👨‍💼',
  rating: 4.9,
  clients: 847,
  experience: '15+ anos'
}

const recentRecommendations = [
  {
    id: 1,
    date: '27 Jan 2026',
    type: 'buy',
    asset: 'VALE3',
    price: 68.50,
    target: 78.00,
    reason: 'Forte demanda por minério de ferro e resultado positivo no último trimestre.',
    status: 'active'
  },
  {
    id: 2,
    date: '25 Jan 2026',
    type: 'sell',
    asset: 'PETR4',
    price: 32.80,
    target: null,
    reason: 'Realizar lucro após valorização de 15%. Rebalancear portfolio.',
    status: 'completed'
  },
  {
    id: 3,
    date: '23 Jan 2026',
    type: 'hold',
    asset: 'ITUB4',
    price: 26.90,
    target: 30.00,
    reason: 'Manter posição. Aguardar divulgação de resultados trimestrais.',
    status: 'active'
  },
]

const chatMessages = [
  {
    id: 1,
    sender: 'analyst',
    text: 'Olá! Analisei seu portfolio e identifiquei algumas oportunidades interessantes. Gostaria de discutir?',
    time: '10:30'
  },
  {
    id: 2,
    sender: 'user',
    text: 'Sim, por favor! O que você encontrou?',
    time: '10:32'
  },
  {
    id: 3,
    sender: 'analyst',
    text: 'Notei que você tem alta concentração no setor financeiro (35%). Recomendo diversificar para tecnologia e consumo.',
    time: '10:33'
  },
  {
    id: 4,
    sender: 'user',
    text: 'Faz sentido. Pode sugerir alguns ativos?',
    time: '10:35'
  },
  {
    id: 5,
    sender: 'analyst',
    text: 'Com certeza! WEGE3 e MGLU3 estão com bons fundamentos. Também vale olhar TOTS3 no setor de tecnologia.',
    time: '10:36'
  },
]

export default function MentorshipPage() {
  return (
    <div className="p-8 space-y-8 relative">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 left-20 w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 left-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-2">Analista TradeStars</h1>
        <p className="text-gray-400">Orientação profissional personalizada para seus investimentos</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Analyst Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-surface border border-border/50 rounded-2xl p-6 sticky top-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl border border-border/50">
                {analyst.avatar}
              </div>
              <h2 className="text-xl font-bold mb-1">{analyst.name}</h2>
              <p className="text-sm text-gray-400 mb-4">{analyst.title}</p>

              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-lg">{analyst.rating}</span>
                  </div>
                  <p className="text-xs text-gray-400">Avaliação</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center mb-1">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-lg">{analyst.clients}</span>
                  </div>
                  <p className="text-xs text-gray-400">Clientes</p>
                </div>
              </div>

              <div className="bg-surface-light border border-border/30 rounded-lg p-3 mb-6">
                <p className="text-xs text-gray-400 mb-1">Experiência no Mercado</p>
                <p className="font-semibold text-lg">{analyst.experience}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full bg-primary hover:bg-primary/90 text-background px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Iniciar Conversa
              </button>
              <button className="w-full bg-surface-light border border-border/50 hover:border-primary/50 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Agendar Consultoria
              </button>
            </div>

            <div className="pt-6 border-t border-border/30">
              <h3 className="font-semibold mb-3 text-sm text-gray-400">Especialidades</h3>
              <div className="flex flex-wrap gap-2">
                {['Ações', 'Renda Fixa', 'FIIs', 'Day Trade', 'Análise Técnica'].map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1.5 bg-surface-light border border-border/50 rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/30">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield className="w-4 h-4 text-primary" />
                <span>Disponível no Plano Premium</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          {/* Chat Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface border border-border/50 rounded-2xl overflow-hidden"
          >
            <div className="bg-surface-light border-b border-border/50 p-4">
              <h2 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Conversa com Analista
              </h2>
            </div>

            <div className="h-[400px] overflow-y-auto p-6 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-background'
                        : 'bg-surface-light border border-border/30'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <span className="text-xs opacity-60 mt-2 block">{message.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border/50 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                />
                <button className="bg-primary hover:bg-primary/90 text-background px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Recent Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface border border-border/50 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recomendações Recentes
            </h2>

            <div className="space-y-4">
              {recentRecommendations.map((rec) => {
                const typeConfig = {
                  buy: { label: 'Comprar', icon: '↗' },
                  sell: { label: 'Vender', icon: '↘' },
                  hold: { label: 'Manter', icon: '=' }
                }
                const config = typeConfig[rec.type as keyof typeof typeConfig]

                const statusConfig = {
                  active: { label: 'Ativa', dot: 'bg-primary' },
                  completed: { label: 'Concluída', dot: 'bg-success' }
                }
                const statusStyle = statusConfig[rec.status as keyof typeof statusConfig]

                return (
                  <div key={rec.id} className="bg-surface-light border border-border/30 rounded-xl p-5 hover:border-border/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface border border-border/50 rounded-lg flex items-center justify-center text-lg">
                          {config.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{rec.asset}</h3>
                            <span className="text-xs px-2 py-1 bg-surface border border-border/50 rounded">
                              {config.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{rec.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                        <span className="text-xs text-gray-400">{statusStyle.label}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">{rec.reason}</p>

                    <div className="flex items-center gap-6 text-sm pt-4 border-t border-border/30">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Preço Atual</p>
                        <p className="font-semibold">R$ {rec.price.toFixed(2)}</p>
                      </div>
                      {rec.target && (
                        <>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Alvo</p>
                            <p className="font-semibold">R$ {rec.target.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Potencial</p>
                            <p className="font-semibold text-primary">
                              +{(((rec.target - rec.price) / rec.price) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Premium CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface border border-primary/30 rounded-2xl p-6 relative z-10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Acesso Exclusivo para Membros Premium</h3>
              <p className="text-sm text-gray-400">
                Consultoria personalizada, recomendações semanais e análise de portfolio completa
              </p>
            </div>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-background px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
            Fazer Upgrade
          </button>
        </div>
      </motion.div>
    </div>
  )
}
