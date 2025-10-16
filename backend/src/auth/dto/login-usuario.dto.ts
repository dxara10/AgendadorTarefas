import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUsuarioDto {
  @ApiProperty({ example: 'douglas@adv.com', description: 'Email do usuário' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ter formato válido' })
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  senha: string;
}