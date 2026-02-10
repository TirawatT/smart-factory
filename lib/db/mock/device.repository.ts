import { IDeviceRepository } from "../repositories";
import {
  Device,
  DeviceFilters,
  DeviceTelemetry,
  DeviceCommand,
  TimeRange,
} from "@/types";
import { mockDevices } from "./data/devices";
import { mockTelemetry, mockCommands } from "./data/telemetry";
import { v4 as uuidv4 } from "uuid";

const devices = [...mockDevices];
const telemetry = [...mockTelemetry];
const commands = [...mockCommands];

export const mockDeviceRepository: IDeviceRepository = {
  async findAll(filters?: DeviceFilters): Promise<Device[]> {
    let result = [...devices];
    if (filters?.status)
      result = result.filter((d) => d.status === filters.status);
    if (filters?.type) result = result.filter((d) => d.type === filters.type);
    if (filters?.zone) result = result.filter((d) => d.zone === filters.zone);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(s) || d.id.toLowerCase().includes(s),
      );
    }
    return result;
  },

  async findById(id: string): Promise<Device | null> {
    return devices.find((d) => d.id === id) || null;
  },

  async getLatestTelemetry(deviceId: string): Promise<DeviceTelemetry | null> {
    const deviceTelemetry = telemetry
      .filter((t) => t.deviceId === deviceId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return deviceTelemetry[0] || null;
  },

  async getTelemetryHistory(
    deviceId: string,
    range?: TimeRange,
  ): Promise<DeviceTelemetry[]> {
    let data = telemetry.filter((t) => t.deviceId === deviceId);
    if (range) {
      data = data.filter(
        (t) => t.timestamp >= range.start && t.timestamp <= range.end,
      );
    }
    return data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  },

  async getCommands(deviceId: string): Promise<DeviceCommand[]> {
    return commands
      .filter((c) => c.deviceId === deviceId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async sendCommand(
    deviceId: string,
    command: string,
    params: Record<string, unknown>,
    sentBy: string,
  ): Promise<DeviceCommand> {
    const newCmd: DeviceCommand = {
      id: `cmd_${uuidv4().slice(0, 8)}`,
      deviceId,
      command,
      params,
      status: "acknowledged",
      sentBy,
      createdAt: new Date(),
      respondedAt: new Date(),
    };
    commands.unshift(newCmd);

    // Update device status based on command
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      if (command === "start") device.status = "online";
      if (command === "stop") device.status = "offline";
      device.lastSeen = new Date();
      device.updatedAt = new Date();
    }

    return newCmd;
  },

  async create(
    data: Omit<Device, "id" | "createdAt" | "updatedAt">,
  ): Promise<Device> {
    const newDevice: Device = {
      ...data,
      id: `dev_${uuidv4().slice(0, 8)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    devices.push(newDevice);
    return newDevice;
  },

  async update(id: string, data: Partial<Device>): Promise<Device> {
    const index = devices.findIndex((d) => d.id === id);
    if (index === -1) throw new Error("Device not found");
    devices[index] = { ...devices[index], ...data, updatedAt: new Date() };
    return devices[index];
  },

  async delete(id: string): Promise<void> {
    const index = devices.findIndex((d) => d.id === id);
    if (index === -1) throw new Error("Device not found");
    devices.splice(index, 1);
  },

  async getStatusCounts(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {
      online: 0,
      offline: 0,
      error: 0,
      maintenance: 0,
    };
    devices.forEach((d) => {
      counts[d.status] = (counts[d.status] || 0) + 1;
    });
    return counts;
  },
};
