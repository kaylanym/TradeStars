from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class TradeBase(BaseModel):
    symbol: str
    trade_type: str  # BUY or SELL
    volume: float = 1.0
    entry_price: float
    exit_price: Optional[float] = None
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None
    profit: float = 0.0
    profit_pips: float = 0.0
    commission: float = 0.0
    swap: float = 0.0
    open_time: datetime
    close_time: Optional[datetime] = None
    duration_minutes: int = 0
    source: str = "CSV"
    external_id: Optional[str] = None
    notes: Optional[str] = None


class TradeCreate(TradeBase):
    pass


class TradeResponse(TradeBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TradeListResponse(BaseModel):
    trades: List[TradeResponse]
    total: int
    skip: int
    limit: int


