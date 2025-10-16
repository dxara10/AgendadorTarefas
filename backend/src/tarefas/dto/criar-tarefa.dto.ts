import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarTarefaDto {
  @ApiProperty({ example: 'Preparar petição inicial', description: 'Título da tarefa' })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  titulo: string;

  @ApiProperty({ 
    example: 'Revisar os autos e anexar documentos necessários', 
    description: 'Descrição detalhada da tarefa',
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  descricao?: string;

  @ApiProperty({ 
    example: 'pendente', 
    enum: ['pendente', 'em_andamento', 'concluida'],
    description: 'Status da tarefa',
    required: false,
    default: 'pendente'
  })
  @IsOptional()
  @IsIn(['pendente', 'em_andamento', 'concluida'], { 
    message: 'Status deve ser: pendente, em_andamento ou concluida' 
  })
  status?: string;
}