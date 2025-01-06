// hooks/useLike.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { likeApi } from "../services/api";
import { toast } from "react-hot-toast";

export const useLike = () => {
  const queryClient = useQueryClient();

  const useGetLikeCount = (postId: string) => {
    return useQuery({
      queryKey: ["likes", "count", postId],
      queryFn: () => likeApi.getLikeCount(postId),
      enabled: !!postId,
    });
  };

  const useLikePost = () => {
    return useMutation({
      mutationFn: (postId: string) => likeApi.likePost(postId),
      onSuccess: (_, postId) => {
        queryClient.invalidateQueries({ queryKey: ["likes", "count", postId] });
        toast.success("Post liked successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error liking post");
      },
    });
  };

  const useUnlikePost = () => {
    return useMutation({
      mutationFn: (postId: string) => likeApi.unlikePost(postId),
      onSuccess: (_, postId) => {
        queryClient.invalidateQueries({ queryKey: ["likes", "count", postId] });
        toast.success("Post unliked successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error unliking post");
      },
    });
  };

  return {
    useGetLikeCount,
    useLikePost,
    useUnlikePost,
  };
};
