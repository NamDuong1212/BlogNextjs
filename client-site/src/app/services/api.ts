import axios from "axios";
import { LoginState, RegisterState, VerifyOtpState } from "../types/auth";
import { UpdateUser } from "../types/profile";
import { CreateCategoryType } from "../types/category";
import { get } from "http";

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
  login: async (userData: LoginState): Promise<any> => {
    const response = await api.post("/auth/login", userData);
    return response.data;
  },
  register: async (userData: RegisterState): Promise<any> => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },
  verifyOtp: async (data: any): Promise<any> => {
    const response = await api.post("/auth/verify-otp", data);
    return response.data;
  },
};

export const profileApi = {
  updateProfile: async (data: UpdateUser): Promise<any> => {
    const response = await api.patch("/user/profile", data);
    return response.data;
  },
  updateAvatar: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.patch("/user/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export const categoryApi = {
  createCategory: async (data: CreateCategoryType): Promise<any> => {
    const response = await api.post("/category/create", data);
    return response.data;
  },

  getCategories: async (): Promise<any> => {
    const response = await api.get("/category/getAll");
    return response.data;
  },

  getCategoryById: async (id: string): Promise<any> => {
    const response = await api.get(`/category/${id}`);
    return response.data.data;
  },
};

export const tagApi = {
  createTag: async (data: any): Promise<any> => {
    const response = await api.post("/tag/create", data);
    return response.data;
  },
  getTags: async (): Promise<any> => {
    const response = await api.get("/tag/getAll");
    return response.data.data;
  },
  
};

export const postApi = {
  createPost: async (data: any): Promise<any> => {
    const response = await api.post("/post/create", data);
    return response.data;
  },

  getPosts: async (): Promise<any> => {
    const response = await api.get("/post/getAll");
    return response.data.data || [];
  },

  getPostByCreator: async (userId: string): Promise<any> => {
    const response = await api.get(`/post/by-user/${userId}`);
    return response.data.data || [];
  },

  getPostsByCategory: async (id: any): Promise<any> => {
    const response = await api.get(`/post/GetByCategory/${id}`);
    return response.data.data || [];
  },

  getPostById: async (id: any): Promise<any> => {
    const response = await api.get(`/post/${id}`);
    return response.data;
  },

  updatePost: async (data: any): Promise<any> => {
    const response = await api.patch(`/post/${data.id}`, data);
    return response.data.data;
  },

  deletePost: async (id: any): Promise<any> => {
    const response = await api.delete(`/post/${id}`);
    return response.data.data;
  },
  uploadPostImage: async (id: any, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.patch(`/post/${id}/upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export const likeApi = {
  likePost: async (postId: string): Promise<any> => {
    const response = await api.post(`/like/${postId}`);
    return response.data;
  },

  unlikePost: async (postId: string): Promise<any> => {
    const response = await api.delete(`/like/${postId}`);
    return response.data;
  },

  getLikeCount: async (postId: string): Promise<any> => {
    const response = await api.get(`/like/${postId}/count`);
    return response.data;
  },
};

export const commentApi = {
  getCommentsByPostId: async (postId: any): Promise<any> => {
    const response = await api.get(`/comment/${postId}`);
    return response.data.data || [];
  },

  createComment: async (data: any): Promise<any> => {
    const response = await api.post(`/comment/create`, data);
    return response.data;
  },

  updateComment: async (id: any, data: any): Promise<any> => {
    const response = await api.patch(`/comment/${id}`, data);
    return response.data;
  },

  deleteComment: async (id: any): Promise<any> => {
    const response = await api.delete(`/comment/${id}`);
    return response.data;
  },

  replyToComment: async (
    postId: any,
    parentId: any,
    data: any,
  ): Promise<any> => {
    const response = await api.post(
      `/comment/reply/${postId}/${parentId}`,
      data,
    );
    return response.data;
  },
};

export const walletApi = {
  getWalletByUserId: async (): Promise<any> => {
    const response = await api.get("/wallet");
    return response.data;
  },
  createWallet: async (): Promise<any> => {
    const response = await api.post("/wallet/create");
    return response.data;
  },
  requestWithdrawal: async ({ amount }: { amount: number }): Promise<any> => {
    const response = await api.post("/wallet/withdrawals", { amount });
    return response.data;
  },
};

export const ratingApi = {
  createRating: async (postId: string, stars: number): Promise<any> => {
    const response = await api.post("/rating", { postId, stars });
    return response.data;
  },

  getAverageRating: async (postId: string): Promise<any> => {
    const response = await api.get(`/rating/${postId}`);
    return response.data;
  },
  getRatingById: async (ratingId: string): Promise<any> => {
    const response = await api.get(`/rating/get/${ratingId}`);
    return response.data;
  },
};

export const reportApi = {
  createReport: async (postId: any, data: any): Promise<any> => {
    const response = await api.post(`/report/create/${postId}`, data);
    return response.data;
  },
};