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

export const categoryApi = {
  createCategory: async (data: any): Promise<any> => {
    const response = await api.post('/cms/category/create', data);
    return response.data;
  },
  
  updateCategory: async (id: string, data: any): Promise<any> => {
    const response = await api.patch(`/cms/category/${id}`, data);
    return response.data;
  },
  
  getCategories: async (): Promise<any> => {
    const response = await api.get('/cms/category/getAll');
    return response.data;
  },
};