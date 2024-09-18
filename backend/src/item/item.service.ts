import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Item } from '../schemes/item.schema';
import { CreateItemDTO, GetItemsDTO, UpdateItemDTO } from 'src/dto/items.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ItemService {
  constructor(
    private itemsModel: Model<Item>,
    private userService: UserService,
    private categoryService: CategoryService,
  ) {}

  async getItem(itemId: string) {
    const item = this.itemsModel.findOne({
      _id: new mongoose.Types.ObjectId(itemId),
    });
    if (!item) {
      throw new BadRequestException('Item not found');
    }
    return item;
  }

  async createItem(dto: CreateItemDTO) {
    const existingUsers = await this.userService.findMany([
      dto.userId,
      dto.supplierId,
    ]);
    if (!existingUsers.length) throw new BadRequestException();
    const existingCategory = await this.categoryService.findOnde(
      dto.categoryId,
    );
    if (!existingCategory) throw new BadRequestException();
    const createdItem = await this.itemsModel.create({
      _id: new mongoose.Types.ObjectId(),
      name: dto.name,
      categoryId: dto.categoryId,
      supplierId: dto.supplierId,
      quantity: dto.quantity,
      price: dto.price,
      description: dto.description,
      createdBy: new mongoose.Types.ObjectId(dto.userId),
      createdAt: new Date(),
      updatedBy: new mongoose.Types.ObjectId(dto.userId),
      updatedAt: new Date(),
    });

    if (!createdItem) {
      throw new InternalServerErrorException(
        'Error occured while trying to create the item.',
      );
    }

    return {
      item: createdItem.toObject(),
      message: 'Message created succesfully.',
    };
  }

  async UpdateItem(dto: UpdateItemDTO) {
    const existingUser = await this.userService.findOne(dto.userId);
    if (!existingUser) throw new BadRequestException();
    const updatedItem = await this.itemsModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(dto.itemId),
      },
      {
        ...dto,
        itemId: undefined,
        updatedAt: new Date(),
        updatedBy: new mongoose.Types.ObjectId(dto.userId),
      },
    );

    if (!updatedItem || !updatedItem.modifiedCount) {
      throw new BadRequestException();
    }
    return { message: 'Item Updated successfully.' };
  }

  async getItems(dto: GetItemsDTO) {
    const pageSize = 10;
    const items = await this.itemsModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'supplierId',
          foreignField: '_id',
          as: 'supplier',
        },
      },
      { $unwind: '$supplier' },
      {
        $facet: {
          items: [
            {
              $project: {
                _id: 1,
                name: 1,
                category: {
                  name: 1,
                  _id: 1,
                },
                supplier: {
                  name: 1,
                  _id: 1,
                },
                quantity: 1,
                price: 1,
                description: 1,
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

    return { ...items[0], message: 'Items received successfully.' };
  }
}
