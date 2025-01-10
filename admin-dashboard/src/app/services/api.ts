import axios from "axios";

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
  login: async (userData: any): Promise<any> => {
    const response = await api.post("/cms/login", userData);
    return response.data;
  },
  register: async (userData: any): Promise<any> => {
    const response = await api.post("/cms/signup", userData);
    return response.data;
  },
};
const BASE = '/cms/category';
export const categoryApi = {
  createCategory: async (data: any): Promise<any> => {
    const response = await api.post(`${BASE}/create`, data);
    return response.data;
  },
  
  updateCategory: async (id: string, data: any): Promise<any> => {
    const response = await api.patch(`${BASE}/${id}`, data);
    return response.data;
  },
  
  getAllCategories: async (): Promise<any> => {
    const response = await api.get(`${BASE}/get-all`);
    return response.data;
  },

  getDeleteCategory: async (id: string): Promise<any> => {
    const response = await api.delete(`${BASE}/${id}`);
    return response.data;
  },
};

const BASE$1 = '/cms/post';
export const postApi = {
  getAllPosts: async (): Promise<any> => {
    const response = await api.get(`/post/getAll`);
    return response.data;
  },
  getDeletePost: async (id: string): Promise<any> => {
    const response = await api.delete(`${BASE$1}/${id}`);
    return response.data;
  }
};
