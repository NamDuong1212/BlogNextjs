// hooks/useCreatorRequest.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { creatorRequestApi } from "../services/api";

export const useCreatorRequest = () => {
  const queryClient = useQueryClient();

  const useGetUserCreatorRequests = () => {
    return useQuery({
      queryKey: ["creator-requests", "user"],
      queryFn: () => creatorRequestApi.getUserCreatorRequests(),
      staleTime: 0,
    });
  };

  const useCreateCreatorRequest = () => {
    return useMutation({
      mutationFn: (data: { reason: string }) =>
        creatorRequestApi.createCreatorRequest(data),
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ["creator-requests", "user"] });
        toast.success(response.message || "Creator request submitted successfully!");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to submit creator request"
        );
      },
    });
  };

  return {
    useGetUserCreatorRequests,
    useCreateCreatorRequest,
  };
};