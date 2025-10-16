import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';
import { CadastroUsuarioDto } from '../auth/dto/cadastro-usuario.dto';
import { HashUtil } from '../utils/hash.util';

/**
 * Serviço responsável por gerenciar usuários no sistema
 * 
 * Funcionalidades:
 * - Criar novos usuários com validação de email único
 * - Buscar usuários por email ou ID
 * - Validar senhas usando bcrypt
 * - Criptografar senhas antes de salvar no banco
 */
@Injectable()
export class UsuariosService {
  constructor(
    // Injeta o modelo do MongoDB para a coleção 'usuarios'
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
  ) {}

  /**
   * Cria um novo usuário no sistema
   * 
   * Fluxo:
   * 1. Verifica se o email já existe (regra de negócio: email único)
   * 2. Criptografa a senha usando bcrypt
   * 3. Salva o usuário no MongoDB
   * 
   * @param dadosUsuario - Dados do usuário (nome, email, senha)
   * @returns Promise<Usuario> - Usuário criado
   * @throws ConflictException - Se email já estiver em uso
   */
  async criarUsuario(dadosUsuario: CadastroUsuarioDto): Promise<Usuario> {
    // Verifica se já existe um usuário com este email
    const usuarioExistente = await this.buscarPorEmail(dadosUsuario.email);
    if (usuarioExistente) {
      throw new ConflictException('Email já está em uso');
    }

    // Criptografa a senha usando bcrypt com salt
    const senhaHash = await HashUtil.gerarHash(dadosUsuario.senha);
    
    // Cria uma nova instância do modelo Usuario
    const novoUsuario = new this.usuarioModel({
      nome: dadosUsuario.nome,
      email: dadosUsuario.email,
      senha_hash: senhaHash, // Salva a senha criptografada
    });

    // Salva no MongoDB e retorna o usuário criado
    return novoUsuario.save();
  }

  /**
   * Busca um usuário pelo email
   * 
   * @param email - Email do usuário
   * @returns Promise<Usuario | null> - Usuário encontrado ou null
   */
  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ email }).exec();
  }

  /**
   * Busca um usuário pelo ID
   * 
   * @param id - ID do usuário (ObjectId do MongoDB)
   * @returns Promise<Usuario> - Usuário encontrado
   * @throws NotFoundException - Se usuário não existir
   */
  async buscarPorId(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return usuario;
  }

  /**
   * Valida se uma senha corresponde ao hash armazenado
   * 
   * Usado no processo de login para verificar credenciais
   * 
   * @param senha - Senha em texto plano
   * @param senhaHash - Hash da senha armazenado no banco
   * @returns Promise<boolean> - true se a senha estiver correta
   */
  async validarSenha(senha: string, senhaHash: string): Promise<boolean> {
    // Validação de segurança: verifica se os argumentos não são nulos
    if (!senha || !senhaHash) {
      return false;
    }
    // Usa bcrypt para comparar a senha com o hash
    return HashUtil.compararHash(senha, senhaHash);
  }
}