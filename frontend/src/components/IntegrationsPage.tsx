'use client'

import { motion } from 'framer-motion'
import { 
  Building2, 
  Check, 
  Clock, 
  Link2,
  ArrowRight,
  Sparkles
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Logo_da_XP_Investimentos_01.png/320px-Logo_da_XP_Investimentos_01.png',
    description: 'Integração completa com sua conta XP para importar portfolio e operações automaticamente.',
    type: 'broker',
    status: 'available',
    features: ['Renda Fixa', 'Renda Variável', 'FIIs', 'Histórico Completo']
  },
  {
    id: 'clear',
    name: 'Clear Corretora',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Clear_Corretora_logo.svg/320px-Clear_Corretora_logo.svg.png',
    description: 'Sincronize seus trades e investimentos da Clear em tempo real.',
    type: 'broker',
    status: 'available',
    features: ['Day Trade', 'Swing Trade', 'Portfolio Ações', 'Mini-Contratos']
  },
  {
    id: 'rico',
    name: 'Rico Investimentos',
    logo: 'https://seeklogo.com/images/R/rico-investimentos-logo-6E3F64B04D-seeklogo.com.png',
    description: 'Conecte sua conta Rico para análise completa do seu portfolio.',
    type: 'broker',
    status: 'available',
    features: ['Tesouro Direto', 'CDBs', 'Ações', 'Fundos']
  },
  {
    id: 'btg',
    name: 'BTG Pactual',
    logo: 'https://seeklogo.com/images/B/btg-pactual-logo-7C3C3F66C5-seeklogo.com.png',
    description: 'Integração premium com BTG para investidores qualificados.',
    type: 'broker',
    status: 'coming-soon',
    features: ['COE', 'Fundos Exclusivos', 'Private', 'Renda Fixa']
  },
  {
    id: 'nuinvest',
    name: 'Nu Invest',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Nubank_logo_2021.svg/320px-Nubank_logo_2021.svg.png',
    description: 'Conecte sua conta Nu Invest e tenha análises completas.',
    type: 'broker',
    status: 'coming-soon',
    features: ['Ações', 'ETFs', 'Renda Fixa', 'Criptomoedas']
  },
  {
    id: 'inter',
    name: 'Inter Invest',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Logo_do_banco_Inter_%282023%29.svg/320px-Logo_do_banco_Inter_%282023%29.svg.png',
    description: 'Sincronize seus investimentos do Banco Inter.',
    type: 'broker',
    status: 'coming-soon',
    features: ['Ações', 'Fundos', 'Tesouro', 'CDB']
  },
  {
    id: 'mt5',
    name: 'MetaTrader 5',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/MetaTrader_5_logo.png/320px-MetaTrader_5_logo.png',
    description: 'Integração profissional com MT5 para traders avançados.',
    type: 'platform',
    status: 'active',
    features: ['Forex', 'Futuros', 'CFDs', 'Histórico Completo']
  },
  {
    id: 'tradingview',
    name: 'TradingView',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/TradingView_Logo.svg/320px-TradingView_Logo.svg.png',
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
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Link2 className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Integrações</h1>
            <p className="text-gray-400">Conecte suas contas e plataformas</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <span className="text-3xl font-bold gradient-text">{activeIntegrations.length}</span>
          </div>
          <h3 className="font-semibold mb-1">Integrações Ativas</h3>
          <p className="text-sm text-gray-400">Conectadas e funcionando</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-3xl font-bold gradient-text">{availableIntegrations.length}</span>
          </div>
          <h3 className="font-semibold mb-1">Disponíveis</h3>
          <p className="text-sm text-gray-400">Prontas para conectar</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-3xl font-bold text-gray-400">{comingSoonIntegrations.length}</span>
          </div>
          <h3 className="font-semibold mb-1">Em Breve</h3>
          <p className="text-sm text-gray-400">Próximas integrações</p>
        </motion.div>
      </div>

      {/* Active Integrations */}
      {activeIntegrations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            Integrações Ativas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeIntegrations.map((integration, index) => (
              <IntegrationCard key={integration.id} integration={integration} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      {availableIntegrations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            Corretoras Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableIntegrations.map((integration, index) => (
              <IntegrationCard key={integration.id} integration={integration} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon */}
      {comingSoonIntegrations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Em Breve
          </h2>
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
      badgeClass: 'bg-primary/20 text-primary border-primary/30',
      buttonText: 'Gerenciar',
      buttonClass: 'btn-secondary'
    },
    available: {
      badge: 'Disponível',
      badgeClass: 'bg-secondary/20 text-secondary border-secondary/30',
      buttonText: 'Conectar Agora',
      buttonClass: 'btn-primary'
    },
    'coming-soon': {
      badge: 'Em Breve',
      badgeClass: 'bg-gray-700/50 text-gray-400 border-gray-600',
      buttonText: 'Notificar-me',
      buttonClass: 'bg-gray-700 hover:bg-gray-600'
    }
  }

  const config = statusConfig[integration.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg p-2">
            <img 
              src={integration.logo} 
              alt={integration.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback para emoji se imagem não carregar
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-2xl">${
                    integration.type === 'broker' ? '🏦' : '📊'
                  }</span>`;
                  parent.className = 'w-12 h-12 flex items-center justify-center bg-surface-light rounded-lg';
                }
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {integration.name}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full border ${config.badgeClass}`}>
              {config.badge}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        {integration.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {integration.features.map((feature) => (
          <span key={feature} className="text-xs px-2 py-1 bg-surface-light rounded-md text-gray-300">
            {feature}
          </span>
        ))}
      </div>

      <button className={`w-full ${config.buttonClass} flex items-center justify-center gap-2 group/btn`}>
        <span>{config.buttonText}</span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  )
}
