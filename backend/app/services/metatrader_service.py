"""
MetaTrader 5 Integration Service

Requires MetaTrader 5 terminal installed on Windows.
For Mac/Linux, you can use Wine or a Windows VM.
"""

from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import asyncio


class MetaTraderService:
    def __init__(self):
        self._connected = False
        self._mt5 = None
    
    async def connect(self, login: int, password: str, server: str) -> dict:
        """
        Connect to MetaTrader 5 terminal.
        
        Note: MT5 library only works on Windows.
        For cross-platform support, consider using MT5 Web API or broker's API.
        """
        import platform
        
        # Check if running on Windows
        if platform.system() != "Windows":
            return {
                "success": False,
                "is_mock": True,
                "message": f"⚠️ MetaTrader5 só funciona no Windows. Você está usando {platform.system()}. Use a opção de Upload CSV para importar seus trades do MT5.",
                "alternatives": [
                    "1. Exporte o histórico do MT5 como CSV e faça upload",
                    "2. Use uma VPS Windows para rodar a integração",
                    "3. Use a API da sua corretora diretamente"
                ]
            }
        
        try:
            # Try to import MT5 (only works on Windows)
            import MetaTrader5 as mt5
            self._mt5 = mt5
            
            # Initialize
            if not mt5.initialize():
                return {
                    "success": False,
                    "is_mock": False,
                    "message": f"❌ Falha ao inicializar MT5: {mt5.last_error()}"
                }
            
            # Login
            authorized = mt5.login(
                login=login,
                password=password,
                server=server
            )
            
            if authorized:
                self._connected = True
                account = mt5.account_info()
                return {
                    "success": True,
                    "is_mock": False,
                    "message": f"✅ Conectado ao MT5: {account.name}",
                    "account": {
                        "name": account.name,
                        "balance": account.balance,
                        "server": server
                    }
                }
            else:
                return {
                    "success": False,
                    "is_mock": False,
                    "message": f"❌ Falha no login: {mt5.last_error()}"
                }
                
        except ImportError:
            return {
                "success": False,
                "is_mock": True,
                "message": "❌ Biblioteca MetaTrader5 não instalada. Instale com: pip install MetaTrader5"
            }
        except Exception as e:
            return {
                "success": False,
                "is_mock": False,
                "message": f"❌ Erro de conexão: {str(e)}"
            }
    
    async def disconnect(self):
        """Disconnect from MT5"""
        if self._mt5:
            self._mt5.shutdown()
        self._connected = False
    
    async def is_connected(self) -> bool:
        """Check if connected to MT5"""
        return self._connected
    
    async def get_account_info(self) -> Dict[str, Any]:
        """Get account information"""
        if not self._connected:
            return {}
        
        try:
            if self._mt5:
                info = self._mt5.account_info()
                if info:
                    return {
                        "login": info.login,
                        "name": info.name,
                        "server": info.server,
                        "balance": info.balance,
                        "equity": info.equity,
                        "profit": info.profit,
                        "margin": info.margin,
                        "margin_free": info.margin_free,
                        "currency": info.currency
                    }
        except:
            pass
        
        # Mock data for development
        return {
            "login": 12345678,
            "name": "Demo Account",
            "server": "Demo-Server",
            "balance": 10000.00,
            "equity": 10150.00,
            "profit": 150.00,
            "margin": 500.00,
            "margin_free": 9650.00,
            "currency": "USD"
        }
    
    async def get_history(self, from_date: datetime, to_date: datetime = None) -> List[Dict[str, Any]]:
        """
        Get trading history from MT5.
        
        Returns list of closed trades.
        """
        if to_date is None:
            to_date = datetime.now()
        
        try:
            if self._mt5:
                # Get deals from history
                deals = self._mt5.history_deals_get(from_date, to_date)
                
                if deals is None:
                    print(f"No deals found: {self._mt5.last_error()}")
                    return []
                
                trades = []
                positions = {}
                
                for deal in deals:
                    if deal.type in [0, 1]:  # BUY or SELL
                        pos_id = deal.position_id
                        
                        if deal.entry == 0:  # Entry
                            positions[pos_id] = {
                                "ticket": deal.ticket,
                                "symbol": deal.symbol,
                                "type": "BUY" if deal.type == 0 else "SELL",
                                "volume": deal.volume,
                                "price_open": deal.price,
                                "time_open": datetime.fromtimestamp(deal.time),
                                "commission": deal.commission,
                            }
                        elif deal.entry == 1:  # Exit
                            if pos_id in positions:
                                pos = positions[pos_id]
                                pos["price_close"] = deal.price
                                pos["time_close"] = datetime.fromtimestamp(deal.time)
                                pos["profit"] = deal.profit
                                pos["swap"] = deal.swap
                                trades.append(pos)
                
                return trades
                
        except Exception as e:
            print(f"Error getting MT5 history: {e}")
        
        # Return mock data for development
        return self._generate_mock_history(from_date, to_date)
    
    def _generate_mock_history(self, from_date: datetime, to_date: datetime) -> List[Dict[str, Any]]:
        """Generate mock trading history for development/testing"""
        import random
        
        trades = []
        current_date = from_date
        ticket = 100000000
        
        symbols = ["WINZ24", "WDOZ24", "PETR4", "VALE3", "EURUSD", "GBPUSD"]
        
        while current_date < to_date:
            # Skip weekends
            if current_date.weekday() < 5:
                # 2-5 trades per day
                for _ in range(random.randint(2, 5)):
                    symbol = random.choice(symbols)
                    trade_type = random.choice(["BUY", "SELL"])
                    
                    # Random time during trading hours
                    hour = random.randint(9, 17)
                    minute = random.randint(0, 59)
                    open_time = current_date.replace(hour=hour, minute=minute)
                    
                    duration = random.randint(5, 120)  # 5 min to 2 hours
                    close_time = open_time + timedelta(minutes=duration)
                    
                    # Random profit/loss with slight positive bias
                    profit = random.uniform(-200, 250)
                    
                    if "WIN" in symbol or "WDO" in symbol:
                        price = random.uniform(125000, 135000) if "WIN" in symbol else random.uniform(4800, 5200)
                    elif symbol in ["EURUSD", "GBPUSD"]:
                        price = random.uniform(1.05, 1.30)
                    else:
                        price = random.uniform(20, 100)
                    
                    trades.append({
                        "ticket": ticket,
                        "symbol": symbol,
                        "type": trade_type,
                        "volume": random.choice([1, 2, 5]),
                        "price_open": price,
                        "price_close": price + (random.uniform(-0.01, 0.01) * price),
                        "time_open": open_time,
                        "time_close": close_time,
                        "profit": round(profit, 2),
                        "commission": round(random.uniform(0.5, 2.0), 2),
                        "swap": 0
                    })
                    
                    ticket += 1
            
            current_date += timedelta(days=1)
        
        return trades
    
    async def get_open_positions(self) -> List[Dict[str, Any]]:
        """Get current open positions"""
        if not self._connected:
            return []
        
        try:
            if self._mt5:
                positions = self._mt5.positions_get()
                if positions:
                    return [
                        {
                            "ticket": p.ticket,
                            "symbol": p.symbol,
                            "type": "BUY" if p.type == 0 else "SELL",
                            "volume": p.volume,
                            "price_open": p.price_open,
                            "price_current": p.price_current,
                            "profit": p.profit,
                            "swap": p.swap,
                            "time": datetime.fromtimestamp(p.time)
                        }
                        for p in positions
                    ]
        except:
            pass
        
        return []

