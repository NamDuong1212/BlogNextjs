import axios from "axios";
import { LoginState, RegisterState } from "../types/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = {
  login: async (credentials: LoginState): Promise<any> => {
    const response = await api.post<any>("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: RegisterState): Promise<any> => {
    const response = await api.post<any>("/auth/signup", userData);
    return response.data;
  },
};
