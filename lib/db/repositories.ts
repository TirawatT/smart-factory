import {
  Alert,
  AlertFilters,
  AlertRule,
  AuditLog,
  AuditLogFilters,
  CreateAlertRuleInput,
  CreateUserInput,
  Device,
  DeviceCommand,
  DeviceFilters,
  DeviceTelemetry,
  EnergyFilters,
  EnergyReading,
  EnergySummary,
  EnergyTarget,
  PaginatedResult,
  Permission,
  Role,
  RolePermission,
  TimeRange,
  UpdateUserInput,
  User,
  UserWithPassword,
} from "@/types";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<UserWithPassword | null>;
  create(data: CreateUserInput): Promise<User>;
  update(id: string, data: UpdateUserInput): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface IRoleRepository {
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  getPermissions(roleId: string): Promise<Permission[]>;
  getAllPermissions(): Promise<Permission[]>;
  getRolePermissions(): Promise<RolePermission[]>;
  updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void>;
  create(data: Omit<Role, "id" | "createdAt">): Promise<Role>;
  delete(id: string): Promise<void>;
}

export interface IDeviceRepository {
  findAll(filters?: DeviceFilters): Promise<Device[]>;
  findById(id: string): Promise<Device | null>;
  getLatestTelemetry(deviceId: string): Promise<DeviceTelemetry | null>;
  getTelemetryHistory(
    deviceId: string,
    range?: TimeRange,
  ): Promise<DeviceTelemetry[]>;
  getCommands(deviceId: string): Promise<DeviceCommand[]>;
  sendCommand(
    deviceId: string,
    command: string,
    params: Record<string, unknown>,
    sentBy: string,
  ): Promise<DeviceCommand>;
  create(data: Omit<Device, "id" | "createdAt" | "updatedAt">): Promise<Device>;
  update(id: string, data: Partial<Device>): Promise<Device>;
  delete(id: string): Promise<void>;
  getStatusCounts(): Promise<Record<string, number>>;
}

export interface IAlertRepository {
  findAll(filters?: AlertFilters): Promise<Alert[]>;
  findById(id: string): Promise<Alert | null>;
  acknowledge(id: string, userId: string): Promise<Alert>;
  resolve(id: string, userId: string): Promise<Alert>;
  getActiveCount(): Promise<number>;
  getRules(): Promise<AlertRule[]>;
  createRule(data: CreateAlertRuleInput): Promise<AlertRule>;
  updateRule(id: string, data: Partial<AlertRule>): Promise<AlertRule>;
  deleteRule(id: string): Promise<void>;
}

export interface IEnergyRepository {
  getReadings(filters?: EnergyFilters): Promise<EnergyReading[]>;
  getSummary(days?: number): Promise<EnergySummary>;
  getTargets(): Promise<EnergyTarget[]>;
}

export interface IAuditLogRepository {
  findAll(
    filters?: AuditLogFilters,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedResult<AuditLog>>;
  create(data: Omit<AuditLog, "id">): Promise<AuditLog>;
}
