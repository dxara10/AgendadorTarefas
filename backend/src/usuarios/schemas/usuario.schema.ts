import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema({ 
  timestamps: { 
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  } 
})
export class Usuario {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  senha_hash: string;

  criado_em?: Date;
  atualizado_em?: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);