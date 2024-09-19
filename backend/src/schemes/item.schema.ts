import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {
  //@Prop({ required: true, unique: true })
  //_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    ref: 'Category',
  })
  categoryId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, ref: 'Supplier' })
  supplierId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  isArchived: boolean;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
