import { Navigate } from 'react-router-dom'

// ============================================================================
// COMPONENTE DE PROTEÇÃO DE ROTAS - Controla acesso baseado em autenticação
// ============================================================================

/**
 * Interface para as props do componente RotaPrivada
 */
interface RotaPrivadaProps {
  children: React.ReactNode // Componente filho que será renderizado se autenticado
}

/**
 * Componente de proteção de rotas
 * 
 * Verifica se o usuário está autenticado antes de permitir acesso
 * - Se tem token JWT válido: renderiza o componente filho
 * - Se não tem token: redireciona para /login
 * 
 * Usado para proteger páginas como /tarefas que precisam de autenticação
 */
export default function RotaPrivada({ children }: RotaPrivadaProps) {
  // Verifica se existe token JWT salvo no navegador
  const token = localStorage.getItem('token')
  
  // Se não tem token, redireciona para login
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  // Se tem token, renderiza o componente protegido
  return <>{children}</>
}