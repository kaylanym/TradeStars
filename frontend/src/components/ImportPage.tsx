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
  Zap
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
    { id: 'metaapi', label: 'MetaAPI (MT5)', icon: Cloud },
    { id: 'mt5', label: 'MT5 Direto', icon: Monitor },
    { id: 'tradingview', label: 'TradingView', icon: Webhook },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Importar Dados</h1>
        <p className="text-gray-400 mt-1">Conecte suas plataformas ou importe via CSV</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-surface rounded-xl border border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as IntegrationType)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-primary text-background font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-surface-light'
              )}
            >
              <Icon className="w-5 h-5" />
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
            className="space-y-6"
          >
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200',
                isDragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-surface-light'
              )}
            >
              <input {...getInputProps()} />
              
              {uploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-lg font-medium">Processando arquivo...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg font-medium mb-2">
                    {isDragActive ? 'Solte o arquivo aqui' : 'Arraste seu arquivo CSV ou clique para selecionar'}
                  </p>
                  <p className="text-gray-400 text-sm">
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
                    'p-4 rounded-xl flex items-center gap-3',
                    uploadResult.success
                      ? 'bg-success/10 border border-success/20'
                      : 'bg-danger/10 border border-danger/20'
                  )}
                >
                  {uploadResult.success ? (
                    <CheckCircle className="w-6 h-6 text-success" />
                  ) : (
                    <XCircle className="w-6 h-6 text-danger" />
                  )}
                  <p className={uploadResult.success ? 'text-success' : 'text-danger'}>
                    {uploadResult.message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CSV Format Guide */}
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                Formato do CSV
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Seu CSV deve conter pelo menos as colunas: <code className="text-primary">symbol</code> e <code className="text-primary">profit</code>
              </p>
              <div className="bg-background rounded-xl p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">
{`date,time,symbol,type,volume,entry_price,exit_price,profit,duration
2024-01-15,09:30:00,WINZ24,BUY,1,128500,128650,150.00,5
2024-01-15,10:15:00,WINZ24,SELL,1,128700,128550,-150.00,8
2024-01-15,11:00:00,WDOZ24,BUY,1,4950,4965,75.00,12`}
                </pre>
              </div>
              <button className="mt-4 flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm">Baixar template CSV</span>
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
            className="space-y-6"
          >
            {/* MetaAPI Hero */}
            <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl p-6 border border-primary/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Cloud className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    MetaAPI 
                    <span className="bg-success/20 text-success text-xs px-2 py-1 rounded-full">Recomendado</span>
                  </h3>
                  <p className="text-gray-400 text-sm">Conecte ao MT4/MT5 de qualquer sistema operacional</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-success">
                  <CheckCircle className="w-4 h-4" /> Funciona no Mac
                </span>
                <span className="flex items-center gap-1 text-success">
                  <CheckCircle className="w-4 h-4" /> Funciona no Linux
                </span>
                <span className="flex items-center gap-1 text-success">
                  <CheckCircle className="w-4 h-4" /> Funciona no Windows
                </span>
                <span className="flex items-center gap-1 text-primary">
                  <Zap className="w-4 h-4" /> Plano Gratuito
                </span>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-primary" />
                Configurar MetaAPI
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">API Token</label>
                  <input
                    type="password"
                    value={metaApiForm.apiToken}
                    onChange={(e) => setMetaApiForm({ ...metaApiForm, apiToken: e.target.value })}
                    placeholder="Seu token da MetaAPI"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Account ID</label>
                  <input
                    type="text"
                    value={metaApiForm.accountId}
                    onChange={(e) => setMetaApiForm({ ...metaApiForm, accountId: e.target.value })}
                    placeholder="ID da sua conta no MetaAPI"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary transition-colors"
                  />
                </div>

                <button
                  onClick={handleMetaApiSync}
                  disabled={metaApiLoading || !metaApiForm.apiToken || !metaApiForm.accountId}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {metaApiLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      <Cloud className="w-5 h-5" />
                      Sincronizar Trades
                    </>
                  )}
                </button>
              </div>

              {/* MetaAPI Status */}
              <AnimatePresence>
                {metaApiStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      'mt-4 p-4 rounded-xl',
                      metaApiStatus.success
                        ? 'bg-success/10 border border-success/20'
                        : 'bg-danger/10 border border-danger/20'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {metaApiStatus.success ? (
                        <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-danger flex-shrink-0" />
                      )}
                      <div>
                        <p className={metaApiStatus.success ? 'text-success' : 'text-danger'}>
                          {metaApiStatus.message}
                        </p>
                        {metaApiStatus.account && (
                          <p className="text-sm text-gray-400 mt-1">
                            Conta: {metaApiStatus.account.name} ({metaApiStatus.account.login})
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tutorial MetaAPI */}
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h3 className="font-semibold mb-4">📋 Como configurar o MetaAPI</h3>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium">Crie uma conta no MetaAPI</p>
                    <p className="text-sm text-gray-400">Acesse <a href="https://metaapi.cloud" target="_blank" className="text-primary hover:underline">metaapi.cloud</a> e crie uma conta gratuita</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium">Adicione sua conta MT5</p>
                    <p className="text-sm text-gray-400">No painel do MetaAPI, clique em "Add Account" e insira as credenciais da sua corretora</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium">Aguarde o deploy</p>
                    <p className="text-sm text-gray-400">O MetaAPI vai criar a conexão com sua conta (leva alguns minutos)</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">4</span>
                  <div>
                    <p className="font-medium">Copie as credenciais</p>
                    <p className="text-sm text-gray-400">Pegue o "API Token" (nas configurações) e o "Account ID" (na lista de contas)</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center font-bold flex-shrink-0">5</span>
                  <div>
                    <p className="font-medium">Cole aqui e sincronize!</p>
                    <p className="text-sm text-gray-400">Pronto! Seus trades serão importados automaticamente 🎉</p>
                  </div>
                </li>
              </ol>
              
              <a 
                href="https://metaapi.cloud" 
                target="_blank"
                className="mt-6 inline-flex items-center gap-2 btn-primary"
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
            className="space-y-6"
          >
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                Conectar MetaTrader 5
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Insira suas credenciais do MetaTrader 5 para sincronizar seus trades automaticamente.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Login (Número da conta)</label>
                  <input
                    type="text"
                    value={mt5Form.login}
                    onChange={(e) => setMt5Form({ ...mt5Form, login: e.target.value })}
                    placeholder="12345678"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Senha</label>
                  <input
                    type="password"
                    value={mt5Form.password}
                    onChange={(e) => setMt5Form({ ...mt5Form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Servidor</label>
                  <input
                    type="text"
                    value={mt5Form.server}
                    onChange={(e) => setMt5Form({ ...mt5Form, server: e.target.value })}
                    placeholder="XPInvestimentos-Demo"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary transition-colors"
                  />
                </div>

                <button
                  onClick={handleMT5Connect}
                  disabled={mt5Loading || !mt5Form.login || !mt5Form.password || !mt5Form.server}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mt5Loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <Monitor className="w-5 h-5" />
                      Sincronizar Trades
                    </>
                  )}
                </button>
              </div>

              {/* MT5 Status */}
              <AnimatePresence>
                {mt5Status && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      'mt-4 p-4 rounded-xl',
                      mt5Status.connected
                        ? 'bg-success/10 border border-success/20'
                        : 'bg-warning/10 border border-warning/20'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {mt5Status.connected ? (
                        <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={mt5Status.connected ? 'text-success' : 'text-warning'}>
                          {mt5Status.message}
                        </p>
                        
                        {mt5Alternatives.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-sm font-medium text-white">Alternativas:</p>
                            <ul className="space-y-1">
                              {mt5Alternatives.map((alt, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                  <span>{alt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Info Box - Tutorial para exportar do MT5 */}
            <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
              <h4 className="font-medium mb-3 text-primary">📋 Como exportar do MetaTrader 5</h4>
              <ol className="space-y-2 text-sm text-gray-300">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  Abra o MetaTrader 5 no seu computador
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  Vá em <code className="bg-surface px-2 py-0.5 rounded">Caixa de Ferramentas</code> {">"} aba <code className="bg-surface px-2 py-0.5 rounded">Histórico</code>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">3.</span>
                  Clique com botão direito {">"} <code className="bg-surface px-2 py-0.5 rounded">Relatório</code>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">4.</span>
                  Escolha <code className="bg-surface px-2 py-0.5 rounded">Open XML</code> ou salve como arquivo
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">5.</span>
                  Volte aqui e use a aba <span className="text-primary font-semibold">Upload CSV</span> para importar!
                </li>
              </ol>
            </div>
          </motion.div>
        )}

        {activeTab === 'tradingview' && (
          <motion.div
            key="tradingview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Webhook className="w-5 h-5 text-primary" />
                Integração TradingView
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Configure webhooks no TradingView para registrar seus trades automaticamente.
              </p>

              <div className="space-y-6">
                {/* Webhook URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">URL do Webhook</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="https://seu-dominio.com/api/integrations/tradingview/webhook"
                      className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-gray-400"
                    />
                    <button className="btn-secondary flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      Copiar
                    </button>
                  </div>
                </div>

                {/* Message Template */}
                <div>
                  <label className="block text-sm font-medium mb-2">Template da Mensagem</label>
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <pre className="text-sm font-mono text-primary overflow-x-auto">
{`{
  "symbol": "{{ticker}}",
  "type": "{{strategy.order.action}}",
  "price": {{close}},
  "volume": {{strategy.order.contracts}},
  "message": "{{strategy.order.comment}}"
}`}
                    </pre>
                  </div>
                  <button className="mt-2 flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copiar template</span>
                  </button>
                </div>

                {/* Instructions */}
                <div className="bg-surface-light rounded-xl p-4">
                  <h4 className="font-medium mb-3">📋 Como configurar:</h4>
                  <ol className="space-y-2 text-sm text-gray-400">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">1.</span>
                      Abra o TradingView e vá em Alertas
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">2.</span>
                      Crie um novo alerta na sua estratégia
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">3.</span>
                      Em "Webhook URL", cole a URL acima
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">4.</span>
                      Em "Message", cole o template JSON
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">5.</span>
                      Salve o alerta e pronto!
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Export Option */}
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h3 className="font-semibold mb-4">📊 Exportar do Strategy Tester</h3>
              <p className="text-gray-400 text-sm mb-4">
                Você também pode exportar os trades do Strategy Tester do TradingView e importar via CSV.
              </p>
              <div className="flex gap-3">
                <button className="btn-secondary flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Ver tutorial
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

