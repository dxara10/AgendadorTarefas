import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tarefa, TarefaDocument } from './schemas/tarefa.schema';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';
import { AtualizarTarefaDto } from './dto/atualizar-tarefa.dto';

/**
 * Serviço responsável pelo gerenciamento de tarefas
 * 
 * Funcionalidades:
 * - CRUD completo de tarefas (Create, Read, Update, Delete)
 * - Controle de propriedade (usuário só acessa suas próprias tarefas)
 * - Lógica de negócio para data de conclusão
 * - Estatísticas por status das tarefas
 * - Ordenação por data de criação
 */
@Injectable()
export class TarefasService {
  constructor(
    // Injeta o modelo do MongoDB para a coleção 'tarefas'
    @InjectModel(Tarefa.name) private tarefaModel: Model<TarefaDocument>,
  ) {}

  /**
   * Cria uma nova tarefa para o usuário
   * 
   * @param dadosTarefa - Dados da tarefa (título, descrição, status)
   * @param usuarioId - ID do usuário proprietário da tarefa
   * @returns Promise<Tarefa> - Tarefa criada
   */
  async criarTarefa(dadosTarefa: CriarTarefaDto, usuarioId: string): Promise<Tarefa> {
    // Cria nova instância da tarefa associando ao usuário
    const novaTarefa = new this.tarefaModel({
      ...dadosTarefa, // Espalha os dados da tarefa (título, descrição, status)
      usuario_id: usuarioId, // Associa a tarefa ao usuário autenticado
    });

    // Salva no MongoDB (data_criacao é definida automaticamente pelo schema)
    return novaTarefa.save();
  }

  /**
   * Lista todas as tarefas de um usuário
   * 
   * @param usuarioId - ID do usuário
   * @returns Promise<Tarefa[]> - Lista de tarefas ordenadas por data de criação (mais recente primeiro)
   */
  async listarTarefas(usuarioId: string): Promise<Tarefa[]> {
    return this.tarefaModel
      .find({ usuario_id: usuarioId }) // Filtra apenas tarefas do usuário
      .sort({ data_criacao: -1 }) // Ordena por data decrescente (-1 = mais recente primeiro)
      .exec();
  }

  /**
   * Busca uma tarefa específica por ID com validação de propriedade
   * 
   * Segurança: Verifica se a tarefa pertence ao usuário antes de retornar
   * 
   * @param id - ID da tarefa
   * @param usuarioId - ID do usuário solicitante
   * @returns Promise<Tarefa> - Tarefa encontrada
   * @throws NotFoundException - Se tarefa não existir
   * @throws ForbiddenException - Se tarefa não pertencer ao usuário
   */
  async buscarTarefaPorId(id: string, usuarioId: string): Promise<Tarefa> {
    // Busca a tarefa pelo ID
    const tarefa = await this.tarefaModel.findById(id).exec();
    
    // Primeira validação: tarefa existe?
    if (!tarefa) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    // Segunda validação: tarefa pertence ao usuário? (Segurança)
    if (tarefa.usuario_id.toString() !== usuarioId) {
      throw new ForbiddenException('Acesso negado a esta tarefa');
    }

    return tarefa;
  }

  /**
   * Atualiza uma tarefa existente
   * 
   * Lógica de negócio:
   * - Se status muda para 'concluida': define data_conclusao automaticamente
   * - Se status muda para outro valor: remove data_conclusao
   * 
   * @param id - ID da tarefa
   * @param dadosAtualizacao - Dados para atualizar
   * @param usuarioId - ID do usuário (para validação de propriedade)
   * @returns Promise<Tarefa> - Tarefa atualizada
   */
  async atualizarTarefa(
    id: string,
    dadosAtualizacao: AtualizarTarefaDto,
    usuarioId: string,
  ): Promise<Tarefa> {
    // Valida se tarefa existe e pertence ao usuário
    await this.buscarTarefaPorId(id, usuarioId);

    // Lógica de negócio: gerenciamento automático da data_conclusao
    
    // Se status mudou para 'concluida' e não foi fornecida data_conclusao
    if (dadosAtualizacao.status === 'concluida' && !dadosAtualizacao.data_conclusao) {
      dadosAtualizacao.data_conclusao = new Date().toISOString();
    }

    // Se status mudou para algo diferente de 'concluida', limpa data_conclusao
    if (dadosAtualizacao.status && dadosAtualizacao.status !== 'concluida') {
      dadosAtualizacao.data_conclusao = undefined;
    }

    // Atualiza no MongoDB e retorna a versão atualizada
    const tarefaAtualizada = await this.tarefaModel
      .findByIdAndUpdate(id, dadosAtualizacao, { new: true }) // new: true retorna documento atualizado
      .exec();

    return tarefaAtualizada!; // ! indica que sabemos que não será null (já validamos antes)
  }

  /**
   * Exclui uma tarefa
   * 
   * @param id - ID da tarefa
   * @param usuarioId - ID do usuário (para validação de propriedade)
   * @returns Promise<void>
   */
  async excluirTarefa(id: string, usuarioId: string): Promise<void> {
    // Valida se tarefa existe e pertence ao usuário
    await this.buscarTarefaPorId(id, usuarioId);
    
    // Remove do MongoDB
    await this.tarefaModel.findByIdAndDelete(id).exec();
  }

  /**
   * Gera estatísticas das tarefas do usuário
   * 
   * Calcula:
   * - Total de tarefas
   * - Quantidade por status (pendente, em_andamento, concluida)
   * 
   * @param usuarioId - ID do usuário
   * @returns Objeto com estatísticas
   */
  async obterEstatisticas(usuarioId: string) {
    // Busca todas as tarefas do usuário
    const tarefas = await this.listarTarefas(usuarioId);
    
    // Calcula estatísticas usando filter para contar por status
    const estatisticas = {
      total: tarefas.length,
      pendente: tarefas.filter(t => t.status === 'pendente').length,
      em_andamento: tarefas.filter(t => t.status === 'em_andamento').length,
      concluida: tarefas.filter(t => t.status === 'concluida').length,
    };

    return estatisticas;
  }
}