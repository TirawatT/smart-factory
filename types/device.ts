export type DeviceStatus = "online" | "offline" | "error" | "maintenance";
export type DeviceType =
  | "cnc_machine"
  | "robot_arm"
  | "conveyor"
  | "temperature_sensor"
  | "humidity_sensor"
  | "power_meter"
  | "air_compressor";

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  zone: string;
  status: DeviceStatus;
  ipAddress?: string;
  firmware?: string;
  lastSeen: Date;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceTelemetry {
  id: string;
  deviceId: string;
  timestamp: Date;
  metrics: Record<string, number>;
}

export type CommandStatus = "pending" | "sent" | "acknowledged" | "failed";

export interface DeviceCommand {
  id: string;
  deviceId: string;
  command: string;
  params: Record<string, unknown>;
  status: CommandStatus;
  sentBy: string;
  createdAt: Date;
  respondedAt?: Date;
}

export interface DeviceFilters {
  status?: DeviceStatus;
  type?: DeviceType;
  zone?: string;
  search?: string;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  cnc_machine: "CNC Machine",
  robot_arm: "Robot Arm",
  conveyor: "Conveyor Belt",
  temperature_sensor: "Temperature Sensor",
  humidity_sensor: "Humidity Sensor",
  power_meter: "Power Meter",
  air_compressor: "Air Compressor",
};

export const DEVICE_STATUS_LABELS: Record<DeviceStatus, string> = {
  online: "Online",
  offline: "Offline",
  error: "Error",
  maintenance: "Maintenance",
};

export const ZONE_LABELS: Record<string, string> = {
  "zone-a": "Zone A - Production",
  "zone-b": "Zone B - Assembly",
  "zone-c": "Zone C - Packaging",
  "zone-d": "Zone D - Warehouse",
};
