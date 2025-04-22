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
      toast.success(response.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi cập nhật thông tin cá nhân");
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (file: File) => profileApi.updateAvatar(file),
    onSuccess: (response) => {
      setUserData({
        token: accessToken!,
        user: response.data,
      });
      toast.success(response.message || "Cập nhật ảnh đại diện thành công");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi cập nhật ảnh đại diện");
    },
  });

  return {
    updateProfileMutation,
    updateAvatarMutation,
  };
};
