import type { Permission, Role, RolePermissionMatrix } from "@/types";

export const mockPermissions: Permission[] = [
  {
    id: "perm-001",
    resource: "dashboard",
    action: "view",
    description: "View dashboard",
  },
  {
    id: "perm-002",
    resource: "device",
    action: "view",
    description: "View devices",
  },
  {
    id: "perm-003",
    resource: "device",
    action: "create",
    description: "Create devices",
  },
  {
    id: "perm-004",
    resource: "device",
    action: "update",
    description: "Update devices",
  },
  {
    id: "perm-005",
    resource: "device",
    action: "delete",
    description: "Delete devices",
  },
  {
    id: "perm-006",
    resource: "device",
    action: "control",
    description: "Control devices (start/stop)",
  },
  {
    id: "perm-007",
    resource: "alert",
    action: "view",
    description: "View alerts",
  },
  {
    id: "perm-008",
    resource: "alert",
    action: "create",
    description: "Create alerts",
  },
  {
    id: "perm-009",
    resource: "alert",
    action: "update",
    description: "Update alerts",
  },
  {
    id: "perm-010",
    resource: "alert",
    action: "acknowledge",
    description: "Acknowledge alerts",
  },
  {
    id: "perm-011",
    resource: "alert_rule",
    action: "view",
    description: "View alert rules",
  },
  {
    id: "perm-012",
    resource: "alert_rule",
    action: "create",
    description: "Create alert rules",
  },
  {
    id: "perm-013",
    resource: "alert_rule",
    action: "update",
    description: "Update alert rules",
  },
  {
    id: "perm-014",
    resource: "alert_rule",
    action: "delete",
    description: "Delete alert rules",
  },
  {
    id: "perm-015",
    resource: "user",
    action: "view",
    description: "View users",
  },
  {
    id: "perm-016",
    resource: "user",
    action: "create",
    description: "Create users",
  },
  {
    id: "perm-017",
    resource: "user",
    action: "update",
    description: "Update users",
  },
  {
    id: "perm-018",
    resource: "user",
    action: "delete",
    description: "Delete/deactivate users",
  },
  {
    id: "perm-019",
    resource: "role",
    action: "view",
    description: "View roles",
  },
  {
    id: "perm-020",
    resource: "role",
    action: "create",
    description: "Create roles",
  },
  {
    id: "perm-021",
    resource: "role",
    action: "update",
    description: "Update roles",
  },
  {
    id: "perm-022",
    resource: "role",
    action: "delete",
    description: "Delete roles",
  },
  {
    id: "perm-023",
    resource: "log",
    action: "view",
    description: "View audit logs",
  },
  {
    id: "perm-024",
    resource: "log",
    action: "export",
    description: "Export audit logs",
  },
  {
    id: "perm-025",
    resource: "energy",
    action: "view",
    description: "View energy data",
  },
  {
    id: "perm-026",
    resource: "energy",
    action: "export",
    description: "Export energy reports",
  },
  {
    id: "perm-027",
    resource: "settings",
    action: "view",
    description: "View settings",
  },
  {
    id: "perm-028",
    resource: "settings",
    action: "update",
    description: "Update settings",
  },
  {
    id: "perm-029",
    resource: "system_health",
    action: "view",
    description: "View system health",
  },
  {
    id: "perm-030",
    resource: "digital_twin",
    action: "view",
    description: "View digital twin",
  },
];

export const mockRoles: Role[] = [
  {
    id: "role-001",
    name: "admin",
    displayName: "Admin",
    description:
      "Full system access — manage users, roles, settings, and all operations",
    permissions: mockPermissions,
    isSystem: true,
    createdAt: new Date("2025-06-01T00:00:00Z"),
    updatedAt: new Date("2025-06-01T00:00:00Z"),
  },
  {
    id: "role-002",
    name: "manager",
    displayName: "Manager",
    description: "View all data, manage alerts, export reports",
    permissions: mockPermissions.filter(
      (p) =>
        [
          "dashboard",
          "device",
          "alert",
          "alert_rule",
          "user",
          "role",
          "log",
          "energy",
          "settings",
          "system_health",
          "digital_twin",
        ].includes(p.resource) &&
        [
          "view",
          "control",
          "acknowledge",
          "create",
          "update",
          "export",
        ].includes(p.action),
    ),
    isSystem: true,
    createdAt: new Date("2025-06-01T00:00:00Z"),
    updatedAt: new Date("2025-06-01T00:00:00Z"),
  },
  {
    id: "role-003",
    name: "operator",
    displayName: "Operator",
    description: "Monitor and control devices, acknowledge alerts",
    permissions: mockPermissions.filter(
      (p) =>
        [
          "dashboard",
          "device",
          "alert",
          "alert_rule",
          "log",
          "energy",
          "system_health",
          "digital_twin",
        ].includes(p.resource) &&
        ["view", "control", "acknowledge"].includes(p.action),
    ),
    isSystem: true,
    createdAt: new Date("2025-06-01T00:00:00Z"),
    updatedAt: new Date("2025-06-01T00:00:00Z"),
  },
  {
    id: "role-004",
    name: "guest",
    displayName: "Guest",
    description: "View-only access to dashboard, devices, and energy data",
    permissions: mockPermissions.filter(
      (p) =>
        ["dashboard", "device", "alert", "energy", "digital_twin"].includes(
          p.resource,
        ) && p.action === "view",
    ),
    isSystem: true,
    createdAt: new Date("2025-06-01T00:00:00Z"),
    updatedAt: new Date("2025-06-01T00:00:00Z"),
  },
];

export const mockRolePermissionMatrix: RolePermissionMatrix[] = [
  {
    role: "admin",
    permissions: {
      dashboard: ["view"],
      device: ["view", "create", "update", "delete", "control"],
      alert: ["view", "create", "update", "acknowledge"],
      alert_rule: ["view", "create", "update", "delete"],
      user: ["view", "create", "update", "delete"],
      role: ["view", "create", "update", "delete"],
      log: ["view", "export"],
      energy: ["view", "export"],
      settings: ["view", "update"],
      system_health: ["view"],
      digital_twin: ["view"],
    },
  },
  {
    role: "manager",
    permissions: {
      dashboard: ["view"],
      device: ["view", "control"],
      alert: ["view", "acknowledge"],
      alert_rule: ["view", "create", "update"],
      user: ["view"],
      role: ["view"],
      log: ["view"],
      energy: ["view", "export"],
      settings: ["view"],
      system_health: ["view"],
      digital_twin: ["view"],
    },
  },
  {
    role: "operator",
    permissions: {
      dashboard: ["view"],
      device: ["view", "control"],
      alert: ["view", "acknowledge"],
      alert_rule: ["view"],
      log: ["view"],
      energy: ["view"],
      system_health: ["view"],
      digital_twin: ["view"],
    },
  },
  {
    role: "guest",
    permissions: {
      dashboard: ["view"],
      device: ["view"],
      alert: ["view"],
      energy: ["view"],
      digital_twin: ["view"],
    },
  },
];
