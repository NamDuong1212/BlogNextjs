import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../services/api";
import { toast } from "react-hot-toast";

export const useCategories = () => {
  const queryClient = useQueryClient();

  const useGetCategories = () => {
    return useQuery({
      queryKey: ["categories"],
      queryFn: () => categoryApi.getCategories(),
      staleTime: 0,
    });
  };
  const useCreateCategory = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (data: any) => categoryApi.createCategory(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("Category created successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error creating category");
      },
    });
  };

  const useUpdateCategory = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
        categoryApi.updateCategory(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("Category updated successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error updating category");
      },
    });
  };


  return {
    useGetCategories,
    useCreateCategory,
    useUpdateCategory,
  };
};