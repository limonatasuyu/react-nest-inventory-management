import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Item } from '../schemes/item.schema';
import {
  CreateItemDTO,
  DeleteItemDTO,
  GetItemsDTO,
  UpdateItemDTO,
} from 'src/dto/items.dto';
import { CategoryService } from 'src/category/category.service';
import { SupplierService } from 'src/supplier/supplier.service';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemsModel: Model<Item>,
    private userService: UserService,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    private supplierService: SupplierService,
  ) {}

  async deleteItem(dto: DeleteItemDTO) {
    const existingUser = await this.userService.findOne(dto.userId);
    if (!existingUser) throw new BadRequestException();
    const updatedItem = await this.itemsModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(dto.itemId),
      },
      {
        isArchived: true,
      },
    );

    if (!updatedItem || !updatedItem.modifiedCount) {
      throw new BadRequestException();
    }
    return { message: 'Item deleted successfully.' };
  }

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
    const existingUser = await this.userService.findOne(dto.userId);
    if (!existingUser)
      throw new BadRequestException('Could not find the user.');
    const existingSupplier = await this.supplierService.findOne(dto.supplierId);
    if (!existingSupplier)
      throw new BadRequestException('Could not find the supplier.');
    const existingCategory = await this.categoryService.findOne(dto.categoryId);
    if (!existingCategory)
      throw new BadRequestException('Could not find the category.');
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
      isArchived: false,
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

  async updateItem(dto: UpdateItemDTO) {
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
    return { message: 'Item updated successfully.' };
  }

  async getItemsSelect() {
    const items = await this.itemsModel
      .find({
        isArchived: false,
      })
      .populate('_id name');
    if (!items) throw new InternalServerErrorException();
    return items;
  }

  async getItems(dto: GetItemsDTO) {
    const pageSize = 10;
    const items = await this.itemsModel.aggregate([
      { $match: { isArchived: false } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'supplierId',
          foreignField: '_id',
          as: 'supplier',
        },
      },
      { $unwind: { path: '$supplier', preserveNullAndEmptyArrays: true } },
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
    ]);

    return { ...items[0], message: 'Items received successfully.' };
  }

  async findOne(id: string) {
    const item = await this.itemsModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    return item?.toObject();
  }

  async getTotalCount() {
    const items = await this.itemsModel.find({ isArchived: false });
    return items?.length ?? 0;
  }

  async getLowStockItems() {
    const lowStockTreshold = 10;
    const items = await this.itemsModel
      .find(
        {
          isArchived: false,
          quantity: { $lt: lowStockTreshold },
        },
        '_id name price quantity',
      )
      .limit(10);
    return items ?? [];
  }

  async findOneByCategoryId(categoryId: string) {
    const item = await this.itemsModel.findOne({
      categoryId: new mongoose.Types.ObjectId(categoryId),
    });
    return item;
  }
}
