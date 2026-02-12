"use client";

import { useAuth } from "@/contexts/auth-context";
import { checkPermission } from "@/lib/rbac";
import { useCallback } from "react";

export function usePermission() {
  const { user } = useAuth();

  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      if (!user) return false;
      return checkPermission(user.role, resource, action);
    },
    [user],
  );

  const hasAny = useCallback(
    (resource: string, actions: readonly string[]): boolean => {
      if (!user) return false;
      return actions.some((action) =>
        checkPermission(user.role, resource, action),
      );
    },
    [user],
  );

  return { hasPermission, hasAny, role: user?.role ?? null };
}
