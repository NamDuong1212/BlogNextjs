import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { profileApi } from "../services/api";
import useAuthStore from "../store/useAuthStore";
import { UpdateUser } from "../types/profile";

export const useProfile = () => {
  const { accessToken, setUserData } = useAuthStore();

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateUser) => profileApi.updateProfile(data),
    onSuccess: (response) => {
      setUserData({
        token: accessToken!,
        user: response.data,
      });
      toast.success(response.message || "Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (file: File) => profileApi.updateAvatar(file),
    onSuccess: (response) => {
      setUserData({
        token: accessToken!,
        user: response.data,
      });
      toast.success(response.message || "Avatar updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update avatar");
    },
  });

  return {
    updateProfileMutation,
    updateAvatarMutation,
  };
};