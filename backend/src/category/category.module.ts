import { Module, forwardRef } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/schemes/category.schema';
import { UserModule } from 'src/user/user.module';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [
  
    forwardRef(() => ItemModule),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    UserModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
