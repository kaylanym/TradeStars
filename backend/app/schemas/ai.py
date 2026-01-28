from pydantic import BaseModel
from typing import Optional, List


class InsightRequest(BaseModel):
    focus_area: Optional[str] = None  # timing, symbols, risk, psychology


class Insight(BaseModel):
    type: str  # success, warning, danger, info
    category: str  # timing, symbol, psychology, risk, general
    title: str
    description: str
    action: Optional[str] = None


class InsightResponse(BaseModel):
    has_data: bool
    trades_analyzed: int
    insights: List[Insight]
    generated_at: str


