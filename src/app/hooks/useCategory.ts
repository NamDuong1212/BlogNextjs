import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { categoryApi } from "../services/api";
import { CreateCategoryType, UpdateCategoryType } from "../types/category";

export const useCategory = () => {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryType) => categoryApi.createCategory(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(response.message || "Category created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error creating category");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryType }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(response.message || "Category updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error updating category");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(response.message || "Category deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error deleting category");
    },
  });

  return {
    categories: Array.isArray(categoriesQuery.data) ? categoriesQuery.data : [],
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
  
};
