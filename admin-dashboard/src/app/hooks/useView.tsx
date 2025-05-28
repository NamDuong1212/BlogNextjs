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
        toast.success("Calculate earnings successfully");
        queryClient.invalidateQueries({ queryKey: ["daily"] });
      },
      onError: () => {
        toast.error("Error calculating earnings");
      },
    });
  };

  return {
    useGetViews,
    useCalculateDailyEarnings,
  };
};