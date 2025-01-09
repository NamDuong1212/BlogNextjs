export interface CategoryFormData {
  name: string;
  description: string;
}

export interface Category extends CategoryFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}
