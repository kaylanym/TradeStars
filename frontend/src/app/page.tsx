'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import ImportPage from '@/components/ImportPage'
import InsightsPage from '@/components/InsightsPage'
import TradesPage from '@/components/TradesPage'
import PortfolioPage from '@/components/PortfolioPage'
import AnalysisPage from '@/components/AnalysisPage'
import IntegrationsPage from '@/components/IntegrationsPage'
import MentorshipPage from '@/components/MentorshipPage'
import BillingPage from '@/components/BillingPage'

type PageType = 'dashboard' | 'import' | 'insights' | 'trades' | 'portfolio' | 'analysis' | 'integrations' | 'mentorship' | 'billing'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial load
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary p-4 animate-pulse">
              <img src="/logo.png" alt="TradeStars" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-bold gradient-text">TradeStars</h1>
          <p className="text-gray-400 mt-2">Carregando...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-1 ml-64 p-8">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'trades' && <TradesPage />}
          {currentPage === 'portfolio' && <PortfolioPage />}
          {currentPage === 'analysis' && <AnalysisPage />}
          {currentPage === 'integrations' && <IntegrationsPage />}
          {currentPage === 'import' && <ImportPage />}
          {currentPage === 'insights' && <InsightsPage />}
          {currentPage === 'mentorship' && <MentorshipPage />}
          {currentPage === 'billing' && <BillingPage />}
        </motion.div>
      </main>
    </div>
  )
}


