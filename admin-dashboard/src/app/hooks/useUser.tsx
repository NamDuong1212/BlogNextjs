import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../services/api";
import { toast } from "react-hot-toast";
import { UpdateCreatorStatusDto } from "../types/user";

export const useUser = () => {
  const queryClient = useQueryClient();

  const useGetAllUsers = () => {
    return useQuery({
      queryKey: ["users"],
      queryFn: () => userApi.getAllUsers(),
      staleTime: 0,
    });
  };

  const useGetUserById = (id: string) => {
    return useQuery({
      queryKey: ["user", id],
      queryFn: () => userApi.getUserById(id),
      enabled: !!id,
      staleTime: 0,
    });
  };

  const useUpdateCreatorStatus = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: ({ 
        userId, 
        updateData 
      }: { 
        userId: string; 
        updateData: UpdateCreatorStatusDto 
      }) => userApi.updateCreatorStatus(userId, updateData),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });
        toast.success("Creator status updated successfully");
        onSuccess?.();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error.message || "Error updating creator status";
        toast.error(errorMessage);
      },
    });
  };

  const useDeleteUser = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: (userId: string) => userApi.deleteUser(userId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success("User deleted successfully");
        onSuccess?.();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error.message || "Error deleting user";
        toast.error(errorMessage);
      },
    });
  };

  return {
    useGetAllUsers,
    useGetUserById,
    useUpdateCreatorStatus,
    useDeleteUser,
  };
};