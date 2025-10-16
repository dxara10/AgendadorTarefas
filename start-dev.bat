@echo off
echo 🚀 Iniciando Gerenciador de Tarefas...

REM Verifica se o Docker está rodando
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não está rodando. Inicie o Docker primeiro.
    pause
    exit /b 1
)

REM Inicia o banco de dados
echo 📦 Iniciando MongoDB...
docker-compose up -d

REM Aguarda o MongoDB estar pronto
echo ⏳ Aguardando MongoDB...
timeout /t 5 /nobreak >nul

REM Inicia o backend em nova janela
echo 🔧 Iniciando Backend (porta 3000)...
start "Backend" cmd /k "cd backend && npm run start:dev"

REM Aguarda o backend iniciar
timeout /t 3 /nobreak >nul

REM Inicia o frontend em nova janela
echo 🎨 Iniciando Frontend (porta 5173)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Serviços iniciados com sucesso!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:3000
echo 🗄️ MongoDB Express: http://localhost:8081
echo.
echo Feche as janelas do terminal para parar os serviços
pause