# 🚀 TradeStars - Plataforma de Análise para Traders

Uma plataforma inteligente que analisa suas operações de trading e fornece insights personalizados para melhorar sua performance.

## ✨ Funcionalidades

- 📊 **Dashboard Completo** - Visualize métricas de performance, ganhos, perdas, win rate e muito mais
- 🔗 **Integração MetaTrader 4/5** - Conecte sua conta e importe operações automaticamente
- 📈 **Integração TradingView** - Sincronize seus trades do TradingView
- 📁 **Upload CSV** - Importe relatórios de qualquer corretora via arquivo CSV
- 🤖 **IA para Insights** - Receba análises personalizadas sobre onde você deve melhorar
- ⏰ **Análise de Horários** - Descubra seus melhores e piores horários para operar
- 💰 **Gestão de Risco** - Cálculo automático de loss/gain diário ideal

## 🛠️ Tecnologias

### Backend
- Python 3.11+
- FastAPI
- SQLAlchemy
- OpenAI API (para IA)
- MetaTrader5 Library
- Pandas

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- Recharts
- Framer Motion

## 🚀 Como Rodar

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou: venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:3000

## 📁 Estrutura do Projeto

```
TradeStars/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── package.json
└── README.md
```

## 📄 Formato CSV Esperado

Para importação manual, o CSV deve conter as seguintes colunas:

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| date | Data da operação | 2024-01-15 |
| time | Horário | 10:30:00 |
| symbol | Ativo operado | WINZ24 |
| type | Tipo (BUY/SELL) | BUY |
| volume | Volume/Lotes | 1.0 |
| entry_price | Preço de entrada | 128500 |
| exit_price | Preço de saída | 128650 |
| profit | Resultado em R$ | 150.00 |
| duration | Duração em minutos | 5 |

## 🔐 Variáveis de Ambiente

### Backend (.env)
```
OPENAI_API_KEY=sua_chave_openai
DATABASE_URL=sqlite:///./tradestars.db
SECRET_KEY=sua_chave_secreta
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📝 Licença

MIT License - Use à vontade!

---

Desenvolvido com ❤️ para traders que querem evoluir


