import { IAlertRepository } from "../repositories";
import { Alert, AlertFilters, AlertRule, CreateAlertRuleInput } from "@/types";
import { mockAlerts, mockAlertRules } from "./data/alerts";
import { v4 as uuidv4 } from "uuid";

const alerts = [...mockAlerts];
const rules = [...mockAlertRules];

export const mockAlertRepository: IAlertRepository = {
  async findAll(filters?: AlertFilters): Promise<Alert[]> {
    let result = [...alerts];
    if (filters?.severity)
      result = result.filter((a) => a.severity === filters.severity);
    if (filters?.status)
      result = result.filter((a) => a.status === filters.status);
    if (filters?.deviceId)
      result = result.filter((a) => a.deviceId === filters.deviceId);
    if (filters?.startDate)
      result = result.filter((a) => a.triggeredAt >= filters.startDate!);
    if (filters?.endDate)
      result = result.filter((a) => a.triggeredAt <= filters.endDate!);
    return result.sort(
      (a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime(),
    );
  },

  async findById(id: string): Promise<Alert | null> {
    return alerts.find((a) => a.id === id) || null;
  },

  async acknowledge(id: string, userId: string): Promise<Alert> {
    const alert = alerts.find((a) => a.id === id);
    if (!alert) throw new Error("Alert not found");
    alert.status = "acknowledged";
    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = userId;
    return alert;
  },

  async resolve(id: string, userId: string): Promise<Alert> {
    const alert = alerts.find((a) => a.id === id);
    if (!alert) throw new Error("Alert not found");
    alert.status = "resolved";
    alert.resolvedAt = new Date();
    alert.resolvedBy = userId;
    return alert;
  },

  async getActiveCount(): Promise<number> {
    return alerts.filter((a) => a.status === "active").length;
  },

  async getRules(): Promise<AlertRule[]> {
    return rules;
  },

  async createRule(data: CreateAlertRuleInput): Promise<AlertRule> {
    const rule: AlertRule = {
      ...data,
      id: `rule_${uuidv4().slice(0, 8)}`,
      isActive: true,
      createdBy: "usr_001",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    rules.push(rule);
    return rule;
  },

  async updateRule(id: string, data: Partial<AlertRule>): Promise<AlertRule> {
    const index = rules.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Rule not found");
    rules[index] = { ...rules[index], ...data, updatedAt: new Date() };
    return rules[index];
  },

  async deleteRule(id: string): Promise<void> {
    const index = rules.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Rule not found");
    rules.splice(index, 1);
  },
};
