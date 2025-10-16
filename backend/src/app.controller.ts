import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Sistema')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Mensagem de boas-vindas' })
  @ApiResponse({ status: 200, description: 'Mensagem retornada com sucesso' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('saude')
  @ApiOperation({ summary: 'Verificar saúde da API' })
  @ApiResponse({ status: 200, description: 'API funcionando corretamente' })
  verificarSaude() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Gerenciador de Tarefas API',
    };
  }
}
