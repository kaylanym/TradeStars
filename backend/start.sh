#!/bin/bash

# Criar diretório para o banco de dados se não existir
mkdir -p /app/backend

# Iniciar o servidor
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --app-dir backend
