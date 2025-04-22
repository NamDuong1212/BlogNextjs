import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dailyApi } from "../services/api";
import { toast } from "react-hot-toast";

export const useViews = () => {
  const queryClient = useQueryClient();

  const useGetViews = () => {
    return useQuery({
      queryKey: ["daily"],
      queryFn: () => dailyApi.getViews(),
      staleTime: 0,
    });
  };

  const useCalculateDailyEarnings = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: dailyApi.getDailyWallet,
      onSuccess: () => {
        toast.success("Tính toán thành công");
        queryClient.invalidateQueries({ queryKey: ["daily"] });
      },
      onError: () => {
        toast.error("Lỗi tính toán");
      },
    });
  };

  return {
    useGetViews,
    useCalculateDailyEarnings,
  };
};