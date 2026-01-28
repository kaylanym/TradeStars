'use client'

import { motion } from 'framer-motion'
import {
  MessageSquare,
  User,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  Send,
  Sparkles
} from 'lucide-react'

// Mock data
const mentor = {
  name: 'Analista TradeStars',
  title: 'Especialista em Investimentos',
  avatar: '👨‍💼',
  rating: 4.9,
  students: 1234,
  experience: '15+ anos'
}

const recentRecommendations = [
  {
    id: 1,
    date: '2026-01-27',
    type: 'buy',
    asset: 'VALE3',
    price: 68.50,
    target: 78.00,
    reason: 'Forte demanda por minério de ferro e resultado positivo no último trimestre.',
    status: 'pending'
  },
  {
    id: 2,
    date: '2026-01-25',
    type: 'sell',
    asset: 'PETR4',
    price: 32.80,
    target: null,
    reason: 'Realizar lucro após valorização de 15%. Rebalancear portfolio.',
    status: 'completed'
  },
  {
    id: 3,
    date: '2026-01-23',
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
    sender: 'mentor',
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
    sender: 'mentor',
    text: 'Notei que você tem alta concentração no setor financeiro (35%). Recomendo diversificar para tecnologia e consumo. O que acha?',
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
    sender: 'mentor',
    text: 'Com certeza! WEGE3 e MGLU3 estão com bons fundamentos. Também vale olhar TOTS3 no setor de tecnologia.',
    time: '10:36'
  },
]

export default function MentorshipPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Mentoria Profissional</h1>
            <p className="text-gray-400">Orientação personalizada para seus investimentos</p>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-orange-400" />
            <div>
              <h3 className="font-semibold text-orange-400">Em Desenvolvimento</h3>
              <p className="text-sm text-gray-400">Este recurso estará disponível em breve com mentores certificados!</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mentor Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-surface border border-border rounded-xl p-6 sticky top-8">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl">
                {mentor.avatar}
              </div>
              <h2 className="text-xl font-bold mb-1">{mentor.name}</h2>
              <p className="text-sm text-gray-400 mb-4">{mentor.title}</p>

              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{mentor.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{mentor.students}+ alunos</span>
                </div>
              </div>

              <div className="bg-surface-light rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-400 mb-1">Experiência</p>
                <p className="font-semibold">{mentor.experience}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full btn-primary flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Iniciar Conversa
              </button>
              <button className="w-full btn-secondary flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Agendar Reunião
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Especialidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Ações', 'Renda Fixa', 'FIIs', 'Day Trade', 'Análise Técnica'].map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          {/* Chat Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface border border-border rounded-xl overflow-hidden"
          >
            <div className="bg-surface-light border-b border-border p-4">
              <h2 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Conversa com Mentor
              </h2>
            </div>

            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'bg-surface-light'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">{message.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-surface-light border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                />
                <button className="btn-primary px-6 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Enviar
                </button>
              </div>
            </div>
          </motion.div>

          {/* Recent Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recomendações Recentes
            </h2>

            <div className="space-y-4">
              {recentRecommendations.map((rec) => {
                const typeConfig = {
                  buy: { label: 'Comprar', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
                  sell: { label: 'Vender', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
                  hold: { label: 'Manter', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' }
                }
                const config = typeConfig[rec.type as keyof typeof typeConfig]

                const statusConfig = {
                  pending: { label: 'Pendente', color: 'text-orange-400' },
                  active: { label: 'Ativa', color: 'text-blue-400' },
                  completed: { label: 'Concluída', color: 'text-green-400' }
                }
                const statusStyle = statusConfig[rec.status as keyof typeof statusConfig]

                return (
                  <div key={rec.id} className={`${config.bg} border ${config.border} rounded-lg p-4`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`${config.bg} px-3 py-1 rounded-full border ${config.border}`}>
                          <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{rec.asset}</h3>
                          <p className="text-xs text-gray-400">{rec.date}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${statusStyle.color}`}>
                        {statusStyle.label}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mb-3">{rec.reason}</p>

                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Preço Alvo</p>
                        <p className="font-semibold">{rec.target ? `R$ ${rec.target.toFixed(2)}` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Preço Atual</p>
                        <p className="font-semibold">R$ {rec.price.toFixed(2)}</p>
                      </div>
                      {rec.target && (
                        <div>
                          <p className="text-gray-400">Potencial</p>
                          <p className={`font-semibold ${config.color}`}>
                            +{(((rec.target - rec.price) / rec.price) * 100).toFixed(1)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
