import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDTO } from 'src/dto/user.dto';
import { User } from 'src/schemes/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(id: string) {
    const user = await this.userModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    return user?.toObject();
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({
      email,
    });
    return user?.toObject();
  }

  async create(dto: CreateUserDTO) {
    return await this.userModel.create({
      _id: new mongoose.Types.ObjectId(),
      ...dto,
      role: 'staff',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
