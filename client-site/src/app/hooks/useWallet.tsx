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
        toast.success("Tạo ví thành công");
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
        toast.success(`Rút ${variables.amount} $ thành công`);
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Lỗi rút tiền",
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
