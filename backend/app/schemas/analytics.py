from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class DashboardStats(BaseModel):
    total_trades: int
    winning_trades: int
    losing_trades: int
    win_rate: float
    total_profit: float
    total_loss: float
    net_profit: float
    average_win: float
    average_loss: float
    profit_factor: float
    best_trade: float
    worst_trade: float
    average_duration: int
    suggested_daily_loss: float
    suggested_daily_gain: float


class HourlyPerformance(BaseModel):
    hour: int
    hour_label: str
    trades: int
    profit: float
    win_rate: float


class SymbolPerformance(BaseModel):
    symbol: str
    trades: int
    profit: float
    win_rate: float
    average_profit: float


class DailyPerformance(BaseModel):
    date: str
    profit: float
    cumulative: float
    trades: int
    win_rate: float


class DayStats(BaseModel):
    day: str
    profit: float


class WeeklyStats(BaseModel):
    period: str
    start_date: str
    end_date: str
    total_trades: int
    net_profit: float
    win_rate: float
    best_day: Optional[DayStats]
    worst_day: Optional[DayStats]


class MonthlyStats(BaseModel):
    period: str
    month: str
    total_trades: int
    net_profit: float
    win_rate: float
    trading_days: int
    average_daily_profit: float


