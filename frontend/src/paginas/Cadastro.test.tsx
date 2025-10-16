import { render, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Cadastro from './Cadastro'
import * as api from '../servicos/api'
import { CadastroPage } from '../test/pageObjects/CadastroPage'

vi.mock('../servicos/api')

const renderCadastro = () => {
  return render(
    <BrowserRouter>
      <Cadastro />
    </BrowserRouter>
  )
}

describe('Cadastro', () => {
  let cadastroPage: CadastroPage

  beforeEach(() => {
    vi.clearAllMocks()
    renderCadastro()
    cadastroPage = new CadastroPage()
  })

  test('deve renderizar todos os campos obrigatórios', () => {
    cadastroPage.verificarElementosVisiveis()
  })

  test('deve cadastrar usuário com sucesso', async () => {
    const mockCadastro = vi.mocked(api.cadastro)
    mockCadastro.mockResolvedValue({
      token: 'fake-token',
      usuario: { id: '1', nome: 'Teste', email: 'teste@teste.com' }
    })
    
    await cadastroPage.fazerCadastro('Teste Silva', 'teste@teste.com', '123456', '123456')
    
    await waitFor(() => {
      expect(mockCadastro).toHaveBeenCalledWith({
        nome: 'Teste Silva',
        email: 'teste@teste.com',
        senha: '123456'
      })
    })
  })

  test('deve mostrar erro quando senhas não coincidem', async () => {
    await cadastroPage.preencherNome('Teste Silva')
    await cadastroPage.preencherEmail('teste@teste.com')
    await cadastroPage.preencherSenha('123456')
    await cadastroPage.preencherConfirmarSenha('654321')
    await cadastroPage.clicarCadastrar()
    
    await waitFor(() => {
      cadastroPage.verificarErro('As senhas não coincidem')
    })
  })
})