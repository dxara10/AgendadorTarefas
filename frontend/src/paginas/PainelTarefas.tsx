import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, LogOut, Edit, Trash2, CheckCircle } from 'lucide-react'
import { listarTarefas, criarTarefa, atualizarTarefa, excluirTarefa, obterEstatisticas } from '../servicos/api'
import type { Tarefa, Estatisticas } from '../servicos/api'
import ModalTarefa from '../componentes/ModalTarefa'
import Dashboard from '../componentes/Dashboard'

// ============================================================================
// PAINEL DE TAREFAS - Página principal da aplicação (protegida)
// ============================================================================

/**
 * Componente principal da aplicação após login
 * 
 * Funcionalidades:
 * - Exibe dashboard com estatísticas
 * - Lista todas as tarefas do usuário
 * - Permite criar, editar e excluir tarefas
 * - Permite alterar status das tarefas
 * - Gerencia autenticação (logout)
 * - Interface responsiva e intuitiva
 */
export default function PainelTarefas() {
  // ========================================================================
  // ESTADOS DO COMPONENTE
  // ========================================================================
  
  /** Lista de tarefas do usuário */
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  
  /** Estatísticas para o dashboard */
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    total: 0,
    pendente: 0,
    em_andamento: 0,
    concluida: 0
  })
  
  /** Controla se o modal de tarefa está aberto */
  const [modalAberto, setModalAberto] = useState(false)
  
  /** Tarefa sendo editada (undefined = criando nova) */
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | undefined>()
  
  /** Estado de carregamento inicial */
  const [carregando, setCarregando] = useState(true)
  
  /** Hook para navegação programática */
  const navigate = useNavigate()

  /** Dados do usuário logado (do localStorage) */
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  // ========================================================================
  // EFFECTS E FUNÇÕES
  // ========================================================================
  
  /**
   * Effect que carrega os dados iniciais quando o componente monta
   */
  useEffect(() => {
    carregarDados()
  }, [])  // Array vazio = executa apenas uma vez

  /**
   * Função que carrega tarefas e estatísticas do backend
   * 
   * Usa Promise.all para fazer as duas requisições em paralelo,
   * melhorando a performance
   */
  const carregarDados = async () => {
    try {
      // Executa ambas as requisições simultaneamente
      const [tarefasData, estatisticasData] = await Promise.all([
        listarTarefas(),      // GET /tarefas
        obterEstatisticas()   // GET /tarefas/estatisticas
      ])
      
      // Atualiza os estados com os dados recebidos
      setTarefas(tarefasData)
      setEstatisticas(estatisticasData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      // TODO: Implementar notificação de erro para o usuário
    } finally {
      setCarregando(false)  // Para o loading independente do resultado
    }
  }

  /**
   * Função para criar uma nova tarefa
   * 
   * @param dados - Dados da nova tarefa (título, descrição, status)
   */
  const handleCriarTarefa = async (dados: { titulo: string; descricao: string; status: 'pendente' | 'em_andamento' | 'concluida' }) => {
    try {
      await criarTarefa(dados)  // POST /tarefas
      await carregarDados()     // Recarrega a lista para mostrar a nova tarefa
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
      // TODO: Implementar notificação de erro para o usuário
    }
  }

  /**
   * Função para editar uma tarefa existente
   * 
   * @param dados - Novos dados da tarefa
   */
  const handleEditarTarefa = async (dados: { titulo: string; descricao: string; status: 'pendente' | 'em_andamento' | 'concluida' }) => {
    if (!tarefaEditando) return  // Segurança: verifica se há tarefa selecionada
    
    try {
      await atualizarTarefa(tarefaEditando._id, dados)  // PUT /tarefas/:id
      await carregarDados()                             // Recarrega a lista
      setTarefaEditando(undefined)                      // Limpa a seleção
    } catch (error) {
      console.error('Erro ao editar tarefa:', error)
      // TODO: Implementar notificação de erro para o usuário
    }
  }

  /**
   * Função para excluir uma tarefa
   * 
   * @param id - ID da tarefa a ser excluída
   */
  const handleExcluirTarefa = async (id: string) => {
    // Confirmação antes de excluir (evita exclusões acidentais)
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return
    
    try {
      await excluirTarefa(id)  // DELETE /tarefas/:id
      await carregarDados()    // Recarrega a lista
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error)
      // TODO: Implementar notificação de erro para o usuário
    }
  }

  /**
   * Função para marcar uma tarefa como concluída
   * 
   * @param tarefa - Tarefa a ser marcada como concluída
   */
  const handleConcluirTarefa = async (tarefa: Tarefa) => {
    try {
      // Atualiza apenas o status para 'concluida'
      await atualizarTarefa(tarefa._id, { status: 'concluida' })  // PUT /tarefas/:id
      await carregarDados()  // Recarrega para atualizar estatísticas
    } catch (error) {
      console.error('Erro ao concluir tarefa:', error)
      // TODO: Implementar notificação de erro para o usuário
    }
  }

  /**
   * Função para fazer logout do usuário
   * 
   * 1. Remove dados de autenticação do localStorage
   * 2. Redireciona para a página de login
   */
  const handleSair = () => {
    localStorage.removeItem('token')    // Remove token JWT
    localStorage.removeItem('usuario')  // Remove dados do usuário
    navigate('/login')                  // Redireciona para login
  }

  // ========================================================================
  // FUNÇÕES UTILITÁRIAS
  // ========================================================================
  
  /**
   * Retorna as classes CSS para estilizar o badge de status
   * 
   * @param status - Status da tarefa
   * @returns Classes Tailwind para cor de fundo e texto
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-blue-100 text-blue-800'      // Azul claro
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800'  // Amarelo claro
      case 'concluida': return 'bg-green-100 text-green-800'   // Verde claro
      default: return 'bg-gray-100 text-gray-800'              // Cinza (fallback)
    }
  }

  /**
   * Retorna o emoji correspondente ao status da tarefa
   * 
   * @param status - Status da tarefa
   * @returns Emoji visual para o status
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return '🔵'      // Círculo azul
      case 'em_andamento': return '🟡'  // Círculo amarelo
      case 'concluida': return '🟢'     // Círculo verde
      default: return '⚪'                 // Círculo branco (fallback)
    }
  }

  /**
   * Formata uma data ISO para o padrão brasileiro
   * 
   * @param data - Data em formato ISO string
   * @returns Data formatada como DD/MM/AAAA
   */
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',    // Dia com 2 dígitos
      month: '2-digit',  // Mês com 2 dígitos
      year: 'numeric'    // Ano com 4 dígitos
    })
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra Superior */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Gerenciador de Tarefas</h1>
              <span className="text-gray-600">
                Olá, {usuario.nome} 👩‍⚖️
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setModalAberto(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </button>
              <button
                onClick={handleSair}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Dashboard estatisticas={estatisticas} />

        {/* Lista de Tarefas */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">📋 Suas Tarefas</h2>
          </div>
          
          {tarefas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
              <button
                onClick={() => setModalAberto(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira tarefa
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título da Tarefa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criada em
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Concluída em
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tarefas.map((tarefa) => (
                    <tr key={tarefa._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {tarefa.titulo}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {tarefa.descricao}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tarefa.status)}`}>
                          {getStatusIcon(tarefa.status)} {tarefa.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarData(tarefa.data_criacao)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tarefa.data_conclusao ? formatarData(tarefa.data_conclusao) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setTarefaEditando(tarefa)
                              setModalAberto(true)
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleExcluirTarefa(tarefa._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                            aria-label="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {tarefa.status !== 'concluida' && (
                            <button
                              onClick={() => handleConcluirTarefa(tarefa)}
                              className="text-green-600 hover:text-green-900"
                              title="Marcar como concluída"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <ModalTarefa
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false)
          setTarefaEditando(undefined)
        }}
        onSave={tarefaEditando ? handleEditarTarefa : handleCriarTarefa}
        tarefa={tarefaEditando}
        titulo={tarefaEditando ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
      />
    </div>
  )
}