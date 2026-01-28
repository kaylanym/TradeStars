'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle,
  Loader2,
  Monitor,
  Webhook,
  Download,
  Copy,
  ExternalLink,
  AlertTriangle,
  Cloud,
  Zap,
  Info
} from 'lucide-react'
import { tradesApi, integrationsApi } from '@/lib/api'
import { cn } from '@/lib/utils'

type IntegrationType = 'csv' | 'mt5' | 'metaapi' | 'tradingview'

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState<IntegrationType>('csv')
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null)
  
  // MT5 form
  const [mt5Form, setMt5Form] = useState({
    login: '',
    password: '',
    server: '',
  })
  const [mt5Loading, setMt5Loading] = useState(false)
  const [mt5Status, setMt5Status] = useState<{ connected: boolean; message: string } | null>(null)

  // MetaAPI form
  const [metaApiForm, setMetaApiForm] = useState({
    apiToken: '',
    accountId: '',
  })
  const [metaApiLoading, setMetaApiLoading] = useState(false)
  const [metaApiStatus, setMetaApiStatus] = useState<{ success: boolean; message: string; account?: any } | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setUploadResult(null)

    try {
      const result = await tradesApi.uploadCSV(file)
      setUploadResult({ success: true, message: result.message })
    } catch (error: any) {
      setUploadResult({ 
        success: false, 
        message: error.response?.data?.detail || 'Erro ao processar arquivo' 
      })
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  })

  const [mt5Alternatives, setMt5Alternatives] = useState<string[]>([])

  // MetaAPI sync handler
  const handleMetaApiSync = async () => {
    setMetaApiLoading(true)
    setMetaApiStatus(null)

    try {
      const result = await integrationsApi.syncMetaApi(
        metaApiForm.apiToken,
        metaApiForm.accountId,
        30
      )
      
      setMetaApiStatus({
        success: result.success,
        message: result.message,
        account: result.account
      })
    } catch (error: any) {
      setMetaApiStatus({
        success: false,
        message: error.response?.data?.detail || 'Erro na sincronização'
      })
    } finally {
      setMetaApiLoading(false)
    }
  }

  const handleMT5Connect = async () => {
    setMt5Loading(true)
    setMt5Status(null)
    setMt5Alternatives([])

    try {
      const result = await integrationsApi.syncMT5({
        login: parseInt(mt5Form.login),
        password: mt5Form.password,
        server: mt5Form.server,
      })
      
      if (result.success) {
        setMt5Status({ connected: true, message: result.message })
      } else {
        setMt5Status({ connected: false, message: result.message })
        if (result.alternatives) {
          setMt5Alternatives(result.alternatives)
        }
      }
    } catch (error: any) {
      setMt5Status({ 
        connected: false, 
        message: error.response?.data?.detail || 'Erro na conexão' 
      })
    } finally {
      setMt5Loading(false)
    }
  }

  const tabs = [
    { id: 'csv', label: 'Upload CSV', icon: FileSpreadsheet },
    { id: 'metaapi', label: 'MetaAPI', icon: Cloud },
    { id: 'mt5', label: 'MT5 Direto', icon: Monitor },
    { id: 'tradingview', label: 'TradingView', icon: Webhook },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-2">Importar Dados</h1>
        <p className="text-gray-400">Conecte suas plataformas ou importe via CSV</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-surface border border-border/50 rounded-lg relative z-10">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as IntegrationType)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 text-sm font-medium',
                activeTab === tab.id
                  ? 'bg-primary text-background'
                  : 'text-gray-400 hover:text-white hover:bg-surface-light/50'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'csv' && (
          <motion.div
            key="csv"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 relative z-10"
          >
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300',
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border/50 hover:border-primary/50 hover:bg-surface-light/30',
                uploading && 'pointer-events-none'
              )}
            >
              <input {...getInputProps()} />
              
              {uploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                  <p className="text-lg font-medium">Processando arquivo...</p>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-xl font-semibold mb-2">
                    {isDragActive ? 'Solte o arquivo aqui' : 'Arraste seu CSV ou clique para selecionar'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Suporta relatórios de qualquer corretora
                  </p>
                </>
              )}
            </div>

            {/* Upload Result */}
            <AnimatePresence>
              {uploadResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'p-5 rounded-2xl flex items-center gap-4 border',
                    uploadResult.success
                      ? 'bg-success/5 border-success/20'
                      : 'bg-danger/5 border-danger/20'
                  )}
                >
                  {uploadResult.success ? (
                    <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-danger flex-shrink-0" />
                  )}
                  <p className={cn(
                    "font-medium",
                    uploadResult.success ? 'text-success' : 'text-danger'
                  )}>
                    {uploadResult.message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CSV Format Guide - Simplified */}
            <div className="bg-surface border border-border/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Formato do CSV</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Seu arquivo deve conter no mínimo: <code className="text-primary bg-primary/10 px-2 py-1 rounded">symbol</code> e <code className="text-primary bg-primary/10 px-2 py-1 rounded">profit</code>
              </p>
              <div className="bg-background/50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs font-mono text-gray-300">
{`date,symbol,type,volume,entry_price,exit_price,profit
2024-01-15,WINZ24,BUY,1,128500,128650,150.00
2024-01-15,WINZ24,SELL,1,128700,128550,-150.00`}
                </pre>
              </div>
              <button className="mt-4 text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Baixar template
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'metaapi' && (
          <motion.div
            key="metaapi"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 relative z-10"
          >
            {/* MetaAPI Hero - Simplified */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Cloud className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">MetaAPI</h3>
                    <span className="bg-success/20 text-success text-xs px-2.5 py-1 rounded-full font-medium">Recomendado</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">Conecte ao MT4/MT5 de qualquer sistema operacional</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-success">
                      <CheckCircle className="w-3.5 h-3.5" /> Mac/Linux/Windows
                    </span>
                    <span className="flex items-center gap-1.5 text-primary">
                      <Zap className="w-3.5 h-3.5" /> Plano Gratuito
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form - Simplified */}
            <div className="bg-surface border border-border/50 rounded-2xl p-6">
              <h3 className="font-semibold mb-5 text-lg">Configurar Conexão</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">API Token</label>
                  <input
                    type="password"
                    value={metaApiForm.apiToken}
                    onChange={(e) => setMetaApiForm({ ...metaApiForm, apiToken: e.target.value })}
                    placeholder="Cole seu token aqui"
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">Account ID</label>
                  <input
                    type="text"
                    value={metaApiForm.accountId}
                    onChange={(e) => setMetaApiForm({ ...metaApiForm, accountId: e.target.value })}
                    placeholder="ID da sua conta"
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={handleMetaApiSync}
                  disabled={metaApiLoading || !metaApiForm.apiToken || !metaApiForm.accountId}
                  className="w-full bg-primary hover:bg-primary/90 text-background px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {metaApiLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      <Cloud className="w-5 h-5" />
                      Sincronizar
                    </>
                  )}
                </button>
              </div>

              {/* Status */}
              <AnimatePresence>
                {metaApiStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      'mt-4 p-4 rounded-lg border flex items-start gap-3',
                      metaApiStatus.success
                        ? 'bg-success/5 border-success/20'
                        : 'bg-danger/5 border-danger/20'
                    )}
                  >
                    {metaApiStatus.success ? (
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-danger flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm font-medium",
                        metaApiStatus.success ? 'text-success' : 'text-danger'
                      )}>
                        {metaApiStatus.message}
                      </p>
                      {metaApiStatus.account && (
                        <p className="text-xs text-gray-500 mt-1">
                          {metaApiStatus.account.name} ({metaApiStatus.account.login})
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <a 
                href="https://metaapi.cloud" 
                target="_blank"
                className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Criar conta no MetaAPI (Grátis)
              </a>
            </div>
          </motion.div>
        )}

        {activeTab === 'mt5' && (
          <motion.div
            key="mt5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 relative z-10"
          >
            <div className="bg-surface border border-border/50 rounded-2xl p-6">
              <h3 className="font-semibold mb-5 text-lg">Conectar MetaTrader 5</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">Login</label>
                  <input
                    type="text"
                    value={mt5Form.login}
                    onChange={(e) => setMt5Form({ ...mt5Form, login: e.target.value })}
                    placeholder="12345678"
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">Senha</label>
                  <input
                    type="password"
                    value={mt5Form.password}
                    onChange={(e) => setMt5Form({ ...mt5Form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">Servidor</label>
                  <input
                    type="text"
                    value={mt5Form.server}
                    onChange={(e) => setMt5Form({ ...mt5Form, server: e.target.value })}
                    placeholder="XPInvestimentos-Demo"
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={handleMT5Connect}
                  disabled={mt5Loading || !mt5Form.login || !mt5Form.password || !mt5Form.server}
                  className="w-full bg-primary hover:bg-primary/90 text-background px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mt5Loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <Monitor className="w-5 h-5" />
                      Conectar
                    </>
                  )}
                </button>
              </div>

              {/* Status */}
              <AnimatePresence>
                {mt5Status && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      'mt-4 p-4 rounded-lg border flex items-start gap-3',
                      mt5Status.connected
                        ? 'bg-success/5 border-success/20'
                        : 'bg-warning/5 border-warning/20'
                    )}
                  >
                    {mt5Status.connected ? (
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                    )}
                    <p className={cn(
                      "text-sm font-medium flex-1",
                      mt5Status.connected ? 'text-success' : 'text-warning'
                    )}>
                      {mt5Status.message}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeTab === 'tradingview' && (
          <motion.div
            key="tradingview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 relative z-10"
          >
            <div className="bg-surface border border-border/50 rounded-2xl p-6">
              <h3 className="font-semibold mb-5 text-lg">Integração TradingView</h3>

              <div className="space-y-4">
                {/* Webhook URL */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">URL do Webhook</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="https://tradestars.app/api/webhook"
                      className="flex-1 bg-background border border-border/50 rounded-lg px-4 py-3 text-sm text-gray-500"
                    />
                    <button className="px-4 py-3 bg-surface-light border border-border/50 hover:border-primary/50 rounded-lg transition-colors flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message Template */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">Template JSON</label>
                  <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                    <pre className="text-xs font-mono text-primary overflow-x-auto">
{`{
  "symbol": "{{ticker}}",
  "type": "{{strategy.order.action}}",
  "price": {{close}}
}`}
                    </pre>
                  </div>
                  <button className="mt-2 text-sm text-primary hover:text-primary/80 flex items-center gap-2 transition-colors">
                    <Copy className="w-4 h-4" />
                    Copiar template
                  </button>
                </div>
              </div>

              <a 
                href="#" 
                className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ver tutorial completo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
