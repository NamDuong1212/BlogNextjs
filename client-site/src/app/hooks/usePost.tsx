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

  const useGetPostByCreator = (userId: string | undefined, page = 1, limit = 10) => {
    return useQuery({
      queryKey: ["posts", "creator", userId, page, limit],
      queryFn: () => {
        if (!userId) return { data: [], pagination: { total: 0, totalPages: 0, page, limit } };
        return postApi.getPostByCreator(userId, page, limit);
      },
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
        toast.error(error.message || "Failed to create post");
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
        toast.error(error.message || "Failed to update post");
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
        toast.error(error.message || "Failed to delete post");
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
        toast.error(error.message || "Failed to upload image");
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