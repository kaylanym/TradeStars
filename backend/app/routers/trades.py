from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional
from datetime import datetime, date
import pandas as pd
import io

from app.database import get_db
from app.models.trade import Trade
from app.schemas.trade import TradeCreate, TradeResponse, TradeListResponse
from app.services.csv_parser import parse_csv_trades

router = APIRouter()


@router.get("/", response_model=TradeListResponse)
async def get_trades(
    user_id: int = 1,  # TODO: Get from auth
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    symbol: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: AsyncSession = Depends(get_db)
):
    """Retorna lista de trades do usuário"""
    query = select(Trade).where(Trade.user_id == user_id)
    
    if symbol:
        query = query.where(Trade.symbol == symbol)
    if start_date:
        query = query.where(Trade.open_time >= datetime.combine(start_date, datetime.min.time()))
    if end_date:
        query = query.where(Trade.open_time <= datetime.combine(end_date, datetime.max.time()))
    
    query = query.order_by(desc(Trade.open_time)).offset(skip).limit(limit)
    
    result = await db.execute(query)
    trades = result.scalars().all()
    
    # Count total
    count_query = select(Trade).where(Trade.user_id == user_id)
    count_result = await db.execute(count_query)
    total = len(count_result.scalars().all())
    
    return TradeListResponse(
        trades=[TradeResponse.model_validate(t) for t in trades],
        total=total,
        skip=skip,
        limit=limit
    )


@router.post("/", response_model=TradeResponse)
async def create_trade(
    trade: TradeCreate,
    user_id: int = 1,  # TODO: Get from auth
    db: AsyncSession = Depends(get_db)
):
    """Cria um novo trade manualmente"""
    db_trade = Trade(
        user_id=user_id,
        **trade.model_dump()
    )
    db.add(db_trade)
    await db.commit()
    await db.refresh(db_trade)
    return TradeResponse.model_validate(db_trade)


@router.post("/upload-csv")
async def upload_csv(
    file: UploadFile = File(...),
    user_id: int = 1,  # TODO: Get from auth
    db: AsyncSession = Depends(get_db)
):
    """Upload de arquivo CSV com trades"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Arquivo deve ser CSV")
    
    try:
        contents = await file.read()
        trades_data = parse_csv_trades(contents)
        
        created_trades = []
        for trade_data in trades_data:
            db_trade = Trade(user_id=user_id, **trade_data)
            db.add(db_trade)
            created_trades.append(db_trade)
        
        await db.commit()
        
        return {
            "message": f"✅ {len(created_trades)} trades importados com sucesso!",
            "count": len(created_trades)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar CSV: {str(e)}")


@router.get("/{trade_id}", response_model=TradeResponse)
async def get_trade(
    trade_id: int,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Retorna um trade específico"""
    query = select(Trade).where(Trade.id == trade_id, Trade.user_id == user_id)
    result = await db.execute(query)
    trade = result.scalar_one_or_none()
    
    if not trade:
        raise HTTPException(status_code=404, detail="Trade não encontrado")
    
    return TradeResponse.model_validate(trade)


@router.delete("/{trade_id}")
async def delete_trade(
    trade_id: int,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Deleta um trade"""
    query = select(Trade).where(Trade.id == trade_id, Trade.user_id == user_id)
    result = await db.execute(query)
    trade = result.scalar_one_or_none()
    
    if not trade:
        raise HTTPException(status_code=404, detail="Trade não encontrado")
    
    await db.delete(trade)
    await db.commit()
    
    return {"message": "Trade deletado com sucesso"}


@router.delete("/")
async def delete_all_trades(
    user_id: int = 1,
    confirm: bool = Query(False),
    db: AsyncSession = Depends(get_db)
):
    """Deleta todos os trades do usuário"""
    if not confirm:
        raise HTTPException(status_code=400, detail="Confirme a exclusão com ?confirm=true")
    
    query = select(Trade).where(Trade.user_id == user_id)
    result = await db.execute(query)
    trades = result.scalars().all()
    
    for trade in trades:
        await db.delete(trade)
    
    await db.commit()
    
    return {"message": f"{len(trades)} trades deletados"}


