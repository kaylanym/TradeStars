from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from datetime import datetime, date, timedelta
import pandas as pd

from app.database import get_db
from app.models.trade import Trade
from app.schemas.analytics import (
    DashboardStats, 
    HourlyPerformance, 
    SymbolPerformance,
    DailyPerformance,
    WeeklyStats,
    MonthlyStats
)

router = APIRouter()


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    user_id: int = 1,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: AsyncSession = Depends(get_db)
):
    """Retorna estatísticas gerais do dashboard"""
    query = select(Trade).where(Trade.user_id == user_id)
    
    if start_date:
        query = query.where(Trade.open_time >= datetime.combine(start_date, datetime.min.time()))
    if end_date:
        query = query.where(Trade.open_time <= datetime.combine(end_date, datetime.max.time()))
    
    result = await db.execute(query)
    trades = result.scalars().all()
    
    if not trades:
        return DashboardStats(
            total_trades=0,
            winning_trades=0,
            losing_trades=0,
            win_rate=0.0,
            total_profit=0.0,
            total_loss=0.0,
            net_profit=0.0,
            average_win=0.0,
            average_loss=0.0,
            profit_factor=0.0,
            best_trade=0.0,
            worst_trade=0.0,
            average_duration=0,
            suggested_daily_loss=0.0,
            suggested_daily_gain=0.0
        )
    
    profits = [t.profit for t in trades]
    winning = [p for p in profits if p > 0]
    losing = [p for p in profits if p < 0]
    
    total_profit = sum(winning) if winning else 0
    total_loss = abs(sum(losing)) if losing else 0
    net_profit = sum(profits)
    
    win_rate = (len(winning) / len(trades)) * 100 if trades else 0
    avg_win = sum(winning) / len(winning) if winning else 0
    avg_loss = abs(sum(losing) / len(losing)) if losing else 0
    profit_factor = total_profit / total_loss if total_loss > 0 else 0
    
    durations = [t.duration_minutes for t in trades if t.duration_minutes]
    avg_duration = sum(durations) / len(durations) if durations else 0
    
    # Sugestões baseadas no histórico
    daily_trades = len(trades) / max(1, len(set(t.open_time.date() for t in trades)))
    suggested_daily_loss = avg_loss * 2 if avg_loss else 100
    suggested_daily_gain = avg_win * daily_trades * (win_rate / 100) if avg_win else 200
    
    return DashboardStats(
        total_trades=len(trades),
        winning_trades=len(winning),
        losing_trades=len(losing),
        win_rate=round(win_rate, 2),
        total_profit=round(total_profit, 2),
        total_loss=round(total_loss, 2),
        net_profit=round(net_profit, 2),
        average_win=round(avg_win, 2),
        average_loss=round(avg_loss, 2),
        profit_factor=round(profit_factor, 2),
        best_trade=round(max(profits), 2) if profits else 0,
        worst_trade=round(min(profits), 2) if profits else 0,
        average_duration=round(avg_duration),
        suggested_daily_loss=round(suggested_daily_loss, 2),
        suggested_daily_gain=round(suggested_daily_gain, 2)
    )


