import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TarefasService } from './tarefas.service';
import { Tarefa } from './schemas/tarefa.schema';

describe('TarefasService', () => {
  let service: TarefasService;
  let mockTarefaModel: any;

  const usuarioId = '507f1f77bcf86cd799439011';
  const outroUsuarioId = '507f1f77bcf86cd799439012';
  
  const mockTarefa = {
    _id: '507f1f77bcf86cd799439013',
    titulo: 'Teste Tarefa',
    descricao: 'Descrição teste',
    status: 'pendente',
    usuario_id: usuarioId,
    data_criacao: new Date(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const MockTarefaModel = jest.fn().mockImplementation(() => mockTarefa);
    MockTarefaModel.find = jest.fn();
    MockTarefaModel.findById = jest.fn();
    MockTarefaModel.findByIdAndUpdate = jest.fn();
    MockTarefaModel.findByIdAndDelete = jest.fn();
    
    mockTarefaModel = MockTarefaModel;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TarefasService,
        {
          provide: getModelToken(Tarefa.name),
          useValue: mockTarefaModel,
        },
      ],
    }).compile();

    service = module.get<TarefasService>(TarefasService);
    jest.clearAllMocks();
  });

  describe('criarTarefa', () => {
    const dadosTarefa = {
      titulo: 'Nova Tarefa',
      descricao: 'Descrição nova',
      status: 'pendente',
    };

    it('deve criar tarefa com sucesso', async () => {
      mockTarefa.save.mockResolvedValue(mockTarefa);

      const resultado = await service.criarTarefa(dadosTarefa, usuarioId);

      expect(mockTarefa.save).toHaveBeenCalled();
      expect(resultado).toBe(mockTarefa);
    });
  });

  describe('listarTarefas', () => {
    it('deve retornar tarefas do usuário ordenadas por data', async () => {
      const tarefas = [mockTarefa];
      
      mockTarefaModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(tarefas),
        }),
      });

      const resultado = await service.listarTarefas(usuarioId);

      expect(mockTarefaModel.find).toHaveBeenCalledWith({ usuario_id: usuarioId });
      expect(resultado).toBe(tarefas);
    });
  });

  describe('buscarTarefaPorId', () => {
    it('deve retornar tarefa quando encontrada e usuário é o dono', async () => {
      mockTarefaModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockTarefa,
          usuario_id: { toString: () => usuarioId },
        }),
      });

      const resultado = await service.buscarTarefaPorId(mockTarefa._id, usuarioId);

      expect(mockTarefaModel.findById).toHaveBeenCalledWith(mockTarefa._id);
      expect(resultado.usuario_id.toString()).toBe(usuarioId);
    });

    it('deve lançar NotFoundException quando tarefa não existe', async () => {
      mockTarefaModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.buscarTarefaPorId('inexistente', usuarioId),
      ).rejects.toThrow(new NotFoundException('Tarefa não encontrada'));
    });

    it('deve lançar ForbiddenException quando usuário não é o dono', async () => {
      mockTarefaModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockTarefa,
          usuario_id: { toString: () => outroUsuarioId },
        }),
      });

      await expect(
        service.buscarTarefaPorId(mockTarefa._id, usuarioId),
      ).rejects.toThrow(new ForbiddenException('Acesso negado a esta tarefa'));
    });
  });

  describe('atualizarTarefa', () => {
    const dadosAtualizacao = {
      titulo: 'Tarefa Atualizada',
      status: 'em_andamento',
    };

    beforeEach(() => {
      // Mock do buscarTarefaPorId
      mockTarefaModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockTarefa,
          usuario_id: { toString: () => usuarioId },
        }),
      });
    });

    it('deve atualizar tarefa com sucesso', async () => {
      const tarefaAtualizada = { ...mockTarefa, ...dadosAtualizacao };
      
      mockTarefaModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(tarefaAtualizada),
      });

      const resultado = await service.atualizarTarefa(
        mockTarefa._id,
        dadosAtualizacao,
        usuarioId,
      );

      expect(mockTarefaModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTarefa._id,
        dadosAtualizacao,
        { new: true },
      );
      expect(resultado).toBe(tarefaAtualizada);
    });

    it('deve definir data_conclusao quando status muda para concluida', async () => {
      const dadosComConclusao = { status: 'concluida' };
      const tarefaAtualizada = { ...mockTarefa, status: 'concluida' };
      
      mockTarefaModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(tarefaAtualizada),
      });

      await service.atualizarTarefa(mockTarefa._id, dadosComConclusao, usuarioId);

      const chamada = mockTarefaModel.findByIdAndUpdate.mock.calls[0];
      expect(chamada[1]).toHaveProperty('data_conclusao');
      expect(chamada[1].data_conclusao).toBeDefined();
    });

    it('deve remover data_conclusao quando status não é concluida', async () => {
      const dadosSemConclusao = { status: 'pendente' };
      
      mockTarefaModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTarefa),
      });

      await service.atualizarTarefa(mockTarefa._id, dadosSemConclusao, usuarioId);

      const chamada = mockTarefaModel.findByIdAndUpdate.mock.calls[0];
      expect(chamada[1].data_conclusao).toBeUndefined();
    });
  });

  describe('excluirTarefa', () => {
    beforeEach(() => {
      // Mock do buscarTarefaPorId
      mockTarefaModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockTarefa,
          usuario_id: { toString: () => usuarioId },
        }),
      });
    });

    it('deve excluir tarefa com sucesso', async () => {
      mockTarefaModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTarefa),
      });

      await service.excluirTarefa(mockTarefa._id, usuarioId);

      expect(mockTarefaModel.findByIdAndDelete).toHaveBeenCalledWith(mockTarefa._id);
    });
  });

  describe('obterEstatisticas', () => {
    it('deve retornar estatísticas corretas', async () => {
      const tarefas = [
        { status: 'pendente' },
        { status: 'pendente' },
        { status: 'em_andamento' },
        { status: 'concluida' },
        { status: 'concluida' },
        { status: 'concluida' },
      ];

      mockTarefaModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(tarefas),
        }),
      });

      const resultado = await service.obterEstatisticas(usuarioId);

      expect(resultado).toEqual({
        total: 6,
        pendente: 2,
        em_andamento: 1,
        concluida: 3,
      });
    });

    it('deve retornar estatísticas zeradas quando não há tarefas', async () => {
      mockTarefaModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      });

      const resultado = await service.obterEstatisticas(usuarioId);

      expect(resultado).toEqual({
        total: 0,
        pendente: 0,
        em_andamento: 0,
        concluida: 0,
      });
    });
  });
});