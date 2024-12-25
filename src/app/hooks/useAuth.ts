import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authApi } from "../services/api";
import useAuthStore from "../store/useAuthStore";
import { LoginState, RegisterState, VerifyOtpState } from "../types/auth";

export const useAuth = () => {
  const router = useRouter();
  const setUserData = useAuthStore((state) => state.setUserData);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginState) => authApi.login(credentials),
    onSuccess: (data) => {
      setUserData({
        token: data.token,
        user: data.user,
      });

      localStorage.setItem("token", data.token);

      toast.success("Login Successful", {
        autoClose: 2000,
        onClose: () => router.push("/"),
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
    onError: (error: Error) => {
      toast.error(error.message || "Error during registration", {
        autoClose: 2000,
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: VerifyOtpState) => authApi.verifyOtp(data),
    onError: (error: Error) => {
      toast.error(error.message || "Error verifying OTP", {
        autoClose: 2000,
      });
    },
  });

  return {
    loginMutation,
    registerMutation,
    verifyOtpMutation,
  };
};
