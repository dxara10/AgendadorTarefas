import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './paginas/Login'
import Cadastro from './paginas/Cadastro'
import PainelTarefas from './paginas/PainelTarefas'
import RotaPrivada from './rotas/RotaPrivada'

// ============================================================================
// APP PRINCIPAL - Componente raiz da aplicação React
// ============================================================================

/**
 * Componente principal da aplicação
 * 
 * Responsável por:
 * - Configurar o roteamento da aplicação (React Router)
 * - Definir rotas públicas (login, cadastro)
 * - Definir rotas protegidas (painel de tarefas)
 * - Redirecionar usuários não autenticados
 * 
 * Estrutura de rotas:
 * - / → Redireciona para /login
 * - /login → Página de autenticação
 * - /cadastro → Página de registro
 * - /tarefas → Página principal (protegida por autenticação)
 */
function App() {
  return (
    // BrowserRouter habilita navegação SPA (Single Page Application)
    <Router>
      {/* Container de todas as rotas da aplicação */}
      <Routes>
        {/* Rota pública: Página de login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota pública: Página de cadastro */}
        <Route path="/cadastro" element={<Cadastro />} />
        
        {/* Rota protegida: Página principal de tarefas */}
        {/* RotaPrivada verifica autenticação antes de permitir acesso */}
        <Route 
          path="/tarefas" 
          element={
            <RotaPrivada>
              <PainelTarefas />
            </RotaPrivada>
          } 
        />
        
        {/* Rota padrão: Redireciona para login */}
        {/* Qualquer URL não reconhecida vai para /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App