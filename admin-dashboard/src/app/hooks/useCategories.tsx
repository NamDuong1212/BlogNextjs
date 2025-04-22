import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../services/api";
import { toast } from "react-hot-toast";

export const useCategories = () => {
  const queryClient = useQueryClient();

  const useGetCategories = () => {
    return useQuery({
      queryKey: ["categories"],
      queryFn: () => categoryApi.getAllCategories(),
      staleTime: 0,
    });
  };

  const useCreateCategory = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (data: any) => categoryApi.createCategory(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("Danh mục đã được tạo thành công");
        onSuccess?.();
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || "Lỗi tạo danh mục";
        toast.error(message);
      },
    });
  };

  const useUpdateCategory = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
        categoryApi.updateCategory(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("Danh mục đã được cập nhật thành công");
        onSuccess?.();
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || "Lỗi cập nhật danh mục";
        toast.error(message);
      },
    });
  };

  const useDeleteCategory = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (id: string) => categoryApi.getDeleteCategory(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("Danh mục đã được xóa thành công");
        onSuccess?.();
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || "Lỗi xóa danh mục";
        toast.error(message);
      },
    });
  };

  return {
    useGetCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory
  };
};