'use client'

import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Upload, 
  Brain, 
  LineChart,
  Settings,
  LogOut,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

type PageType = 'dashboard' | 'import' | 'insights' | 'trades'

interface SidebarProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'trades', label: 'Meus Trades', icon: LineChart },
  { id: 'import', label: 'Importar Dados', icon: Upload },
  { id: 'insights', label: 'Insights IA', icon: Brain },
]

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">TradeStars</h1>
            <p className="text-xs text-gray-500">Trading Analytics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id as PageType)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    isActive 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-gray-400 hover:text-white hover:bg-surface-light'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 rounded-full bg-primary"
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Pro Badge */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">TradeStars Pro</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Desbloqueie insights avançados com IA
          </p>
          <button className="w-full btn-primary text-sm py-2">
            Upgrade
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Configurações</span>
        </button>
      </div>
    </aside>
  )
}


