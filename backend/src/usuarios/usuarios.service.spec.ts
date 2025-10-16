import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './schemas/usuario.schema';
import { HashUtil } from '../utils/hash.util';

jest.mock('../utils/hash.util');

describe('UsuariosService', () => {
  let service: UsuariosService;
  let mockUsuarioModel: any;

  const mockUsuario = {
    _id: '507f1f77bcf86cd799439011',
    nome: 'Teste User',
    email: 'teste@test.com',
    senha_hash: '$2b$10$hashedpassword',
    save: jest.fn(),
  };

  beforeEach(async () => {
    const MockUsuarioModel = jest.fn().mockImplementation(() => mockUsuario);
    MockUsuarioModel.findOne = jest.fn();
    MockUsuarioModel.findById = jest.fn();
    
    mockUsuarioModel = MockUsuarioModel;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getModelToken(Usuario.name),
          useValue: mockUsuarioModel,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    jest.clearAllMocks();
  });

  describe('criarUsuario', () => {
    const dadosUsuario = {
      nome: 'Novo User',
      email: 'novo@test.com',
      senha: 'senha123',
    };

    it('deve criar usuário com sucesso', async () => {
      mockUsuarioModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      
      (HashUtil.gerarHash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword');
      mockUsuario.save.mockResolvedValue(mockUsuario);

      const resultado = await service.criarUsuario(dadosUsuario);

      expect(mockUsuarioModel.findOne).toHaveBeenCalledWith({ email: dadosUsuario.email });
      expect(HashUtil.gerarHash).toHaveBeenCalledWith(dadosUsuario.senha);
      expect(mockUsuario.save).toHaveBeenCalled();
      expect(resultado).toBe(mockUsuario);
    });

    it('deve lançar ConflictException se email já existe', async () => {
      mockUsuarioModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUsuario),
      });

      await expect(service.criarUsuario(dadosUsuario)).rejects.toThrow(
        new ConflictException('Email já está em uso'),
      );

      expect(HashUtil.gerarHash).not.toHaveBeenCalled();
    });
  });

  describe('buscarPorEmail', () => {
    it('deve retornar usuário quando encontrado', async () => {
      mockUsuarioModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUsuario),
      });

      const resultado = await service.buscarPorEmail('teste@test.com');

      expect(mockUsuarioModel.findOne).toHaveBeenCalledWith({ email: 'teste@test.com' });
      expect(resultado).toBe(mockUsuario);
    });

    it('deve retornar null quando usuário não encontrado', async () => {
      mockUsuarioModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const resultado = await service.buscarPorEmail('inexistente@test.com');

      expect(resultado).toBeNull();
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar usuário quando encontrado', async () => {
      mockUsuarioModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUsuario),
      });

      const resultado = await service.buscarPorId('507f1f77bcf86cd799439011');

      expect(mockUsuarioModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(resultado).toBe(mockUsuario);
    });

    it('deve lançar NotFoundException quando usuário não encontrado', async () => {
      mockUsuarioModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.buscarPorId('507f1f77bcf86cd799439011')).rejects.toThrow(
        new NotFoundException('Usuário não encontrado'),
      );
    });
  });

  describe('validarSenha', () => {
    it('deve retornar true quando senha é válida', async () => {
      (HashUtil.compararHash as jest.Mock).mockResolvedValue(true);

      const resultado = await service.validarSenha('senha123', '$2b$10$hashedpassword');

      expect(HashUtil.compararHash).toHaveBeenCalledWith('senha123', '$2b$10$hashedpassword');
      expect(resultado).toBe(true);
    });

    it('deve retornar false quando senha é inválida', async () => {
      (HashUtil.compararHash as jest.Mock).mockResolvedValue(false);

      const resultado = await service.validarSenha('senhaerrada', '$2b$10$hashedpassword');

      expect(resultado).toBe(false);
    });

    it('deve retornar false quando argumentos são null/undefined', async () => {
      let resultado = await service.validarSenha(null as any, '$2b$10$hashedpassword');
      expect(resultado).toBe(false);

      resultado = await service.validarSenha('senha123', null as any);
      expect(resultado).toBe(false);

      expect(HashUtil.compararHash).not.toHaveBeenCalled();
    });
  });
});