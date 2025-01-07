import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ratingApi } from "../services/api";
import { toast } from "react-hot-toast";
import { use } from "react";

export const useRating = (postId: string) => {
  const queryClient = useQueryClient();

  const useGetAverageRating = () => {
    return useQuery({
      queryKey: ["rating", postId],
      queryFn: () => ratingApi.getAverageRating(postId),
      enabled: !!postId,
      staleTime: 0,
    });
  };

  const useCreateRating = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (stars: number) => ratingApi.createRating(postId, stars),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["rating", postId] });
        toast.success("Rating submitted successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error submitting rating");
      },
    });
  };

  const useGetUserRating = () => {
    return useQuery({
      queryKey: ["rating", postId, "user"],
      queryFn: () => ratingApi.getUserRating(postId),
      enabled: !!postId,
      staleTime: 0,
    });
  };

  return {
    useGetAverageRating,
    useCreateRating,
    useGetUserRating,
  };
};