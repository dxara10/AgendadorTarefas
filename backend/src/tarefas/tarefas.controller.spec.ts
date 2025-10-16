import { Test, TestingModule } from '@nestjs/testing';
import { TarefasController } from './tarefas.controller';
import { TarefasService } from './tarefas.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';
import { AtualizarTarefaDto } from './dto/atualizar-tarefa.dto';

describe('TarefasController', () => {
  let controller: TarefasController;
  let tarefasService: jest.Mocked<TarefasService>;

  const mockTarefasService = {
    criarTarefa: jest.fn(),
    listarTarefas: jest.fn(),
    obterEstatisticas: jest.fn(),
    buscarTarefaPorId: jest.fn(),
    atualizarTarefa: jest.fn(),
    excluirTarefa: jest.fn(),
  };

  const mockRequest = {
    user: {
      sub: '507f1f77bcf86cd799439011',
      email: 'teste@test.com',
      nome: 'Teste User',
    },
  };

  const mockTarefa = {
    _id: '507f1f77bcf86cd799439013',
    titulo: 'Teste Tarefa',
    descricao: 'Descrição teste',
    status: 'pendente',
    usuario_id: '507f1f77bcf86cd799439011',
    data_criacao: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TarefasController],
      providers: [
        {
          provide: TarefasService,
          useValue: mockTarefasService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TarefasController>(TarefasController);
    tarefasService = module.get(TarefasService);
  });

  describe('criar', () => {
    it('deve criar tarefa com sucesso', async () => {
      const dadosTarefa: CriarTarefaDto = {
        titulo: 'Nova Tarefa',
        descricao: 'Descrição nova',
        status: 'pendente',
      };

      tarefasService.criarTarefa.mockResolvedValue(mockTarefa as any);

      const resultado = await controller.criar(dadosTarefa, mockRequest);

      expect(tarefasService.criarTarefa).toHaveBeenCalledWith(
        dadosTarefa,
        mockRequest.user.sub,
      );
      expect(resultado).toBe(mockTarefa);
    });
  });

  describe('listar', () => {
    it('deve listar tarefas do usuário', async () => {
      const tarefas = [mockTarefa];
      tarefasService.listarTarefas.mockResolvedValue(tarefas as any);

      const resultado = await controller.listar(mockRequest);

      expect(tarefasService.listarTarefas).toHaveBeenCalledWith(mockRequest.user.sub);
      expect(resultado).toBe(tarefas);
    });
  });

  describe('obterEstatisticas', () => {
    it('deve retornar estatísticas do usuário', async () => {
      const estatisticas = {
        total: 5,
        pendente: 2,
        em_andamento: 1,
        concluida: 2,
      };

      tarefasService.obterEstatisticas.mockResolvedValue(estatisticas);

      const resultado = await controller.obterEstatisticas(mockRequest);

      expect(tarefasService.obterEstatisticas).toHaveBeenCalledWith(mockRequest.user.sub);
      expect(resultado).toBe(estatisticas);
    });
  });

  describe('buscarPorId', () => {
    it('deve buscar tarefa por ID', async () => {
      const tarefaId = '507f1f77bcf86cd799439013';
      tarefasService.buscarTarefaPorId.mockResolvedValue(mockTarefa as any);

      const resultado = await controller.buscarPorId(tarefaId, mockRequest);

      expect(tarefasService.buscarTarefaPorId).toHaveBeenCalledWith(
        tarefaId,
        mockRequest.user.sub,
      );
      expect(resultado).toBe(mockTarefa);
    });
  });

  describe('atualizar', () => {
    it('deve atualizar tarefa com sucesso', async () => {
      const tarefaId = '507f1f77bcf86cd799439013';
      const dadosAtualizacao: AtualizarTarefaDto = {
        titulo: 'Tarefa Atualizada',
        status: 'em_andamento',
      };

      const tarefaAtualizada = { ...mockTarefa, ...dadosAtualizacao };
      tarefasService.atualizarTarefa.mockResolvedValue(tarefaAtualizada as any);

      const resultado = await controller.atualizar(
        tarefaId,
        dadosAtualizacao,
        mockRequest,
      );

      expect(tarefasService.atualizarTarefa).toHaveBeenCalledWith(
        tarefaId,
        dadosAtualizacao,
        mockRequest.user.sub,
      );
      expect(resultado).toBe(tarefaAtualizada);
    });
  });

  describe('excluir', () => {
    it('deve excluir tarefa com sucesso', async () => {
      const tarefaId = '507f1f77bcf86cd799439013';
      tarefasService.excluirTarefa.mockResolvedValue(undefined);

      await controller.excluir(tarefaId, mockRequest);

      expect(tarefasService.excluirTarefa).toHaveBeenCalledWith(
        tarefaId,
        mockRequest.user.sub,
      );
    });
  });
});