import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({ required: true, unique: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, ref: 'User' })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true, ref: 'User' })
  updatedBy: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  isArchived: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
