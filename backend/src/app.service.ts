import { Injectable, Inject } from '@nestjs/common';
import { ItemService } from './item/item.service';
import { CategoryService } from './category/category.service';
import { SupplierService } from './supplier/supplier.service';
import { OrderService } from './order/order.service';
import { UserService } from './user/user.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { cacheKeys } from './constants';

@Injectable()
export class AppService {
  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private orderService: OrderService,
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async getRecentActivity() {
    const activities = {
      category: {
        create: (await this.cacheManager.get(cacheKeys.category.create)) ?? 0,
        update: (await this.cacheManager.get(cacheKeys.category.update)) ?? 0,
        delete: (await this.cacheManager.get(cacheKeys.category.delete)) ?? 0,
      },
      item: {
        create: (await this.cacheManager.get(cacheKeys.item.create)) ?? 0,
        update: (await this.cacheManager.get(cacheKeys.item.update)) ?? 0,
        delete: (await this.cacheManager.get(cacheKeys.item.delete)) ?? 0,
      },
      order: {
        create: (await this.cacheManager.get(cacheKeys.order.create)) ?? 0,
        update: (await this.cacheManager.get(cacheKeys.order.update)) ?? 0,
        //delete: await this.cacheManager.get(cacheKeys.order.delete),
      },
      supplier: {
        create: (await this.cacheManager.get(cacheKeys.supplier.create)) ?? 0,
        update: (await this.cacheManager.get(cacheKeys.supplier.update)) ?? 0,
        delete: (await this.cacheManager.get(cacheKeys.supplier.delete)) ?? 0,
      },
    };

    return activities;
  }

}
