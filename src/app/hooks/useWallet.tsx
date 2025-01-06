import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { walletApi } from "../services/api";
import { toast } from "react-hot-toast";

export const useWallet = (userId: string) => {
  const queryClient = useQueryClient();

  const useGetWalletByUserId = () => {
    return useQuery({
      queryKey: ["wallet", userId],
      queryFn: () => walletApi.getWalletByUserId(userId),
      enabled: !!userId,
      staleTime: 0,
    });
  };

  const useCreateWallet = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (data: any) => walletApi.createWallet(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["wallet", userId] });
        toast.success("Wallet created successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error creating wallet");
      },
    });
  };

  const useRequestWithdrawal = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (data: { amount: number }) =>
        walletApi.requestWithdrawal({ userId, amount: data.amount }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["wallet", userId] });
        toast.success("Withdrawal request submitted successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error requesting withdrawal");
      },
    });
  };

  return {
    useCreateWallet,
    useGetWalletByUserId,
    useRequestWithdrawal,
  };
};
