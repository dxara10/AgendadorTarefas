import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';

describe('AuthService', () => {
  let service: AuthService;
  let usuariosService: jest.Mocked<UsuariosService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUsuario = {
    _id: '507f1f77bcf86cd799439011',
    nome: 'Teste User',
    email: 'teste@test.com',
    senha_hash: '$2b$10$hashedpassword',
  };

  beforeEach(async () => {
    const mockUsuariosService = {
      criarUsuario: jest.fn(),
      buscarPorEmail: jest.fn(),
      validarSenha: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuariosService,
          useValue: mockUsuariosService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usuariosService = module.get(UsuariosService);
    jwtService = module.get(JwtService);
  });

  describe('cadastrarUsuario', () => {
    const dadosUsuario = {
      nome: 'Novo User',
      email: 'novo@test.com',
      senha: 'senha123',
    };

    it('deve cadastrar usuário e retornar token', async () => {
      const tokenEsperado = 'jwt.token.here';
      
      usuariosService.criarUsuario.mockResolvedValue(mockUsuario as any);
      jwtService.sign.mockReturnValue(tokenEsperado);

      const resultado = await service.cadastrarUsuario(dadosUsuario);

      expect(usuariosService.criarUsuario).toHaveBeenCalledWith(dadosUsuario);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUsuario._id,
        email: mockUsuario.email,
        nome: mockUsuario.nome,
      });
      expect(resultado).toEqual({
        token: tokenEsperado,
        usuario: {
          id: mockUsuario._id,
          nome: mockUsuario.nome,
          email: mockUsuario.email,
        },
      });
    });

    it('deve propagar erro do UsuariosService', async () => {
      const erro = new Error('Email já existe');
      usuariosService.criarUsuario.mockRejectedValue(erro);

      await expect(service.cadastrarUsuario(dadosUsuario)).rejects.toThrow(erro);
    });
  });

  describe('autenticarUsuario', () => {
    const dadosLogin = {
      email: 'teste@test.com',
      senha: 'senha123',
    };

    it('deve autenticar usuário e retornar token', async () => {
      const tokenEsperado = 'jwt.token.here';
      
      usuariosService.buscarPorEmail.mockResolvedValue(mockUsuario as any);
      usuariosService.validarSenha.mockResolvedValue(true);
      jwtService.sign.mockReturnValue(tokenEsperado);

      const resultado = await service.autenticarUsuario(dadosLogin);

      expect(usuariosService.buscarPorEmail).toHaveBeenCalledWith(dadosLogin.email);
      expect(usuariosService.validarSenha).toHaveBeenCalledWith(
        dadosLogin.senha,
        mockUsuario.senha_hash,
      );
      expect(resultado).toEqual({
        token: tokenEsperado,
        usuario: {
          id: mockUsuario._id,
          nome: mockUsuario.nome,
          email: mockUsuario.email,
        },
      });
    });

    it('deve lançar UnauthorizedException quando usuário não existe', async () => {
      usuariosService.buscarPorEmail.mockResolvedValue(null);

      await expect(service.autenticarUsuario(dadosLogin)).rejects.toThrow(
        new UnauthorizedException('Credenciais inválidas'),
      );

      expect(usuariosService.validarSenha).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException quando senha é inválida', async () => {
      usuariosService.buscarPorEmail.mockResolvedValue(mockUsuario as any);
      usuariosService.validarSenha.mockResolvedValue(false);

      await expect(service.autenticarUsuario(dadosLogin)).rejects.toThrow(
        new UnauthorizedException('Credenciais inválidas'),
      );
    });
  });

  describe('gerarToken (método privado)', () => {
    it('deve gerar token com payload correto', async () => {
      const tokenEsperado = 'jwt.token.here';
      jwtService.sign.mockReturnValue(tokenEsperado);

      // Testando através do método público que usa o privado
      usuariosService.criarUsuario.mockResolvedValue(mockUsuario as any);
      
      await service.cadastrarUsuario({
        nome: 'Test',
        email: 'test@test.com',
        senha: 'senha123',
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUsuario._id,
        email: mockUsuario.email,
        nome: mockUsuario.nome,
      });
    });
  });
});