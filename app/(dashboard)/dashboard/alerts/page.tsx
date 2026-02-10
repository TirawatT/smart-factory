"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Filter,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select, SearchInput } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { alertRepository } from "@/lib/db";
import { Alert, AlertSeverity, AlertStatus } from "@/types";
import { usePermission } from "@/stores/authStore";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "resolved", label: "Resolved" },
];

const SEVERITY_OPTIONS = [
  { value: "", label: "All Severity" },
  { value: "critical", label: "Critical" },
  { value: "warning", label: "Warning" },
  { value: "info", label: "Info" },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const canManage = usePermission("alerts:manage");
  const { addToast } = useToast();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const all = await alertRepository.findAll();
    setAlerts(all);
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (statusFilter && a.status !== statusFilter) return false;
      if (severityFilter && a.severity !== severityFilter) return false;
      if (
        search &&
        !a.message.toLowerCase().includes(search.toLowerCase()) &&
        !a.deviceId.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [alerts, statusFilter, severityFilter, search]);

  const handleAcknowledge = async (id: string) => {
    await alertRepository.acknowledge(id, "current-user");
    addToast("success", "Alert acknowledged");
    loadAlerts();
    setSelectedAlert(null);
  };

  const handleResolve = async (id: string) => {
    await alertRepository.resolve(id, "current-user");
    addToast("success", "Alert resolved");
    loadAlerts();
    setSelectedAlert(null);
  };

  const statusCounts = useMemo(
    () => ({
      active: alerts.filter((a) => a.status === "active").length,
      acknowledged: alerts.filter((a) => a.status === "acknowledged").length,
      resolved: alerts.filter((a) => a.status === "resolved").length,
      critical: alerts.filter(
        (a) => a.severity === "critical" && a.status === "active",
      ).length,
    }),
    [alerts],
  );

  const getStatusIcon = (status: AlertStatus) => {
    switch (status) {
      case "active":
        return <AlertTriangle size={16} className="text-danger" />;
      case "acknowledged":
        return <CheckCircle size={16} className="text-warning" />;
      case "resolved":
        return <CheckCircle size={16} className="text-success" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor and manage system alerts
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="!p-4 border-l-4 border-l-danger">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-danger">
            {statusCounts.active}
          </div>
        </Card>
        <Card className="!p-4 border-l-4 border-l-warning">
          <div className="text-sm text-muted-foreground">Acknowledged</div>
          <div className="text-2xl font-bold text-warning">
            {statusCounts.acknowledged}
          </div>
        </Card>
        <Card className="!p-4 border-l-4 border-l-success">
          <div className="text-sm text-muted-foreground">Resolved</div>
          <div className="text-2xl font-bold text-success">
            {statusCounts.resolved}
          </div>
        </Card>
        <Card className="!p-4 border-l-4 border-l-[var(--danger)]">
          <div className="text-sm text-muted-foreground">Critical Active</div>
          <div className="text-2xl font-bold text-danger">
            {statusCounts.critical}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="!p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Filter size={16} className="text-muted-foreground" />
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search alerts..."
            className="w-60"
          />
          <Select
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40"
          />
          <Select
            options={SEVERITY_OPTIONS}
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-40"
          />
        </div>
      </Card>

      {/* Alert List */}
      <div className="space-y-2">
        {filteredAlerts.length === 0 && (
          <Card className="!p-8 text-center text-muted-foreground">
            No alerts match your filters
          </Card>
        )}
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-card border border-border rounded-[var(--radius-lg)] shadow-sm p-4 cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => setSelectedAlert(alert)}
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(alert.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <SeverityBadge severity={alert.severity} />
                  <span className="text-sm font-medium">{alert.message}</span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span>Device: {alert.deviceName}</span>
                  <span>
                    Metric: {alert.metric} = {alert.value}
                  </span>
                  <span>{new Date(alert.triggeredAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {canManage && alert.status === "active" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcknowledge(alert.id);
                    }}
                  >
                    Acknowledge
                  </Button>
                )}
                {canManage && alert.status === "acknowledged" && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolve(alert.id);
                    }}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Detail Modal */}
      <Modal
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title="Alert Details"
        size="md"
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SeverityBadge severity={selectedAlert.severity} />
              <StatusBadge status={selectedAlert.status} />
            </div>
            <p className="text-sm">{selectedAlert.message}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Device:</span>{" "}
                {selectedAlert.deviceName}
              </div>
              <div>
                <span className="text-muted-foreground">Rule:</span>{" "}
                {selectedAlert.ruleId}
              </div>
              <div>
                <span className="text-muted-foreground">Metric:</span>{" "}
                {selectedAlert.metric}
              </div>
              <div>
                <span className="text-muted-foreground">Value:</span>{" "}
                {selectedAlert.value}
              </div>
              <div>
                <span className="text-muted-foreground">Triggered:</span>{" "}
                {new Date(selectedAlert.triggeredAt).toLocaleString()}
              </div>
              {selectedAlert.acknowledgedAt && (
                <div>
                  <span className="text-muted-foreground">Acknowledged:</span>{" "}
                  {new Date(selectedAlert.acknowledgedAt).toLocaleString()}
                </div>
              )}
              {selectedAlert.resolvedAt && (
                <div>
                  <span className="text-muted-foreground">Resolved:</span>{" "}
                  {new Date(selectedAlert.resolvedAt).toLocaleString()}
                </div>
              )}
            </div>
            {canManage && (
              <div className="flex gap-2 pt-2 border-t border-border">
                {selectedAlert.status === "active" && (
                  <Button
                    variant="outline"
                    onClick={() => handleAcknowledge(selectedAlert.id)}
                  >
                    Acknowledge
                  </Button>
                )}
                {(selectedAlert.status === "active" ||
                  selectedAlert.status === "acknowledged") && (
                  <Button
                    variant="primary"
                    onClick={() => handleResolve(selectedAlert.id)}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
