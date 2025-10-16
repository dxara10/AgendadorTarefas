import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Estatisticas } from '../servicos/api'

// ============================================================================
// DASHBOARD - Componente de visualização de estatísticas das tarefas
// ============================================================================

/**
 * Interface que define as propriedades do componente Dashboard
 */
interface DashboardProps {
  estatisticas: Estatisticas  // Dados estatísticos vindos da API
}

/**
 * Paleta de cores para os diferentes status das tarefas
 * Cores consistentes com o design system da aplicação
 */
const CORES = {
  pendente: '#3B82F6',      // Azul - tarefas não iniciadas
  em_andamento: '#F59E0B',  // Amarelo/Laranja - tarefas em progresso
  concluida: '#10B981'      // Verde - tarefas finalizadas
}

/**
 * Componente Dashboard que exibe estatísticas visuais das tarefas
 * 
 * Funcionalidades:
 * - Cards com números totais por status
 * - Gráfico de pizza mostrando distribuição
 * - Gráfico de barras com quantidades
 * - Cálculo de percentual de conclusão
 * - Layout responsivo (mobile/desktop)
 */
export default function Dashboard({ estatisticas }: DashboardProps) {
  /**
   * Dados formatados para o gráfico de pizza
   * Remove categorias com valor zero para melhor visualização
   */
  const dadosPizza = [
    { name: 'Pendente', value: estatisticas.pendente, color: CORES.pendente },
    { name: 'Em andamento', value: estatisticas.em_andamento, color: CORES.em_andamento },
    { name: 'Concluída', value: estatisticas.concluida, color: CORES.concluida }
  ].filter(item => item.value > 0)  // Remove itens com valor 0

  /**
   * Dados formatados para o gráfico de barras
   * Mantém todas as categorias para comparação visual
   */
  const dadosBarras = [
    { status: 'Pendente', quantidade: estatisticas.pendente },
    { status: 'Em andamento', quantidade: estatisticas.em_andamento },
    { status: 'Concluída', quantidade: estatisticas.concluida }
  ]

  /**
   * Calcula o percentual de conclusão das tarefas
   * Evita divisão por zero quando não há tarefas
   */
  const percentualConclusao = estatisticas.total > 0 
    ? Math.round((estatisticas.concluida / estatisticas.total) * 100)
    : 0

  return (
    // Container principal do dashboard com estilo de card
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      {/* Título do dashboard */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Dashboard</h3>
      
      {/* Grid de cards com estatísticas principais */}
      {/* Responsivo: 1 coluna no mobile, 4 colunas no desktop */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Card: Total de tarefas */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{estatisticas.total}</div>
          <div className="text-sm text-blue-800">Total de tarefas</div>
        </div>
        
        {/* Card: Tarefas pendentes */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{estatisticas.pendente}</div>
          <div className="text-sm text-yellow-800">Pendentes</div>
        </div>
        
        {/* Card: Tarefas em andamento */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{estatisticas.em_andamento}</div>
          <div className="text-sm text-orange-800">Em andamento</div>
        </div>
        
        {/* Card: Percentual de conclusão */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{percentualConclusao}%</div>
          <div className="text-sm text-green-800">Conclusão</div>
        </div>
      </div>

      {/* Seção de gráficos - só exibe se houver tarefas */}
      {estatisticas.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de Pizza - Distribuição por Status */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Distribuição por Status</h4>
            {/* Container responsivo para o gráfico */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dadosPizza}           // Dados filtrados (sem zeros)
                  cx="50%"                    // Centro horizontal
                  cy="50%"                    // Centro vertical
                  outerRadius={80}            // Tamanho do gráfico
                  dataKey="value"             // Campo com os valores
                  label={({ name, value }) => `${name}: ${value}`}  // Labels personalizados
                >
                  {/* Aplica cores personalizadas para cada fatia */}
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />  {/* Tooltip ao passar o mouse */}
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras - Quantidade por Status */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Quantidade por Status</h4>
            {/* Container responsivo para o gráfico */}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dadosBarras}>
                <CartesianGrid strokeDasharray="3 3" />  {/* Grade de fundo */}
                <XAxis dataKey="status" />               {/* Eixo X com status */}
                <YAxis />                                {/* Eixo Y com quantidades */}
                <Tooltip />                              {/* Tooltip ao passar o mouse */}
                <Bar dataKey="quantidade" fill="#3B82F6" />  {/* Barras azuis */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}