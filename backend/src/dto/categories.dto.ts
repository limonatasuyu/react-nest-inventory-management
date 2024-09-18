export interface GetCategoriesDTO {
  page: number;
  sortBy: 'name' | 'createdAt' | 'updatedAt';
  sortOrder: 'ascending' | 'descending';
}

export interface CreateCategoryDTO {
  userId: string;
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  userId: string;
  categoryId: string;
  name: string;
  description?: string;
}

export interface DeleteCategoryDTO {
  userId: string;
  categoryId: string;
}
