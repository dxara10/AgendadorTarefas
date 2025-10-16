import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CadastroUsuarioDto {
  @ApiProperty({ example: 'Douglas Cortes', description: 'Nome completo do usuário' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  nome: string;

  @ApiProperty({ example: 'douglas@adv.com', description: 'Email do usuário' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ter formato válido' })
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário (mínimo 6 caracteres)' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  senha: string;
}