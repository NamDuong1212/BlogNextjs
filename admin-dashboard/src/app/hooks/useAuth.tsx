import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { authApi } from "../services/api";
import useAuthStore from "../store/useAuthStore";
import { LoginState, RegisterState } from "../types/auth";

export const useAuth = () => {
  const router = useRouter();
  const setUserData = useAuthStore((state) => state.setUserData);

  const loginMutation = useMutation({
    mutationFn: (userData: LoginState) => authApi.login(userData),
    onSuccess: (data) => {
      setUserData({
        token: data.token,
        user: data.user,
      });

      localStorage.setItem("token", data.token);

      const toastPromise = new Promise<void>((resolve) => {
        toast.success("Đăng nhập thành công", {
          duration: 2000,
        });
        setTimeout(resolve, 2000);
      });

      toastPromise.then(() => {
        router.push("/");
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi đăng nhập");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterState) => authApi.register(userData),
    onSuccess: () => {
      const toastPromise = new Promise<void>((resolve) => {
        toast.success("Đăng ký thành công", {
          duration: 2000,
        });
        setTimeout(resolve, 2000);
      });

      toastPromise.then(() => {
        router.push("/login");
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi đăng ký");
    },
  });

  return {
    loginMutation,
    registerMutation,
  };
};