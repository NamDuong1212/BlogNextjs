import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
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
      console.log("Check data:", {
        token: response.token,
        user: response.data,
      });
      toast.success(response.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error updating profile");
    },
  });

  return {
    updateProfileMutation,
  };
};
