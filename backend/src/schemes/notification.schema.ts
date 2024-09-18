import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({ required: true, unique: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: [mongoose.Schema.Types.ObjectId], ref: 'Item' })
  createdFor: User[];

  @Prop({ required: true, ref: 'User' })
  message: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
