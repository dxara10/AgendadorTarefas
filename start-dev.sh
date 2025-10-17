#!/bin/bash

# Script para iniciar backend e frontend simultaneamente
echo "🚀 Iniciando Gerenciador de Tarefas..."

# Função para cleanup ao sair
cleanup() {
    echo "🛑 Parando serviços..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Captura Ctrl+C para fazer cleanup
trap cleanup SIGINT

# Verifica se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

# Inicia o banco de dados
echo "📦 Iniciando MongoDB..."
docker-compose up -d

# Aguarda o MongoDB estar pronto
echo "⏳ Aguardando MongoDB..."
sleep 5

# Salva o diretório atual
PROJECT_DIR=$(pwd)

# Inicia o backend
echo "🔧 Iniciando Backend (porta 3000)..."
(cd "$PROJECT_DIR/backend" && npm run start:dev) &
BACKEND_PID=$!

# Aguarda o backend iniciar
sleep 3

# Inicia o frontend
echo "🎨 Iniciando Frontend (porta 5173)..."
(cd "$PROJECT_DIR/frontend" && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "✅ Serviços iniciados com sucesso!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3000"
echo "🗄️  MongoDB Express: http://localhost:8081"
echo ""
echo "Pressione Ctrl+C para parar todos os serviços"

# Aguarda os processos
wait