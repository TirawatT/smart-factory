import { DeviceTelemetry, DeviceCommand } from "@/types";

function generateTelemetryForDevice(
  deviceId: string,
  deviceType: string,
  hoursBack: number = 24,
  intervalMinutes: number = 15,
): DeviceTelemetry[] {
  const data: DeviceTelemetry[] = [];
  const now = new Date("2026-02-10T09:30:00");
  const points = Math.floor((hoursBack * 60) / intervalMinutes);

  for (let i = 0; i < points; i++) {
    const timestamp = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
    let metrics: Record<string, number> = {};

    switch (deviceType) {
      case "cnc_machine":
        metrics = {
          temperature:
            35 + Math.random() * 30 + (i < 5 ? Math.random() * 15 : 0),
          vibration: 1.5 + Math.random() * 3 + (i === 3 ? 5 : 0),
          rpm: 3000 + Math.random() * 5000,
          power: 8 + Math.random() * 12,
          spindleLoad: 20 + Math.random() * 60,
        };
        break;
      case "robot_arm":
        metrics = {
          temperature: 30 + Math.random() * 20,
          power: 3 + Math.random() * 7,
          cycleTime: 12 + Math.random() * 8,
          accuracy: 0.01 + Math.random() * 0.05,
          jointLoad: 15 + Math.random() * 50,
        };
        break;
      case "conveyor":
        metrics = {
          speed: 1.2 + Math.random() * 0.8,
          power: 2 + Math.random() * 3,
          itemCount: Math.floor(100 + Math.random() * 200),
          motorTemp: 40 + Math.random() * 20,
        };
        break;
      case "temperature_sensor":
        metrics = {
          temperature: 22 + Math.random() * 8 + Math.sin(i / 10) * 3,
          humidity: 45 + Math.random() * 15,
        };
        break;
      case "humidity_sensor":
        metrics = {
          humidity: 40 + Math.random() * 20 + Math.sin(i / 8) * 5,
          temperature: 23 + Math.random() * 5,
        };
        break;
      case "power_meter":
        metrics = {
          activePower: 50 + Math.random() * 200,
          reactivePower: 10 + Math.random() * 50,
          voltage: 380 + Math.random() * 20 - 10,
          current: 50 + Math.random() * 150,
          powerFactor: 0.85 + Math.random() * 0.12,
          frequency: 49.8 + Math.random() * 0.4,
        };
        break;
      case "air_compressor":
        metrics = {
          pressure: 6.5 + Math.random() * 2,
          temperature: 60 + Math.random() * 25,
          power: 25 + Math.random() * 15,
          airFlow: 350 + Math.random() * 200,
          oilTemp: 55 + Math.random() * 20,
        };
        break;
    }

    // Round all values to 2 decimal places
    Object.keys(metrics).forEach((key) => {
      metrics[key] = Math.round(metrics[key] * 100) / 100;
    });

    data.push({
      id: `tel_${deviceId}_${i.toString().padStart(4, "0")}`,
      deviceId,
      timestamp,
      metrics,
    });
  }

  return data;
}

// Generate telemetry for all devices
const deviceTypes: Record<string, string> = {
  dev_001: "cnc_machine",
  dev_002: "cnc_machine",
  dev_003: "cnc_machine",
  dev_004: "robot_arm",
  dev_005: "robot_arm",
  dev_006: "conveyor",
  dev_007: "conveyor",
  dev_008: "temperature_sensor",
  dev_009: "temperature_sensor",
  dev_010: "temperature_sensor",
  dev_011: "humidity_sensor",
  dev_012: "humidity_sensor",
  dev_013: "power_meter",
  dev_014: "power_meter",
  dev_015: "air_compressor",
};

export const mockTelemetry: DeviceTelemetry[] = Object.entries(
  deviceTypes,
).flatMap(([deviceId, type]) =>
  generateTelemetryForDevice(deviceId, type, 24, 15),
);

export function generateRealtimeTelemetry(deviceId: string): DeviceTelemetry {
  const type = deviceTypes[deviceId] || "temperature_sensor";
  const [entry] = generateTelemetryForDevice(deviceId, type, 0.01, 1);
  return { ...entry, id: `tel_rt_${Date.now()}`, timestamp: new Date() };
}

export const mockCommands: DeviceCommand[] = [
  {
    id: "cmd_001",
    deviceId: "dev_001",
    command: "start",
    params: { program: "part_a_v2", speed: 80 },
    status: "acknowledged",
    sentBy: "usr_004",
    createdAt: new Date("2026-02-10T08:00:00"),
    respondedAt: new Date("2026-02-10T08:00:02"),
  },
  {
    id: "cmd_002",
    deviceId: "dev_002",
    command: "start",
    params: { program: "part_b_v1", speed: 100 },
    status: "acknowledged",
    sentBy: "usr_004",
    createdAt: new Date("2026-02-10T08:15:00"),
    respondedAt: new Date("2026-02-10T08:15:01"),
  },
  {
    id: "cmd_003",
    deviceId: "dev_005",
    command: "stop",
    params: { reason: "emergency", force: true },
    status: "acknowledged",
    sentBy: "usr_002",
    createdAt: new Date("2026-02-10T08:45:00"),
    respondedAt: new Date("2026-02-10T08:45:00"),
  },
  {
    id: "cmd_004",
    deviceId: "dev_006",
    command: "adjust_speed",
    params: { speed: 1.8 },
    status: "acknowledged",
    sentBy: "usr_005",
    createdAt: new Date("2026-02-10T07:30:00"),
    respondedAt: new Date("2026-02-10T07:30:03"),
  },
  {
    id: "cmd_005",
    deviceId: "dev_003",
    command: "diagnostic",
    params: { type: "full", includeCalibration: true },
    status: "pending",
    sentBy: "usr_004",
    createdAt: new Date("2026-02-10T09:00:00"),
  },
  {
    id: "cmd_006",
    deviceId: "dev_015",
    command: "set_pressure",
    params: { target: 7.5, unit: "bar" },
    status: "acknowledged",
    sentBy: "usr_002",
    createdAt: new Date("2026-02-10T06:00:00"),
    respondedAt: new Date("2026-02-10T06:00:05"),
  },
  {
    id: "cmd_007",
    deviceId: "dev_001",
    command: "stop",
    params: { reason: "shift_end" },
    status: "failed",
    sentBy: "usr_005",
    createdAt: new Date("2026-02-09T18:00:00"),
    respondedAt: new Date("2026-02-09T18:00:10"),
  },
];
