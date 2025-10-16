import { render, waitFor, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PainelTarefas from './PainelTarefas'
import * as api from '../servicos/api'

// Mock completo da API
vi.mock('../servicos/api', () => ({
  listarTarefas: vi.fn(),
  obterEstatisticas: vi.fn(),
  criarTarefa: vi.fn(),
  atualizarTarefa: vi.fn(),
  excluirTarefa: vi.fn()
}))

const mockTarefas = [
  {
    _id: '1',
    titulo: 'Petição Inicial',
    descricao: 'Elaborar minuta da ação de alimentos',
    status: 'em_andamento' as const,
    data_criacao: '2025-01-15T10:00:00Z',
    data_conclusao: undefined
  }
]

const renderPainelTarefas = () => {
  return render(
    <BrowserRouter>
      <PainelTarefas />
    </BrowserRouter>
  )
}

describe('PainelTarefas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'fake-token')
    localStorage.setItem('usuario', JSON.stringify({ nome: 'Dra. Ana Paula' }))
  })

  test('deve renderizar componente sem erros', async () => {
    vi.mocked(api.listarTarefas).mockResolvedValue([])
    vi.mocked(api.obterEstatisticas).mockResolvedValue({
      total: 0,
      pendente: 0,
      em_andamento: 0,
      concluida: 0
    })

    renderPainelTarefas()

    await waitFor(() => {
      expect(screen.getByText('Gerenciador de Tarefas')).toBeInTheDocument()
    })
  })

  test('deve mostrar mensagem quando não há tarefas', async () => {
    vi.mocked(api.listarTarefas).mockResolvedValue([])
    vi.mocked(api.obterEstatisticas).mockResolvedValue({
      total: 0,
      pendente: 0,
      em_andamento: 0,
      concluida: 0
    })

    renderPainelTarefas()

    await waitFor(() => {
      expect(screen.getByText('Nenhuma tarefa encontrada.')).toBeInTheDocument()
    })
  })

  test('deve listar tarefas do usuário', async () => {
    vi.mocked(api.listarTarefas).mockResolvedValue(mockTarefas)
    vi.mocked(api.obterEstatisticas).mockResolvedValue({
      total: 1,
      pendente: 0,
      em_andamento: 1,
      concluida: 0
    })
    
    renderPainelTarefas()

    await waitFor(() => {
      expect(screen.getByText('Petição Inicial')).toBeInTheDocument()
    })
  })

  test('deve carregar estatísticas', async () => {
    vi.mocked(api.listarTarefas).mockResolvedValue([])
    vi.mocked(api.obterEstatisticas).mockResolvedValue({
      total: 5,
      pendente: 2,
      em_andamento: 1,
      concluida: 2
    })
    
    renderPainelTarefas()

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })
})