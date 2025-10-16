import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Tarefa } from '../servicos/api'

// ============================================================================
// MODAL DE TAREFA - Componente para criar/editar tarefas
// ============================================================================

/**
 * Interface que define as propriedades do componente ModalTarefa
 */
interface ModalTarefaProps {
  isOpen: boolean      // Controla se o modal está visível
  onClose: () => void  // Função chamada ao fechar o modal
  onSave: (dados: { titulo: string; descricao: string; status: 'pendente' | 'em_andamento' | 'concluida' }) => void  // Função chamada ao salvar
  tarefa?: Tarefa      // Tarefa para edição (opcional - se não fornecida, cria nova)
  titulo: string       // Título do modal ("Criar" ou "Editar")
}

/**
 * Componente Modal para criar ou editar tarefas
 * 
 * Funcionalidades:
 * - Criar nova tarefa (quando tarefa não é fornecida)
 * - Editar tarefa existente (quando tarefa é fornecida)
 * - Validação de campos obrigatórios
 * - Interface responsiva e acessível
 */
export default function ModalTarefa({ isOpen, onClose, onSave, tarefa, titulo }: ModalTarefaProps) {
  /**
   * Estado local do formulário
   * Armazena os dados da tarefa sendo criada/editada
   */
  const [formData, setFormData] = useState<{
    titulo: string
    descricao: string
    status: 'pendente' | 'em_andamento' | 'concluida'
  }>({
    titulo: '',
    descricao: '',
    status: 'pendente'  // Status padrão para novas tarefas
  })

  /**
   * Effect que preenche o formulário quando uma tarefa é fornecida para edição
   * ou limpa o formulário quando é para criar uma nova tarefa
   */
  useEffect(() => {
    if (tarefa) {
      // Modo edição: preenche com dados da tarefa existente
      setFormData({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        status: tarefa.status
      })
    } else {
      // Modo criação: limpa o formulário
      setFormData({
        titulo: '',
        descricao: '',
        status: 'pendente'
      })
    }
  }, [tarefa, isOpen])  // Executa quando tarefa muda ou modal abre/fecha

  /**
   * Função que processa o envio do formulário
   * 
   * 1. Previne o comportamento padrão do form
   * 2. Chama a função onSave passada pelo componente pai
   * 3. Fecha o modal
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()  // Impede reload da página
    onSave(formData)    // Envia dados para o componente pai processar
    onClose()           // Fecha o modal após salvar
  }

  // Se o modal não está aberto, não renderiza nada
  if (!isOpen) return null

  return (
    // Overlay do modal - cobre toda a tela com fundo escuro semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Container principal do modal - caixa branca centralizada */}
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Cabeçalho do modal com título e botão de fechar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{titulo}</h2>
          {/* Botão X para fechar o modal */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fechar modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formulário da tarefa */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Título - obrigatório */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
              Título *
            </label>
            <input
              id="titulo"
              type="text"
              required
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o título da tarefa"
            />
          </div>

          {/* Campo Descrição - opcional */}
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="descricao"
              rows={3}
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descreva os detalhes da tarefa (opcional)"
            />
          </div>

          {/* Campo Status - dropdown com opções predefinidas */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pendente' | 'em_andamento' | 'concluida' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pendente">🔵 Pendente</option>
              <option value="em_andamento">🟡 Em andamento</option>
              <option value="concluida">🟢 Concluída</option>
            </select>
          </div>

          {/* Botões de ação - Cancelar e Salvar */}
          <div className="flex space-x-3 pt-4">
            {/* Botão Cancelar - fecha o modal sem salvar */}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            {/* Botão Salvar/Atualizar - submete o formulário */}
            <button
              type="submit"
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {/* Texto dinâmico baseado no modo (criar vs editar) */}
              {tarefa ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}