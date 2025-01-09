import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserState } from "../types/auth";

const useAuthStore = create<UserState>()(
  persist(
    (set, get) => ({
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

      isAuthenticated: () => {
        const state = get()
        return !!state.userData && !!state.accessToken
      },
    }),
    {
      name: "cms-store",
      partialize: (state) => ({
        accessToken: state.accessToken,
        userData: state.userData,
      }),
    },
  ),
);

export default useAuthStore;
