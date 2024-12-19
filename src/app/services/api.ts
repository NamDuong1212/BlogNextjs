import axios from "axios";
import { LoginState, RegisterState } from "../types/auth";
import { UpdateUser } from "../types/profile";
import { CreateCategoryType, UpdateCategoryType } from "../types/category";

const getAuthToken = () => localStorage.getItem("token");

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const authApi = {
  login: async (credentials: LoginState): Promise<any> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: RegisterState): Promise<any> => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },
};

export const profileApi = {
  updateProfile: async (data: UpdateUser): Promise<any> => {
    const response = await api.patch("/user/profile", data);
    return response.data;
  },
};

export const categoryApi = {
  createCategory: async (data: CreateCategoryType): Promise<any> => {
    const response = await api.post("/category/create", data);
    return response.data;
  },

  updateCategory: async (
    id: string,
    data: UpdateCategoryType,
  ): Promise<any> => {
    const response = await api.put(`/category/${id}`, data);
    return response.data;
  },

  getCategoryById: async (id: string): Promise<any> => {
    const response = await api.get(`/category/${id}`);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<any> => {
    const response = await api.delete(`/category/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<any> => {
    const response = await api.get("/category/getAll");
    return response.data;
  },
};
