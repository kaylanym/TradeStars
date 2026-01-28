from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=True)
    
    # Settings
    daily_loss_limit = Column(Integer, default=0)  # Limite de loss diário em R$
    daily_gain_target = Column(Integer, default=0)  # Meta de gain diário em R$
    
    # MetaTrader credentials (encrypted)
    mt5_login = Column(String(255), nullable=True)
    mt5_server = Column(String(255), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    trades = relationship("Trade", back_populates="user")
    
    def __repr__(self):
        return f"<User {self.email}>"


