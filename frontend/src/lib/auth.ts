import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "@/types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          // TODO: Replace with actual API call
          const mockUser: User = {
            id: "1",
            email,
            name:
              email === "admin@ddp.com"
                ? "Administrator"
                : email === "company@ddp.com"
                ? "Company User"
                : "Regular User",
            role:
              email === "admin@ddp.com"
                ? "admin"
                : email === "company@ddp.com"
                ? "company"
                : "user",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export const getRedirectPath = (role: string): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "company":
      return "/company/dashboard";
    case "user":
    default:
      return "/user/dashboard";
  }
};
