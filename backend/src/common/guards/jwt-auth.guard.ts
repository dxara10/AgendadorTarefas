import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

/**
 * Guard responsável por proteger rotas com autenticação JWT
 * 
 * Funcionalidades:
 * - Extrai token JWT do header Authorization
 * - Valida se o token é válido e não expirou
 * - Adiciona dados do usuário ao objeto request
 * - Bloqueia acesso se token for inválido ou ausente
 * 
 * Uso: @UseGuards(JwtAuthGuard) nos controllers
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    // Injeta JwtService para validar tokens
    private jwtService: JwtService
  ) {
    super();
  }

  /**
   * Método principal do Guard - decide se permite acesso à rota
   * 
   * Fluxo:
   * 1. Extrai token do header Authorization
   * 2. Valida se token existe
   * 3. Verifica se token é válido (assinatura + expiração)
   * 4. Adiciona dados do usuário ao request
   * 
   * @param context - Contexto da requisição HTTP
   * @returns boolean - true se acesso permitido
   * @throws UnauthorizedException - Se token inválido ou ausente
   */
  canActivate(context: ExecutionContext) {
    // Obtém o objeto request da requisição HTTP
    const request = context.switchToHttp().getRequest();
    
    // Extrai o token JWT do header Authorization
    const token = this.extractTokenFromHeader(request);
    
    // Primeira validação: token foi fornecido?
    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      // Segunda validação: token é válido?
      // jwtService.verify lança exceção se token for inválido ou expirado
      const payload = this.jwtService.verify(token);
      
      // Adiciona dados do usuário ao request para uso nos controllers
      // Payload contém: { sub: userId, email, nome }
      request.user = payload;
      
      // Permite acesso à rota
      return true;
    } catch {
      // Token inválido, expirado ou malformado
      throw new UnauthorizedException('Token inválido');
    }
  }

  /**
   * Extrai o token JWT do header Authorization
   * 
   * Formato esperado: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * 
   * @param request - Objeto da requisição HTTP
   * @returns string | undefined - Token JWT ou undefined se não encontrado
   */
  private extractTokenFromHeader(request: any): string | undefined {
    // Divide o header Authorization em [tipo, token]
    // Exemplo: "Bearer abc123" -> ["Bearer", "abc123"]
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    
    // Retorna token apenas se o tipo for "Bearer"
    return type === 'Bearer' ? token : undefined;
  }
}