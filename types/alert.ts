export type AlertSeverity = "info" | "warning" | "critical";
export type AlertStatus = "active" | "acknowledged" | "resolved";
export type AlertChannel = "popup" | "email" | "sms";
export type RuleOperator = "gt" | "lt" | "eq" | "gte" | "lte" | "neq";

export interface Alert {
  readonly id: string;
  readonly type: string;
  readonly severity: AlertSeverity;
  readonly message: string;
  readonly deviceId: string;
  readonly deviceName: string;
  readonly ruleId?: string;
  readonly status: AlertStatus;
  readonly acknowledgedBy?: string;
  readonly acknowledgedAt?: Date;
  readonly resolvedAt?: Date;
  readonly createdAt: Date;
}

export interface AlertRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly deviceId: string;
  readonly deviceName: string;
  readonly metric: string;
  readonly operator: RuleOperator;
  readonly threshold: number;
  readonly unit: string;
  readonly severity: AlertSeverity;
  readonly channels: readonly AlertChannel[];
  readonly isActive: boolean;
  readonly lastTriggered?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface AlertStats {
  readonly total: number;
  readonly active: number;
  readonly acknowledged: number;
  readonly resolved: number;
  readonly critical: number;
  readonly warning: number;
  readonly info: number;
}

export interface Notification {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly message: string;
  readonly type: AlertSeverity | "system";
  readonly read: boolean;
  readonly link?: string;
  readonly createdAt: Date;
}
