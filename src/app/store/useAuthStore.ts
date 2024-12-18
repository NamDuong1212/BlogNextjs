import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserState } from "../types/auth";

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
      partialize: (state) => ({
        userData: state.userData,
      }),
    },
  ),
);

export default useAuthStore;
