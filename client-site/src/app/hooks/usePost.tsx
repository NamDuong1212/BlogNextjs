import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi, categoryApi } from "../services/api";
import { toast } from "react-hot-toast";

export const usePost = () => {
  const queryClient = useQueryClient();

  const useGetPosts = () => {
    return useQuery({
      queryKey: ["posts"],
      queryFn: () => postApi.getPosts(),
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

  const useGetPostsByCategory = (categoryId: string) => {
    return useQuery({
      queryKey: ["posts", "category", categoryId],
      queryFn: () => postApi.getPostsByCategory(categoryId),
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
        toast.success("Post created successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error creating post");
      },
    });
  };

  const useUpdatePost = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (data: any) => postApi.updatePost(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post updated successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error updating post");
      },
    });
  };

  const useDeletePost = () => {
    return useMutation({
      mutationFn: (id: any) => postApi.deletePost(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post deleted successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error deleting post");
      },
    });
  };

  const useUploadPostImage = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: ({ id, file }: { id: any; file: File }) =>
        postApi.uploadPostImage(id, file),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["post"] });
        toast.success("Image uploaded successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error uploading image");
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
  };
};
