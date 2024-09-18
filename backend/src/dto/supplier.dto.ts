export interface GetSuppliersDTO {
  page: number;
  sortBy: 'name' | 'createdAt' | 'updatedAt';
  sortOrder: 'ascending' | 'descending';
}

export interface CreateSupplierDTO {
  userId: string;
  name: string;
  contactInfo: string;
  address: string;
}

export interface UpdateSupplierDTO {
  userId: string;
  supplierId: string;
  name: string;
  contactInfo: string;
  address: string;
}

export interface DeleteSupplierDTO {
  userId: string;
  supplierId: string;
}
