import type { Notification } from "@/types";

export const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    userId: "usr-001-admin",
    title: "Critical Alert",
    message: "Conveyor Motor A2 temperature exceeded 80°C",
    type: "critical",
    read: false,
    link: "/alerts",
    createdAt: new Date("2026-02-12T08:44:00Z"),
  },
  {
    id: "notif-002",
    userId: "usr-001-admin",
    title: "Warning Alert",
    message: "Motor Controller C1 temperature approaching limit",
    type: "warning",
    read: false,
    link: "/alerts",
    createdAt: new Date("2026-02-12T08:30:00Z"),
  },
  {
    id: "notif-003",
    userId: "usr-001-admin",
    title: "Device Offline",
    message: "Flow Meter C2 has been offline for 10+ hours",
    type: "warning",
    read: true,
    link: "/monitoring",
    createdAt: new Date("2026-02-11T23:35:00Z"),
  },
  {
    id: "notif-004",
    userId: "usr-001-admin",
    title: "System Update",
    message: "IoT Gateway G1 firmware updated successfully",
    type: "system",
    read: true,
    link: "/system-health",
    createdAt: new Date("2026-02-10T03:00:00Z"),
  },
  {
    id: "notif-005",
    userId: "usr-001-admin",
    title: "Maintenance Scheduled",
    message: "Compressor Controller D2 maintenance started",
    type: "info",
    read: true,
    link: "/iot-control",
    createdAt: new Date("2026-02-10T16:00:00Z"),
  },
];

export function getUnreadNotifications(userId: string): Notification[] {
  return mockNotifications.filter((n) => n.userId === userId && !n.read);
}

export function getNotificationsByUser(userId: string): Notification[] {
  return mockNotifications.filter((n) => n.userId === userId);
}
