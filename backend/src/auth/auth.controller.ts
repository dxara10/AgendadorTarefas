import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CadastroUsuarioDto } from './dto/cadastro-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';

/**
 * Controller responsável pelos endpoints de autenticação
 * 
 * Rotas públicas (não protegidas por JWT):
 * - POST /auth/cadastro - Cadastro de novos usuários
 * - POST /auth/login - Login de usuários existentes
 * 
 * Ambas as rotas retornam token JWT para autenticação nas rotas protegidas
 */
@ApiTags('Autenticação') // Agrupa endpoints no Swagger
@Controller('auth') // Define prefixo da rota: /auth
export class AuthController {
  constructor(
    // Injeta o serviço de autenticação
    private readonly authService: AuthService
  ) {}

  /**
   * Endpoint para cadastro de novos usuários
   * 
   * Rota: POST /auth/cadastro
   * Acesso: Público (não requer autenticação)
   * 
   * @param dadosUsuario - Dados validados pelo DTO (nome, email, senha)
   * @returns Objeto com token JWT e dados do usuário
   */
  @Post('cadastro')
  // Documentação Swagger
  @ApiOperation({ summary: 'Cadastrar novo usuário' })
  @ApiBody({ type: CadastroUsuarioDto })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async cadastrar(@Body() dadosUsuario: CadastroUsuarioDto) {
    // Delega a lógica para o AuthService
    // O DTO já validou os dados automaticamente
    return this.authService.cadastrarUsuario(dadosUsuario);
  }

  /**
   * Endpoint para login de usuários existentes
   * 
   * Rota: POST /auth/login
   * Acesso: Público (não requer autenticação)
   * 
   * @param dadosLogin - Credenciais validadas pelo DTO (email, senha)
   * @returns Objeto com token JWT e dados do usuário
   */
  @Post('login')
  @HttpCode(HttpStatus.OK) // Força status 200 (POST normalmente retorna 201)
  // Documentação Swagger
  @ApiOperation({ summary: 'Fazer login' })
  @ApiBody({ type: LoginUsuarioDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async login(@Body() dadosLogin: LoginUsuarioDto) {
    // Delega a lógica para o AuthService
    // O DTO já validou os dados automaticamente
    return this.authService.autenticarUsuario(dadosLogin);
  }
}