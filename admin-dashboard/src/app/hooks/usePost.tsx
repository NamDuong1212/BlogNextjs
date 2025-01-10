import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi } from "../services/api";
import { toast } from "react-hot-toast";

export const usePosts = () => {
  const queryClient = useQueryClient();

  const useGetPosts = () => {
    return useQuery({
      queryKey: ["posts"],
      queryFn: () => postApi.getAllPosts(),
      staleTime: 0,
    });
  };

  const useDeletePost = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (id: any) => postApi.getDeletePost(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post deleted successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error deleting post");
      },
    });
  }

  return {
    useGetPosts,
    useDeletePost
  };
};