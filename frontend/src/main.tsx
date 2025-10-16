import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // Estilos globais (Tailwind CSS)
import App from './App.tsx'

// ============================================================================
// PONTO DE ENTRADA DA APLICAÇÃO REACT
// ============================================================================

/**
 * Arquivo principal que inicializa a aplicação React
 * 
 * 1. Encontra o elemento 'root' no HTML (index.html)
 * 2. Cria uma raiz React nesse elemento
 * 3. Renderiza o componente App dentro do StrictMode
 * 
 * StrictMode:
 * - Ativa verificações adicionais em desenvolvimento
 * - Detecta efeitos colaterais e componentes inseguros
 * - Não afeta a produção
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />  {/* Componente raiz da aplicação */}
  </StrictMode>,
)
