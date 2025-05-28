import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportApi } from "../services/api";
import { toast } from "react-hot-toast";

export const useReport = () => {
  const queryClient = useQueryClient();

  const useGetReport = () => {
    return useQuery({
      queryKey: ["report"],
      queryFn: () => reportApi.getReport(),
      staleTime: 0,
    });
  };
  const useDeleteReport = (onSuccess?: () => void) => {
      return useMutation({
        mutationFn: (id: any) => reportApi.deleteReport(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["posts"] });
          onSuccess?.();
        },
        onError: (error: Error) => {
          toast.error(error.message || "Error deleting report");
        },
      });
    }
  
    return {
      useGetReport,
      useDeleteReport
    };
  };