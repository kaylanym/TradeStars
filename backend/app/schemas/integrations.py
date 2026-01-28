from pydantic import BaseModel
from typing import Optional


class MT5Credentials(BaseModel):
    login: int
    password: str
    server: str


class MT5ConnectionStatus(BaseModel):
    connected: bool
    message: str
    account_name: Optional[str] = None
    balance: Optional[float] = None
    server: Optional[str] = None


class TradingViewWebhook(BaseModel):
    symbol: str
    type: str  # BUY or SELL
    price: float
    volume: Optional[float] = 1.0
    message: Optional[str] = None
    id: Optional[str] = None


class SyncResult(BaseModel):
    success: bool
    message: str
    trades_imported: int
    trades_skipped: int


