export type DeviceType = "sensor" | "actuator" | "plc" | "gateway" | "meter";
export type DeviceStatus = "online" | "offline" | "error" | "maintenance";

export interface DeviceParameter {
  readonly name: string;
  readonly value: number;
  readonly unit: string;
  readonly min: number;
  readonly max: number;
}

export interface Device {
  readonly id: string;
  readonly name: string;
  readonly type: DeviceType;
  readonly status: DeviceStatus;
  readonly location: string;
  readonly zone: string;
  readonly model: string;
  readonly serialNumber: string;
  readonly parameters: readonly DeviceParameter[];
  readonly lastHeartbeat: Date;
  readonly installedAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface DeviceTelemetry {
  readonly id: string;
  readonly deviceId: string;
  readonly metric: string;
  readonly value: number;
  readonly unit: string;
  readonly timestamp: Date;
}

export interface DeviceCommand {
  readonly id: string;
  readonly deviceId: string;
  readonly command: "start" | "stop" | "restart" | "adjust";
  readonly parameters?: Record<string, number | string>;
  readonly status: "pending" | "sent" | "acknowledged" | "failed";
  readonly issuedBy: string;
  readonly issuedAt: Date;
  readonly completedAt?: Date;
}

export interface DeviceStats {
  readonly total: number;
  readonly online: number;
  readonly offline: number;
  readonly error: number;
  readonly maintenance: number;
}
