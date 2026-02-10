export type UserRole = "admin" | "manager" | "operator" | "guest";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roleId: string;
  isActive: boolean;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  isSystem: boolean;
  createdAt: Date;
}

export interface Permission {
  id: string;
  key: string;
  module: string;
  description: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  roleId: string;
  roleName: string;
}

export interface AuthState {
  user: User | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  roleId: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  roleId?: string;
  isActive?: boolean;
}
