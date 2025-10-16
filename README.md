# Gerenciador de Tarefas Jurídicas

API para gerenciamento de tarefas em escritórios de advocacia.

## Como rodar

### 1. MongoDB
```bash
docker-compose up -d
```

### 2. Backend
```bash
cd backend
npm install
npm run start:dev
```

## Endpoints

- **POST** `/auth/cadastro` - Cadastrar usuário
- **POST** `/auth/login` - Login
- **GET** `/tarefas` - Listar tarefas
- **POST** `/tarefas` - Criar tarefa
- **PUT** `/tarefas/:id` - Atualizar tarefa
- **DELETE** `/tarefas/:id` - Excluir tarefa

## Swagger

Documentação interativa: http://localhost:3000/api