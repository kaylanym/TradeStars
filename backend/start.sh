#!/bin/bash
set -e

echo "🚀 Starting TradeStars API..."
echo "PORT: ${PORT:-8000}"
echo "Working directory: $(pwd)"
echo "Files in backend: $(ls -la backend)"

# Criar diretório para o banco de dados se não existir
mkdir -p /app/backend

cd /app

# Iniciar o servidor com logs detalhados
echo "🔥 Starting uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --app-dir backend --log-level debug
