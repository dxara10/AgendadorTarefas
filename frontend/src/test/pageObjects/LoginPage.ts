import { screen, fireEvent } from '@testing-library/react'

export class LoginPage {
  get emailInput() {
    return screen.getByPlaceholderText('seu@email.com')
  }

  get senhaInput() {
    return screen.getByPlaceholderText('Sua senha')
  }

  get entrarButton() {
    return screen.getByRole('button', { name: /entrar/i })
  }

  get cadastroLink() {
    return screen.getByRole('link', { name: /cadastre-se/i })
  }

  async preencherEmail(email: string) {
    fireEvent.change(this.emailInput, { target: { value: email } })
  }

  async preencherSenha(senha: string) {
    fireEvent.change(this.senhaInput, { target: { value: senha } })
  }

  async clicarEntrar() {
    fireEvent.click(this.entrarButton)
  }

  async fazerLogin(email: string, senha: string) {
    await this.preencherEmail(email)
    await this.preencherSenha(senha)
    await this.clicarEntrar()
  }

  verificarElementosVisiveis() {
    expect(this.emailInput).toBeInTheDocument()
    expect(this.senhaInput).toBeInTheDocument()
    expect(this.entrarButton).toBeInTheDocument()
  }

  verificarErro(mensagem: string) {
    expect(screen.getByText(new RegExp(mensagem, 'i'))).toBeInTheDocument()
  }
}