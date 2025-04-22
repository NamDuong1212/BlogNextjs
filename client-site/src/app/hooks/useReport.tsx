import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { reportApi } from "../services/api";

export const useReport = () => {
  const queryClient = useQueryClient();

  const useCreateReport = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: ({ postId, data }: { postId: any; data: any }) => 
        reportApi.createReport(postId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Báo cáo thành công");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Lỗi báo cáo bài viết");
      },
    });
  };

  return {
    useCreateReport,
  };
};