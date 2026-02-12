import type { Alert, AlertStats } from "@/types";

export const mockAlerts: Alert[] = [
  {
    id: "alt-001",
    type: "threshold_exceeded",
    severity: "critical",
    message:
      "Conveyor Motor A2 temperature exceeded 80°C — Emergency stop activated",
    deviceId: "dev-006",
    deviceName: "Conveyor Motor A2",
    ruleId: "rule-001",
    status: "active",
    createdAt: new Date("2026-02-12T08:44:00Z"),
  },
  {
    id: "alt-002",
    type: "threshold_exceeded",
    severity: "warning",
    message:
      "Motor Controller C1 temperature approaching limit (55°C / 60°C threshold)",
    deviceId: "dev-003",
    deviceName: "Motor Controller C1",
    ruleId: "rule-002",
    status: "active",
    createdAt: new Date("2026-02-12T08:30:00Z"),
  },
  {
    id: "alt-003",
    type: "device_offline",
    severity: "warning",
    message: "Flow Meter C2 has been offline for more than 10 hours",
    deviceId: "dev-009",
    deviceName: "Flow Meter C2",
    status: "acknowledged",
    acknowledgedBy: "usr-002-manager",
    acknowledgedAt: new Date("2026-02-12T07:00:00Z"),
    createdAt: new Date("2026-02-11T23:35:00Z"),
  },
  {
    id: "alt-004",
    type: "threshold_exceeded",
    severity: "info",
    message:
      "Energy Meter E1 power consumption above average (25.3 kW vs 20 kW baseline)",
    deviceId: "dev-005",
    deviceName: "Energy Meter E1",
    ruleId: "rule-003",
    status: "active",
    createdAt: new Date("2026-02-12T06:00:00Z"),
  },
  {
    id: "alt-005",
    type: "maintenance_due",
    severity: "info",
    message: "Compressor Controller D2 scheduled maintenance in progress",
    deviceId: "dev-010",
    deviceName: "Compressor Controller D2",
    status: "acknowledged",
    acknowledgedBy: "usr-003-operator",
    acknowledgedAt: new Date("2026-02-10T16:05:00Z"),
    createdAt: new Date("2026-02-10T16:00:00Z"),
  },
  {
    id: "alt-006",
    type: "threshold_exceeded",
    severity: "critical",
    message:
      "Vibration Sensor B1 detected abnormal vibration pattern (15.2 mm/s)",
    deviceId: "dev-008",
    deviceName: "Vibration Sensor B1",
    ruleId: "rule-004",
    status: "resolved",
    acknowledgedBy: "usr-003-operator",
    acknowledgedAt: new Date("2026-02-11T14:00:00Z"),
    resolvedAt: new Date("2026-02-11T15:30:00Z"),
    createdAt: new Date("2026-02-11T13:45:00Z"),
  },
  {
    id: "alt-007",
    type: "device_restart",
    severity: "info",
    message: "IoT Gateway G1 restarted successfully after firmware update",
    deviceId: "dev-007",
    deviceName: "IoT Gateway G1",
    status: "resolved",
    resolvedAt: new Date("2026-02-10T03:00:00Z"),
    createdAt: new Date("2026-02-10T02:55:00Z"),
  },
  {
    id: "alt-008",
    type: "threshold_exceeded",
    severity: "warning",
    message:
      "Pressure Sensor B2 reading above normal range (3.2 bar / 3.0 bar threshold)",
    deviceId: "dev-002",
    deviceName: "Pressure Sensor B2",
    ruleId: "rule-005",
    status: "active",
    createdAt: new Date("2026-02-12T08:00:00Z"),
  },
];

export function getAlertsByStatus(status: string): Alert[] {
  return mockAlerts.filter((a) => a.status === status);
}

export function getAlertsByDevice(deviceId: string): Alert[] {
  return mockAlerts.filter((a) => a.deviceId === deviceId);
}

export function getAlertsBySeverity(severity: string): Alert[] {
  return mockAlerts.filter((a) => a.severity === severity);
}

export function getAlertStats(): AlertStats {
  return {
    total: mockAlerts.length,
    active: mockAlerts.filter((a) => a.status === "active").length,
    acknowledged: mockAlerts.filter((a) => a.status === "acknowledged").length,
    resolved: mockAlerts.filter((a) => a.status === "resolved").length,
    critical: mockAlerts.filter((a) => a.severity === "critical").length,
    warning: mockAlerts.filter((a) => a.severity === "warning").length,
    info: mockAlerts.filter((a) => a.severity === "info").length,
  };
}
