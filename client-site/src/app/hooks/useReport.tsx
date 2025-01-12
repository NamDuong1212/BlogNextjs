// hooks/useReport.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { reportApi } from "../services/api";

export const useReport = () => {
  const queryClient = useQueryClient();

  const useCreateReport = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (data: any) => reportApi.createReport(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Report submitted successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error submitting report");
      },
    });
  };

  return {
    useCreateReport,
  };
};