import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ratingApi } from "../services/api";
import { toast } from "react-hot-toast";
import { use } from "react";

export const useRating = (postId: string) => {
  const queryClient = useQueryClient();

  const useGetAverageRating = () => {
    return useQuery({
      queryKey: ["rating", postId, "average"],
      queryFn: () => ratingApi.getAverageRating(postId),
      enabled: !!postId,
      staleTime: 0,
    });
  };

  const useGetRatingById = (ratingId: string) => {
    return useQuery({
      queryKey: ["rating", ratingId],
      queryFn: () => ratingApi.getRatingById(ratingId),
      enabled: !!ratingId,
    });
  };

  const useCreateRating = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (stars: number) => ratingApi.createRating(postId, stars),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["rating", postId] });
        toast.success("Rate successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to rate post");
      },
    });
  };

  return {
    useGetAverageRating,
    useGetRatingById,
    useCreateRating,
  };
};