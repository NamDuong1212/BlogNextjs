'use client';

import { CategoryForm } from '@/app/components/CategoryForm';
import { useCategories } from '@/app/hooks/useCategories';

export default function CategoryPage() {
  const { useCreateCategory } = useCategories();
  const { mutate: createCategory } = useCreateCategory();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create Category</h1>
      <CategoryForm onSubmit={createCategory} />
    </div>
  );
}
