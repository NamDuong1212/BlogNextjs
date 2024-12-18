import axios from "axios";
import {
  LoginState,
  LoginResponse,
  RegisterState,
  RegisterResponse,
} from "../types/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = {
  login: async (credentials: LoginState): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: RegisterState): Promise<any> => {
    const response = await api.post<RegisterResponse>(
      "/auth/signup",
      userData,
    );
    return response.data;
  },
};
