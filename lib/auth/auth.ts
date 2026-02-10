import { roleRepository, userRepository } from "@/lib/db";
import { User } from "@/types";

const AUTH_COOKIE = "sf_auth_user";

export async function login(
  email: string,
  password: string,
): Promise<{ user: User; permissions: string[] } | null> {
  const userWithPassword = await userRepository.findByEmail(email);
  if (!userWithPassword) return null;
  if (!userWithPassword.isActive) return null;

  // Mock: compare plain text passwords
  if (userWithPassword.passwordHash !== password) return null;

  const permissions = await getUserPermissions(userWithPassword.roleId);
  const { passwordHash: _, ...user } = userWithPassword;

  return { user, permissions };
}

export async function getUserPermissions(roleId: string): Promise<string[]> {
  const permissions = await roleRepository.getPermissions(roleId);
  return permissions.map((p) => p.key);
}

export async function getUserById(userId: string): Promise<User | null> {
  return userRepository.findById(userId);
}

export function getAuthCookieName(): string {
  return AUTH_COOKIE;
}

export function checkPermission(
  userPermissions: string[],
  requiredPermission: string,
): boolean {
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: string[],
): boolean {
  return requiredPermissions.some((p) => userPermissions.includes(p));
}
