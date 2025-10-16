import { IsOptional, IsString, IsIn, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarTarefaDto {
  @ApiProperty({ example: 'Preparar petição inicial - Atualizada', description: 'Título da tarefa', required: false })
  @IsOptional()
  @IsString({ message: 'Título deve ser uma string' })
  titulo?: string;

  @ApiProperty({ 
    example: 'Descrição atualizada da tarefa', 
    description: 'Descrição detalhada da tarefa',
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  descricao?: string;

  @ApiProperty({ 
    example: 'em_andamento', 
    enum: ['pendente', 'em_andamento', 'concluida'],
    description: 'Status da tarefa',
    required: false
  })
  @IsOptional()
  @IsIn(['pendente', 'em_andamento', 'concluida'], { 
    message: 'Status deve ser: pendente, em_andamento ou concluida' 
  })
  status?: string;

  @ApiProperty({ 
    example: '2024-10-15T19:30:00.000Z', 
    description: 'Data de conclusão da tarefa',
    required: false 
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de conclusão deve ser uma data válida' })
  data_conclusao?: string;
}