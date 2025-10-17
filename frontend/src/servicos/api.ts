import axios from 'axios'

// ============================================================================
// SERVIÇO DE API - Comunicação entre Frontend React e Backend NestJS
// ============================================================================

/**
 * Configuração da instância do Axios para comunicação com o backend
 * 
 * - baseURL: Detecta automaticamente se está no Codespaces ou local
 * - headers: Define Content-Type padrão como JSON
 */
const getBaseURL = () => {
  // Se estiver no Codespaces, usa a URL pública
  if (window.location.hostname.includes('github.dev') || window.location.hostname.includes('codespaces')) {
    return window.location.origin.replace('5173', '3000')
  }
  // Caso contrário, usa localhost
  return 'http://localhost:3000'
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // Timeout de 10 segundos para evitar travamentos
})

/**
 * Interceptor de requisição para adicionar token JWT automaticamente
 * 
 * - Pega o token do localStorage
 * - Adiciona no header Authorization se existir
 * - Permite acesso a rotas protegidas do backend
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Interceptor de resposta para tratamento global de erros
 * 
 * - Captura erros 401 (não autorizado) e redireciona para login
 * - Trata erros de rede e timeout
 * - Fornece mensagens de erro mais amigáveis
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se token expirou ou é inválido, limpa localStorage e redireciona
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    
    // Melhora mensagens de erro para o usuário
    if (error.code === 'ECONNREFUSED') {
      error.message = 'Erro de conexão com o servidor. Verifique se o backend está rodando.'
    } else if (error.code === 'TIMEOUT') {
      error.message = 'Timeout na requisição. Tente novamente.'
    }
    
    return Promise.reject(error)
  }
)

// ============================================================================
// INTERFACES E TIPOS - Definem a estrutura dos dados da aplicação
// ============================================================================

/**
 * Interface do usuário retornada pelo backend
 * Corresponde ao modelo Usuario do NestJS/MongoDB
 */
export interface Usuario {
  id: string    // ID único do usuário no MongoDB
  nome: string  // Nome completo do usuário
  email: string // Email único para login
}

/**
 * Resposta das funções de login e cadastro
 * Retornada pelos endpoints /auth/login e /auth/cadastro
 */
export interface LoginResponse {
  token: string   // Token JWT para autenticação
  usuario: Usuario // Dados do usuário logado
}

/**
 * Interface da tarefa conforme modelo do MongoDB
 * _id é usado pelo MongoDB (diferente de 'id')
 */
export interface Tarefa {
  _id: string                                          // ID único no MongoDB
  titulo: string                                       // Título da tarefa
  descricao: string                                    // Descrição detalhada
  status: 'pendente' | 'em_andamento' | 'concluida'   // Status atual da tarefa
  data_criacao: string                                 // Data de criação (ISO string)
  data_conclusao?: string                              // Data de conclusão (opcional)
}

/**
 * Estatísticas das tarefas por status
 * Retornada pelo endpoint /tarefas/estatisticas
 */
export interface Estatisticas {
  total: number        // Total de tarefas do usuário
  pendente: number     // Tarefas com status 'pendente'
  em_andamento: number // Tarefas com status 'em_andamento'
  concluida: number    // Tarefas com status 'concluida'
}

/**
 * Função de login - autentica usuário no backend
 * 
 * @param dados - Email e senha do usuário
 * @returns Promise com token JWT e dados do usuário
 * 
 * Endpoint: POST /auth/login
 * Retorna: { token: string, usuario: Usuario }
 */
export const login = async (dados: { email: string; senha: string }): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', dados)
    return response.data
  } catch (error: any) {
    // Melhora mensagem de erro para credenciais inválidas
    if (error.response?.status === 401) {
      throw new Error('Email ou senha incorretos')
    }
    throw error
  }
}

/**
 * Função de cadastro - registra novo usuário no backend
 * 
 * @param dados - Nome, email e senha do novo usuário
 * @returns Promise com token JWT e dados do usuário
 * 
 * Endpoint: POST /auth/cadastro
 * Retorna: { token: string, usuario: Usuario }
 */
export const cadastro = async (dados: { nome: string; email: string; senha: string }): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/cadastro', dados)
    return response.data
  } catch (error: any) {
    // Trata erros específicos de cadastro
    if (error.response?.status === 409) {
      throw new Error('Email já está em uso')
    } else if (error.response?.status === 400) {
      throw new Error('Dados inválidos. Verifique os campos obrigatórios')
    }
    throw error
  }
}

/**
 * Lista todas as tarefas do usuário autenticado
 * 
 * Endpoint: GET /tarefas
 * Requer: Token JWT no header Authorization
 * Retorna: Array de tarefas do usuário
 */
export const listarTarefas = async (): Promise<Tarefa[]> => {
  const response = await api.get('/tarefas')
  return response.data
}

/**
 * Cria uma nova tarefa para o usuário autenticado
 * 
 * @param dados - Título, descrição e status da tarefa
 * Endpoint: POST /tarefas
 * Requer: Token JWT no header Authorization
 * Retorna: Tarefa criada com ID gerado
 */
export const criarTarefa = async (dados: { titulo: string; descricao: string; status: string }): Promise<Tarefa> => {
  const response = await api.post('/tarefas', dados)
  return response.data
}

/**
 * Atualiza uma tarefa existente do usuário
 * 
 * @param id - ID da tarefa a ser atualizada
 * @param dados - Campos a serem atualizados (parcial)
 * Endpoint: PUT /tarefas/:id
 * Requer: Token JWT no header Authorization
 * Retorna: Tarefa atualizada
 */
export const atualizarTarefa = async (id: string, dados: Partial<Tarefa>): Promise<Tarefa> => {
  const response = await api.put(`/tarefas/${id}`, dados)
  return response.data
}

/**
 * Exclui uma tarefa do usuário
 * 
 * @param id - ID da tarefa a ser excluída
 * Endpoint: DELETE /tarefas/:id
 * Requer: Token JWT no header Authorization
 * Retorna: Void (sem conteúdo)
 */
export const excluirTarefa = async (id: string): Promise<void> => {
  await api.delete(`/tarefas/${id}`)
}

/**
 * Obtém estatísticas das tarefas do usuário
 * 
 * Endpoint: GET /tarefas/estatisticas
 * Requer: Token JWT no header Authorization
 * Retorna: Contadores por status (total, pendente, em_andamento, concluida)
 */
export const obterEstatisticas = async (): Promise<Estatisticas> => {
  const response = await api.get('/tarefas/estatisticas')
  return response.data
}