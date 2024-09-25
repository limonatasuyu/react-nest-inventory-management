export interface CreateRecentUpdateDTO {
  description: string;
  relatedCollection: 'items' | 'categories' | 'suppliers' | 'orders';
  userId: string;
}
