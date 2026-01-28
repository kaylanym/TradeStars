# 🌟 TradeStars - Plataforma Profissional de Gestão Financeira

**A solução completa para traders e investidores que desejam maximizar seus resultados**

Sistema inteligente com IA integrada para análise de trading, gestão de portfolio, integrações com principais corretoras e mentoria profissional.

---

## 🎯 Visão Geral

TradeStars é uma plataforma all-in-one que combina análise avançada de trading, gestão completa de portfolio de investimentos e orientação profissional através de IA e mentores especializados.

### Por que TradeStars?

- ✅ **Gestão Completa**: Trading + Investimentos em um só lugar
- ✅ **Integrações Reais**: Conecte com XP, Clear, MT5, TradingView e mais
- ✅ **IA Integrada**: Insights automáticos e recomendações personalizadas
- ✅ **Mentoria**: Acesso a analistas profissionais (em breve)
- ✅ **Interface Moderna**: Design profissional e intuitivo

---

## 🚀 Funcionalidades

### 📊 Dashboard de Trading
- Visualização em tempo real do P&L (Profit & Loss)
- Métricas essenciais: Win Rate, Profit Factor, Drawdown
- Gráficos interativos de performance
- Análise dos melhores horários de operação
- Estatísticas por símbolo e período

### 💼 Gestão de Portfolio
**NOVO! Gerencie todos seus investimentos em um só lugar**

- **Visão 360º**: RV, RF, FIIs, Fundos, Criptomoedas
- **Alocação Inteligente**: Gráficos de distribuição por setor
- **Performance**: Acompanhe rentabilidade mês a mês
- **Detalhamento**: Lista completa de ativos com lucros calculados
- **Renda Fixa**: Acompanhe vencimentos e taxas

### 📈 Análise Profissional
**Análise avançada do seu portfolio com IA**

- **Score de Risco**: Avaliação completa de 0 a 10
- **Radar de Métricas**: Diversificação, Liquidez, Volatilidade
- **Análise Setorial**: Compare sua alocação vs recomendado
- **Benchmarks**: Performance vs IBOV, CDI e outros índices
- **Sharpe Ratio**: Indicadores profissionais de risco/retorno
- **Recomendações**: Sugestões automatizadas de rebalanceamento

### 🔗 Integrações

#### Corretoras Brasileiras
| Corretora | Status | Features |
|-----------|--------|----------|
| 🏦 XP Investimentos | ✅ Disponível | RF, RV, FIIs, Histórico |
| 💎 Clear Corretora | ✅ Disponível | Day Trade, Swing Trade, Portfolio |
| 🚀 Rico Investimentos | ✅ Disponível | Tesouro, CDBs, Ações, Fundos |
| 🏛️ BTG Pactual | 🔄 Em Breve | COE, Fundos Exclusivos, Private |
| 💜 Nu Invest | 🔄 Em Breve | Ações, ETFs, RF, Cripto |
| 🧡 Inter Invest | 🔄 Em Breve | Ações, Fundos, Tesouro, CDB |

#### Plataformas de Trading
- **📊 MetaTrader 5** (via MetaAPI - funciona em Mac/Windows/Linux)
  - Histórico completo de trades
  - Forex, Futuros, CFDs
  - Conexão 24/7 cloud-based
  
- **📈 TradingView**
  - Webhooks para alertas automáticos
  - Integração com estratégias
  - Registro de sinais em tempo real

#### Importação Manual
- **Upload CSV**: Suporte para qualquer corretora
- **Parser Inteligente**: Detecta formato automaticamente
- **Múltiplos Formatos**: Excel, CSV, TXT

### 🤖 Insights com IA
- Análise automática de padrões de trading
- Identificação de pontos fracos e fortes
- Sugestões personalizadas de melhoria
- Chat interativo para dúvidas
- Alertas automáticos de risco
- Recomendações de rebalanceamento

### 👨‍🏫 Mentoria Profissional (EM DESENVOLVIMENTO)
**Acesso direto a analistas certificados**

- Chat em tempo real com mentores
- Recomendações personalizadas de compra/venda
- Agendamento de reuniões individuais
- Acompanhamento de trades sugeridos
- Análise de performance com especialista
- Planos de investimento sob medida

### 📋 Gestão de Operações
- Listagem completa de todos os trades
- Filtros avançados (data, símbolo, tipo, resultado)
- Visualização detalhada de cada operação
- Exportação de relatórios em múltiplos formatos
- Importação bulk via CSV

---

## 🛠️ Tecnologias

### Backend
- **Python 3.11+**
- **FastAPI** - API REST moderna e rápida
- **SQLAlchemy** - ORM com suporte assíncrono
- **OpenAI API** - IA para insights
- **MetaAPI** - Integração MT5 cross-platform
- **Pandas** - Análise de dados
- **Aiosqlite** - Database assíncrono

### Frontend
- **Next.js 14** - Framework React moderno
- **TypeScript** - Type safety
- **TailwindCSS** - Styling profissional
- **Framer Motion** - Animações fluidas
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones modernos

### Infraestrutura
- **Railway** - Backend deployment
- **Vercel** - Frontend deployment (em config)
- **PostgreSQL** - Database production
- **Docker** - Containerização

---

## 🚦 Como Rodar

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend roda em: `http://localhost:8000`
Docs interativa: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend roda em: `http://localhost:3000`

### Variáveis de Ambiente

#### Backend (`.env`)
```env
OPENAI_API_KEY=sua_chave_openai
METAAPI_TOKEN=seu_token_metaapi  # Opcional
DATABASE_URL=sqlite+aiosqlite:///./tradestars.db
```

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📦 Deployment

### Backend (Railway)
1. Crie conta no [Railway](https://railway.app)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy automático a cada push!

URL de produção: `https://tradestars-production.up.railway.app`

### Frontend (Vercel)
1. Crie conta no [Vercel](https://vercel.com)
2. Importe o projeto do GitHub
3. Configure Root Directory: `frontend`
4. Adicione variável: `NEXT_PUBLIC_API_URL`
5. Deploy!

---

## 🎨 Screenshots

> Em breve: Screenshots das novas funcionalidades

---

## 🗺️ Roadmap

### ✅ Fase 1 - Concluída
- [x] Dashboard de trading completo
- [x] Integrações MT5 e TradingView
- [x] Upload CSV
- [x] Insights com IA
- [x] Gestão de trades

### ✅ Fase 2 - Concluída (ATUAL)
- [x] Gestão de Portfolio
- [x] Análise Profissional
- [x] Integrações com Corretoras
- [x] Interface de Mentoria (preview)

### 🔄 Fase 3 - Em Desenvolvimento
- [ ] Integração real com XP, Clear, Rico
- [ ] Sistema de mentoria ativo
- [ ] Notificações em tempo real
- [ ] App Mobile (React Native)

### 📅 Fase 4 - Planejado
- [ ] Social trading (copiar trades de mentores)
- [ ] Marketplace de estratégias
- [ ] Backtesting automatizado
- [ ] Algoritmos de ML para previsões

---

## 📄 Licença

Este projeto é privado e proprietário.

---

## 👥 Equipe

Desenvolvido com ❤️ por TradeStars Team

---

## 📞 Contato

Para investidores e parcerias: **[Seu contato aqui]**

---

**TradeStars** - *Transformando dados em decisões inteligentes* 🌟
