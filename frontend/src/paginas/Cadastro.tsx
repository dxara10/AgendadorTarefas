import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, AlertCircle } from 'lucide-react'
import { cadastro } from '../servicos/api'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  /**
   * Valida se o email tem formato válido
   * Verifica se contém @ e domínio válido
   */
  const validarEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Função que processa o formulário de cadastro
   * 
   * 1. Valida todos os campos localmente
   * 2. Chama a API de cadastro no backend (/auth/cadastro)
   * 3. Salva token e dados do usuário no localStorage
   * 4. Redireciona para a página de tarefas
   * 5. Mostra mensagens de erro amigáveis ao usuário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Impede reload da página
    setCarregando(true)
    setErro('') // Limpa erros anteriores

    // Validações locais antes de enviar para o backend
    if (!nome.trim()) {
      setErro('Por favor, digite seu nome completo')
      setCarregando(false)
      return
    }

    if (nome.trim().length < 2) {
      setErro('O nome deve ter pelo menos 2 caracteres')
      setCarregando(false)
      return
    }

    if (!email.trim()) {
      setErro('Por favor, digite seu email')
      setCarregando(false)
      return
    }

    if (!validarEmail(email)) {
      setErro('Por favor, digite um email válido (exemplo: usuario@email.com)')
      setCarregando(false)
      return
    }

    if (!senha.trim()) {
      setErro('Por favor, digite uma senha')
      setCarregando(false)
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres')
      setCarregando(false)
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem. Digite a mesma senha nos dois campos.')
      setCarregando(false)
      return
    }

    try {
      // Chama o backend NestJS na porta 3000
      const response = await cadastro({ nome, email, senha })
      
      // Salva autenticação no navegador (mesmo fluxo do login)
      localStorage.setItem('token', response.token)
      localStorage.setItem('usuario', JSON.stringify(response.usuario))
      
      // Redireciona para página principal (protegida)
      navigate('/tarefas')
    } catch (error: any) {
      // Trata diferentes tipos de erro com mensagens amigáveis
      if (error.message.includes('conexão')) {
        setErro('Não foi possível conectar ao servidor. Tente novamente em alguns instantes.')
      } else if (error.message.includes('Email já está em uso')) {
        setErro('Este email já está cadastrado. Tente fazer login ou use outro email.')
        // Limpa apenas o email após 2 segundos
        setTimeout(() => {
          setEmail('')
        }, 2000)
      } else if (error.response?.status === 400) {
        setErro('Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.')
      } else {
        setErro('Erro ao criar conta. Verifique seus dados e tente novamente.')
        // Limpa todos os campos após 2 segundos para dar tempo de ler a mensagem
        setTimeout(() => {
          setNome('')
          setEmail('')
          setSenha('')
          setConfirmarSenha('')
        }, 2000)
      }
    } finally {
      setCarregando(false) // Para o loading independente do resultado
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Gerenciador de Tarefas
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Crie sua conta
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                👤 Nome completo
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                📧 E-mail
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                🔒 Senha
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Sua senha"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                🔒 Confirmar senha
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirme sua senha"
                />
              </div>
            </div>
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{erro}</span>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={carregando}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Já possui conta?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Faça login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}