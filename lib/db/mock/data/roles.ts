import { Role } from "@/types";

export const mockRoles: Role[] = [
  {
    id: "role_admin",
    name: "admin",
    displayName: "Administrator",
    description: "Full system access with all privileges",
    isSystem: true,
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "role_manager",
    name: "manager",
    displayName: "Manager",
    description:
      "Can view all data, manage devices and alerts, limited user management",
    isSystem: true,
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "role_operator",
    name: "operator",
    displayName: "Operator",
    description: "Can view devices, send commands, and acknowledge alerts",
    isSystem: true,
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "role_guest",
    name: "guest",
    displayName: "Guest",
    description: "Read-only access to dashboards and monitoring",
    isSystem: true,
    createdAt: new Date("2025-01-01"),
  },
];
