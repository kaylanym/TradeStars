'use client'

import { motion } from 'framer-motion'
import { 
  Building2, 
  Check, 
  Clock, 
  Link2,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronRight
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  logo: string
  description: string
  type: 'broker' | 'platform'
  status: 'active' | 'coming-soon' | 'available'
  features: string[]
}

const integrations: Integration[] = [
  {
    id: 'xp',
    name: 'XP Investimentos',
    logo: '/logos/xp.png',
    description: 'Integração completa com sua conta XP para importar portfolio e operações automaticamente.',
    type: 'broker',
    status: 'available',
    features: ['Renda Fixa', 'Renda Variável', 'FIIs', 'Histórico Completo']
  },
  {
    id: 'clear',
    name: 'Clear Corretora',
    logo: '/logos/clear.png',
    description: 'Sincronize seus trades e investimentos da Clear em tempo real.',
    type: 'broker',
    status: 'available',
    features: ['Day Trade', 'Swing Trade', 'Portfolio Ações', 'Mini-Contratos']
  },
  {
    id: 'rico',
    name: 'Rico Investimentos',
    logo: '/logos/rico.png',
    description: 'Conecte sua conta Rico para análise completa do seu portfolio.',
    type: 'broker',
    status: 'available',
    features: ['Tesouro Direto', 'CDBs', 'Ações', 'Fundos']
  },
  {
    id: 'btg',
    name: 'BTG Pactual',
    logo: '/logos/btg.png',
    description: 'Integração premium com BTG para investidores qualificados.',
    type: 'broker',
    status: 'coming-soon',
    features: ['COE', 'Fundos Exclusivos', 'Private', 'Renda Fixa']
  },
  {
    id: 'nuinvest',
    name: 'Nu Invest',
    logo: '/logos/nubank.png',
    description: 'Conecte sua conta Nu Invest e tenha análises completas.',
    type: 'broker',
    status: 'coming-soon',
    features: ['Ações', 'ETFs', 'Renda Fixa', 'Criptomoedas']
  },
  {
    id: 'inter',
    name: 'Inter Invest',
    logo: '/logos/inter.png',
    description: 'Sincronize seus investimentos do Banco Inter.',
    type: 'broker',
    status: 'coming-soon',
    features: ['Ações', 'Fundos', 'Tesouro', 'CDB']
  },
  {
    id: 'mt5',
    name: 'MetaTrader 5',
    logo: '/logos/mt5.png',
    description: 'Integração profissional com MT5 para traders avançados.',
    type: 'platform',
    status: 'active',
    features: ['Forex', 'Futuros', 'CFDs', 'Histórico Completo']
  },
  {
    id: 'tradingview',
    name: 'TradingView',
    logo: '/logos/tradingview.png',
    description: 'Receba alertas e sinais do TradingView automaticamente.',
    type: 'platform',
    status: 'active',
    features: ['Webhooks', 'Alertas', 'Estratégias', 'Gráficos']
  },
]

export default function IntegrationsPage() {
  const activeIntegrations = integrations.filter(i => i.status === 'active')
  const availableIntegrations = integrations.filter(i => i.status === 'available')
  const comingSoonIntegrations = integrations.filter(i => i.status === 'coming-soon')

  return (
    <div className="space-y-8 relative">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Integrações</h1>
          <p className="text-gray-400">Conecte suas contas e plataformas de trading</p>
        </div>
      </div>

      {/* Stats - Clean */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-4 h-4 text-success" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ativas</span>
          </div>
          <p className="text-4xl font-bold mb-1">{activeIntegrations.length}</p>
          <p className="text-xs text-gray-500">Conectadas e funcionando</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-surface border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Disponíveis</span>
          </div>
          <p className="text-4xl font-bold mb-1">{availableIntegrations.length}</p>
          <p className="text-xs text-gray-500">Prontas para conectar</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Em Breve</span>
          </div>
          <p className="text-4xl font-bold mb-1">{comingSoonIntegrations.length}</p>
          <p className="text-xs text-gray-500">Próximas integrações</p>
        </motion.div>
      </div>

      {/* Active Integrations */}
      {activeIntegrations.length > 0 && (
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Integrações Ativas</h2>
              <p className="text-sm text-gray-500">Conectadas e sincronizando</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeIntegrations.map((integration, index) => (
              <IntegrationCard key={integration.id} integration={integration} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      {availableIntegrations.length > 0 && (
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Corretoras Disponíveis</h2>
              <p className="text-sm text-gray-500">Conecte em poucos cliques</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableIntegrations.map((integration, index) => (
              <IntegrationCard key={integration.id} integration={integration} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon */}
      {comingSoonIntegrations.length > 0 && (
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Em Desenvolvimento</h2>
              <p className="text-sm text-gray-500">Próximas integrações</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoonIntegrations.map((integration, index) => (
              <IntegrationCard key={integration.id} integration={integration} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function IntegrationCard({ integration, index }: { integration: Integration; index: number }) {
  const statusConfig = {
    active: {
      badge: 'Conectado',
      badgeClass: 'text-success',
      buttonText: 'Gerenciar',
      buttonClass: 'bg-surface-light border border-border/50 hover:border-primary/50'
    },
    available: {
      badge: 'Disponível',
      badgeClass: 'text-primary',
      buttonText: 'Conectar',
      buttonClass: 'bg-primary text-background hover:bg-primary/90'
    },
    'coming-soon': {
      badge: 'Em Breve',
      badgeClass: 'text-gray-500',
      buttonText: 'Notificar-me',
      buttonClass: 'bg-surface-light border border-border/50 text-gray-400'
    }
  }

  const config = statusConfig[integration.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-surface border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
    >
      {/* Header with Logo */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Logo Container - MANTIDO */}
          <div className="w-14 h-14 flex items-center justify-center bg-white rounded-xl p-2.5 group-hover:scale-105 transition-transform duration-300">
            <img 
              src={integration.logo} 
              alt={integration.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-2xl">${
                    integration.type === 'broker' ? '🏦' : '📊'
                  }</span>`;
                  parent.className = 'w-14 h-14 flex items-center justify-center bg-surface-light rounded-xl';
                }
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
              {integration.name}
            </h3>
            <span className={`text-xs font-medium ${config.badgeClass}`}>
              {config.badge}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {integration.description}
      </p>

      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-5">
        {integration.features.map((feature) => (
          <span 
            key={feature} 
            className="text-xs px-2.5 py-1 bg-surface-light/50 border border-border/30 rounded-md text-gray-300"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Action Button */}
      <button 
        className={`w-full ${config.buttonClass} px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2`}
      >
        <span>{config.buttonText}</span>
        {integration.status !== 'coming-soon' && (
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        )}
      </button>
    </motion.div>
  )
}
