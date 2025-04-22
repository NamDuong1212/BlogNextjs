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
      select: (response) => response.data // Extract the inner data array
    });
  };

  const useCreateComment = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (data: any) => commentApi.createComment(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        toast.success("Thêm bình luận thành công");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Lỗi thêm bình luận");
      },
    });
  };

  const useUpdateComment = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: ({ id, data }: { id: any; data: any }) =>
        commentApi.updateComment(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        toast.success("Sửa bình luận thành công");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Lỗi sửa bình luận");
      },
    });
  };

  const useDeleteComment = () => {
    return useMutation({
      mutationFn: (id: any) => commentApi.deleteComment(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        toast.success("Xóa bình luận thành công");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Lỗi xóa bình luận");
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
        toast.success("Thêm phản hồi thành công");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Lỗi thêm phản hồi");
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
