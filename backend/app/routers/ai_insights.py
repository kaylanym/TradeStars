from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models.trade import Trade
from app.services.ai_service import AIService
from app.schemas.ai import InsightRequest, InsightResponse

router = APIRouter()


@router.get("/insights")
async def get_ai_insights(
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Gera insights personalizados com IA baseado no histórico de trades"""
    
    # Buscar trades
    query = select(Trade).where(Trade.user_id == user_id)
    result = await db.execute(query)
    trades = result.scalars().all()
    
    if not trades:
        return {
            "has_data": False,
            "message": "Você ainda não tem trades registrados. Importe seus dados para receber insights!",
            "insights": []
        }
    
    if len(trades) < 10:
        return {
            "has_data": True,
            "message": "Você tem poucos trades. Continue operando e importe mais dados para insights mais precisos.",
            "insights": [
                {
                    "type": "info",
                    "title": "📊 Mais dados necessários",
                    "description": f"Você tem apenas {len(trades)} trades. Recomendamos pelo menos 30 para análises mais precisas."
                }
            ]
        }
    
    ai_service = AIService()
    insights = await ai_service.generate_insights(trades)
    
    return {
        "has_data": True,
        "trades_analyzed": len(trades),
        "generated_at": datetime.now().isoformat(),
        "insights": insights
    }


@router.get("/quick-analysis")
async def quick_analysis(
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Análise rápida sem usar IA (baseada em regras)"""
    
    query = select(Trade).where(Trade.user_id == user_id)
    result = await db.execute(query)
    trades = result.scalars().all()
    
    if not trades:
        return {"insights": [], "message": "Sem trades para analisar"}
    
    insights = []
    
    # Análise de horários
    hourly_performance = {}
    for trade in trades:
        hour = trade.open_time.hour
        if hour not in hourly_performance:
            hourly_performance[hour] = {"wins": 0, "losses": 0, "profit": 0}
        
        hourly_performance[hour]["profit"] += trade.profit
        if trade.profit > 0:
            hourly_performance[hour]["wins"] += 1
        else:
            hourly_performance[hour]["losses"] += 1
    
    # Encontrar melhor e pior horário
    if hourly_performance:
        best_hour = max(hourly_performance.items(), key=lambda x: x[1]["profit"])
        worst_hour = min(hourly_performance.items(), key=lambda x: x[1]["profit"])
        
        if best_hour[1]["profit"] > 0:
            insights.append({
                "type": "success",
                "category": "timing",
                "title": "⏰ Melhor Horário",
                "description": f"Seu melhor horário para operar é às {best_hour[0]:02d}:00. Você lucrou R$ {best_hour[1]['profit']:.2f} nesse horário.",
                "action": f"Considere concentrar suas operações próximo das {best_hour[0]:02d}:00"
            })
        
        if worst_hour[1]["profit"] < 0:
            insights.append({
                "type": "warning",
                "category": "timing", 
                "title": "⚠️ Horário Problemático",
                "description": f"Evite operar às {worst_hour[0]:02d}:00. Você perdeu R$ {abs(worst_hour[1]['profit']):.2f} nesse horário.",
                "action": f"Considere não operar entre {worst_hour[0]:02d}:00 e {worst_hour[0]+1:02d}:00"
            })
    
    # Análise de símbolos
    symbol_performance = {}
    for trade in trades:
        if trade.symbol not in symbol_performance:
            symbol_performance[trade.symbol] = {"wins": 0, "total": 0, "profit": 0}
        
        symbol_performance[trade.symbol]["profit"] += trade.profit
        symbol_performance[trade.symbol]["total"] += 1
        if trade.profit > 0:
            symbol_performance[trade.symbol]["wins"] += 1
    
    for symbol, data in symbol_performance.items():
        win_rate = (data["wins"] / data["total"]) * 100 if data["total"] > 0 else 0
        
        if win_rate < 40 and data["total"] >= 5:
            insights.append({
                "type": "danger",
                "category": "symbol",
                "title": f"🚨 Baixo Win Rate em {symbol}",
                "description": f"Seu win rate em {symbol} é de apenas {win_rate:.1f}% ({data['wins']}/{data['total']} trades).",
                "action": f"Revise sua estratégia para {symbol} ou considere não operar esse ativo"
            })
        elif win_rate > 70 and data["total"] >= 5:
            insights.append({
                "type": "success",
                "category": "symbol",
                "title": f"🌟 Excelente em {symbol}",
                "description": f"Seu win rate em {symbol} é de {win_rate:.1f}%! Lucro total: R$ {data['profit']:.2f}",
                "action": f"Continue focando em {symbol}, você tem vantagem nesse ativo"
            })
    
    # Análise de sequências (revenge trading)
    losses_sequence = 0
    max_losses_sequence = 0
    for trade in sorted(trades, key=lambda x: x.open_time):
        if trade.profit < 0:
            losses_sequence += 1
            max_losses_sequence = max(max_losses_sequence, losses_sequence)
        else:
            losses_sequence = 0
    
    if max_losses_sequence >= 3:
        insights.append({
            "type": "warning",
            "category": "psychology",
            "title": "🧠 Possível Revenge Trading",
            "description": f"Você teve uma sequência de {max_losses_sequence} losses seguidos. Isso pode indicar revenge trading.",
            "action": "Após 2 losses seguidos, faça uma pausa de pelo menos 15 minutos"
        })
    
    # Win rate geral
    wins = len([t for t in trades if t.profit > 0])
    total = len(trades)
    win_rate = (wins / total) * 100
    
    if win_rate < 50:
        insights.append({
            "type": "warning",
            "category": "general",
            "title": "📉 Win Rate Abaixo de 50%",
            "description": f"Seu win rate geral é de {win_rate:.1f}%. Isso significa que você perde mais trades do que ganha.",
            "action": "Revise seus critérios de entrada e considere ser mais seletivo"
        })
    
    # Gestão de risco
    profits = [t.profit for t in trades]
    avg_win = sum(p for p in profits if p > 0) / max(1, len([p for p in profits if p > 0]))
    avg_loss = abs(sum(p for p in profits if p < 0)) / max(1, len([p for p in profits if p < 0]))
    
    if avg_loss > avg_win * 1.5:
        insights.append({
            "type": "danger",
            "category": "risk",
            "title": "⚠️ Loss Médio Muito Alto",
            "description": f"Seu loss médio (R$ {avg_loss:.2f}) é muito maior que seu gain médio (R$ {avg_win:.2f}).",
            "action": "Use stop loss mais curto ou aumente seu take profit"
        })
    
    # Recomendações de gestão
    suggested_loss = avg_loss * 2
    suggested_gain = avg_win * 3
    
    insights.append({
        "type": "info",
        "category": "management",
        "title": "💰 Limites Sugeridos",
        "description": f"Com base no seu histórico, sugerimos: Loss diário máximo de R$ {suggested_loss:.2f} e meta de gain de R$ {suggested_gain:.2f}",
        "action": "Configure esses limites no seu operacional"
    })
    
    return {
        "trades_analyzed": len(trades),
        "insights_count": len(insights),
        "insights": insights
    }


@router.post("/chat")
async def chat_with_ai(
    message: str,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Chat com IA sobre suas operações"""
    
    query = select(Trade).where(Trade.user_id == user_id)
    result = await db.execute(query)
    trades = result.scalars().all()
    
    ai_service = AIService()
    response = await ai_service.chat(message, trades)
    
    return {
        "message": message,
        "response": response,
        "timestamp": datetime.now().isoformat()
    }


