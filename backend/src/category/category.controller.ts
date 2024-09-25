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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDTO,
  GetCategoriesDTO,
  UpdateCategoryDTO,
} from 'src/dto/categories.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CategoryInterceptor } from './category.interceptor';

@UseInterceptors(CategoryInterceptor)
@UseGuards(AuthGuard)
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
  async createCategory(@Body() body: CreateCategoryDTO, @Request() req) {
    return await this.categoryService.createCategory({
      ...body,
      userId: req.user.sub,
    });
  }

  @Put()
  async updateCategory(@Body() dto: UpdateCategoryDTO, @Request() req) {
    return await this.categoryService.updateCategory({
      ...dto,
      userId: req.user.sub,
    });
  }

  @Delete(':id')
  async deleteCategory(@Param() id: string, @Request() req) {
    return await this.categoryService.deleteCategory({
      categoryId: id,
      userId: req.user.sub,
    });
  }
}
