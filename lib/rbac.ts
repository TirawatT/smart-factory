import { ROLE_PERMISSIONS } from "@/lib/constants";
import type { UserRole } from "@/types";

export function checkPermission(
  role: UserRole,
  resource: string,
  action: string,
): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  const resourcePermissions = permissions[resource];
  if (!resourcePermissions) return false;

  return resourcePermissions.includes(action);
}

export function hasAnyPermission(
  role: UserRole,
  resource: string,
  actions: readonly string[],
): boolean {
  return actions.some((action) => checkPermission(role, resource, action));
}

export function hasAllPermissions(
  role: UserRole,
  resource: string,
  actions: readonly string[],
): boolean {
  return actions.every((action) => checkPermission(role, resource, action));
}

export function getAccessibleResources(role: UserRole): string[] {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return [];

  return Object.entries(permissions)
    .filter(([, actions]) => actions.length > 0)
    .map(([resource]) => resource);
}
