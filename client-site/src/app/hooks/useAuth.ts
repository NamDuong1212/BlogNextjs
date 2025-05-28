import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { authApi } from "../services/api";
import useAuthStore from "../store/useAuthStore";
import { LoginState, RegisterState, VerifyOtpState, ResetPasswordRequest, ForgotPasswordRequest } from "../types/auth";

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
        toast.success("Login successful", {
          duration: 2000,
        });
        setTimeout(resolve, 2000);
      });

      toastPromise.then(() => {
        router.push("/");
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterState) => authApi.register(userData),
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: VerifyOtpState) => authApi.verifyOtp(data),
    onError: (error: Error) => {
      toast.error(error.message || "OTP verification failed");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => authApi.changePassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password changed successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);
    },
  });

   const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password reset link sent to your email");
      // Optionally redirect to a confirmation page
      // router.push("/forgot-password-confirmation");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to send reset link";
      toast.error(errorMessage);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password reset successfully");
      
      // Redirect to login page after successful password reset
      const toastPromise = new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      });

      toastPromise.then(() => {
        router.push("/login");
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
    },
  });

  return {
    loginMutation,
    registerMutation,
    verifyOtpMutation,
    changePasswordMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
  };
};
