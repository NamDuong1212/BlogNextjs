// Updated usePosts hook
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
      mutationFn: async (postData: { 
        id: string; 
        userId: string; 
        title: string; 
        reason: string; 
      }) => {
        const { id, reason } = postData;
        
        // Chỉ cần gọi deletePost với reason, backend sẽ tự động gửi notification
        await postApi.deletePost(id, reason);
        
        return { success: true };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post deleted and notification sent successfully.");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete post");
      },
    });
  };

  return {
    useGetPosts,
    useDeletePost
  };
};