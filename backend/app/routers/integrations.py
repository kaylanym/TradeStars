from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models.trade import Trade
from app.schemas.integrations import (
    MT5Credentials, 
    MT5ConnectionStatus,
    TradingViewWebhook,
    SyncResult
)
from app.services.metatrader_service import MetaTraderService
from app.services.tradingview_service import TradingViewService
from app.services.metaapi_service import MetaAPIService, get_setup_instructions

router = APIRouter()


# ==================== METATRADER 5 ====================

@router.post("/mt5/connect")
async def connect_mt5(
    credentials: MT5Credentials,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Conecta ao MetaTrader 5"""
    mt5_service = MetaTraderService()
    
    try:
        result = await mt5_service.connect(
            login=credentials.login,
            password=credentials.password,
            server=credentials.server
        )
        
        # Se é mock (não Windows), retorna erro informativo
        if result.get("is_mock"):
            return {
                "connected": False,
                "message": result.get("message"),
                "alternatives": result.get("alternatives", []),
                "platform_info": "Use a opção de Upload CSV para importar seus trades."
            }
        
        if result.get("success"):
            account = result.get("account", {})
            return {
                "connected": True,
                "message": result.get("message"),
                "account_name": account.get("name"),
                "balance": account.get("balance"),
                "server": credentials.server
            }
        else:
            return {
                "connected": False,
                "message": result.get("message")
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/mt5/sync")
async def sync_mt5_trades(
    credentials: MT5Credentials,
    days: int = 30,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Sincroniza trades do MetaTrader 5"""
    import platform
    
    # Verificar se está no Windows
    if platform.system() != "Windows":
        return {
            "success": False,
            "message": f"⚠️ Integração direta com MetaTrader5 só funciona no Windows. Você está usando {platform.system()}.",
            "trades_imported": 0,
            "trades_skipped": 0,
            "alternatives": [
                "📁 Exporte o histórico do MT5 como arquivo CSV",
                "📤 Use a opção 'Upload CSV' para importar os trades",
                "💡 No MT5: Histórico > Clique direito > Relatório > Salvar como CSV"
            ],
            "tutorial": {
                "step1": "Abra o MetaTrader 5",
                "step2": "Vá em 'Caixa de Ferramentas' > aba 'Histórico'",
                "step3": "Clique com botão direito > 'Relatório'",
                "step4": "Escolha 'Open XML' ou salve como arquivo",
                "step5": "Faça upload do arquivo aqui no TradeStars"
            }
        }
    
    mt5_service = MetaTraderService()
    
    try:
        result = await mt5_service.connect(
            login=credentials.login,
            password=credentials.password,
            server=credentials.server
        )
        
        if not result.get("success"):
            return {
                "success": False,
                "message": result.get("message", "Falha na conexão com MT5"),
                "trades_imported": 0,
                "trades_skipped": 0
            }
        
        # Buscar histórico
        from_date = datetime.now() - timedelta(days=days)
        trades_data = await mt5_service.get_history(from_date)
        
        if not trades_data:
            return {
                "success": True,
                "message": "Nenhum trade encontrado no período",
                "trades_imported": 0,
                "trades_skipped": 0
            }
        
        imported = 0
        skipped = 0
        
        for trade in trades_data:
            # Verificar se já existe
            from sqlalchemy import select
            existing = await db.execute(
                select(Trade).where(
                    Trade.user_id == user_id,
                    Trade.external_id == str(trade["ticket"]),
                    Trade.source == "METATRADER"
                )
            )
            
            if existing.scalar_one_or_none():
                skipped += 1
                continue
            
            db_trade = Trade(
                user_id=user_id,
                symbol=trade["symbol"],
                trade_type=trade["type"],
                volume=trade["volume"],
                entry_price=trade["price_open"],
                exit_price=trade["price_close"],
                profit=trade["profit"],
                commission=trade.get("commission", 0),
                swap=trade.get("swap", 0),
                open_time=trade["time_open"],
                close_time=trade["time_close"],
                duration_minutes=int((trade["time_close"] - trade["time_open"]).total_seconds() / 60),
                source="METATRADER",
                external_id=str(trade["ticket"])
            )
            db.add(db_trade)
            imported += 1
        
        await db.commit()
        await mt5_service.disconnect()
        
        return {
            "success": True,
            "message": f"✅ Sincronização concluída!",
            "trades_imported": imported,
            "trades_skipped": skipped
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/mt5/status")
async def mt5_status():
    """Verifica status da conexão MT5"""
    mt5_service = MetaTraderService()
    is_connected = await mt5_service.is_connected()
    
    return {
        "connected": is_connected,
        "platform": "MetaTrader 5"
    }


# ==================== METAAPI (CLOUD MT5 - FUNCIONA EM QUALQUER OS) ====================

@router.get("/metaapi/setup")
async def metaapi_setup():
    """Retorna instruções de como configurar o MetaAPI"""
    return get_setup_instructions()


@router.post("/metaapi/test")
async def test_metaapi_connection(
    api_token: str,
    account_id: str
):
    """Testa a conexão com MetaAPI"""
    service = MetaAPIService(api_token=api_token, account_id=account_id)
    result = await service.test_connection()
    await service.close()
    return result


@router.post("/metaapi/sync")
async def sync_metaapi_trades(
    api_token: str,
    account_id: str,
    days: int = 30,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """
    Sincroniza trades do MetaTrader via MetaAPI.
    Funciona em qualquer sistema operacional (Mac, Linux, Windows)!
    """
    service = MetaAPIService(api_token=api_token, account_id=account_id)
    
    # Testar conexão primeiro
    connection = await service.test_connection()
    if not connection.get("success"):
        await service.close()
        return {
            "success": False,
            "message": connection.get("message"),
            "trades_imported": 0
        }
    
    # Buscar histórico
    history = await service.get_history(days=days)
    
    if not history.get("success"):
        await service.close()
        return {
            "success": False,
            "message": history.get("message"),
            "trades_imported": 0
        }
    
    trades_data = history.get("trades", [])
    
    if not trades_data:
        await service.close()
        return {
            "success": True,
            "message": "✅ Conexão OK, mas nenhum trade encontrado no período",
            "trades_imported": 0,
            "account": connection.get("account")
        }
    
    # Importar trades
    imported = 0
    skipped = 0
    
    for trade in trades_data:
        try:
            # Criar ID único para o trade
            external_id = f"metaapi_{trade.get('symbol')}_{trade.get('open_time')}"
            
            # Verificar se já existe
            from sqlalchemy import select
            existing = await db.execute(
                select(Trade).where(
                    Trade.user_id == user_id,
                    Trade.external_id == external_id,
                    Trade.source == "METAAPI"
                )
            )
            
            if existing.scalar_one_or_none():
                skipped += 1
                continue
            
            # Converter datetime string para objeto
            open_time = datetime.fromisoformat(trade["open_time"].replace("Z", "+00:00"))
            close_time = None
            if trade.get("close_time"):
                close_time = datetime.fromisoformat(trade["close_time"].replace("Z", "+00:00"))
            
            db_trade = Trade(
                user_id=user_id,
                symbol=trade["symbol"],
                trade_type=trade["type"],
                volume=trade.get("volume", 1),
                entry_price=trade.get("entry_price", 0),
                exit_price=trade.get("exit_price"),
                profit=trade.get("profit", 0),
                commission=trade.get("commission", 0),
                swap=trade.get("swap", 0),
                open_time=open_time,
                close_time=close_time,
                duration_minutes=trade.get("duration_minutes", 0),
                source="METAAPI",
                external_id=external_id
            )
            db.add(db_trade)
            imported += 1
            
        except Exception as e:
            print(f"Erro ao importar trade: {e}")
            continue
    
    await db.commit()
    await service.close()
    
    return {
        "success": True,
        "message": f"✅ Sincronização concluída!",
        "trades_imported": imported,
        "trades_skipped": skipped,
        "total_found": len(trades_data),
        "account": connection.get("account")
    }


@router.get("/metaapi/account-info")
async def get_metaapi_account(
    api_token: str,
    account_id: str
):
    """Busca informações da conta MT5 via MetaAPI"""
    service = MetaAPIService(api_token=api_token, account_id=account_id)
    result = await service.get_account_info()
    await service.close()
    return result


# ==================== TRADINGVIEW ====================

@router.post("/tradingview/webhook")
async def tradingview_webhook(
    webhook: TradingViewWebhook,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Recebe webhooks do TradingView para registrar trades"""
    try:
        tv_service = TradingViewService()
        trade_data = tv_service.parse_webhook(webhook.dict())
        
        db_trade = Trade(
            user_id=user_id,
            symbol=trade_data["symbol"],
            trade_type=trade_data["type"],
            volume=trade_data.get("volume", 1.0),
            entry_price=trade_data["price"],
            profit=trade_data.get("profit", 0),
            open_time=datetime.now(),
            source="TRADINGVIEW",
            external_id=trade_data.get("id"),
            notes=trade_data.get("message")
        )
        
        db.add(db_trade)
        await db.commit()
        
        return {
            "success": True,
            "message": "Trade registrado via TradingView",
            "trade_id": db_trade.id
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/tradingview/setup")
async def tradingview_setup_info():
    """Retorna instruções para configurar webhook do TradingView"""
    return {
        "webhook_url": "/api/integrations/tradingview/webhook",
        "instructions": """
        Para configurar o TradingView:
        
        1. Vá em Alertas no TradingView
        2. Crie um novo alerta
        3. Em 'Webhook URL', coloque: https://seu-dominio.com/api/integrations/tradingview/webhook
        4. Em 'Message', use o formato JSON:
        
        {
            "symbol": "{{ticker}}",
            "type": "{{strategy.order.action}}",
            "price": {{close}},
            "volume": {{strategy.order.contracts}},
            "message": "{{strategy.order.comment}}"
        }
        """,
        "example_payload": {
            "symbol": "WINZ24",
            "type": "BUY",
            "price": 128500,
            "volume": 1,
            "message": "Entry signal"
        }
    }


@router.post("/tradingview/import-csv")
async def import_tradingview_csv(
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """
    Importa relatório exportado do TradingView
    O TradingView permite exportar trades em CSV através do Strategy Tester
    """
    # Esta rota usa o mesmo parser de CSV, mas com mapeamento específico para TV
    return {
        "message": "Use o endpoint /api/trades/upload-csv com o CSV exportado do TradingView",
        "supported_formats": [
            "Strategy Tester Export",
            "Paper Trading History"
        ]
    }

