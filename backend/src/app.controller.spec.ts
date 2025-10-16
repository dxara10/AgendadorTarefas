import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('deve retornar mensagem de boas-vindas', () => {
      const mensagemEsperada = 'Hello World!';
      jest.spyOn(appService, 'getHello').mockReturnValue(mensagemEsperada);

      const resultado = appController.getHello();

      expect(appService.getHello).toHaveBeenCalled();
      expect(resultado).toBe(mensagemEsperada);
    });
  });

  describe('verificarSaude', () => {
    it('deve retornar status de saúde da API', () => {
      const resultado = appController.verificarSaude();

      expect(resultado).toHaveProperty('status', 'ok');
      expect(resultado).toHaveProperty('timestamp');
      expect(resultado).toHaveProperty('service', 'Gerenciador de Tarefas API');
      expect(typeof resultado.timestamp).toBe('string');
    });

    it('deve retornar timestamp no formato ISO', () => {
      const resultado = appController.verificarSaude();
      const timestamp = new Date(resultado.timestamp);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.toISOString()).toBe(resultado.timestamp);
    });
  });
});
