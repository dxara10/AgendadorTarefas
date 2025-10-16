# 🏗️ Arquitetura do Sistema

## 📋 **Visão Geral**

Este projeto implementa uma **API REST** para gerenciamento de tarefas jurídicas usando **arquitetura em camadas** com **NestJS**.

### **🎯 Padrões Arquiteturais Utilizados**

1. **MVC (Model-View-Controller)** - Separação de responsabilidades
2. **Dependency Injection** - Inversão de controle
3. **Repository Pattern** - Abstração do acesso a dados
4. **DTO Pattern** - Validação e transferência de dados
5. **Guard Pattern** - Controle de acesso

## 🏛️ **Estrutura em Camadas**

```
┌─────────────────────────────────────┐
│           PRESENTATION              │ ← Controllers (HTTP)
├─────────────────────────────────────┤
│            BUSINESS                 │ ← Services (Lógica)
├─────────────────────────────────────┤
│             DATA                    │ ← Schemas (MongoDB)
├─────────────────────────────────────┤
│           SECURITY                  │ ← Guards & Utils
└─────────────────────────────────────┘
```

### **📊 Camada de Apresentação (Controllers)**

**Responsabilidade**: Receber requisições HTTP e retornar respostas

```typescript
// Exemplo: AuthController
@Controller('auth')
export class AuthController {
  // Recebe dados HTTP
  // Valida com DTOs
  // Delega para Services
  // Retorna resposta HTTP
}
```

**Arquivos**:
- `auth.controller.ts` - Endpoints de autenticação
- `tarefas.controller.ts` - Endpoints de tarefas
- `app.controller.ts` - Endpoints básicos

### **⚙️ Camada de Negócio (Services)**

**Responsabilidade**: Implementar regras de negócio e lógica da aplicação

```typescript
// Exemplo: TarefasService
export class TarefasService {
  // Regras de negócio
  // Validações complexas
  // Orquestração de operações
  // Integração entre módulos
}
```

**Arquivos**:
- `auth.service.ts` - Lógica de autenticação
- `usuarios.service.ts` - Lógica de usuários
- `tarefas.service.ts` - Lógica de tarefas

### **🗄️ Camada de Dados (Schemas)**

**Responsabilidade**: Definir estrutura e validação dos dados

```typescript
// Exemplo: Usuario Schema
@Schema()
export class Usuario {
  // Define estrutura no MongoDB
  // Validações de campo
  // Índices e relacionamentos
}
```

**Arquivos**:
- `usuario.schema.ts` - Modelo de usuário
- `tarefa.schema.ts` - Modelo de tarefa

### **🛡️ Camada de Segurança (Guards & Utils)**

**Responsabilidade**: Autenticação, autorização e utilitários

```typescript
// Exemplo: JwtAuthGuard
export class JwtAuthGuard {
  // Valida tokens JWT
  // Controla acesso às rotas
  // Extrai dados do usuário
}
```

**Arquivos**:
- `jwt-auth.guard.ts` - Proteção de rotas
- `hash.util.ts` - Criptografia de senhas

## 🔄 **Fluxo de Dados**

### **1. Requisição de Entrada**
```
HTTP Request → Controller → DTO Validation → Service → Database
```

### **2. Processamento**
```
Service → Business Logic → Database Operations → Response Data
```

### **3. Resposta de Saída**
```
Database → Service → Controller → HTTP Response
```

## 🧩 **Módulos e Responsabilidades**

### **🔐 AuthModule**
```typescript
// Responsabilidades:
- Cadastro de usuários
- Login e geração de JWT
- Validação de credenciais
- Integração com UsuariosModule

// Componentes:
- AuthController (endpoints)
- AuthService (lógica)
- DTOs (validação)
```

### **👥 UsuariosModule**
```typescript
// Responsabilidades:
- CRUD de usuários
- Validação de senhas
- Busca por email/ID
- Criptografia com bcrypt

// Componentes:
- UsuariosService (lógica)
- Usuario Schema (modelo)
- HashUtil (criptografia)
```

### **📝 TarefasModule**
```typescript
// Responsabilidades:
- CRUD de tarefas
- Controle de propriedade
- Estatísticas por status
- Lógica de data_conclusao

// Componentes:
- TarefasController (endpoints)
- TarefasService (lógica)
- Tarefa Schema (modelo)
- DTOs (validação)
```

## 🔒 **Segurança Implementada**

### **1. Autenticação JWT**
```typescript
// Fluxo:
Login → Gera Token → Token em Headers → Valida Token → Acesso
```

### **2. Autorização por Propriedade**
```typescript
// Regra:
Usuário só acessa suas próprias tarefas
```

### **3. Criptografia de Senhas**
```typescript
// Método:
bcrypt com salt automático
```

### **4. Validação de Entrada**
```typescript
// Ferramentas:
class-validator + DTOs
```

## 📊 **Padrões de Código**

### **1. Naming Convention**
```typescript
// Classes: PascalCase
export class UsuariosService

// Métodos: camelCase
async criarUsuario()

// Constantes: UPPER_CASE
const JWT_SECRET
```

### **2. Error Handling**
```typescript
// Exceções específicas do NestJS
throw new NotFoundException('Usuário não encontrado');
throw new ConflictException('Email já está em uso');
throw new UnauthorizedException('Credenciais inválidas');
```

### **3. Async/Await**
```typescript
// Sempre usar async/await para operações assíncronas
async criarUsuario(dados: CadastroUsuarioDto): Promise<Usuario>
```

## 🧪 **Estratégia de Testes**

### **1. Testes Unitários**
```typescript
// Cada service e controller testado isoladamente
// Mocks para todas as dependências
// Cobertura de casos positivos e negativos
```

### **2. Estrutura de Testes**
```
src/
├── auth/
│   ├── auth.service.ts
│   └── auth.service.spec.ts ← Teste do service
├── tarefas/
│   ├── tarefas.controller.ts
│   └── tarefas.controller.spec.ts ← Teste do controller
```

## 🚀 **Escalabilidade**

### **1. Modularidade**
- Cada funcionalidade em módulo separado
- Baixo acoplamento entre módulos
- Fácil adição de novas funcionalidades

### **2. Injeção de Dependência**
- Facilita testes e manutenção
- Permite substituição de implementações
- Inversão de controle

### **3. Configuração Externa**
- Variáveis de ambiente (.env)
- Configurações centralizadas
- Fácil deploy em diferentes ambientes

## 📈 **Benefícios da Arquitetura**

### **✅ Manutenibilidade**
- Código organizado e bem estruturado
- Responsabilidades bem definidas
- Fácil localização de bugs

### **✅ Testabilidade**
- Componentes isolados
- Mocks simples de implementar
- Cobertura de testes alta

### **✅ Escalabilidade**
- Fácil adição de novas funcionalidades
- Módulos independentes
- Baixo acoplamento

### **✅ Segurança**
- Autenticação robusta
- Autorização por propriedade
- Validação de entrada

### **✅ Performance**
- Operações otimizadas no MongoDB
- Índices apropriados
- Consultas eficientes

## 🎯 **Próximos Passos para Evolução**

1. **Cache** - Redis para sessões
2. **Rate Limiting** - Proteção contra spam
3. **Logging** - Winston para logs estruturados
4. **Monitoring** - Health checks avançados
5. **Documentação** - OpenAPI completa