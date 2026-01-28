"""
MetaAPI Integration Service

MetaAPI é um serviço cloud que permite conectar ao MetaTrader 4/5 de qualquer plataforma.
Funciona via API REST, sem precisar de Windows!

Site: https://metaapi.cloud
Plano gratuito: Sim (até 1 conta)

Para usar:
1. Crie uma conta em metaapi.cloud
2. Adicione sua conta MT5 no painel deles
3. Pegue o token de API e o account ID
4. Configure no TradeStars
"""

import httpx
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import asyncio


class MetaAPIService:
    """
    Serviço para integração com MetaTrader via MetaAPI.cloud
    Funciona em qualquer sistema operacional!
    """
    
    BASE_URL = "https://mt-client-api-v1.agiliumtrade.agiliumtrade.ai"
    
    def __init__(self, api_token: str = None, account_id: str = None):
        self.api_token = api_token
        self.account_id = account_id
        self._client = None
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "auth-token": self.api_token,
            "Content-Type": "application/json"
        }
    
    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(timeout=30.0)
        return self._client
    
    async def test_connection(self) -> Dict[str, Any]:
        """Testa a conexão com MetaAPI"""
        if not self.api_token or not self.account_id:
            return {
                "success": False,
                "message": "Token de API e Account ID são obrigatórios"
            }
        
        try:
            client = await self._get_client()
            
            # Buscar informações da conta
            url = f"{self.BASE_URL}/users/current/accounts/{self.account_id}"
            response = await client.get(url, headers=self._get_headers())
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "message": "✅ Conectado ao MetaAPI com sucesso!",
                    "account": {
                        "name": data.get("name"),
                        "login": data.get("login"),
                        "server": data.get("server"),
                        "platform": data.get("platform"),
                        "state": data.get("state")
                    }
                }
            elif response.status_code == 401:
                return {
                    "success": False,
                    "message": "❌ Token de API inválido"
                }
            elif response.status_code == 404:
                return {
                    "success": False,
                    "message": "❌ Account ID não encontrado"
                }
            else:
                return {
                    "success": False,
                    "message": f"❌ Erro na API: {response.status_code}"
                }
                
        except httpx.TimeoutException:
            return {
                "success": False,
                "message": "❌ Timeout na conexão. Tente novamente."
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"❌ Erro: {str(e)}"
            }
    
    async def get_account_info(self) -> Dict[str, Any]:
        """Busca informações da conta MT5"""
        try:
            client = await self._get_client()
            
            url = f"{self.BASE_URL}/users/current/accounts/{self.account_id}/account-information"
            response = await client.get(url, headers=self._get_headers())
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "balance": data.get("balance"),
                    "equity": data.get("equity"),
                    "profit": data.get("profit"),
                    "margin": data.get("margin"),
                    "freeMargin": data.get("freeMargin"),
                    "currency": data.get("currency"),
                    "leverage": data.get("leverage")
                }
            else:
                return {"success": False, "message": f"Erro: {response.status_code}"}
                
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    async def get_history(self, days: int = 30) -> Dict[str, Any]:
        """
        Busca histórico de trades dos últimos X dias
        """
        try:
            client = await self._get_client()
            
            # Calcular período
            end_time = datetime.utcnow()
            start_time = end_time - timedelta(days=days)
            
            # Endpoint de histórico
            url = f"{self.BASE_URL}/users/current/accounts/{self.account_id}/history-deals/time/{start_time.strftime('%Y-%m-%dT%H:%M:%S.000Z')}/{end_time.strftime('%Y-%m-%dT%H:%M:%S.000Z')}"
            
            response = await client.get(url, headers=self._get_headers())
            
            if response.status_code == 200:
                deals = response.json()
                
                # Processar deals em trades
                trades = self._process_deals_to_trades(deals)
                
                return {
                    "success": True,
                    "trades": trades,
                    "total_deals": len(deals),
                    "total_trades": len(trades)
                }
            else:
                return {
                    "success": False,
                    "message": f"Erro ao buscar histórico: {response.status_code}",
                    "trades": []
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "trades": []
            }
    
    def _process_deals_to_trades(self, deals: List[Dict]) -> List[Dict]:
        """
        Processa deals da MetaAPI em trades completos
        Agrupa entrada e saída de cada posição
        """
        positions = {}
        trades = []
        
        for deal in deals:
            # Pular deals que não são trade (depósito, saque, etc)
            if deal.get("type") not in ["DEAL_TYPE_BUY", "DEAL_TYPE_SELL"]:
                continue
            
            position_id = deal.get("positionId")
            entry_type = deal.get("entryType")  # DEAL_ENTRY_IN, DEAL_ENTRY_OUT
            
            if entry_type == "DEAL_ENTRY_IN":
                # Abertura de posição
                positions[position_id] = {
                    "symbol": deal.get("symbol"),
                    "type": "BUY" if deal.get("type") == "DEAL_TYPE_BUY" else "SELL",
                    "volume": deal.get("volume"),
                    "entry_price": deal.get("price"),
                    "open_time": deal.get("time"),
                    "commission": deal.get("commission", 0),
                }
            elif entry_type == "DEAL_ENTRY_OUT" and position_id in positions:
                # Fechamento de posição
                pos = positions.pop(position_id)
                pos["exit_price"] = deal.get("price")
                pos["close_time"] = deal.get("time")
                pos["profit"] = deal.get("profit", 0)
                pos["swap"] = deal.get("swap", 0)
                pos["commission"] = pos.get("commission", 0) + deal.get("commission", 0)
                
                # Calcular duração
                try:
                    open_dt = datetime.fromisoformat(pos["open_time"].replace("Z", "+00:00"))
                    close_dt = datetime.fromisoformat(pos["close_time"].replace("Z", "+00:00"))
                    pos["duration_minutes"] = int((close_dt - open_dt).total_seconds() / 60)
                except:
                    pos["duration_minutes"] = 0
                
                trades.append(pos)
        
        return trades
    
    async def close(self):
        """Fecha a conexão HTTP"""
        if self._client:
            await self._client.aclose()
            self._client = None


def get_setup_instructions() -> Dict[str, Any]:
    """Retorna instruções de como configurar o MetaAPI"""
    return {
        "service": "MetaAPI",
        "website": "https://metaapi.cloud",
        "free_plan": True,
        "steps": [
            {
                "step": 1,
                "title": "Criar conta no MetaAPI",
                "description": "Acesse metaapi.cloud e crie uma conta gratuita"
            },
            {
                "step": 2,
                "title": "Adicionar conta MT5",
                "description": "No painel do MetaAPI, clique em 'Add Account' e insira as credenciais da sua conta MT5"
            },
            {
                "step": 3,
                "title": "Aguardar deploy",
                "description": "O MetaAPI vai criar uma conexão com sua conta (leva alguns minutos)"
            },
            {
                "step": 4,
                "title": "Copiar credenciais",
                "description": "Copie o 'API Token' (nas configurações) e o 'Account ID' (na lista de contas)"
            },
            {
                "step": 5,
                "title": "Configurar no TradeStars",
                "description": "Cole as credenciais aqui e clique em Sincronizar!"
            }
        ],
        "video_tutorial": "https://www.youtube.com/results?search_query=metaapi+metatrader+setup",
        "note": "O plano gratuito permite 1 conta MT4/MT5. Para mais contas, veja os planos pagos."
    }


