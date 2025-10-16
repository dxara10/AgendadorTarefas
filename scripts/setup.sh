#!/bin/bash

# Script de configuração do ambiente de desenvolvimento
# Gerenciador de Tarefas Jurídicas

echo "🧩 Configurando ambiente do Gerenciador de Tarefas..."

# Verifica se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Instale o Docker Compose primeiro."
    exit 1
fi

# Para containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Inicia o MongoDB
echo "🚀 Iniciando MongoDB..."
docker-compose up -d mongodb

# Aguarda o MongoDB inicializar
echo "⏳ Aguardando MongoDB inicializar..."
sleep 10

# Inicia o Mongo Express
echo "🌐 Iniciando Mongo Express..."
docker-compose up -d mongo-express

# Verifica status dos containers
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "✅ Ambiente configurado com sucesso!"
echo ""
echo "🔗 Links úteis:"
echo "   MongoDB: mongodb://localhost:27018"
echo "   Mongo Express: http://localhost:8081"
echo ""
echo "📝 Próximos passos:"
echo "   1. cd backend"
echo "   2. npm install"
echo "   3. npm run start:dev"
echo ""
echo "🗄️ Dados de exemplo já foram inseridos no banco!"