import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserState } from "../types/auth";

const useAuthStore = create<UserState>()(
  persist(
    (set) => ({
      accessToken: null,
      userData: null,
      setUserData: (data) =>
        set({
          accessToken: data.token,
          userData: {
            id: data.id,
            username: data.username,
            email: data.email,
          },
        }),
      clearUserData: () =>
        set({
          accessToken: null,
          userData: null,
        }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ userData: state.userData }),
    },
  ),
);

export default useAuthStore;
