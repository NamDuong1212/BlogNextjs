import { useMutation, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "../services/api";
import { toast } from "react-toastify";

export const useWallet = (userId: string) => {
  const queryClient = useQueryClient();

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

  return {
    useCreateWallet,
  };
};
