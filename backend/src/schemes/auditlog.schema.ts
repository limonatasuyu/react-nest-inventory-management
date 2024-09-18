import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema()
export class AuditLog {
  @Prop({ required: true, unique: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, ref: 'Item' })
  itemId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  action: 'add' | 'remove' | 'update';

  @Prop({ required: true })
  quantityChanged: number;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
