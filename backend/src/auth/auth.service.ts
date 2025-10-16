import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CadastroUsuarioDto } from './dto/cadastro-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';

/**
 * Serviço responsável pela autenticação e autorização
 * 
 * Funcionalidades:
 * - Cadastro de novos usuários com geração automática de JWT
 * - Login com validação de credenciais
 * - Geração de tokens JWT para autenticação
 * - Integração com UsuariosService para operações de usuário
 */
@Injectable()
export class AuthService {
  constructor(
    // Injeta o serviço de usuários para operações CRUD
    private usuariosService: UsuariosService,
    // Injeta o serviço JWT do NestJS para gerar/validar tokens
    private jwtService: JwtService,
  ) {}

  /**
   * Cadastra um novo usuário e retorna token de autenticação
   * 
   * Fluxo:
   * 1. Delega a criação do usuário para UsuariosService
   * 2. Gera um token JWT para o usuário recém-criado
   * 3. Retorna token + dados básicos do usuário (sem senha)
   * 
   * @param dadosUsuario - Dados para cadastro (nome, email, senha)
   * @returns Objeto com token JWT e dados do usuário
   */
  async cadastrarUsuario(dadosUsuario: CadastroUsuarioDto) {
    // Cria o usuário usando o UsuariosService
    const usuario = await this.usuariosService.criarUsuario(dadosUsuario);
    
    // Gera token JWT para o usuário recém-criado
    const token = this.gerarToken(usuario);
    
    // Retorna resposta padronizada (token + dados seguros do usuário)
    return {
      token,
      usuario: {
        id: (usuario as any)._id, // Cast necessário devido ao tipo do Mongoose
        nome: usuario.nome,
        email: usuario.email,
        // Nota: senha_hash NÃO é retornada por segurança
      },
    };
  }

  /**
   * Autentica um usuário existente
   * 
   * Fluxo:
   * 1. Busca usuário pelo email
   * 2. Valida se a senha fornecida confere com o hash armazenado
   * 3. Gera novo token JWT
   * 4. Retorna token + dados do usuário
   * 
   * @param dadosLogin - Credenciais (email, senha)
   * @returns Objeto com token JWT e dados do usuário
   * @throws UnauthorizedException - Se credenciais forem inválidas
   */
  async autenticarUsuario(dadosLogin: LoginUsuarioDto) {
    // Busca usuário pelo email
    const usuario = await this.usuariosService.buscarPorEmail(dadosLogin.email);
    
    // Primeira validação: usuário existe?
    if (!usuario) {
      // Mensagem genérica por segurança (não revela se email existe)
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Segunda validação: senha está correta?
    const senhaValida = await this.usuariosService.validarSenha(
      dadosLogin.senha,
      usuario.senha_hash,
    );

    if (!senhaValida) {
      // Mesma mensagem genérica por segurança
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Se chegou até aqui, credenciais são válidas
    const token = this.gerarToken(usuario);
    
    return {
      token,
      usuario: {
        id: (usuario as any)._id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  }

  /**
   * Gera um token JWT para o usuário
   * 
   * O token contém:
   * - sub: ID do usuário (padrão JWT)
   * - email: Email do usuário
   * - nome: Nome do usuário
   * 
   * @param usuario - Dados do usuário
   * @returns String do token JWT assinado
   */
  private gerarToken(usuario: any): string {
    // Payload do JWT (informações que serão codificadas no token)
    const payload = {
      sub: (usuario as any)._id, // 'sub' é padrão JWT para identificar o usuário
      email: usuario.email,
      nome: usuario.nome,
    };
    
    // Assina o token com a chave secreta configurada no JWT_SECRET
    return this.jwtService.sign(payload);
  }
}