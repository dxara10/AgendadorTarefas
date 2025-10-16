import { screen } from '@testing-library/react'

export class PainelTarefasPage {
  get titulo() {
    return screen.getByText('Gerenciador Jurídico')
  }

  get novaTarefaButton() {
    return screen.queryByRole('button', { name: /nova tarefa/i })
  }

  get sairButton() {
    return screen.queryByRole('button', { name: /sair/i })
  }

  get mensagemSemTarefas() {
    return screen.queryByText('Nenhuma tarefa encontrada.')
  }

  verificarCarregamento() {
    expect(this.titulo).toBeInTheDocument()
  }

  verificarTarefa(titulo: string) {
    expect(screen.getByText(titulo)).toBeInTheDocument()
  }

  verificarEstatistica(valor: string) {
    expect(screen.getByText(valor)).toBeInTheDocument()
  }

  verificarMensagemSemTarefas() {
    expect(this.mensagemSemTarefas).toBeInTheDocument()
  }
}