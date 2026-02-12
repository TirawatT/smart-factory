export type UserRole = "admin" | "manager" | "operator" | "guest";
export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly avatar?: string;
  readonly lastLoginAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt?: Date;
}

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly avatar?: string;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface AuthState {
  readonly user: AuthUser | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
}

export interface Permission {
  readonly id: string;
  readonly resource: string;
  readonly action: string;
  readonly description: string;
}

export interface Role {
  readonly id: string;
  readonly name: UserRole;
  readonly displayName: string;
  readonly description: string;
  readonly permissions: readonly Permission[];
  readonly isSystem: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface RolePermissionMatrix {
  readonly role: UserRole;
  readonly permissions: Record<string, readonly string[]>;
}
