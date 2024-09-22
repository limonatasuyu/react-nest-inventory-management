import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { GetOrdersDTO, CreateOrderDTO } from 'src/dto/order.dto';
import { ItemService } from '../item/item.service';
import { Order } from 'src/schemes/order.schema';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private userService: UserService,
    private itemService: ItemService,
  ) {}

  async createOrder(dto: CreateOrderDTO) {
    const existingUser = await this.userService.findOne(dto.userId);
    if (!existingUser) throw new BadRequestException();
    const existingItem = await this.itemService.findOne(dto.itemId);
    if (!existingItem) throw new BadRequestException();
    const createdOrder = this.orderModel.create({
      _id: new mongoose.Types.ObjectId(),
      itemId: new mongoose.Types.ObjectId(dto.itemId),
      quantity: dto.quantity,
      dateOrdered: new Date(dto.dateOrdered),
      status: 'pending',
      createdAt: new Date(),
      createdBy: new mongoose.Types.ObjectId(dto.userId),
      updatedAt: new Date(),
      updatedBy: new mongoose.Types.ObjectId(dto.userId),
      isArchived: false,
    });
    if (!createdOrder) throw new InternalServerErrorException();
    return { message: 'Order created succesfully.' };
  }

  async getOrders(dto: GetOrdersDTO) {
    const pageSize = 10;
    const orders = await this.orderModel.aggregate([
      { $match: { isArchived: false } },
      {
        $lookup: {
          from: 'items',
          localField: 'itemId',
          foreignField: '_id',
          as: 'item',
        },
      },
      { $unwind: '$item' },
      {
        $facet: {
          orders: [
            {
              $project: {
                _id: 1,
                item: {
                  _id: 1,
                  name: 1,
                },
                quantity: 1,
                dateOrdered: 1,
                status: 1,
                createdAt: 1,
              },
            },
            {
              $sort: { [dto.sortBy]: dto.sortOrder === 'ascending' ? 1 : -1 },
            },
            {
              $skip: (dto.page - 1) * pageSize,
            },
            {
              $limit: pageSize,
            },
          ],
          totalRecordCount: [{ $count: 'count' }],
        },
      },
      {
        $addFields: {
          totalPageCount: {
            $ifNull: [
              {
                $ceil: {
                  $divide: [
                    { $arrayElemAt: ['$totalRecordCount.count', 0] },
                    pageSize,
                  ],
                },
              },
              1,
            ],
          },
        },
      },
    ]);

    if (!orders || !orders.length) throw new InternalServerErrorException();
    return { ...orders[0], message: 'Orders received succesfully.' };
  }
}
