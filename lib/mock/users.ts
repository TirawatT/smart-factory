import type { User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "usr-001-admin",
    email: "admin@smartfactory.com",
    name: "สมชาย อดมินิสเตอร์",
    role: "admin",
    status: "active",
    avatar: undefined,
    lastLoginAt: new Date("2026-02-12T08:30:00Z"),
    createdAt: new Date("2025-06-01T00:00:00Z"),
    updatedAt: new Date("2026-02-12T08:30:00Z"),
  },
  {
    id: "usr-002-manager",
    email: "manager@smartfactory.com",
    name: "สมหญิง ผู้จัดการ",
    role: "manager",
    status: "active",
    avatar: undefined,
    lastLoginAt: new Date("2026-02-11T14:20:00Z"),
    createdAt: new Date("2025-07-15T00:00:00Z"),
    updatedAt: new Date("2026-02-11T14:20:00Z"),
  },
  {
    id: "usr-003-operator",
    email: "operator@smartfactory.com",
    name: "สมศักดิ์ โอเปอเรเตอร์",
    role: "operator",
    status: "active",
    avatar: undefined,
    lastLoginAt: new Date("2026-02-12T06:00:00Z"),
    createdAt: new Date("2025-08-01T00:00:00Z"),
    updatedAt: new Date("2026-02-12T06:00:00Z"),
  },
  {
    id: "usr-004-operator2",
    email: "operator2@smartfactory.com",
    name: "วิชัย เทคนิเชียน",
    role: "operator",
    status: "active",
    avatar: undefined,
    lastLoginAt: new Date("2026-02-10T22:00:00Z"),
    createdAt: new Date("2025-09-10T00:00:00Z"),
    updatedAt: new Date("2026-02-10T22:00:00Z"),
  },
  {
    id: "usr-005-guest",
    email: "guest@smartfactory.com",
    name: "ผู้เยี่ยมชม ทดสอบ",
    role: "guest",
    status: "active",
    avatar: undefined,
    lastLoginAt: new Date("2026-02-09T10:00:00Z"),
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-02-09T10:00:00Z"),
  },
  {
    id: "usr-006-inactive",
    email: "inactive@smartfactory.com",
    name: "ไม่ใช้งาน แล้ว",
    role: "operator",
    status: "inactive",
    avatar: undefined,
    lastLoginAt: new Date("2025-12-01T00:00:00Z"),
    createdAt: new Date("2025-06-15T00:00:00Z"),
    updatedAt: new Date("2026-01-15T00:00:00Z"),
  },
];

// Mock password: "password123" for all users
export const mockUserPasswords: Record<string, string> = {
  "admin@smartfactory.com": "password123",
  "manager@smartfactory.com": "password123",
  "operator@smartfactory.com": "password123",
  "operator2@smartfactory.com": "password123",
  "guest@smartfactory.com": "password123",
};

export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((u) => u.email === email && u.status === "active");
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getUsersByRole(role: string): User[] {
  return mockUsers.filter((u) => u.role === role);
}
