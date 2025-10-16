import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CadastroUsuarioDto } from './dto/cadastro-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    cadastrarUsuario: jest.fn(),
    autenticarUsuario: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('cadastrar', () => {
    it('deve cadastrar usuário com sucesso', async () => {
      const dadosUsuario: CadastroUsuarioDto = {
        nome: 'Teste User',
        email: 'teste@test.com',
        senha: 'senha123',
      };

      const respostaEsperada = {
        token: 'jwt.token.here',
        usuario: {
          id: '507f1f77bcf86cd799439011',
          nome: 'Teste User',
          email: 'teste@test.com',
        },
      };

      authService.cadastrarUsuario.mockResolvedValue(respostaEsperada);

      const resultado = await controller.cadastrar(dadosUsuario);

      expect(authService.cadastrarUsuario).toHaveBeenCalledWith(dadosUsuario);
      expect(resultado).toBe(respostaEsperada);
    });

    it('deve propagar erro do AuthService', async () => {
      const dadosUsuario: CadastroUsuarioDto = {
        nome: 'Teste User',
        email: 'teste@test.com',
        senha: 'senha123',
      };

      const erro = new Error('Email já existe');
      authService.cadastrarUsuario.mockRejectedValue(erro);

      await expect(controller.cadastrar(dadosUsuario)).rejects.toThrow(erro);
    });
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const dadosLogin: LoginUsuarioDto = {
        email: 'teste@test.com',
        senha: 'senha123',
      };

      const respostaEsperada = {
        token: 'jwt.token.here',
        usuario: {
          id: '507f1f77bcf86cd799439011',
          nome: 'Teste User',
          email: 'teste@test.com',
        },
      };

      authService.autenticarUsuario.mockResolvedValue(respostaEsperada);

      const resultado = await controller.login(dadosLogin);

      expect(authService.autenticarUsuario).toHaveBeenCalledWith(dadosLogin);
      expect(resultado).toBe(respostaEsperada);
    });

    it('deve propagar erro do AuthService', async () => {
      const dadosLogin: LoginUsuarioDto = {
        email: 'teste@test.com',
        senha: 'senhaerrada',
      };

      const erro = new Error('Credenciais inválidas');
      authService.autenticarUsuario.mockRejectedValue(erro);

      await expect(controller.login(dadosLogin)).rejects.toThrow(erro);
    });
  });
});