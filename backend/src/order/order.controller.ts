import { Controller, Get, Query, Post, Body, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetOrdersDTO, CreateOrderDTO } from '../dto/order.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async getOrders(@Query() dto: GetOrdersDTO) {
    return await this.orderService.getOrders(dto);
  }

  @Post()
  async createOrder(@Body() dto: CreateOrderDTO, @Request() req) {
    return await this.orderService.createOrder({
      ...dto,
      userId: req.user.sub,
    });
  }
}
