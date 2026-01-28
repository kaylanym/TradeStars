'use client'

import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Upload, 
  Brain, 
  LineChart,
  Settings,
  LogOut,
  TrendingUp,
  CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'

type PageType = 'dashboard' | 'import' | 'insights' | 'trades' | 'portfolio' | 'analysis' | 'integrations' | 'mentorship' | 'billing'

interface SidebarProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
}

const menuSections = [
  {
    title: 'Principal',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'trades', label: 'Meus Trades', icon: LineChart },
      { id: 'portfolio', label: 'Meu Portfolio', icon: TrendingUp, badge: 'Novo' },
      { id: 'analysis', label: 'Análise Portfolio', icon: Brain, badge: 'Novo' },
    ]
  },
  {
    title: 'Configurações',
    items: [
      { id: 'integrations', label: 'Integrações', icon: Settings, badge: 'Novo' },
      { id: 'import', label: 'Importar Dados', icon: Upload },
      { id: 'billing', label: 'Plano & Pagamento', icon: CreditCard },
    ]
  },
  {
    title: 'Inteligência',
    items: [
      { id: 'insights', label: 'Insights IA', icon: Brain },
      { id: 'mentorship', label: 'Analista', icon: LogOut },
    ]
  }
]

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center p-1.5">
            <img src="/logo.png" alt="TradeStars" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">TradeStars</h1>
            <p className="text-xs text-gray-500">Trading Analytics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPage === item.id
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onNavigate(item.id as PageType)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 relative',
                          isActive 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-gray-400 hover:text-white hover:bg-surface-light'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium flex-1 text-left text-sm">{item.label}</span>
                        {item.badge && (
                          <span className={cn(
                            'text-[9px] font-medium px-1.5 py-0.5 rounded',
                            item.badge === 'Novo' 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-gray-700/50 text-gray-400'
                          )}>
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 w-0.5 h-5 bg-primary rounded-r"
                          />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-white rounded-lg transition-colors text-sm">
          <Settings className="w-4 h-4" />
          <span>Configurações</span>
        </button>
      </div>
    </aside>
  )
}


