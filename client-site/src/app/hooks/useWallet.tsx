import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { walletApi } from "../services/api";
import { toast } from "react-hot-toast";

export const useWallet = (userId: string) => {
  const queryClient = useQueryClient();

  const useGetWalletByUserId = () => {
    return useQuery({
      queryKey: ["wallet"],
      queryFn: () => walletApi.getWalletByUserId(),
      enabled: !!userId,
      staleTime: 0,
    });
  };

  const useCreateWallet = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: () => walletApi.createWallet(),
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
        walletApi.requestWithdrawal(data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
        toast.success(`Deposit ${variables.amount} $ successfully`);
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Error requesting withdrawal",
        );
      },
    });
  };

  return {
    useCreateWallet,
    useGetWalletByUserId,
    useRequestWithdrawal,
  };
};
