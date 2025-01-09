export interface CreateCategoryType {
  name: string;
  description?: string;
}

export interface UpdateCategoryType {
  name: string;
  description?: string;
}

export interface CategoryType {
  id: string;
  name: string;
  description: string;
}
