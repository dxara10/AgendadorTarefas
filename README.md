# Gerenciador de Tarefas Jurídicas

Sistema completo para gerenciamento de tarefas em escritórios de advocacia, desenvolvido com **TDD** (Test-Driven Development).

## 🏗️ Arquitetura

- **Backend**: NestJS + MongoDB + JWT
- **Frontend**: React + TypeScript + TailwindCSS + Vite
- **Testes**: Vitest + Testing Library
- **Banco**: MongoDB via Docker

## 🚀 Como rodar o projeto

### 🎯 Opção 1: Inicialização Rápida (Recomendado)

**Linux/Mac:**
```bash
# Torna o script executável (apenas na primeira vez)
chmod +x start-dev.sh

# Inicia tudo de uma vez
./start-dev.sh
```

**Windows:**
```cmd
# Duplo clique no arquivo ou execute no terminal
start-dev.bat
```

Este script irá:
- ✅ Iniciar o MongoDB via Docker
- ✅ Iniciar o Backend (porta 3000)
- ✅ Iniciar o Frontend (porta 5173)
- ✅ Mostrar todos os links de acesso

**Para parar**: Pressione `Ctrl+C` no terminal

---

### 🔧 Opção 2: Inicialização Manual

### 1. Pré-requisitos

```bash
# Node.js 18+ e npm
node --version
npm --version

# Docker e Docker Compose
docker --version
docker-compose --version
```

### 2. Clonar e instalar dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Iniciar o banco de dados

```bash
# Na raiz do projeto
docker-compose up -d
```

### 4. Iniciar o backend

```bash
cd backend
npm run start:dev
```

O backend estará rodando em: http://localhost:3000

### 5. Iniciar o frontend

```bash
# Em outro terminal
cd frontend
npm run dev
```

O frontend estará rodando em: http://localhost:5173

## 🧪 Executar testes

### Testes do Backend

```bash
cd backend

# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:cov
```

### Testes do Frontend

```bash
cd frontend

# Executar todos os testes
npm run test:run

# Executar testes em modo watch
npm test

# Executar testes com interface visual
npm run test:ui
```

## 📋 Funcionalidades

### ✅ Autenticação
- [x] Cadastro de usuários
- [x] Login com JWT
- [x] Proteção de rotas

### ✅ Gerenciamento de Tarefas
- [x] Criar tarefas
- [x] Listar tarefas do usuário
- [x] Editar tarefas
- [x] Excluir tarefas
- [x] Alterar status (Pendente → Em andamento → Concluída)

### ✅ Dashboard
- [x] Estatísticas por status
- [x] Gráficos interativos
- [x] Percentual de conclusão

## 🎨 Design System

### Paleta de Cores
- **Fundo principal**: `#F4F5F7` (Cinza-claro elegante)
- **Destaque**: `#2E3A59` (Azul petróleo sofisticado)
- **Botões**: `#3F72AF` (Azul royal moderno)
- **Sucesso**: `#4ECDC4` (Verde-menta sutil)
- **Aviso**: `#FFB347` (Âmbar suave)
- **Erro**: `#E63946` (Vermelho desaturado)

### Tipografia
- **Fonte**: Inter/Poppins
- **Tamanho base**: 16px (mobile) → 18px (desktop)

## 🔗 Endpoints da API

### Autenticação
- `POST /auth/cadastro` - Cadastrar usuário
- `POST /auth/login` - Login

### Tarefas (Protegidas por JWT)
- `GET /tarefas` - Listar tarefas
- `POST /tarefas` - Criar tarefa
- `PUT /tarefas/:id` - Atualizar tarefa
- `DELETE /tarefas/:id` - Excluir tarefa
- `GET /tarefas/estatisticas` - Obter estatísticas

## 📖 Documentação da API

Com o backend rodando, acesse: http://localhost:3000/api

## 🧪 Estratégia TDD

O projeto foi desenvolvido seguindo **Test-Driven Development**:

1. **Red**: Escrever testes que falham
2. **Green**: Implementar código mínimo para passar
3. **Refactor**: Melhorar o código mantendo os testes

### Cobertura de Testes

- **Backend**: Controllers, Services, Guards, Utils
- **Frontend**: Componentes, Páginas, Serviços

## 🔧 Scripts Úteis

### Projeto Completo
```bash
./start-dev.sh       # Inicia tudo (banco + backend + frontend)
```

### Backend
```bash
npm run start:dev    # Desenvolvimento
npm run build        # Build de produção
npm run test         # Executar testes
npm run test:cov     # Testes com coverage
npm run lint         # Linter
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run test         # Testes em watch mode
npm run test:run     # Executar testes uma vez
npm run test:ui      # Interface visual dos testes
npm run lint         # Linter
```

## 🐳 Docker

### Apenas o banco
```bash
docker-compose up -d
```

### Parar serviços
```bash
docker-compose down
```

## 📁 Estrutura do Projeto

```
AgendadorTarefas/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── auth/           # Módulo de autenticação
│   │   ├── tarefas/        # Módulo de tarefas
│   │   ├── usuarios/       # Módulo de usuários
│   │   └── common/         # Guards, filters, etc
│   └── test/               # Testes e2e
├── frontend/               # App React
│   ├── src/
│   │   ├── componentes/    # Componentes reutilizáveis
│   │   ├── paginas/        # Páginas da aplicação
│   │   ├── servicos/       # Serviços de API
│   │   └── test/           # Setup de testes
├── database/               # Scripts do MongoDB
└── docker-compose.yml      # Configuração do banco
```

## 🚨 Troubleshooting

### Backend não conecta no MongoDB
```bash
# Verificar se o container está rodando
docker ps

# Reiniciar o banco
docker-compose restart
```

### Testes falhando
```bash
# Limpar cache do npm
npm run test -- --clearCache

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro de CORS no frontend
Verifique se o backend está rodando na porta 3000 e o frontend na 5173.

## 📝 Próximos Passos

- [ ] Notificações push
- [ ] Filtros avançados
- [ ] Exportação de relatórios
- [ ] Integração com calendário
- [ ] Anexos em tarefas

---

**Desenvolvido com ❤️ seguindo TDD e boas práticas**