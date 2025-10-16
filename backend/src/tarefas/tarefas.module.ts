import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TarefasController } from './tarefas.controller';
import { TarefasService } from './tarefas.service';
import { Tarefa, TarefaSchema } from './schemas/tarefa.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tarefa.name, schema: TarefaSchema }]),
    AuthModule,
  ],
  controllers: [TarefasController],
  providers: [TarefasService],
})
export class TarefasModule {}