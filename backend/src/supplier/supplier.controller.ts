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
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import {
  CreateSupplierDTO,
  GetSuppliersDTO,
  UpdateSupplierDTO,
} from 'src/dto/supplier.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
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
  async createSupplier(@Body() dto: CreateSupplierDTO, @Request() req) {
    return await this.supplierService.createSupplier({
      ...dto,
      userId: req.user.sub,
    });
  }

  @Put()
  async updateSupplier(@Body() dto: UpdateSupplierDTO, @Request() req) {
    return await this.supplierService.updateSupplier({
      ...dto,
      userId: req.user.sub,
    });
  }

  @Delete(':id')
  async deleteSupplier(@Param() id: string, @Request() req) {
    return await this.supplierService.deleteSupplier({
      supplierId: id,
      userId: req.user.sub,
    });
  }
}
