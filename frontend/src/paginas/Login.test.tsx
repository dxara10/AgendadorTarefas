import { render, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from './Login'
import * as api from '../servicos/api'
import { LoginPage } from '../test/pageObjects/LoginPage'

vi.mock('../servicos/api')

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  )
}

describe('Login', () => {
  let loginPage: LoginPage

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    renderLogin()
    loginPage = new LoginPage()
  })

  test('deve renderizar elementos da página', () => {
    loginPage.verificarElementosVisiveis()
  })

  test('deve fazer login com sucesso', async () => {
    const mockLogin = vi.mocked(api.login)
    mockLogin.mockResolvedValue({
      token: 'fake-token',
      usuario: { id: '1', nome: 'Teste', email: 'teste@teste.com' }
    })
    
    await loginPage.fazerLogin('teste@teste.com', '123456')
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'teste@teste.com',
        senha: '123456'
      })
    })
  })

  test('deve mostrar erro em caso de falha no login', async () => {
    const mockLogin = vi.mocked(api.login)
    mockLogin.mockRejectedValue(new Error('Credenciais inválidas'))
    
    await loginPage.fazerLogin('teste@teste.com', 'senha-errada')
    
    await waitFor(() => {
      loginPage.verificarErro('Suas credenciais são inválidas')
    })
  })
})