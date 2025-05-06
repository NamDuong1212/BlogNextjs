import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { likeApi } from "../services/api";

export const useLike = () => {
  const queryClient = useQueryClient();

  const useGetLikeCount = (postId: string) => {
    return useQuery({
      queryKey: ["likes", "count", postId],
      queryFn: () => likeApi.getLikeCount(postId),
      enabled: !!postId,
    });
  };

  const useCheckLikeStatus = (postId: string) => {
    return useQuery({
      queryKey: ["likes", "status", postId],
      queryFn: () => likeApi.checkLikeStatus(postId),
      enabled: !!postId,
    });
  };

  const useGetUserLikedPosts = () => {
    return useQuery({
      queryKey: ["likes", "user", "posts"],
      queryFn: () => likeApi.getUserLikedPosts(),
    });
  };

  const useLikePost = () => {
    return useMutation({
      mutationFn: (postId: string) => likeApi.likePost(postId),
      onSuccess: (_, postId) => {
        queryClient.invalidateQueries({ queryKey: ["likes", "count", postId] });
        queryClient.invalidateQueries({ queryKey: ["likes", "status", postId] });
        queryClient.invalidateQueries({ queryKey: ["likes", "user", "posts"] });
      },
    });
  };

  const useUnlikePost = () => {
    return useMutation({
      mutationFn: (postId: string) => likeApi.unlikePost(postId),
      onSuccess: (_, postId) => {
        queryClient.invalidateQueries({ queryKey: ["likes", "count", postId] });
        queryClient.invalidateQueries({ queryKey: ["likes", "status", postId] });
        queryClient.invalidateQueries({ queryKey: ["likes", "user", "posts"] });
      },
    });
  };

  return {
    useGetLikeCount,
    useCheckLikeStatus,
    useGetUserLikedPosts,
    useLikePost,
    useUnlikePost,
  };
};
