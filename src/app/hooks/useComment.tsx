// hooks/useComment.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "../services/api";
import { toast } from "react-toastify";

export const useComment = (postId: any) => {
  const queryClient = useQueryClient();

  const useGetComments = () => {
    return useQuery({
      queryKey: ["comments", postId],
      queryFn: () => commentApi.getCommentsByPostId(postId),
      enabled: !!postId,
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
        toast.error(error.message || "Error adding comment");
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
        toast.error(error.message || "Error updating comment");
      },
    });
  };

  const useDeleteComment = () => {
    return useMutation({
      mutationFn: (id: string) => commentApi.deleteComment(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        toast.success("Comment deleted successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error deleting comment");
      },
    });
  };

  return {
    useGetComments,
    useCreateComment,
    useUpdateComment,
    useDeleteComment,
  };
};
