import axios from "axios";
import { get } from "http";
import { User , UpdateCreatorStatusDto} from "@/app/types/user";

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
  
  deletePost: async (id: string, reason: string): Promise<any> => {
    const response = await api.delete(`${BASE$1}/${id}`, {
      data: { reason } 
    });
    return response.data;
  },
  notifyPostDeletion: async (postId: string): Promise<any> => {
    const response = await api.post(`cms/notify`, { postId });
    return response.data;
  }
};

export const dailyApi = {
  getViews: async (): Promise<any> => {
    const response = await api.get(`/cms/views`);
    return response.data;
  },
  getDailyWallet: async (): Promise<any> => {
    const response = await api.post(`/cms/wallet/daily`);
    return response.data;
  }
};

export const reportApi = {
  getReport: async (): Promise<any> => {
    const response = await api.get(`/cms/report/get-all`);
    return response.data;
  },
  deleteReport: async (id: string): Promise<any> => {
    const response = await api.delete(`/cms/report/${id}`);
    return response.data;
  }
};

export const userApi = {
  getAllUsers: async (): Promise<{ message: string; data: User[] }> => {
    const response = await api.get("/cms/user/get-all");
    return response.data;
  },

  getUserById: async (id: string): Promise<{ message: string; data: User }> => {
    const response = await api.get(`/cms/user/${id}`);
    return response.data;
  },

  updateCreatorStatus: async (
    userId: string,
    updateData: UpdateCreatorStatusDto
  ): Promise<{ message: string; data: User }> => {
    const response = await api.patch(`/cms/user/${userId}/creator-status`, updateData);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/cms/user/${userId}`);
    return response.data;
  },

  // Additional methods for notifications
  sendNotification: async (
    userId: string,
    notificationData: {
      type: string;
      title: string;
      message: string;
    }
  ): Promise<{ message: string }> => {
    const response = await api.post(`/cms/user/${userId}/notification`, notificationData);
    return response.data;
  },
};

export const creatorRequestApi = {
  getAllCreatorRequests: async (): Promise<any> => {
    const response = await api.get(`/cms/creator-requests`);
    return response.data;
  },

  reviewCreatorRequest: async (id: string, data: any): Promise<any> => {
    const response = await api.patch(`/cms/creator-requests/${id}/review`, data);
    return response.data;
  },
};