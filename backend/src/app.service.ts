import { Injectable } from '@nestjs/common';
import { ItemService } from './item/item.service';
import { CategoryService } from './category/category.service';
import { SupplierService } from './supplier/supplier.service';
import { OrderService } from './order/order.service';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private orderService: OrderService,
    private userService: UserService,
  ) {}

  async getMetrics() {
    const totalItems = await this.itemService.getTotalCount();
    const totalCategories = await this.categoryService.getTotalCount();
    const totalSuppliers = await this.supplierService.getTotalCount();
    const totalOrders = await this.orderService.getTotalCount();
    const lowStockItems = await this.itemService.getLowStockItems();
    const pendingOrders = await this.orderService.getPendingOrders();

    return {
      totalItems,
      totalCategories,
      totalSuppliers,
      totalOrders,
      lowStockItems,
      pendingOrders,
    };
  }

  async getRecentActivity() {}

  async getChartData() {}
}
