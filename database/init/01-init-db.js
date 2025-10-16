// Script de inicialização do MongoDB
// Este script será executado automaticamente quando o container for criado

// Conecta ao banco de dados tarefasdb
db = db.getSiblingDB('tarefasdb');

// Cria coleção de usuários com validação
db.createCollection("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "email", "senha_hash"],
      properties: {
        nome: { 
          bsonType: "string",
          description: "Nome do usuário é obrigatório"
        },
        email: { 
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Email válido é obrigatório"
        },
        senha_hash: { 
          bsonType: "string",
          description: "Hash da senha é obrigatório"
        },
        criado_em: {
          bsonType: "date",
          description: "Data de criação do usuário"
        }
      }
    }
  }
});

// Cria coleção de tarefas com validação
db.createCollection("tarefas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["titulo", "status", "usuario_id"],
      properties: {
        titulo: { 
          bsonType: "string",
          minLength: 1,
          description: "Título da tarefa é obrigatório"
        },
        descricao: { 
          bsonType: "string",
          description: "Descrição da tarefa"
        },
        status: {
          enum: ["pendente", "em_andamento", "concluida"],
          description: "Status deve ser: pendente, em_andamento ou concluida"
        },
        data_criacao: {
          bsonType: "date",
          description: "Data de criação da tarefa"
        },
        data_conclusao: {
          bsonType: ["date", "null"],
          description: "Data de conclusão da tarefa (opcional)"
        },
        usuario_id: { 
          bsonType: "objectId",
          description: "ID do usuário proprietário da tarefa"
        }
      }
    }
  }
});

// Cria índices para otimização
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.tarefas.createIndex({ usuario_id: 1 });
db.tarefas.createIndex({ status: 1 });
db.tarefas.createIndex({ data_criacao: -1 });

// Insere dados de exemplo para desenvolvimento
const usuarioExemplo = {
  nome: "Douglas Cortes",
  email: "douglas@adv.com",
  senha_hash: "$2b$10$exemplo.hash.para.desenvolvimento",
  criado_em: new Date()
};

const usuarioId = db.usuarios.insertOne(usuarioExemplo).insertedId;

// Insere tarefas de exemplo
const tarefasExemplo = [
  {
    titulo: "Preparar petição inicial",
    descricao: "Revisar os autos e anexar documentos necessários",
    status: "em_andamento",
    data_criacao: new Date(),
    data_conclusao: null,
    usuario_id: usuarioId
  },
  {
    titulo: "Audiência de conciliação",
    descricao: "Comparecer à audiência no fórum central",
    status: "pendente",
    data_criacao: new Date(),
    data_conclusao: null,
    usuario_id: usuarioId
  },
  {
    titulo: "Análise de contrato",
    descricao: "Revisar cláusulas do contrato de prestação de serviços",
    status: "concluida",
    data_criacao: new Date(Date.now() - 86400000), // 1 dia atrás
    data_conclusao: new Date(),
    usuario_id: usuarioId
  }
];

db.tarefas.insertMany(tarefasExemplo);

print("✅ Banco de dados inicializado com sucesso!");
print("📊 Coleções criadas: usuarios, tarefas");
print("🔍 Índices criados para otimização");
print("📝 Dados de exemplo inseridos");