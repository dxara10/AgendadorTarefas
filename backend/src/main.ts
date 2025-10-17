import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Função principal que inicializa a aplicação NestJS
 * 
 * Configurações aplicadas:
 * - Validação global de DTOs
 * - CORS para frontend
 * - Documentação Swagger
 * - Servidor HTTP na porta configurada
 */
async function bootstrap() {
  // Cria a instância da aplicação NestJS
  const app = await NestFactory.create(AppModule);
  
  /**
   * Configuração global de validação
   * 
   * - whitelist: Remove propriedades não definidas nos DTOs
   * - forbidNonWhitelisted: Lança erro se propriedades extras forem enviadas
   * - transform: Converte tipos automaticamente (string -> number, etc.)
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos não definidos no DTO
      forbidNonWhitelisted: true, // Rejeita requisições com campos extras
      transform: true, // Transforma tipos automaticamente
    }),
  );

  /**
   * Configuração CORS (Cross-Origin Resource Sharing)
   * 
   * Permite que o frontend acesse a API de diferentes ambientes
   * - localhost: Desenvolvimento local
   * - github.dev: GitHub Codespaces
   * - preview.app.github.dev: Codespaces preview
   */
  app.enableCors({
    origin: (origin, callback) => {
      // Permite localhost e qualquer subdomínio do GitHub
      if (!origin || 
          origin.includes('localhost') || 
          origin.includes('github.dev') || 
          origin.includes('codespaces') ||
          origin.includes('preview.app.github.dev')) {
        callback(null, true)
      } else {
        callback(new Error('Não permitido pelo CORS'))
      }
    },
    credentials: true, // Permite cookies e headers de autenticação
  });

  /**
   * Configuração do Swagger (Documentação da API)
   * 
   * Gera interface web interativa para testar endpoints
   * Disponível em: http://localhost:3000/api
   */
  const config = new DocumentBuilder()
    .setTitle('Gerenciador de Tarefas Jurídicas')
    .setDescription('API para gerenciamento de tarefas em escritórios de advocacia')
    .setVersion('1.0')
    // Configura autenticação JWT no Swagger
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Digite o token JWT',
        in: 'header',
      },
      'JWT-auth', // Nome usado nos controllers com @ApiBearerAuth
    )
    .build();

  // Gera a documentação baseada nos decorators dos controllers
  const document = SwaggerModule.createDocument(app, config);
  // Disponibiliza a interface Swagger na rota /api
  SwaggerModule.setup('api', app, document);

  // Inicia o servidor HTTP
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  // Logs informativos
  console.log(`🚀 API rodando na porta ${port}`);
  console.log(`📚 Swagger disponível em http://localhost:${port}/api`);
}

// Inicia a aplicação
bootstrap();
