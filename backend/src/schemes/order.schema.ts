import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  //@Prop({ required: true, unique: true })
  //_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, ref: 'Item' })
  itemId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  dateOrdered: Date;

  @Prop({ required: true })
  status: 'failed' | 'complete' | 'pending';

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  isArchived: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
