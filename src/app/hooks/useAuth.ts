import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authApi } from "../services/api";
import useAuthStore from "../store/useAuthStore";
import { LoginState, RegisterState } from "../types/auth";

export const useAuth = () => {
  const router = useRouter();
  const setUserData = useAuthStore((state) => state.setUserData);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginState) => authApi.login(credentials),
    onSuccess: (data) => {
      setUserData({
        token: data.token,
        id: data.id,
        username: data.username,
        email: data.email,
      });

      localStorage.setItem("token", data.token);

      console.log("token:", localStorage.getItem("token"));

      toast.success("Login Successful", {
        autoClose: 2000,
        onClose: () => router.push("/login"),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Invalid Credentials", {
        autoClose: 2000,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterState) => authApi.register(userData),
    onSuccess: () => {
      toast.success("Registration Successful", {
        autoClose: 2000,
        onClose: () => router.push("/login"),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error during registration", {
        autoClose: 2000,
      });
    },
  });

  return {
    loginMutation,
    registerMutation,
  };
};
