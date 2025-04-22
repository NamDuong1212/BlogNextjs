import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi, categoryApi } from "../services/api";
import { toast } from "react-hot-toast";

export const usePost = () => {
  const queryClient = useQueryClient();

  const useGetPosts = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ["posts", page, limit],
      queryFn: () => postApi.getPosts(page, limit),
      staleTime: 0,
    });
  };

  const useGetPostByCreator = (userId: string) => {
    return useQuery({
      queryKey: ["posts", "creator", userId],
      queryFn: () => postApi.getPostByCreator(userId),
      enabled: !!userId,
    });
  };

  const useGetPostsByCategory = (categoryId: string, page = 1, limit = 10) => {
    return useQuery({
      queryKey: ["postsByCategory", categoryId, page, limit],
      queryFn: () => postApi.getPostsByCategory(categoryId, page, limit),
      staleTime: 0,
      enabled: !!categoryId,
    });
  };

  const useGetPostById = (id: any) => {
    return useQuery({
      queryKey: ["post", id],
      queryFn: () => postApi.getPostById(id),
      enabled: !!id,
      staleTime: 0,
    });
  };

  const useGetRelatedPosts = (id: any) => {
    return useQuery({
      queryKey: ["related-posts", id],
      queryFn: () => postApi.getRelatedPosts(id),
      enabled: !!id,
    });
  };

  const useGetCategories = () => {
    return useQuery({
      queryKey: ["categories"],
      queryFn: categoryApi.getCategories,
    });
  };

  const useCreatePost = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (data: any) => postApi.createPost(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Lỗi tạo bài viết");
      },
    });
  };

  const useUpdatePost = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (data: any) => postApi.updatePost(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Cập nhật bài viết thành công");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Cập nhật bài viết thất bại");
      },
    });
  };

  const useDeletePost = () => {
    return useMutation({
      mutationFn: (id: any) => postApi.deletePost(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Đã xóa bài viết thành công");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Xóa bài viết thất bại");
      },
    });
  };

  const useUploadPostImage = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: ({ id, file }: { id: any; file: File }) =>
        postApi.uploadPostImage(id, file),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["post"] });
        toast.success("Tải ảnh lên thành công");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Tải ảnh lên thất bại");
      },
    });
  };

  return {
    useGetPosts,
    useGetPostsByCategory,
    useGetPostById,
    useGetCategories,
    useCreatePost,
    useUpdatePost,
    useDeletePost,
    useUploadPostImage,
    useGetPostByCreator,
    useGetRelatedPosts,
  };
};
