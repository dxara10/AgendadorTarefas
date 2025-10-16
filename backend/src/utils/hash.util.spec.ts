import { HashUtil } from './hash.util';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('HashUtil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('gerarHash', () => {
    it('deve gerar hash da senha com salt correto', async () => {
      const senha = 'senha123';
      const hashEsperado = '$2b$10$hashedpassword';
      
      mockedBcrypt.hash.mockResolvedValue(hashEsperado as never);
      
      const resultado = await HashUtil.gerarHash(senha);
      
      expect(bcrypt.hash).toHaveBeenCalledWith(senha, 10);
      expect(resultado).toBe(hashEsperado);
    });

    it('deve usar BCRYPT_ROUNDS do ambiente se definido', async () => {
      process.env.BCRYPT_ROUNDS = '12';
      const senha = 'senha123';
      
      mockedBcrypt.hash.mockResolvedValue('hash' as never);
      
      await HashUtil.gerarHash(senha);
      
      expect(bcrypt.hash).toHaveBeenCalledWith(senha, 12);
      
      delete process.env.BCRYPT_ROUNDS;
    });
  });

  describe('compararHash', () => {
    it('deve retornar true quando senha e hash coincidem', async () => {
      const senha = 'senha123';
      const hash = '$2b$10$hashedpassword';
      
      mockedBcrypt.compare.mockResolvedValue(true as never);
      
      const resultado = await HashUtil.compararHash(senha, hash);
      
      expect(bcrypt.compare).toHaveBeenCalledWith(senha, hash);
      expect(resultado).toBe(true);
    });

    it('deve retornar false quando senha e hash não coincidem', async () => {
      const senha = 'senha123';
      const hash = '$2b$10$hashedpassword';
      
      mockedBcrypt.compare.mockResolvedValue(false as never);
      
      const resultado = await HashUtil.compararHash(senha, hash);
      
      expect(resultado).toBe(false);
    });

    it('deve retornar false quando senha é null/undefined', async () => {
      const hash = '$2b$10$hashedpassword';
      
      let resultado = await HashUtil.compararHash(null as any, hash);
      expect(resultado).toBe(false);
      
      resultado = await HashUtil.compararHash(undefined as any, hash);
      expect(resultado).toBe(false);
      
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('deve retornar false quando hash é null/undefined', async () => {
      const senha = 'senha123';
      
      let resultado = await HashUtil.compararHash(senha, null as any);
      expect(resultado).toBe(false);
      
      resultado = await HashUtil.compararHash(senha, undefined as any);
      expect(resultado).toBe(false);
      
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });
});