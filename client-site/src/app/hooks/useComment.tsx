import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "../services/api";
import { toast } from "react-hot-toast";

export const useComment = (postId: any) => {
  const queryClient = useQueryClient();

  const useGetComments = () => {
    return useQuery({
      queryKey: ["comments", postId],
      queryFn: () => commentApi.getCommentsByPostId(postId),
      enabled: !!postId,
      staleTime: 0,
      select: (response) => response.data,
    });
  };

  const useCreateComment = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (data: any) => commentApi.createComment(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        toast.success("Comment added successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to add comment");
      },
    });
  };

  const useUpdateComment = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: ({ id, data }: { id: any; data: any }) =>
        commentApi.updateComment(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        toast.success("Comment updated successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to update comment");
      },
    });
  };

  const useDeleteComment = () => {
    return useMutation({
      mutationFn: (id: any) => commentApi.deleteComment(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        toast.success("Comment deleted successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete comment");
      },
    });
  };

  const useReplyComment = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: ({ parentId, data }: { parentId: string; data: any }) =>
        commentApi.replyToComment(postId, parentId, {
          content: data.content,
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        toast.success("Reply added successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to add reply");
      },
    });
  };

  return {
    useGetComments,
    useCreateComment,
    useUpdateComment,
    useDeleteComment,
    useReplyComment,
  };
};