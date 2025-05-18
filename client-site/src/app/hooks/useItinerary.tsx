import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { itineraryApi } from "../services/api";
import { toast } from "react-hot-toast";

export interface UploadDayImageParams {
  itineraryId: string;
  dayNumber: number;
  file: File;
}

export interface DeleteItineraryDayParams {
  itineraryId: string;
  dayId: string;
}

export const useItinerary = () => {
  const queryClient = useQueryClient();

  const useGetItineraryById = (id: any) => {
    return useQuery({
      queryKey: ["itinerary", id],
      queryFn: () => itineraryApi.getItineraryById(id),
      enabled: !!id,
      staleTime: 0,
    });
  };

  const useGetItineraryByPostId = (postId: any) => {
    return useQuery({
      queryKey: ["itinerary", "post", postId],
      queryFn: () => itineraryApi.getItineraryByPostId(postId),
      enabled: !!postId,
      staleTime: 0,
    });
  };

  const useCreateItinerary = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (data: any) => itineraryApi.createItinerary(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["itinerary"] });
        toast.success("Itinerary created successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to create itinerary");
      },
    });
  };

  const useUpdateItinerary = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) => 
        itineraryApi.updateItinerary(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["itinerary"] });
        toast.success("Itinerary updated successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to update itinerary");
      },
    });
  };

  const useDeleteItinerary = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (id: string) => itineraryApi.deleteItinerary(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["itinerary"] });
        toast.success("Itinerary deleted successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete itinerary");
      },
    });
  };

  const useUploadDayImage = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: ({ itineraryId, dayNumber, file }: UploadDayImageParams) =>
        itineraryApi.uploadDayImage(itineraryId, dayNumber, file),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["itinerary"] });
        toast.success("Image uploaded successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to upload image");
      },
    });
  };

  const useDeleteItineraryDay = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: ({ itineraryId, dayId }: DeleteItineraryDayParams) => 
        itineraryApi.deleteItineraryDay(itineraryId, dayId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["itinerary"] });
        toast.success("Day deleted successfully");
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete day");
      },
    });
  };

  return {
    useGetItineraryById,
    useGetItineraryByPostId,
    useCreateItinerary,
    useUpdateItinerary,
    useDeleteItinerary,
    useUploadDayImage,
    useDeleteItineraryDay,
  };
};