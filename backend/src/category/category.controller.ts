import {
  Controller,
  Get,
  Query,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDTO,
  GetCategoriesDTO,
  UpdateCategoryDTO,
} from 'src/dto/categories.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getCategories(@Query() dto: GetCategoriesDTO) {
    return await this.categoryService.getCategories(dto);
  }

  @Get('select')
  async getCategoriesSelect() {
    return await this.categoryService.getCategoriesSelect();
  }

  @Post()
  async createCategory(@Body() dto: CreateCategoryDTO) {
    return await this.categoryService.createCategory(dto);
  }

  @Put()
  async updateCategory(@Body() dto: UpdateCategoryDTO) {
    return await this.categoryService.updateCategory(dto);
  }

  @Delete(':id')
  async deleteCategory(@Param() id: string, @Request() req) {
    return await this.categoryService.deleteCategory({
      categoryId: id,
      userId: req.user.sub,
    });
  }
}
