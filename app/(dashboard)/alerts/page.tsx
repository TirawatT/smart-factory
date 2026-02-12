"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermission } from "@/hooks/use-permission";
import { ALERT_SEVERITIES, ALERT_STATUSES } from "@/lib/constants";
import { getAlertStats, mockAlertRules, mockAlerts } from "@/lib/mock";
import { cn } from "@/lib/utils";
import type { Alert, AlertRule, AlertSeverity, AlertStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Filter,
  Info,
  Search,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const severityConfig: Record<
  AlertSeverity,
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  critical: {
    icon: AlertCircle,
    color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
  },
  warning: {
    icon: AlertTriangle,
    color:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  },
  info: {
    icon: Info,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
};

const statusConfig: Record<
  AlertStatus,
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  active: { icon: Bell, color: "bg-red-500/10 text-red-600 dark:text-red-400" },
  acknowledged: {
    icon: Clock,
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  resolved: {
    icon: CheckCircle,
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
};

const operatorLabels: Record<string, string> = {
  gt: ">",
  lt: "<",
  eq: "=",
  gte: "≥",
  lte: "≤",
  neq: "≠",
};

function AlertRuleCard({ rule }: { readonly rule: AlertRule }) {
  return (
    <div className="border rounded-lg p-4 space-y-2 transition-colors hover:bg-muted/50">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">{rule.name}</h4>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn("text-xs", severityConfig[rule.severity].color)}
          >
            {rule.severity}
          </Badge>
          <Switch checked={rule.isActive} disabled />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{rule.description}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>อุปกรณ์: {rule.deviceName}</span>
        <span className="font-mono">
          {rule.metric} {operatorLabels[rule.operator]} {rule.threshold}{" "}
          {rule.unit}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Channels:</span>
        {rule.channels.map((ch) => (
          <Badge key={ch} variant="secondary" className="text-xs">
            {ch}
          </Badge>
        ))}
      </div>
      {rule.lastTriggered && (
        <p className="text-xs text-muted-foreground">
          Last triggered:{" "}
          {formatDistanceToNow(rule.lastTriggered, { addSuffix: true })}
        </p>
      )}
    </div>
  );
}

export default function AlertsPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { hasPermission } = usePermission();
  const canAcknowledge = hasPermission("alert", "acknowledge");
  const stats = getAlertStats();

  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSearch =
      alert.message.toLowerCase().includes(search.toLowerCase()) ||
      alert.deviceName.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus =
      statusFilter === "all" || alert.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleAcknowledge = (alert: Alert) => {
    toast.success(`ยืนยันการรับทราบ: ${alert.deviceName}`, {
      description: alert.message,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alert Dashboard</h1>
        <p className="text-muted-foreground">
          จัดการการแจ้งเตือน กฎเกณฑ์ และ Threshold ของระบบ
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">ทั้งหมด</span>
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-600 dark:text-red-400">
                Active
              </span>
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.active}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-600 dark:text-yellow-400">
                Acknowledged
              </span>
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.acknowledged}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600 dark:text-green-400">
                Resolved
              </span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.resolved}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">
            <Bell className="mr-1 h-4 w-4" /> การแจ้งเตือน ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="rules">
            <Filter className="mr-1 h-4 w-4" /> กฎเกณฑ์ ({mockAlertRules.length}
            )
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาการแจ้งเตือน..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกระดับ</SelectItem>
                {ALERT_SEVERITIES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                {ALERT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alerts Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severity</TableHead>
                  <TableHead>อุปกรณ์</TableHead>
                  <TableHead className="hidden md:table-cell">
                    ข้อความ
                  </TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="hidden sm:table-cell">เวลา</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => {
                  const sev = severityConfig[alert.severity];
                  const SevIcon = sev.icon;
                  const stat = statusConfig[alert.status];
                  const StatIcon = stat.icon;
                  return (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", sev.color)}
                        >
                          <SevIcon className="mr-1 h-3 w-3" />
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {alert.deviceName}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs">
                        <p className="text-xs text-muted-foreground truncate">
                          {alert.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", stat.color)}
                        >
                          <StatIcon className="mr-1 h-3 w-3" />
                          {alert.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {formatDistanceToNow(alert.createdAt, {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        {canAcknowledge && alert.status === "active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleAcknowledge(alert)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>ไม่พบการแจ้งเตือนที่ตรงกับเงื่อนไข</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {mockAlertRules.map((rule) => (
              <AlertRuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
