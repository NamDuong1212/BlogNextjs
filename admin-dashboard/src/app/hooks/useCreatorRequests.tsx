// hooks/useCreatorRequests.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { creatorRequestApi } from "../services/api";
import { toast } from "react-hot-toast";

export const useCreatorRequests = () => {
  const queryClient = useQueryClient();

  const useGetAllCreatorRequests = () => {
    return useQuery({
      queryKey: ["creator-requests"],
      queryFn: () => creatorRequestApi.getAllCreatorRequests(),
      staleTime: 0,
    });
  };

  const useReviewCreatorRequest = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
        creatorRequestApi.reviewCreatorRequest(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["creator-requests"] });
        toast.success("Creator request reviewed successfully");
        onSuccess?.();
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || "Error reviewing creator request";
        toast.error(message);
      },
    });
  };


  return {
    useGetAllCreatorRequests,
    useReviewCreatorRequest,
  };
};