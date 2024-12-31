import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserState } from "../types/auth";
import Cookies from "js-cookie";

const cookieStorage = {
  getItem: (name: string) => {
    const value = Cookies.get(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    Cookies.set(name, JSON.stringify(value), {
      expires: 7, 
      secure: process.env.NODE_ENV === 'production', 
    });
  },
  removeItem: (name: string) => {
    Cookies.remove(name);
  }
};

const useAuthStore = create<UserState>()(
  persist(
    (set) => ({
      accessToken: null,
      userData: null,
      setUserData: (data) => {
        const { token, user } = data;
        set({
          accessToken: token,
          userData: user,
        });
        
        console.log("setUserData called with:", data);
        console.log("Auth store state updated:", {
          accessToken: token,
          userData: user,
        });
      },
      
      clearUserData: () => {
        set({
          accessToken: null,
          userData: null,
        });
        
        console.log("User data cleared");
      },
    }),
    {
      name: "auth-store",
      storage: cookieStorage,
      partialize: (state) => ({
        accessToken: state.accessToken,
        userData: state.userData,
      }),
    }
  )
);

export default useAuthStore;