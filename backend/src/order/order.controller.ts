import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetOrdersDTO, CreateOrderDTO } from '../dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async getOrders(@Query() dto: GetOrdersDTO) {
    return await this.orderService.getOrders(dto);
  }

  @Post()
  async createOrder(@Body() dto: CreateOrderDTO) {
    return await this.orderService.createOrder(dto);
  }
}