@router.get("/hourly-performance")
async def get_hourly_performance(
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Análise de performance por horário"""
    query = select(Trade).where(Trade.user_id == user_id)
    result = await db.execute(query)
    trades = result.scalars().all()
    
    hourly_data = {}
    for hour in range(24):
        hourly_data[hour] = {"trades": 0, "profit": 0, "wins": 0}
    
    for trade in trades:
        hour = trade.open_time.hour
        hourly_data[hour]["trades"] += 1
        hourly_data[hour]["profit"] += trade.profit
        if trade.profit > 0:
            hourly_data[hour]["wins"] += 1
    
    result = []
    for hour, data in hourly_data.items():
        win_rate = (data["wins"] / data["trades"] * 100) if data["trades"] > 0 else 0
        result.append({
            "hour": hour,
            "hour_label": f"{hour:02d}:00",
            "trades": data["trades"],
            "profit": round(data["profit"], 2),
            "win_rate": round(win_rate, 2)
        })
    
    return result


@router.get("/symbol-performance")
async def get_symbol_performance(
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Análise de performance por ativo"""
    query = select(Trade).where(Trade.user_id == user_id)
    result = await db.execute(query)
    trades = result.scalars().all()
    
    symbol_data = {}
    for trade in trades:
        if trade.symbol not in symbol_data:
            symbol_data[trade.symbol] = {"trades": 0, "profit": 0, "wins": 0}
        
        symbol_data[trade.symbol]["trades"] += 1
        symbol_data[trade.symbol]["profit"] += trade.profit
        if trade.profit > 0:
            symbol_data[trade.symbol]["wins"] += 1
    
    result = []
    for symbol, data in symbol_data.items():
        win_rate = (data["wins"] / data["trades"] * 100) if data["trades"] > 0 else 0
        result.append({
            "symbol": symbol,
            "trades": data["trades"],
            "profit": round(data["profit"], 2),
            "win_rate": round(win_rate, 2),
            "average_profit": round(data["profit"] / data["trades"], 2) if data["trades"] > 0 else 0
        })
    
    # Ordenar por profit
    result.sort(key=lambda x: x["profit"], reverse=True)
    
    return result


@router.get("/daily-performance")
async def get_daily_performance(
    user_id: int = 1,
    days: int = Query(30, ge=7, le=365),
    db: AsyncSession = Depends(get_db)
):
    """Performance diária dos últimos X dias"""
    start_date = datetime.now() - timedelta(days=days)
    
    query = select(Trade).where(
        Trade.user_id == user_id,
        Trade.open_time >= start_date
    ).order_by(Trade.open_time)
    
    result = await db.execute(query)
    trades = result.scalars().all()
    
    daily_data = {}
    for trade in trades:
        day = trade.open_time.strftime("%Y-%m-%d")
        if day not in daily_data:
            daily_data[day] = {"profit": 0, "trades": 0, "wins": 0}
        
        daily_data[day]["profit"] += trade.profit
        daily_data[day]["trades"] += 1
        if trade.profit > 0:
            daily_data[day]["wins"] += 1
    
    result = []
    cumulative = 0
    for day, data in sorted(daily_data.items()):
        cumulative += data["profit"]
        win_rate = (data["wins"] / data["trades"] * 100) if data["trades"] > 0 else 0
        result.append({
            "date": day,
            "profit": round(data["profit"], 2),
            "cumulative": round(cumulative, 2),
            "trades": data["trades"],
            "win_rate": round(win_rate, 2)
        })
    
    return result


@router.get("/weekly-stats")
async def get_weekly_stats(
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Estatísticas da semana atual"""
    today = datetime.now()
    start_of_week = today - timedelta(days=today.weekday())
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
    
    query = select(Trade).where(
        Trade.user_id == user_id,
        Trade.open_time >= start_of_week
    )
    
    result = await db.execute(query)
    trades = result.scalars().all()
    
    if not trades:
        return {
            "period": "Semana Atual",
            "start_date": start_of_week.strftime("%Y-%m-%d"),
            "end_date": today.strftime("%Y-%m-%d"),
            "total_trades": 0,
            "net_profit": 0,
            "win_rate": 0,
            "best_day": None,
            "worst_day": None
        }
    
    profits = [t.profit for t in trades]
    wins = [p for p in profits if p > 0]
    
    # Agrupar por dia
    daily = {}
    for trade in trades:
        day = trade.open_time.strftime("%A")
        if day not in daily:
            daily[day] = 0
        daily[day] += trade.profit
    
    best_day = max(daily.items(), key=lambda x: x[1]) if daily else (None, 0)
    worst_day = min(daily.items(), key=lambda x: x[1]) if daily else (None, 0)
    
    return {
        "period": "Semana Atual",
        "start_date": start_of_week.strftime("%Y-%m-%d"),
        "end_date": today.strftime("%Y-%m-%d"),
        "total_trades": len(trades),
        "net_profit": round(sum(profits), 2),
        "win_rate": round(len(wins) / len(trades) * 100, 2) if trades else 0,
        "best_day": {"day": best_day[0], "profit": round(best_day[1], 2)} if best_day[0] else None,
        "worst_day": {"day": worst_day[0], "profit": round(worst_day[1], 2)} if worst_day[0] else None
    }


@router.get("/monthly-stats")
async def get_monthly_stats(
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Estatísticas do mês atual"""
    today = datetime.now()
    start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    query = select(Trade).where(
        Trade.user_id == user_id,
        Trade.open_time >= start_of_month
    )
    
    result = await db.execute(query)
    trades = result.scalars().all()
    
    if not trades:
        return {
            "period": "Mês Atual",
            "month": today.strftime("%B %Y"),
            "total_trades": 0,
            "net_profit": 0,
            "win_rate": 0,
            "trading_days": 0,
            "average_daily_profit": 0
        }
    
    profits = [t.profit for t in trades]
    wins = [p for p in profits if p > 0]
    trading_days = len(set(t.open_time.date() for t in trades))
    
    return {
        "period": "Mês Atual",
        "month": today.strftime("%B %Y"),
        "total_trades": len(trades),
        "net_profit": round(sum(profits), 2),
        "win_rate": round(len(wins) / len(trades) * 100, 2) if trades else 0,
        "trading_days": trading_days,
        "average_daily_profit": round(sum(profits) / trading_days, 2) if trading_days else 0
    }


