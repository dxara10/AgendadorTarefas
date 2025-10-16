import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { TarefasService } from './tarefas.service';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';
import { AtualizarTarefaDto } from './dto/atualizar-tarefa.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

/**
 * Controller responsável pelos endpoints de gerenciamento de tarefas
 * 
 * Todas as rotas são protegidas por JWT (usuário deve estar autenticado)
 * 
 * Funcionalidades:
 * - CRUD completo de tarefas
 * - Listagem com ordenação
 * - Estatísticas por status
 * - Controle de propriedade (usuário só acessa suas tarefas)
 */
@ApiTags('Tarefas') // Agrupa endpoints no Swagger
@ApiBearerAuth('JWT-auth') // Indica que precisa de token JWT no Swagger
@Controller('tarefas') // Define prefixo da rota: /tarefas
@UseGuards(JwtAuthGuard) // Protege TODAS as rotas deste controller com JWT
export class TarefasController {
  constructor(
    // Injeta o serviço de tarefas
    private readonly tarefasService: TarefasService
  ) {}

  /**
   * Cria uma nova tarefa para o usuário autenticado
   * 
   * Rota: POST /tarefas
   * 
   * @param dadosTarefa - Dados da tarefa validados pelo DTO
   * @param req - Objeto da requisição (contém dados do usuário do JWT)
   * @returns Tarefa criada
   */
  @Post()
  @ApiOperation({ summary: 'Criar nova tarefa' })
  @ApiBody({ type: CriarTarefaDto })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async criar(@Body() dadosTarefa: CriarTarefaDto, @Request() req) {
    // req.user.sub contém o ID do usuário extraído do token JWT
    return this.tarefasService.criarTarefa(dadosTarefa, req.user.sub);
  }

  /**
   * Lista todas as tarefas do usuário autenticado
   * 
   * Rota: GET /tarefas
   * Ordenação: Por data de criação (mais recente primeiro)
   * 
   * @param req - Objeto da requisição (contém dados do usuário do JWT)
   * @returns Array de tarefas do usuário
   */
  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de tarefas retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async listar(@Request() req) {
    return this.tarefasService.listarTarefas(req.user.sub);
  }

  /**
   * Obtém estatísticas das tarefas do usuário
   * 
   * Rota: GET /tarefas/estatisticas
   * 
   * IMPORTANTE: Esta rota deve vir ANTES de /tarefas/:id
   * para evitar que 'estatisticas' seja interpretado como um ID
   * 
   * @param req - Objeto da requisição
   * @returns Objeto com contadores por status
   */
  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas das tarefas' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async obterEstatisticas(@Request() req) {
    return this.tarefasService.obterEstatisticas(req.user.sub);
  }

  /**
   * Busca uma tarefa específica por ID
   * 
   * Rota: GET /tarefas/:id
   * Segurança: Verifica se a tarefa pertence ao usuário
   * 
   * @param id - ID da tarefa (parâmetro da URL)
   * @param req - Objeto da requisição
   * @returns Tarefa encontrada
   */
  @Get(':id')
  @ApiOperation({ summary: 'Buscar tarefa por ID' })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa encontrada' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async buscarPorId(@Param('id') id: string, @Request() req) {
    return this.tarefasService.buscarTarefaPorId(id, req.user.sub);
  }

  /**
   * Atualiza uma tarefa existente
   * 
   * Rota: PUT /tarefas/:id
   * Lógica: Gerencia automaticamente data_conclusao baseado no status
   * 
   * @param id - ID da tarefa
   * @param dadosAtualizacao - Dados para atualizar (validados pelo DTO)
   * @param req - Objeto da requisição
   * @returns Tarefa atualizada
   */
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar tarefa' })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiBody({ type: AtualizarTarefaDto })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async atualizar(
    @Param('id') id: string,
    @Body() dadosAtualizacao: AtualizarTarefaDto,
    @Request() req,
  ) {
    return this.tarefasService.atualizarTarefa(id, dadosAtualizacao, req.user.sub);
  }

  /**
   * Exclui uma tarefa
   * 
   * Rota: DELETE /tarefas/:id
   * Status: 204 No Content (padrão para DELETE bem-sucedido)
   * 
   * @param id - ID da tarefa
   * @param req - Objeto da requisição
   * @returns void (status 204)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Força status 204 em vez de 200
  @ApiOperation({ summary: 'Excluir tarefa' })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiResponse({ status: 204, description: 'Tarefa excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async excluir(@Param('id') id: string, @Request() req) {
    await this.tarefasService.excluirTarefa(id, req.user.sub);
    // Não retorna nada (void) - status 204
  }
}