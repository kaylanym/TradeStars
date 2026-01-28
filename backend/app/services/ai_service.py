"""
AI Service for generating trading insights using OpenAI GPT.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import json

from app.config import get_settings


class AIService:
    def __init__(self):
        self.settings = get_settings()
        self._client = None
    
    def _get_client(self):
        """Lazy load OpenAI client"""
        if self._client is None:
            try:
                from openai import OpenAI
                self._client = OpenAI(api_key=self.settings.openai_api_key)
            except ImportError:
                print("OpenAI library not installed")
            except Exception as e:
                print(f"OpenAI client error: {e}")
        return self._client
    
    def _prepare_trade_summary(self, trades: list) -> Dict[str, Any]:
        """Prepare a summary of trades for AI analysis"""
        if not trades:
            return {}
        
        profits = [t.profit for t in trades]
        wins = [p for p in profits if p > 0]
        losses = [p for p in profits if p < 0]
        
        # Group by hour
        hourly = {}
        for t in trades:
            h = t.open_time.hour
            if h not in hourly:
                hourly[h] = {"wins": 0, "losses": 0, "profit": 0}
            hourly[h]["profit"] += t.profit
            if t.profit > 0:
                hourly[h]["wins"] += 1
            else:
                hourly[h]["losses"] += 1
        
        # Group by symbol
        symbols = {}
        for t in trades:
            s = t.symbol
            if s not in symbols:
                symbols[s] = {"wins": 0, "losses": 0, "profit": 0, "trades": 0}
            symbols[s]["trades"] += 1
            symbols[s]["profit"] += t.profit
            if t.profit > 0:
                symbols[s]["wins"] += 1
            else:
                symbols[s]["losses"] += 1
        
        # Analyze sequences
        max_win_streak = 0
        max_loss_streak = 0
        current_streak = 0
        last_result = None
        
        for t in sorted(trades, key=lambda x: x.open_time):
            if t.profit > 0:
                if last_result == "win":
                    current_streak += 1
                else:
                    current_streak = 1
                    last_result = "win"
                max_win_streak = max(max_win_streak, current_streak)
            else:
                if last_result == "loss":
                    current_streak += 1
                else:
                    current_streak = 1
                    last_result = "loss"
                max_loss_streak = max(max_loss_streak, current_streak)
        
        # Day of week analysis
        weekday = {}
        for t in trades:
            d = t.open_time.strftime("%A")
            if d not in weekday:
                weekday[d] = {"trades": 0, "profit": 0}
            weekday[d]["trades"] += 1
            weekday[d]["profit"] += t.profit
        
        return {
            "total_trades": len(trades),
            "winning_trades": len(wins),
            "losing_trades": len(losses),
            "win_rate": round(len(wins) / len(trades) * 100, 2) if trades else 0,
            "total_profit": round(sum(profits), 2),
            "average_win": round(sum(wins) / len(wins), 2) if wins else 0,
            "average_loss": round(abs(sum(losses) / len(losses)), 2) if losses else 0,
            "best_trade": round(max(profits), 2),
            "worst_trade": round(min(profits), 2),
            "max_win_streak": max_win_streak,
            "max_loss_streak": max_loss_streak,
            "hourly_performance": hourly,
            "symbol_performance": symbols,
            "weekday_performance": weekday,
            "profit_factor": round(sum(wins) / abs(sum(losses)), 2) if losses and sum(losses) != 0 else 0
        }
    
    async def generate_insights(self, trades: list) -> List[Dict[str, Any]]:
        """Generate AI-powered insights from trade data"""
        
        summary = self._prepare_trade_summary(trades)
        
        client = self._get_client()
        
        if not client or not self.settings.openai_api_key:
            # Fallback to rule-based insights
            return self._generate_rule_based_insights(summary)
        
        prompt = f"""Você é um analista de trading especializado em psicologia do trader e gestão de risco.
        
Analise os seguintes dados de um trader brasileiro e forneça insights PRÁTICOS e ACIONÁVEIS para melhorar a performance:

