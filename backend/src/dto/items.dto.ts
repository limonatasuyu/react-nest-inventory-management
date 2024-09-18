export interface GetItemsDTO {
  page: number;
  sortBy:
    | 'name'
    | 'createdAt'
    | 'updatedAt'
    | 'quantity'
    | 'price'
    | 'category'
    | 'supplier';
  sortOrder: 'ascending' | 'descending';
}

export interface UpdateItemDTO {
  itemId: string;
  name: string;
  categoryId: string;
  supplierId: string;
  quantity: number;
  price: number;
  description: string;
  userId: string;
}

export interface CreateItemDTO {
  name: string;
  categoryId: string;
  supplierId: string;
  quantity: number;
  price: number;
  description: string;
  userId: string;
}
