import { Permission, RolePermission } from "@/types";

export const mockPermissions: Permission[] = [
  // Dashboard
  {
    id: "perm_01",
    key: "dashboard:view",
    module: "dashboard",
    description: "View main dashboard",
  },

  // Monitoring
  {
    id: "perm_02",
    key: "monitoring:view",
    module: "monitoring",
    description: "View real-time monitoring",
  },
  {
    id: "perm_03",
    key: "monitoring:digital_twin",
    module: "monitoring",
    description: "Access digital twin 3D view",
  },

  // Devices
  {
    id: "perm_04",
    key: "devices:read",
    module: "devices",
    description: "View device list and details",
  },
  {
    id: "perm_05",
    key: "devices:write",
    module: "devices",
    description: "Create and update devices",
  },
  {
    id: "perm_06",
    key: "devices:delete",
    module: "devices",
    description: "Delete/decommission devices",
  },
  {
    id: "perm_07",
    key: "devices:command",
    module: "devices",
    description: "Send commands to devices (start/stop)",
  },

  // Energy
  {
    id: "perm_08",
    key: "energy:read",
    module: "energy",
    description: "View energy data and reports",
  },
  {
    id: "perm_09",
    key: "energy:manage",
    module: "energy",
    description: "Manage energy targets and settings",
  },

  // Alerts
  {
    id: "perm_10",
    key: "alerts:read",
    module: "alerts",
    description: "View alerts",
  },
  {
    id: "perm_11",
    key: "alerts:acknowledge",
    module: "alerts",
    description: "Acknowledge alerts",
  },
  {
    id: "perm_12",
    key: "alerts:resolve",
    module: "alerts",
    description: "Resolve alerts",
  },
  {
    id: "perm_13",
    key: "alerts:manage_rules",
    module: "alerts",
    description: "Create/edit/delete alert rules",
  },

  // Users
  {
    id: "perm_14",
    key: "users:read",
    module: "users",
    description: "View user list",
  },
  {
    id: "perm_15",
    key: "users:write",
    module: "users",
    description: "Create and update users",
  },
  {
    id: "perm_16",
    key: "users:delete",
    module: "users",
    description: "Delete/deactivate users",
  },
  {
    id: "perm_17",
    key: "roles:read",
    module: "users",
    description: "View roles and permissions",
  },
  {
    id: "perm_18",
    key: "roles:manage",
    module: "users",
    description: "Create/edit roles and assign permissions",
  },

  // Audit Logs
  {
    id: "perm_19",
    key: "logs:read",
    module: "logs",
    description: "View audit logs",
  },
  {
    id: "perm_20",
    key: "logs:export",
    module: "logs",
    description: "Export audit log data",
  },

  // System
  {
    id: "perm_21",
    key: "system:health",
    module: "system",
    description: "View system health dashboard",
  },
  {
    id: "perm_22",
    key: "system:settings",
    module: "system",
    description: "Manage system settings",
  },
];

// role_admin gets ALL permissions
// role_manager gets most except user/role management and system settings
// role_operator gets device view/command, alert view/acknowledge, dashboard, monitoring
// role_guest gets only read/view permissions for dashboard, monitoring, devices(read), energy(read), alerts(read)

export const mockRolePermissions: RolePermission[] = [
  // Admin - ALL permissions
  ...mockPermissions.map((p) => ({ roleId: "role_admin", permissionId: p.id })),

  // Manager
  { roleId: "role_manager", permissionId: "perm_01" }, // dashboard:view
  { roleId: "role_manager", permissionId: "perm_02" }, // monitoring:view
  { roleId: "role_manager", permissionId: "perm_03" }, // monitoring:digital_twin
  { roleId: "role_manager", permissionId: "perm_04" }, // devices:read
  { roleId: "role_manager", permissionId: "perm_05" }, // devices:write
  { roleId: "role_manager", permissionId: "perm_07" }, // devices:command
  { roleId: "role_manager", permissionId: "perm_08" }, // energy:read
  { roleId: "role_manager", permissionId: "perm_09" }, // energy:manage
  { roleId: "role_manager", permissionId: "perm_10" }, // alerts:read
  { roleId: "role_manager", permissionId: "perm_11" }, // alerts:acknowledge
  { roleId: "role_manager", permissionId: "perm_12" }, // alerts:resolve
  { roleId: "role_manager", permissionId: "perm_13" }, // alerts:manage_rules
  { roleId: "role_manager", permissionId: "perm_14" }, // users:read
  { roleId: "role_manager", permissionId: "perm_17" }, // roles:read
  { roleId: "role_manager", permissionId: "perm_19" }, // logs:read
  { roleId: "role_manager", permissionId: "perm_21" }, // system:health

  // Operator
  { roleId: "role_operator", permissionId: "perm_01" }, // dashboard:view
  { roleId: "role_operator", permissionId: "perm_02" }, // monitoring:view
  { roleId: "role_operator", permissionId: "perm_04" }, // devices:read
  { roleId: "role_operator", permissionId: "perm_07" }, // devices:command
  { roleId: "role_operator", permissionId: "perm_08" }, // energy:read
  { roleId: "role_operator", permissionId: "perm_10" }, // alerts:read
  { roleId: "role_operator", permissionId: "perm_11" }, // alerts:acknowledge

  // Guest
  { roleId: "role_guest", permissionId: "perm_01" }, // dashboard:view
  { roleId: "role_guest", permissionId: "perm_02" }, // monitoring:view
  { roleId: "role_guest", permissionId: "perm_04" }, // devices:read
  { roleId: "role_guest", permissionId: "perm_08" }, // energy:read
  { roleId: "role_guest", permissionId: "perm_10" }, // alerts:read
];
