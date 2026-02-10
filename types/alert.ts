export type AlertSeverity = "info" | "warning" | "critical";
export type AlertStatus = "active" | "acknowledged" | "resolved";
export type AlertOperator =
  | "gt"
  | "lt"
  | "eq"
  | "neq"
  | "gte"
  | "lte"
  | "between";

export interface AlertRule {
  id: string;
  name: string;
  deviceId: string | null;
  metric: string;
  operator: AlertOperator;
  threshold: number;
  thresholdHigh?: number;
  severity: AlertSeverity;
  isActive: boolean;
  cooldownMinutes: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  ruleId: string;
  deviceId: string;
  deviceName: string;
  metric: string;
  value: number;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  triggeredAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export type NotificationChannelType = "email" | "push" | "popup";

export interface NotificationChannel {
  id: string;
  userId: string;
  type: NotificationChannelType;
  config: Record<string, unknown>;
  isActive: boolean;
}

export interface Notification {
  id: string;
  alertId: string;
  channelType: NotificationChannelType;
  recipientId: string;
  status: "pending" | "sent" | "failed";
  sentAt?: Date;
  error?: string;
}

export interface AlertFilters {
  severity?: AlertSeverity;
  status?: AlertStatus;
  deviceId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateAlertRuleInput {
  name: string;
  deviceId: string | null;
  metric: string;
  operator: AlertOperator;
  threshold: number;
  thresholdHigh?: number;
  severity: AlertSeverity;
  cooldownMinutes: number;
}
