import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { walletApi } from "../services/api";
import { toast } from "react-hot-toast";

export const useWallet = (userId: string) => {
  const queryClient = useQueryClient();

  const useGetWalletByUserId = () => {
    return useQuery({
      queryKey: ["wallet", userId],
      queryFn: () => walletApi.getWalletByUserId(),
      enabled: !!userId,
      staleTime: 0,
    });
  };

  const useCreateWallet = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: () => walletApi.createWallet(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
        toast.success("Wallet created successfully");
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Error creating wallet");
      },
    });
  };

  const useRequestWithdrawal = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (data: { amount: number }) =>
        walletApi.requestWithdrawal(data),
      onSuccess: (response, variables) => {
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
        queryClient.invalidateQueries({ queryKey: ["withdrawalHistory"] });
        toast.success(response.message || `Withdrawal request of $${variables.amount} submitted successfully`);
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Error requesting withdrawal",
        );
      },
    });
  };

  const useLinkPayPal = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (data: { paypalEmail: string }) =>
        walletApi.linkPayPal(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
        toast.success("PayPal account linked successfully");
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Error linking PayPal account",
        );
      },
    });
  };

  const useGetWithdrawalHistory = () => {
    return useQuery({
      queryKey: ["withdrawalHistory", userId],
      queryFn: () => walletApi.getWithdrawalHistory(),
      enabled: !!userId,
      staleTime: 30000, // 30 seconds
    });
  };

  const useForceCheckWithdrawal = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (withdrawalId: string) =>
        walletApi.forceCheckWithdrawal(withdrawalId),
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ["withdrawalHistory"] });
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
        toast.success(response.message || "Withdrawal status updated");
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Error checking withdrawal status",
        );
      },
    });
  };

  return {
    useCreateWallet,
    useGetWalletByUserId,
    useRequestWithdrawal,
    useLinkPayPal,
    useGetWithdrawalHistory,
    useForceCheckWithdrawal,
  };
};