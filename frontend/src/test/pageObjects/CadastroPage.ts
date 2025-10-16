import { screen, fireEvent } from '@testing-library/react'

export class CadastroPage {
  get nomeInput() {
    return screen.getByPlaceholderText('Seu nome completo')
  }

  get emailInput() {
    return screen.getByPlaceholderText('seu@email.com')
  }

  get senhaInput() {
    return screen.getByPlaceholderText('Sua senha')
  }

  get confirmarSenhaInput() {
    return screen.getByPlaceholderText('Confirme sua senha')
  }

  get cadastrarButton() {
    return screen.getByRole('button', { name: /cadastrar/i })
  }

  get loginLink() {
    return screen.getByRole('link', { name: /faça login/i })
  }

  async preencherNome(nome: string) {
    fireEvent.change(this.nomeInput, { target: { value: nome } })
  }

  async preencherEmail(email: string) {
    fireEvent.change(this.emailInput, { target: { value: email } })
  }

  async preencherSenha(senha: string) {
    fireEvent.change(this.senhaInput, { target: { value: senha } })
  }

  async preencherConfirmarSenha(senha: string) {
    fireEvent.change(this.confirmarSenhaInput, { target: { value: senha } })
  }

  async clicarCadastrar() {
    fireEvent.click(this.cadastrarButton)
  }

  async fazerCadastro(nome: string, email: string, senha: string, confirmarSenha: string) {
    await this.preencherNome(nome)
    await this.preencherEmail(email)
    await this.preencherSenha(senha)
    await this.preencherConfirmarSenha(confirmarSenha)
    await this.clicarCadastrar()
  }

  verificarElementosVisiveis() {
    expect(this.nomeInput).toBeInTheDocument()
    expect(this.emailInput).toBeInTheDocument()
    expect(this.senhaInput).toBeInTheDocument()
    expect(this.confirmarSenhaInput).toBeInTheDocument()
    expect(this.cadastrarButton).toBeInTheDocument()
  }

  verificarErro(mensagem: string) {
    expect(screen.getByText(new RegExp(mensagem, 'i'))).toBeInTheDocument()
  }
}