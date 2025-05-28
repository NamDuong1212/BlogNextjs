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
        toast.success("Login successfully", {
          duration: 2000,
        });
        setTimeout(resolve, 2000);
      });

      toastPromise.then(() => {
        router.push("/");
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error logging in");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterState) => authApi.register(userData),
    onSuccess: () => {
      const toastPromise = new Promise<void>((resolve) => {
        toast.success("Register successfully", {
          duration: 2000,
        });
        setTimeout(resolve, 2000);
      });

      toastPromise.then(() => {
        router.push("/login");
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error registering user");
    },
  });

  return {
    loginMutation,
    registerMutation,
  };
};