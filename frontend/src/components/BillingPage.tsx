'use client'

import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Check, 
  X,
  Calendar,
  DollarSign,
  TrendingUp,
  Zap,
  Crown,
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number
  billing: 'monthly' | 'yearly'
  features: string[]
  limits: {
    trades: string
    integrations: string
    aiInsights: string
    support: string
  }
  popular?: boolean
  current?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    billing: 'monthly',
    current: true,
    features: [
      'Até 100 trades/mês',
      '1 integração ativa',
      'Insights básicos de IA',
      'Dashboard básico',
      'Suporte por email',
    ],
    limits: {
      trades: '100 trades/mês',
      integrations: '1 corretora',
      aiInsights: 'Básico',
      support: 'Email',
    }
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 49.90,
    billing: 'monthly',
    popular: true,
    features: [
      'Trades ilimitados',
      '5 integrações simultâneas',
      'Insights avançados de IA',
      'Análise de portfolio completa',
      'Suporte prioritário',
      'Exportação de relatórios',
      'Webhooks personalizados',
    ],
    limits: {
      trades: 'Ilimitado',
      integrations: '5 corretoras',
      aiInsights: 'Avançado',
      support: 'Prioritário',
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 149.90,
    billing: 'monthly',
    features: [
      'Tudo do Professional',
      'Integrações ilimitadas',
      'IA personalizada',
      'Mentoria 1-on-1',
      'Suporte 24/7',
      'API dedicada',
      'White-label (em breve)',
      'Onboarding personalizado',
    ],
    limits: {
      trades: 'Ilimitado',
      integrations: 'Ilimitadas',
      aiInsights: 'Personalizado',
      support: '24/7',
    }
  },
]

const recentInvoices = [
  { id: '1', date: '2024-01-01', amount: 0, status: 'paid', plan: 'Gratuito' },
  { id: '2', date: '2023-12-01', amount: 0, status: 'paid', plan: 'Gratuito' },
  { id: '3', date: '2023-11-01', amount: 0, status: 'paid', plan: 'Gratuito' },
]

export default function BillingPage() {
  const currentPlan = plans.find(p => p.current)

  const handleUpgrade = (planId: string) => {
    // Aqui você vai integrar com o sistema de pagamento
    console.log('Upgrade to plan:', planId)
    alert('Redirecionando para checkout... (Integração em desenvolvimento)')
  }

  const handleCancelPlan = () => {
    const confirm = window.confirm('Tem certeza que deseja cancelar seu plano? Você perderá acesso aos recursos premium.')
    if (confirm) {
      console.log('Canceling plan...')
      alert('Plano cancelado com sucesso!')
    }
  }

  const handleManagePayment = () => {
    console.log('Opening payment management...')
    alert('Redirecionando para gerenciamento de pagamento... (Integração em desenvolvimento)')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Plano & Pagamento</h1>
            <p className="text-gray-400">Gerencie sua assinatura e métodos de pagamento</p>
          </div>
        </div>
      </div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 border border-primary/20 rounded-2xl p-6"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-white">Plano {currentPlan?.name}</h2>
              {currentPlan?.id === 'free' && (
                <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full">
                  Ativo
                </span>
              )}
            </div>
            <p className="text-gray-400">
              {currentPlan?.id === 'free' 
                ? 'Você está no plano gratuito' 
                : 'Próxima cobrança em 15 de Fevereiro, 2024'
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold gradient-text">
              {currentPlan?.price === 0 ? 'R$ 0' : `R$ ${currentPlan?.price.toFixed(2)}`}
            </div>
            <p className="text-sm text-gray-400">{currentPlan?.billing === 'monthly' ? '/mês' : '/ano'}</p>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface/50 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs text-gray-400">Trades</span>
            </div>
            <p className="text-lg font-bold text-white">{currentPlan?.limits.trades}</p>
          </div>
          <div className="bg-surface/50 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-xs text-gray-400">Integrações</span>
            </div>
            <p className="text-lg font-bold text-white">{currentPlan?.limits.integrations}</p>
          </div>
          <div className="bg-surface/50 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-warning" />
              <span className="text-xs text-gray-400">IA Insights</span>
            </div>
            <p className="text-lg font-bold text-white">{currentPlan?.limits.aiInsights}</p>
          </div>
          <div className="bg-surface/50 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-success" />
              <span className="text-xs text-gray-400">Suporte</span>
            </div>
            <p className="text-lg font-bold text-white">{currentPlan?.limits.support}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {currentPlan?.id === 'free' ? (
            <button 
              onClick={() => handleUpgrade('pro')}
              className="btn-primary flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Fazer Upgrade
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button 
                onClick={handleManagePayment}
                className="btn-primary flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Gerenciar Pagamento
              </button>
              <button 
                onClick={handleCancelPlan}
                className="btn-secondary flex items-center gap-2 text-danger hover:text-danger"
              >
                <X className="w-4 h-4" />
                Cancelar Plano
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-bold mb-4">Planos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-surface border rounded-2xl p-6 relative ${
                plan.popular 
                  ? 'border-primary shadow-lg shadow-primary/20' 
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-4 py-1 rounded-full">
                    Mais Popular
                  </span>
                </div>
              )}

              {plan.current && (
                <div className="absolute top-4 right-4">
                  <span className="bg-success/20 text-success text-xs font-medium px-3 py-1 rounded-full">
                    Plano Atual
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold gradient-text">
                    R$ {plan.price.toFixed(2)}
                  </span>
                  <span className="text-gray-400">/{plan.billing === 'monthly' ? 'mês' : 'ano'}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !plan.current && handleUpgrade(plan.id)}
                disabled={plan.current}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  plan.current
                    ? 'bg-surface-light text-gray-500 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/30'
                    : 'bg-surface-light text-white hover:bg-surface border border-border'
                }`}
              >
                {plan.current ? 'Plano Atual' : `Escolher ${plan.name}`}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Method Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Método de Pagamento
          </h3>
          
          {currentPlan?.id === 'free' ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Nenhum método de pagamento cadastrado</p>
              <button 
                onClick={() => handleUpgrade('pro')}
                className="btn-secondary"
              >
                Adicionar Cartão
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-surface-light rounded-lg p-4 flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-400">Expira em 12/2025</p>
                </div>
                <button className="text-primary text-sm hover:underline">
                  Alterar
                </button>
              </div>
              <button 
                onClick={handleManagePayment}
                className="w-full btn-secondary"
              >
                Gerenciar Métodos de Pagamento
              </button>
            </div>
          )}
        </motion.div>

        {/* Billing History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Histórico de Faturas
          </h3>

          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <div 
                key={invoice.id}
                className="flex items-center justify-between p-3 bg-surface-light rounded-lg hover:bg-surface transition-colors"
              >
                <div>
                  <p className="font-medium">{invoice.plan}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(invoice.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white">
                    R$ {invoice.amount.toFixed(2)}
                  </span>
                  <button className="text-primary hover:text-primary/80">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 btn-secondary text-sm">
            Ver Todas as Faturas
          </button>
        </motion.div>
      </div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface border border-border rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold mb-2">Precisa de Ajuda?</h3>
        <p className="text-gray-400 mb-4">
          Tem dúvidas sobre os planos ou pagamento? Nossa equipe está pronta para ajudar.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary">
            Falar com Suporte
          </button>
          <button className="btn-secondary">
            Ver FAQ
          </button>
        </div>
      </motion.div>
    </div>
  )
}
