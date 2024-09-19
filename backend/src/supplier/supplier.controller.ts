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
import { SupplierService } from './supplier.service';
import {
  CreateSupplierDTO,
  GetSuppliersDTO,
  UpdateSupplierDTO,
} from 'src/dto/supplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Get()
  async getSuppliers(@Query() dto: GetSuppliersDTO) {
    return await this.supplierService.getSuppliers(dto);
  }

  @Get('select')
  async getSuppliersSelect() {
    return await this.supplierService.getSuppliersSelect();
  }

  @Post()
  async createSupplier(@Body() dto: CreateSupplierDTO) {
    return await this.supplierService.createSupplier(dto);
  }

  @Put()
  async updateSupplier(@Body() dto: UpdateSupplierDTO) {
    return await this.supplierService.updateSupplier(dto);
  }

  @Delete(':id')
  async deleteSupplier(@Param() id: string, @Request() req) {
    return await this.supplierService.deleteSupplier({
      supplierId: id,
      userId: req.user.sub,
    });
  }
}
