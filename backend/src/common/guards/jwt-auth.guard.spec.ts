import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: jest.Mocked<JwtService>;

  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get(JwtService);
  });

  const createMockExecutionContext = (authHeader?: string): ExecutionContext => {
    const mockRequest = {
      headers: {
        authorization: authHeader,
      },
      user: undefined,
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  };

  describe('canActivate', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('deve permitir acesso com token válido', () => {
      const token = 'valid.jwt.token';
      const payload = {
        sub: '507f1f77bcf86cd799439011',
        email: 'teste@test.com',
        nome: 'Teste User',
      };

      const context = createMockExecutionContext(`Bearer ${token}`);
      jwtService.verify.mockReturnValue(payload);

      const resultado = guard.canActivate(context);

      expect(jwtService.verify).toHaveBeenCalledWith(token);
      expect(resultado).toBe(true);
      
      const request = context.switchToHttp().getRequest();
      expect(request.user).toBe(payload);
    });

    it('deve lançar UnauthorizedException quando token não fornecido', () => {
      const context = createMockExecutionContext();

      expect(() => guard.canActivate(context)).toThrow(
        new UnauthorizedException('Token não fornecido'),
      );

      expect(jwtService.verify).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException quando header authorization está vazio', () => {
      const context = createMockExecutionContext('');

      expect(() => guard.canActivate(context)).toThrow(
        new UnauthorizedException('Token não fornecido'),
      );
    });

    it('deve lançar UnauthorizedException quando formato do token é inválido', () => {
      const context = createMockExecutionContext('InvalidFormat token');

      expect(() => guard.canActivate(context)).toThrow(
        new UnauthorizedException('Token não fornecido'),
      );
    });

    it('deve lançar UnauthorizedException quando token é inválido', () => {
      const token = 'invalid.jwt.token';
      const context = createMockExecutionContext(`Bearer ${token}`);
      
      jwtService.verify.mockImplementation(() => {
        throw new Error('Token inválido');
      });

      expect(() => guard.canActivate(context)).toThrow(
        new UnauthorizedException('Token inválido'),
      );

      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });

    it('deve lançar UnauthorizedException quando token expirou', () => {
      const token = 'expired.jwt.token';
      const context = createMockExecutionContext(`Bearer ${token}`);
      
      jwtService.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      expect(() => guard.canActivate(context)).toThrow(
        new UnauthorizedException('Token inválido'),
      );
    });
  });

  describe('extractTokenFromHeader', () => {
    it('deve extrair token do header Authorization corretamente', () => {
      const token = 'valid.jwt.token';
      const context = createMockExecutionContext(`Bearer ${token}`);
      
      jwtService.verify.mockReturnValue({ sub: 'user123' });

      guard.canActivate(context);

      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });

    it('deve retornar undefined para header sem Bearer', () => {
      const context = createMockExecutionContext('Basic token123');

      expect(() => guard.canActivate(context)).toThrow(
        new UnauthorizedException('Token não fornecido'),
      );
    });

    it('deve retornar undefined para header malformado', () => {
      const context = createMockExecutionContext('Bearer');

      expect(() => guard.canActivate(context)).toThrow(
        new UnauthorizedException('Token não fornecido'),
      );
    });
  });
});