RESUMO DO HISTÓRICO:
- Total de trades: {summary['total_trades']}
- Win rate: {summary['win_rate']}%
- Lucro total: R$ {summary['total_profit']}
- Gain médio: R$ {summary['average_win']}
- Loss médio: R$ {summary['average_loss']}
- Melhor trade: R$ {summary['best_trade']}
- Pior trade: R$ {summary['worst_trade']}
- Profit Factor: {summary['profit_factor']}
- Maior sequência de gains: {summary['max_win_streak']}
- Maior sequência de losses: {summary['max_loss_streak']}

PERFORMANCE POR HORÁRIO:
{json.dumps(summary['hourly_performance'], indent=2)}

PERFORMANCE POR ATIVO:
{json.dumps(summary['symbol_performance'], indent=2)}

PERFORMANCE POR DIA DA SEMANA:
{json.dumps(summary['weekday_performance'], indent=2)}

Por favor, forneça 5-7 insights no seguinte formato JSON:
[
  {{
    "type": "success|warning|danger|info",
    "category": "timing|symbol|psychology|risk|general",
    "title": "Título curto e direto",
    "description": "Descrição detalhada do insight",
    "action": "Ação específica que o trader deve tomar"
  }}
]

Foque em:
1. Melhores e piores horários para operar
2. Ativos onde o trader tem vantagem ou desvantagem
3. Sinais de revenge trading ou overtrading
4. Gestão de risco (relação gain/loss)
5. Sugestões de limites diários de loss e gain
6. Padrões psicológicos identificados

