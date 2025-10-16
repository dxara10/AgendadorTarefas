# 📚 Exemplos de Uso da API

## 🌐 Swagger UI
**URL**: http://localhost:3000/api

## 🔧 Testando com cURL

### 1. Health Check
```bash
curl -X GET http://localhost:3000/saude
```

### 2. Cadastrar Usuário
```bash
curl -X POST http://localhost:3000/auth/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Douglas Cortes",
    "email": "douglas@adv.com",
    "senha": "senha123"
  }'
```

### 3. Fazer Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "douglas@adv.com",
    "senha": "senha123"
  }'
```

### 4. Criar Tarefa (com token)
```bash
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "titulo": "Preparar petição inicial",
    "descricao": "Revisar os autos e anexar documentos",
    "status": "pendente"
  }'
```

### 5. Listar Tarefas
```bash
curl -X GET http://localhost:3000/tarefas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 6. Obter Estatísticas
```bash
curl -X GET http://localhost:3000/tarefas/estatisticas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 7. Atualizar Tarefa
```bash
curl -X PUT http://localhost:3000/tarefas/ID_DA_TAREFA \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "status": "em_andamento"
  }'
```

### 8. Excluir Tarefa
```bash
curl -X DELETE http://localhost:3000/tarefas/ID_DA_TAREFA \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🎯 Fluxo Completo de Teste

1. **Inicie a API**: `npm run start:dev`
2. **Acesse o Swagger**: http://localhost:3000/api
3. **Cadastre um usuário** usando o endpoint `/auth/cadastro`
4. **Faça login** e copie o token retornado
5. **Clique em "Authorize"** no Swagger e cole o token
6. **Teste todos os endpoints** de tarefas

## 📋 Dados de Exemplo

### Usuário de Teste
```json
{
  "nome": "Douglas Cortes",
  "email": "douglas@adv.com",
  "senha": "senha123"
}
```

### Tarefa de Exemplo
```json
{
  "titulo": "Preparar petição inicial",
  "descricao": "Revisar os autos e anexar documentos necessários",
  "status": "pendente"
}
```

## 🔐 Autenticação

1. Faça login para obter o token JWT
2. Use o token no header: `Authorization: Bearer SEU_TOKEN`
3. No Swagger, clique em "Authorize" e cole o token

## ✅ Respostas Esperadas

### Cadastro/Login Sucesso (201/200)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "67123abc456def789",
    "nome": "Douglas Cortes",
    "email": "douglas@adv.com"
  }
}
```

### Estatísticas (200)
```json
{
  "total": 3,
  "pendente": 1,
  "em_andamento": 1,
  "concluida": 1
}
```