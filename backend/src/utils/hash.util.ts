import * as bcrypt from 'bcrypt';

/**
 * Utilitário para criptografia de senhas usando bcrypt
 * 
 * O bcrypt é uma função de hash adaptativa que:
 * - Adiciona salt automaticamente (proteção contra rainbow tables)
 * - É lenta por design (proteção contra ataques de força bruta)
 * - Permite configurar o número de rounds (complexidade)
 */
export class HashUtil {
  /**
   * Gera um hash seguro da senha usando bcrypt
   * 
   * Processo:
   * 1. Lê o número de rounds da variável de ambiente (padrão: 10)
   * 2. Gera salt automaticamente
   * 3. Cria hash da senha + salt
   * 
   * @param senha - Senha em texto plano
   * @returns Promise<string> - Hash da senha (inclui salt)
   */
  static async gerarHash(senha: string): Promise<string> {
    // Lê configuração do .env ou usa padrão 10
    // Rounds mais altos = mais seguro, porém mais lento
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10');
    
    // bcrypt.hash gera salt + hash automaticamente
    return bcrypt.hash(senha, saltRounds);
  }

  /**
   * Compara uma senha em texto plano com um hash
   * 
   * Usado no processo de login para verificar se a senha está correta
   * 
   * @param senha - Senha em texto plano (fornecida pelo usuário)
   * @param hash - Hash armazenado no banco de dados
   * @returns Promise<boolean> - true se a senha conferir
   */
  static async compararHash(senha: string, hash: string): Promise<boolean> {
    // Validação de segurança: evita erro se argumentos forem nulos
    if (!senha || !hash) {
      return false;
    }
    
    // bcrypt.compare extrai o salt do hash e compara
    return bcrypt.compare(senha, hash);
  }
}