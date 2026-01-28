from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class TradeType(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"


class TradeSource(str, enum.Enum):
    CSV = "CSV"
    METATRADER = "METATRADER"
    TRADINGVIEW = "TRADINGVIEW"


class Trade(Base):
    __tablename__ = "trades"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Trade info
    symbol = Column(String(50), nullable=False, index=True)
    trade_type = Column(String(10), nullable=False)  # BUY or SELL
    volume = Column(Float, nullable=False)
    
    # Prices
    entry_price = Column(Float, nullable=False)
    exit_price = Column(Float, nullable=True)
    stop_loss = Column(Float, nullable=True)
    take_profit = Column(Float, nullable=True)
    
    # Results
    profit = Column(Float, default=0.0)
    profit_pips = Column(Float, default=0.0)
    commission = Column(Float, default=0.0)
    swap = Column(Float, default=0.0)
    
    # Timing
    open_time = Column(DateTime, nullable=False)
    close_time = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, default=0)
    
    # Metadata
    source = Column(String(20), default="CSV")
    external_id = Column(String(100), nullable=True)  # ID from MT5/TradingView
    notes = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="trades")
    
    def __repr__(self):
        return f"<Trade {self.symbol} {self.trade_type} {self.profit}>"


