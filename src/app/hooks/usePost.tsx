import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi, categoryApi } from "../services/api";
import { toast } from "react-toastify";
import { CreatePostState, UpdatePostState } from "../types/post";
export const usePost = () => {
  const queryClient = useQueryClient();

  const useGetPosts = () => {
    return useQuery({
      queryKey: ["posts"],
      queryFn: postApi.getPosts,
    });
  };

  const useGetPostById = (id: string) => {
    return useQuery({
      queryKey: ["post", id],
      queryFn: () => postApi.getPostById(id),
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
      mutationFn: (data: CreatePostState) => postApi.createPost(data),
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
      mutationFn: (data: UpdatePostState) => postApi.updatePost(data),
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
      mutationFn: (id: string) => postApi.deletePost(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post deleted successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error deleting post");
      },
    });
  };

  return {
    useGetPosts,
    useGetPostById,
    useGetCategories,
    useCreatePost,
    useUpdatePost,
    useDeletePost,
  };
};
