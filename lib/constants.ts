import type { UserRole } from "@/types";

export const APP_NAME = "Smart Factory";
export const APP_DESCRIPTION =
  "Real-time Industrial Monitoring & Control System";

export const ROLES: Record<
  UserRole,
  { displayName: string; description: string; level: number }
> = {
  admin: { displayName: "Admin", description: "Full system access", level: 0 },
  manager: {
    displayName: "Manager",
    description: "View all data & manage alerts",
    level: 1,
  },
  operator: {
    displayName: "Operator",
    description: "Monitor & control devices",
    level: 2,
  },
  guest: { displayName: "Guest", description: "View-only access", level: 3 },
} as const;

export const PERMISSIONS = {
  DASHBOARD: { resource: "dashboard", actions: ["view"] },
  DEVICES: {
    resource: "device",
    actions: ["view", "create", "update", "delete", "control"],
  },
  ALERTS: {
    resource: "alert",
    actions: ["view", "create", "update", "acknowledge"],
  },
  ALERT_RULES: {
    resource: "alert_rule",
    actions: ["view", "create", "update", "delete"],
  },
  USERS: { resource: "user", actions: ["view", "create", "update", "delete"] },
  ROLES: { resource: "role", actions: ["view", "create", "update", "delete"] },
  LOGS: { resource: "log", actions: ["view", "export"] },
  ENERGY: { resource: "energy", actions: ["view", "export"] },
  SETTINGS: { resource: "settings", actions: ["view", "update"] },
  SYSTEM_HEALTH: { resource: "system_health", actions: ["view"] },
  DIGITAL_TWIN: { resource: "digital_twin", actions: ["view"] },
} as const;

export const ROLE_PERMISSIONS: Record<
  UserRole,
  Record<string, readonly string[]>
> = {
  admin: {
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
  manager: {
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
  operator: {
    dashboard: ["view"],
    device: ["view", "control"],
    alert: ["view", "acknowledge"],
    alert_rule: ["view"],
    user: [],
    role: [],
    log: ["view"],
    energy: ["view"],
    settings: [],
    system_health: ["view"],
    digital_twin: ["view"],
  },
  guest: {
    dashboard: ["view"],
    device: ["view"],
    alert: ["view"],
    alert_rule: [],
    user: [],
    role: [],
    log: [],
    energy: ["view"],
    settings: [],
    system_health: [],
    digital_twin: ["view"],
  },
} as const;

export const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/",
    icon: "LayoutDashboard",
    permission: { resource: "dashboard", action: "view" },
  },
  {
    title: "Monitoring",
    href: "/monitoring",
    icon: "Activity",
    permission: { resource: "device", action: "view" },
  },
  {
    title: "IoT Control",
    href: "/iot-control",
    icon: "Cpu",
    permission: { resource: "device", action: "view" },
  },
  {
    title: "Digital Twin",
    href: "/digital-twin",
    icon: "Box",
    permission: { resource: "digital_twin", action: "view" },
  },
  {
    title: "Energy",
    href: "/energy",
    icon: "Zap",
    permission: { resource: "energy", action: "view" },
  },
  {
    title: "Alerts",
    href: "/alerts",
    icon: "Bell",
    permission: { resource: "alert", action: "view" },
  },
  {
    title: "Users",
    href: "/users",
    icon: "Users",
    permission: { resource: "user", action: "view" },
  },
  {
    title: "Audit Logs",
    href: "/logs",
    icon: "FileText",
    permission: { resource: "log", action: "view" },
  },
  {
    title: "System Health",
    href: "/system-health",
    icon: "HeartPulse",
    permission: { resource: "system_health", action: "view" },
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
    permission: { resource: "settings", action: "view" },
  },
] as const;

export const DEVICE_TYPES = [
  "sensor",
  "actuator",
  "plc",
  "gateway",
  "meter",
] as const;
export const DEVICE_STATUSES = [
  "online",
  "offline",
  "error",
  "maintenance",
] as const;
export const ALERT_SEVERITIES = ["info", "warning", "critical"] as const;
export const ALERT_STATUSES = ["active", "acknowledged", "resolved"] as const;
