export interface GetOrdersDTO {
  page: number;
  sortBy:
    | 'itemId'
    | 'quntity'
    | 'dateOrdered'
    | 'status'
    | 'createdAt'
    | 'updatedAt';
  sortOrder: 'ascending' | 'descending';
}

export interface CreateOrderDTO {
  userId: string;
  itemId: string;
  quantity: number;
  dateOrdered: Date;
  status: 'failed' | 'complete' | 'pending';
}
