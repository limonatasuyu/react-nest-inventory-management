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
import { ItemService } from './item.service';
import { GetItemsDTO, CreateItemDTO, UpdateItemDTO } from '../dto/items.dto';

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
  async createItem(@Body() dto: CreateItemDTO) {
    return await this.itemService.createItem(dto);
  }

  @Put()
  async updateItem(@Body() dto: UpdateItemDTO) {
    return await this.itemService.updateItem, dto;
  }

  @Delete(':id')
  async deleteItem(@Param() id: string, @Request() req) {
    return await this.itemService.deleteItem({
      itemId: id,
      userId: req.user.sub,
    });
  }
}
