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
import { ItemService } from './item.service';
import { GetItemsDTO, CreateItemDTO, UpdateItemDTO } from '../dto/items.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ItemInterceptor } from './item.interceptor';

@UseInterceptors(ItemInterceptor)
@UseGuards(AuthGuard)
@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  async getItems(@Query() dto: GetItemsDTO) {
    return await this.itemService.getItems(dto);
  }

  @Get('select')
  async getItemsSelect() {
    return await this.itemService.getItemsSelect();
  }

  @Post()
  async createItem(@Body() dto: CreateItemDTO, @Request() req) {
    return await this.itemService.createItem({ ...dto, userId: req.user.sub });
  }

  @Put()
  async updateItem(@Body() dto: UpdateItemDTO, @Request() req) {
    return await this.itemService.updateItem({ ...dto, userId: req.user.sub });
  }

  @Delete(':id')
  async deleteItem(@Param() id: string, @Request() req) {
    return await this.itemService.deleteItem({
      itemId: id,
      userId: req.user.sub,
    });
  }
}
