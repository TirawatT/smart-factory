"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Bell, BellOff } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { alertRepository } from "@/lib/db";
import { AlertRule } from "@/types";
import { usePermission } from "@/stores/authStore";

export default function AlertRulesPage() {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [selectedRule, setSelectedRule] = useState<AlertRule | null>(null);
  const canManage = usePermission("alerts:manage");
  const { addToast } = useToast();

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    const all = await alertRepository.getRules();
    setRules(all);
  };

  const toggleRule = async (rule: AlertRule) => {
    await alertRepository.updateRule(rule.id, { isActive: !rule.isActive });
    addToast("success", `Rule ${rule.isActive ? "disabled" : "enabled"}`);
    loadRules();
  };

  const operatorLabel = (op: string) => {
    switch (op) {
      case "gt":
        return ">";
      case "gte":
        return "\u2265";
      case "lt":
        return "<";
      case "lte":
        return "\u2264";
      case "eq":
        return "=";
      case "neq":
        return "\u2260";
      default:
        return op;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alert Rules</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure alert rules and thresholds
          </p>
        </div>
        {canManage && <Button icon={<Plus size={16} />}>Add Rule</Button>}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Condition
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Severity
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Device
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Cooldown
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  Status
                </th>
                {canManage && (
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr
                  key={rule.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <button
                      className="font-medium text-primary hover:underline text-left"
                      onClick={() => setSelectedRule(rule)}
                    >
                      {rule.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {rule.metric} {operatorLabel(rule.operator)}{" "}
                    {rule.threshold}
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={rule.severity} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {rule.deviceId || "All"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {rule.cooldownMinutes}m
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={rule.isActive ? "success" : "neutral"}>
                      {rule.isActive ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                  {canManage && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={
                            rule.isActive ? (
                              <BellOff size={14} />
                            ) : (
                              <Bell size={14} />
                            )
                          }
                          onClick={() => toggleRule(rule)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<Edit size={14} />}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={!!selectedRule}
        onClose={() => setSelectedRule(null)}
        title="Rule Details"
        size="md"
      >
        {selectedRule && (
          <div className="space-y-4 text-sm">
            <div>
              <label className="text-muted-foreground">Name</label>
              <p className="font-medium">{selectedRule.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground">Metric</label>
                <p className="font-mono">{selectedRule.metric}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Condition</label>
                <p className="font-mono">
                  {operatorLabel(selectedRule.operator)}{" "}
                  {selectedRule.threshold}
                </p>
              </div>
              <div>
                <label className="text-muted-foreground">Severity</label>
                <SeverityBadge severity={selectedRule.severity} />
              </div>
              <div>
                <label className="text-muted-foreground">Cooldown</label>
                <p>{selectedRule.cooldownMinutes} minutes</p>
              </div>
            </div>
            <div>
              <label className="text-muted-foreground">Created</label>
              <p>{new Date(selectedRule.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
