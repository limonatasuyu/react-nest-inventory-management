import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import {
  CreateCategoryDTO,
  GetCategoriesDTO,
  UpdateCategoryDTO,
  DeleteCategoryDTO,
} from 'src/dto/categories.dto';
import { Category } from 'src/schemes/category.schema';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';

Injectable();
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private userService: UserService,
  ) {}

  async deleteCategory(dto: DeleteCategoryDTO) {
    const existinguser = await this.userService.findOne(dto.userId);
    if (!existinguser) throw new BadRequestException();
    const updatedCategory = await this.categoryModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(dto.categoryId),
      },
      {
        isArchived: true,
        updatedAt: new Date(),
        updatedBy: new mongoose.Types.ObjectId(dto.userId),
      },
    );
    if (!updatedCategory || !updatedCategory.modifiedCount)
      throw new InternalServerErrorException();

    return { message: 'Category deleted succesfully.' };
  }

  async updateCategory(dto: UpdateCategoryDTO) {
    const existinguser = await this.userService.findOne(dto.userId);
    if (!existinguser) throw new BadRequestException();
    const updatedCategory = await this.categoryModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(dto.categoryId),
        isArchived: false,
      },
      {
        name: dto.name,
        description: dto.description,
        updatedAt: new Date(),
        updatedBy: new mongoose.Types.ObjectId(dto.userId),
      },
    );

    if (!updatedCategory || !updatedCategory.modifiedCount)
      throw new InternalServerErrorException();

    return { message: 'Category updated succesfully.' };
  }

  async createCategory(dto: CreateCategoryDTO) {
    const existinguser = await this.userService.findOne(dto.userId);
    if (!existinguser) throw new BadRequestException();
    const createdCategory = await this.categoryModel.create({
      _id: new mongoose.Types.ObjectId(),
      name: dto.name,
      description: dto.description,
      createdBy: new mongoose.Types.ObjectId(dto.userId),
      createdAt: new Date(),
      updatedBy: new mongoose.Types.ObjectId(dto.userId),
      updatedAt: new Date(),
      isArchived: false,
    });
    if (!createdCategory) throw new InternalServerErrorException();
    return { message: 'Category created succesfully.' };
  }

  async getCategoriesSelect() {
    const categories = await this.categoryModel
      .find({
        isArchived: false,
      })
      .populate('_id name');
    if (!categories) throw new InternalServerErrorException();
    return categories;
  }

  async getCategories(dto: GetCategoriesDTO) {
    const pageSize = 10;
    const categories = await this.categoryModel.aggregate([
      { $match: { isArchived: false } },
      {
        $facet: {
          categories: [
            {
              $project: {
                _id: 1,
                name: 1,
                description: 1,
                createdAt: 1,
              },
            },
            {
              $sort: { [dto.sortBy]: dto.sortOrder === 'asc' ? 1 : -1 },
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

    if (!categories.length) throw new InternalServerErrorException();
    return { ...categories[0], message: 'Categories received successfully.' };
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    return category?.toObject();
  }
}
