import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import {
  GetSuppliersDTO,
  CreateSupplierDTO,
  UpdateSupplierDTO,
  DeleteSupplierDTO,
} from 'src/dto/supplier.dto';
import { Supplier } from 'src/schemes/supplier.schema';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
    private userService: UserService,
  ) {}

  async deleteSupplier(dto: DeleteSupplierDTO) {
    const existingUser = await this.userService.findOne(dto.userId);
    if (!existingUser) throw new BadRequestException();
    const updatedSupplier = await this.supplierModel.updateOne(
      { _id: dto.supplierId },
      {
        isArchived: true,
        updatedAt: new Date(),
        updatedBy: new mongoose.Types.ObjectId(dto.userId),
      },
    );
    if (!updatedSupplier || !updatedSupplier.modifiedCount)
      throw new InternalServerErrorException();
    return { message: 'Supplier deleted succesfully.' };
  }

  async updateSupplier(dto: UpdateSupplierDTO) {
    const existingUser = await this.userService.findOne(dto.userId);
    if (!existingUser) throw new BadRequestException();
    const updatedSupplier = await this.supplierModel.updateOne(
      { _id: dto.supplierId, isArchived: false },
      {
        name: dto.name,
        contactInfo: dto.contactInfo,
        address: dto.address,
        updatedAt: new Date(),
        updatedBy: new mongoose.Types.ObjectId(dto.userId),
      },
    );
    if (!updatedSupplier || !updatedSupplier.modifiedCount)
      throw new InternalServerErrorException();
    return { message: 'Supplier created succesfully.' };
  }

  async createSupplier(dto: CreateSupplierDTO) {
    const existingUser = await this.userService.findOne(dto.userId);
    if (!existingUser) throw new BadRequestException();
    const createdSupplier = await this.supplierModel.create({
      _id: new mongoose.Types.ObjectId(),
      name: dto.name,
      contactInfo: dto.contactInfo,
      address: dto.address,
      createdAt: new Date(),
      createdBy: new mongoose.Types.ObjectId(dto.userId),
      updatedAt: new Date(),
      updatedBy: new mongoose.Types.ObjectId(dto.userId),
      isArchived: false,
    });
    if (!createdSupplier) throw new InternalServerErrorException();
    return { message: 'Supplier created succesfully.' };
  }

  async getSuppliersSelect() {
    const suppliers = await this.supplierModel
      .find({ isArchived: false })
      .populate('_id name');
    if (!suppliers) throw new InternalServerErrorException();
    return suppliers;
  }

  async getSuppliers(dto: GetSuppliersDTO) {
    const pageSize = 10;
    const suppliers = await this.supplierModel.aggregate([
      { $match: { isArchived: false } },
      {
        $facet: {
          suppliers: [
            {
              $project: {
                _id: 1,
                name: 1,
                contactInfo: 1,
                address: 1,
                createdAt: 1,
              },
            },
            {
              $sort: { [dto.sortBy]: dto.sortOrder === 'ascending' ? 1 : -1 },
            },
            {
              $skip: (dto.page - 1) * pageSize,
            },
            {
              $limit: pageSize,
            },
          ],
          totalRecordCount: [{ $count: 'count' }],
        },
      },
    ]);

    if (!suppliers || !suppliers.length)
      throw new InternalServerErrorException();

    return { ...suppliers[0], message: 'Suppliers received succesfully.' };
  }

  async findOne(id: string) {
    const category = await this.supplierModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    return category?.toObject();
  }

  async getTotalCount() {
    const suppliers = await this.supplierModel.find({ isArchived: false });
    return suppliers?.length ?? 0;
  }
}
