import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TarefaDocument = Tarefa & Document;

@Schema({ 
  timestamps: { 
    createdAt: 'data_criacao',
    updatedAt: 'atualizado_em'
  } 
})
export class Tarefa {
  @Prop({ required: true })
  titulo: string;

  @Prop()
  descricao?: string;

  @Prop({ 
    enum: ['pendente', 'em_andamento', 'concluida'], 
    default: 'pendente' 
  })
  status: string;

  @Prop()
  data_conclusao?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario_id: Types.ObjectId;

  data_criacao?: Date;
  atualizado_em?: Date;
}

export const TarefaSchema = SchemaFactory.createForClass(Tarefa);