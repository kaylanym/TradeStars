import pandas as pd
import io
from datetime import datetime
from typing import List, Dict, Any


def parse_csv_trades(contents: bytes) -> List[Dict[str, Any]]:
    """
    Parse CSV file with trade data.
    Supports multiple formats and tries to auto-detect columns.
    """
    
    # Try different encodings
    for encoding in ['utf-8', 'latin-1', 'cp1252']:
        try:
            df = pd.read_csv(io.BytesIO(contents), encoding=encoding)
            break
        except:
            continue
    else:
        raise ValueError("Não foi possível ler o arquivo CSV")
    
    # Normalize column names
    df.columns = df.columns.str.lower().str.strip().str.replace(' ', '_')
    
    # Column mappings for different platforms
    column_mappings = {
        # Standard format
        'symbol': ['symbol', 'ativo', 'ticker', 'instrumento', 'asset'],
        'type': ['type', 'tipo', 'side', 'direction', 'order_type', 'trade_type'],
        'volume': ['volume', 'lots', 'lotes', 'quantity', 'qty', 'quantidade'],
        'entry_price': ['entry_price', 'preco_entrada', 'open_price', 'price_open', 'entry', 'preco'],
        'exit_price': ['exit_price', 'preco_saida', 'close_price', 'price_close', 'exit'],
        'profit': ['profit', 'lucro', 'resultado', 'pnl', 'result', 'gain_loss', 'pl'],
        'date': ['date', 'data', 'open_date', 'trade_date', 'datetime'],
        'time': ['time', 'hora', 'open_time', 'trade_time'],
        'close_date': ['close_date', 'data_fechamento', 'exit_date'],
        'close_time': ['close_time', 'hora_fechamento', 'exit_time'],
        'duration': ['duration', 'duracao', 'duration_minutes', 'holding_time'],
        'commission': ['commission', 'comissao', 'fee', 'taxa'],
        'swap': ['swap', 'financing', 'overnight'],
    }
    
    # Find matching columns
    def find_column(target_names):
        for name in target_names:
            if name in df.columns:
                return name
        return None
    
    mapped = {}
    for key, alternatives in column_mappings.items():
        col = find_column(alternatives)
        if col:
            mapped[key] = col
    
    # Validate required columns
    required = ['symbol', 'profit']
    for req in required:
        if req not in mapped:
            # Try to find profit in any column with numbers
            if req == 'profit':
                for col in df.columns:
                    if df[col].dtype in ['float64', 'int64']:
                        mapped['profit'] = col
                        break
            if req not in mapped:
                raise ValueError(f"Coluna obrigatória não encontrada: {req}")
    
    trades = []
    
    for idx, row in df.iterrows():
        try:
            # Parse datetime
            open_time = datetime.now()
            
            if 'date' in mapped:
                date_val = row[mapped['date']]
                time_val = row.get(mapped.get('time', ''), '00:00:00')
                
                if pd.notna(date_val):
                    # Try different date formats
                    date_formats = [
                        '%Y-%m-%d %H:%M:%S',
                        '%Y-%m-%d %H:%M',
                        '%Y-%m-%d',
                        '%d/%m/%Y %H:%M:%S',
                        '%d/%m/%Y %H:%M',
                        '%d/%m/%Y',
                        '%m/%d/%Y %H:%M:%S',
                        '%m/%d/%Y',
                    ]
                    
                    date_str = str(date_val)
                    if pd.notna(time_val) and 'time' in mapped:
                        date_str = f"{date_val} {time_val}"
                    
                    for fmt in date_formats:
                        try:
                            open_time = datetime.strptime(date_str.strip(), fmt)
                            break
                        except:
                            continue
            
            # Parse close time
            close_time = None
            if 'close_date' in mapped:
                close_date_val = row[mapped['close_date']]
                if pd.notna(close_date_val):
                    close_time_val = row.get(mapped.get('close_time', ''), '00:00:00')
                    close_str = f"{close_date_val} {close_time_val}" if pd.notna(close_time_val) else str(close_date_val)
                    
                    for fmt in date_formats:
                        try:
                            close_time = datetime.strptime(close_str.strip(), fmt)
                            break
                        except:
                            continue
            
            # Calculate duration
            duration = 0
            if 'duration' in mapped and pd.notna(row[mapped['duration']]):
                duration = int(row[mapped['duration']])
            elif close_time and open_time:
                duration = int((close_time - open_time).total_seconds() / 60)
            
            # Parse trade type
            trade_type = "BUY"
            if 'type' in mapped:
                type_val = str(row[mapped['type']]).upper()
                if any(x in type_val for x in ['SELL', 'VENDA', 'SHORT', 'S']):
                    trade_type = "SELL"
            
            trade = {
                'symbol': str(row[mapped['symbol']]).strip().upper(),
                'trade_type': trade_type,
                'volume': float(row.get(mapped.get('volume', ''), 1) or 1),
                'entry_price': float(row.get(mapped.get('entry_price', ''), 0) or 0),
                'exit_price': float(row.get(mapped.get('exit_price', ''), 0) or 0) if 'exit_price' in mapped and pd.notna(row.get(mapped.get('exit_price', ''))) else None,
                'profit': float(row[mapped['profit']] or 0),
                'commission': float(row.get(mapped.get('commission', ''), 0) or 0),
                'swap': float(row.get(mapped.get('swap', ''), 0) or 0),
                'open_time': open_time,
                'close_time': close_time,
                'duration_minutes': duration,
                'source': 'CSV'
            }
            
            trades.append(trade)
            
        except Exception as e:
            # Skip problematic rows but continue
            print(f"Erro na linha {idx}: {e}")
            continue
    
    if not trades:
        raise ValueError("Nenhum trade válido encontrado no arquivo")
    
    return trades


def generate_sample_csv() -> str:
    """Generate a sample CSV template"""
    return """date,time,symbol,type,volume,entry_price,exit_price,profit,duration
2024-01-15,09:30:00,WINZ24,BUY,1,128500,128650,150.00,5
2024-01-15,10:15:00,WINZ24,SELL,1,128700,128550,-150.00,8
2024-01-15,11:00:00,WDOZ24,BUY,1,4950,4965,75.00,12
2024-01-15,14:30:00,WINZ24,BUY,2,128800,128950,300.00,15
2024-01-15,15:45:00,PETR4,BUY,100,35.50,35.80,30.00,45
"""