Seja direto, específico e use os números reais. Responda APENAS com o JSON."""

        try:
            response = client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "Você é um mentor de trading focado em ajudar traders a melhorar sua disciplina e resultados. Responda sempre em português brasileiro."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content
            
            # Try to parse JSON
            try:
                # Remove markdown code blocks if present
                if "```" in content:
                    content = content.split("```")[1]
                    if content.startswith("json"):
                        content = content[4:]
                
                insights = json.loads(content)
                return insights
            except json.JSONDecodeError:
                print(f"Failed to parse AI response: {content}")
                return self._generate_rule_based_insights(summary)
                
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return self._generate_rule_based_insights(summary)
    
    def _generate_rule_based_insights(self, summary: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate insights based on rules when AI is not available"""
        insights = []
        
        # Win rate analysis
        if summary.get("win_rate", 0) < 50:
            insights.append({
                "type": "warning",
                "category": "general",
                "title": "📉 Win Rate Precisa Melhorar",
                "description": f"Seu win rate de {summary['win_rate']}% está abaixo de 50%. Isso significa que você perde mais trades do que ganha.",
                "action": "Revise seus critérios de entrada e seja mais seletivo nas operações."
            })
        elif summary.get("win_rate", 0) > 60:
            insights.append({
                "type": "success",
                "category": "general",
                "title": "🎯 Excelente Win Rate!",
                "description": f"Seu win rate de {summary['win_rate']}% está acima de 60%. Você está no caminho certo!",
                "action": "Mantenha a consistência e não mude uma estratégia que está funcionando."
            })
        
        # Risk management
        if summary.get("average_loss", 0) > summary.get("average_win", 0) * 1.5:
            insights.append({
                "type": "danger",
                "category": "risk",
                "title": "⚠️ Loss Médio Muito Alto",
                "description": f"Seu loss médio (R$ {summary['average_loss']}) é muito maior que seu gain médio (R$ {summary['average_win']}).",
                "action": "Reduza seu stop loss ou aumente seu take profit para melhorar a relação risco/retorno."
            })
        
        # Profit factor
        if summary.get("profit_factor", 0) < 1:
            insights.append({
                "type": "danger",
                "category": "risk",
                "title": "📊 Profit Factor Negativo",
                "description": f"Seu profit factor de {summary['profit_factor']} indica que você está perdendo dinheiro no longo prazo.",
                "action": "Revise completamente sua estratégia antes de continuar operando."
            })
        elif summary.get("profit_factor", 0) > 2:
            insights.append({
                "type": "success",
                "category": "risk",
                "title": "💪 Profit Factor Excelente!",
                "description": f"Profit factor de {summary['profit_factor']} é muito bom. Você ganha mais do que perde.",
                "action": "Considere aumentar gradualmente seu tamanho de posição."
            })
        
        # Loss streak analysis
        if summary.get("max_loss_streak", 0) >= 4:
            insights.append({
                "type": "warning",
                "category": "psychology",
                "title": "🧠 Possível Revenge Trading",
                "description": f"Você teve uma sequência de {summary['max_loss_streak']} losses seguidos. Isso pode indicar trading emocional.",
                "action": "Após 2 losses seguidos, faça uma pausa de pelo menos 30 minutos."
            })
        
        # Hourly analysis
        hourly = summary.get("hourly_performance", {})
        if hourly:
            best_hour = max(hourly.items(), key=lambda x: x[1]["profit"])
            worst_hour = min(hourly.items(), key=lambda x: x[1]["profit"])
            
            if best_hour[1]["profit"] > 0:
                insights.append({
                    "type": "success",
                    "category": "timing",
                    "title": f"⏰ Melhor Horário: {best_hour[0]:02d}:00",
                    "description": f"Você lucra mais às {best_hour[0]:02d}:00 (R$ {best_hour[1]['profit']:.2f} de profit).",
                    "action": f"Concentre suas operações próximo das {best_hour[0]:02d}:00."
                })
            
            if worst_hour[1]["profit"] < 0:
                insights.append({
                    "type": "warning",
                    "category": "timing",
                    "title": f"🚫 Evite às {worst_hour[0]:02d}:00",
                    "description": f"Você perde mais às {worst_hour[0]:02d}:00 (R$ {abs(worst_hour[1]['profit']):.2f} de loss).",
                    "action": f"Evite operar entre {worst_hour[0]:02d}:00 e {worst_hour[0]+1:02d}:00."
                })
        
        # Symbol analysis
        symbols = summary.get("symbol_performance", {})
        for symbol, data in symbols.items():
            if data["trades"] >= 5:
                win_rate = (data["wins"] / data["trades"]) * 100
                if win_rate < 35:
                    insights.append({
                        "type": "danger",
                        "category": "symbol",
                        "title": f"❌ Evite {symbol}",
                        "description": f"Win rate de apenas {win_rate:.1f}% em {symbol} ({data['wins']}/{data['trades']} trades).",
                        "action": f"Considere parar de operar {symbol} ou estudar mais esse ativo."
                    })
                elif win_rate > 65:
                    insights.append({
                        "type": "success",
                        "category": "symbol",
                        "title": f"⭐ Especialista em {symbol}",
                        "description": f"Win rate de {win_rate:.1f}% em {symbol}! Profit: R$ {data['profit']:.2f}",
                        "action": f"Continue focando em {symbol}, você tem vantagem nesse ativo."
                    })
        
        # Suggested limits
        avg_loss = summary.get("average_loss", 100)
        avg_win = summary.get("average_win", 150)
        insights.append({
            "type": "info",
            "category": "risk",
            "title": "💰 Limites Sugeridos",
            "description": f"Loss diário máximo: R$ {avg_loss * 3:.2f} | Meta de gain: R$ {avg_win * 4:.2f}",
            "action": "Configure esses limites no seu operacional e respeite-os rigorosamente."
        })
        
        return insights
    
    async def chat(self, message: str, trades: list) -> str:
        """Chat with AI about trading performance"""
        
        summary = self._prepare_trade_summary(trades) if trades else {}
        
        client = self._get_client()
        
        if not client or not self.settings.openai_api_key:
            return "Desculpe, o serviço de IA não está configurado. Configure sua chave da OpenAI para usar o chat."
        
        system_prompt = f"""Você é um mentor de trading especializado. O trader tem o seguinte histórico:
- Total de trades: {summary.get('total_trades', 0)}
- Win rate: {summary.get('win_rate', 0)}%
- Lucro total: R$ {summary.get('total_profit', 0)}
- Profit factor: {summary.get('profit_factor', 0)}

Responda de forma direta, prática e motivadora. Use português brasileiro.
Sempre baseie suas respostas nos dados reais do trader quando relevante."""
        
        try:
            response = client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Erro ao processar sua pergunta: {str(e)}"


