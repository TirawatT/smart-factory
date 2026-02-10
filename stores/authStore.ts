"use client";

import { AuthState } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: true,

      login: async (email: string, password: string): Promise<boolean> => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) return false;

          const data = await res.json();
          set({
            user: data.user,
            permissions: data.permissions,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch {
          return false;
        }
      },

      logout: () => {
        fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        set({
          user: null,
          permissions: [],
          isAuthenticated: false,
          isLoading: false,
        });
      },

      checkAuth: () => {
        const state = get();
        if (state.user) {
          set({ isLoading: false });
        } else {
          set({ isLoading: false, isAuthenticated: false });
        }
      },
    }),
    {
      name: "sf-auth",
      partialize: (state) => ({
        user: state.user,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Helper hook for checking permissions
export function usePermission(permission: string): boolean {
  const permissions = useAuthStore((s) => s.permissions);
  return permissions.includes(permission);
}

export function useHasAnyPermission(perms: string[]): boolean {
  const permissions = useAuthStore((s) => s.permissions);
  return perms.some((p) => permissions.includes(p));
}
