export type AuditAction =
  | "login"
  | "logout"
  | "login_failed"
  | "user_create"
  | "user_update"
  | "user_delete"
  | "user_deactivate"
  | "role_update"
  | "role_create"
  | "device_create"
  | "device_update"
  | "device_delete"
  | "device_command"
  | "alert_acknowledge"
  | "alert_resolve"
  | "alert_rule_create"
  | "alert_rule_update"
  | "alert_rule_delete"
  | "settings_update"
  | "export_data";

export type AuditResult = "success" | "failure";

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details: Record<string, unknown>;
  result: AuditResult;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface AuditLogFilters {
  userId?: string;
  action?: AuditAction;
  resource?: string;
  result?: AuditResult;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
