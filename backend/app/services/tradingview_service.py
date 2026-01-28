"""
TradingView Integration Service

TradingView doesn't have a public API for trade history.
Integration options:
1. Webhooks - Receive alerts when trades are executed
2. CSV Export - User exports and uploads the file
3. Browser Extension - Could scrape data (not recommended)
"""

from datetime import datetime
from typing import Dict, Any, Optional
import hashlib
import hmac


class TradingViewService:
    def __init__(self, webhook_secret: str = None):
        self.webhook_secret = webhook_secret
    
    def verify_webhook(self, payload: str, signature: str) -> bool:
        """
        Verify webhook signature (if you set up a secret).
        TradingView doesn't natively support webhook signatures,
        but you can implement your own verification.
        """
        if not self.webhook_secret:
            return True
        
        expected = hmac.new(
            self.webhook_secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(expected, signature)
    
    def parse_webhook(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse incoming webhook from TradingView.
        
        Expected format:
        {
            "symbol": "WINZ24",
            "type": "BUY" or "SELL",
            "price": 128500,
            "volume": 1,
            "message": "Entry signal",
            "id": "unique_id"
        }
        """
        # Normalize trade type
        trade_type = str(data.get("type", "BUY")).upper()
        if trade_type in ["LONG", "BUY", "COMPRA"]:
            trade_type = "BUY"
        elif trade_type in ["SHORT", "SELL", "VENDA"]:
            trade_type = "SELL"
        
        # Extract symbol (remove exchange prefix if present)
        symbol = str(data.get("symbol", "UNKNOWN"))
        if ":" in symbol:
            symbol = symbol.split(":")[-1]
        
        return {
            "symbol": symbol.upper(),
            "type": trade_type,
            "price": float(data.get("price", 0)),
            "volume": float(data.get("volume", 1)),
            "message": data.get("message", ""),
            "id": data.get("id", f"tv_{datetime.now().timestamp()}")
        }
    
    def generate_alert_template(self, include_strategy: bool = True) -> Dict[str, Any]:
        """
        Generate TradingView alert message template.
        
        User should copy this to TradingView alert settings.
        """
        if include_strategy:
            # For use with Pine Script strategies
            return {
                "template": """{
    "symbol": "{{ticker}}",
    "type": "{{strategy.order.action}}",
    "price": {{close}},
    "volume": {{strategy.order.contracts}},
    "message": "{{strategy.order.comment}}",
    "id": "{{strategy.order.id}}"
}""",
                "description": "Use este template no campo 'Message' do alerta do TradingView"
            }
        else:
            # For use with simple alerts
            return {
                "template": """{
    "symbol": "{{ticker}}",
    "type": "BUY",
    "price": {{close}},
    "volume": 1,
    "message": "Alert triggered"
}""",
                "description": "Template para alertas simples. Mude 'type' manualmente para BUY ou SELL."
            }
    
    def parse_strategy_report_csv(self, csv_content: str) -> list:
        """
        Parse TradingView Strategy Tester CSV export.
        
        TradingView Strategy Tester exports include:
        - Trade # 
        - Type (Entry Long, Exit Long, Entry Short, Exit Short)
        - Signal
        - Date/Time
        - Price
        - Contracts
        - Profit
        - Cumulative Profit
        - Run-up
        - Drawdown
        """
        import pandas as pd
        import io
        
        df = pd.read_csv(io.StringIO(csv_content))
        
        # Normalize columns
        df.columns = df.columns.str.lower().str.strip().str.replace(' ', '_')
        
        trades = []
        open_trades = {}
        
        for idx, row in df.iterrows():
            trade_type = str(row.get('type', '')).lower()
            
            if 'entry' in trade_type:
                # Opening a position
                direction = 'BUY' if 'long' in trade_type else 'SELL'
                trade_id = row.get('trade_#', idx)
                
                open_trades[trade_id] = {
                    "trade_type": direction,
                    "entry_price": float(row.get('price', 0)),
                    "volume": float(row.get('contracts', 1)),
                    "open_time": row.get('date/time', datetime.now())
                }
                
            elif 'exit' in trade_type:
                # Closing a position
                trade_id = row.get('trade_#', idx)
                
                if trade_id in open_trades:
                    trade = open_trades.pop(trade_id)
                    trade["exit_price"] = float(row.get('price', 0))
                    trade["close_time"] = row.get('date/time', datetime.now())
                    trade["profit"] = float(row.get('profit', 0))
                    trades.append(trade)
        
        return trades


class TradingViewPineScript:
    """Helper to generate Pine Script code for strategy alerts"""
    
    @staticmethod
    def generate_webhook_strategy() -> str:
        """
        Generate sample Pine Script that sends webhooks on trades.
        """
        return '''
//@version=5
strategy("TradeStars Strategy", overlay=true)

// Your strategy logic here
longCondition = ta.crossover(ta.sma(close, 14), ta.sma(close, 28))
shortCondition = ta.crossunder(ta.sma(close, 14), ta.sma(close, 28))

if (longCondition)
    strategy.entry("Long", strategy.long, alert_message='{"symbol":"' + syminfo.ticker + '","type":"BUY","price":' + str.tostring(close) + ',"volume":1}')

if (shortCondition)
    strategy.entry("Short", strategy.short, alert_message='{"symbol":"' + syminfo.ticker + '","type":"SELL","price":' + str.tostring(close) + ',"volume":1}')

// Stop Loss and Take Profit
strategy.exit("Exit Long", "Long", stop=close * 0.99, limit=close * 1.02, 
    alert_message='{"symbol":"' + syminfo.ticker + '","type":"CLOSE_LONG","price":' + str.tostring(close) + '}')
strategy.exit("Exit Short", "Short", stop=close * 1.01, limit=close * 0.98,
    alert_message='{"symbol":"' + syminfo.ticker + '","type":"CLOSE_SHORT","price":' + str.tostring(close) + '}')
'''


