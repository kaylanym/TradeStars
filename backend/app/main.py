from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routers import trades, analytics, integrations, ai_insights
from app.database import create_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await create_tables()
    yield
    # Shutdown


app = FastAPI(
    title="TradeStars API",
    description="API para análise de operações de trading com IA",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(trades.router, prefix="/api/trades", tags=["Trades"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(integrations.router, prefix="/api/integrations", tags=["Integrations"])
app.include_router(ai_insights.router, prefix="/api/ai", tags=["AI Insights"])


@app.get("/")
async def root():
    return {
        "message": "🚀 TradeStars API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


