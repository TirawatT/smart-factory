export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "CONTROL"
  | "VIEW"
  | "EXPORT"
  | "ACKNOWLEDGE"
  | "CONFIGURE";

export type AuditResult = "SUCCESS" | "FAIL";

export interface AuditLog {
  readonly id: string;
  readonly userId: string;
  readonly userName: string;
  readonly action: AuditAction;
  readonly resource: string;
  readonly resourceId?: string;
  readonly details?: Record<string, unknown>;
  readonly result: AuditResult;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly timestamp: Date;
}

export interface SystemHealthStatus {
  readonly service: string;
  readonly status: "healthy" | "degraded" | "down";
  readonly latency: number;
  readonly uptime: number;
  readonly lastCheck: Date;
  readonly details?: Record<string, unknown>;
}

export interface SystemHealthOverview {
  readonly api: SystemHealthStatus;
  readonly database: SystemHealthStatus;
  readonly mqttBroker: SystemHealthStatus;
  readonly realtimeServer: SystemHealthStatus;
  readonly overallStatus: "healthy" | "degraded" | "down";
  readonly connectedDevices: number;
  readonly activeUsers: number;
  readonly memoryUsage: number;
  readonly cpuUsage: number;
}
