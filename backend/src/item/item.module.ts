import { Module, forwardRef } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from 'src/schemes/item.schema';
import { UserModule } from 'src/user/user.module';
import { CategoryModule } from 'src/category/category.module';
import { SupplierModule } from 'src/supplier/supplier.module';

@Module({
  imports: [
    forwardRef(() => CategoryModule),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    UserModule,
    SupplierModule,
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
