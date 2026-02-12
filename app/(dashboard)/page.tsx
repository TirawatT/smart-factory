"use client";

import { DeviceStatusChart } from "@/components/charts/device-status-chart";
import { EnergyTrendChart } from "@/components/charts/energy-trend-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAlertStats,
  getDeviceStats,
  mockAlerts,
  mockAuditLogs,
  mockDevices,
  mockEnergyStats,
  mockEnergyTrends,
} from "@/lib/mock";
import { cn } from "@/lib/utils";
import type { AlertStats, DeviceStats } from "@/types";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Wifi,
  Zap,
} from "lucide-react";
import { useMemo } from "react";

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = "default",
}: {
  readonly title: string;
  readonly value: string | number;
  readonly subtitle: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly trend?: "up" | "down" | "neutral";
  readonly trendValue?: string;
  readonly variant?: "default" | "success" | "warning" | "danger";
}) {
  const variantStyles = {
    default: "bg-card",
    success: "bg-card border-green-500/20",
    warning: "bg-card border-yellow-500/20",
    danger: "bg-card border-red-500/20",
  };

  const iconStyles = {
    default: "bg-muted text-muted-foreground",
    success: "bg-green-500/10 text-green-600 dark:text-green-400",
    warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return (
    <Card
      className={cn(
        "transition-shadow hover:shadow-md",
        variantStyles[variant],
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={cn("rounded-lg p-3", iconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {trend && trendValue && (
          <div className="mt-3 flex items-center gap-1 text-xs">
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : trend === "down" ? (
              <TrendingDown className="h-3 w-3 text-red-500" />
            ) : null}
            <span
              className={cn(
                trend === "up" && "text-green-500",
                trend === "down" && "text-red-500",
                trend === "neutral" && "text-muted-foreground",
              )}
            >
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentAlerts() {
  const recentAlerts = mockAlerts
    .filter((a) => a.status === "active")
    .slice(0, 5);

  const severityStyles = {
    critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
    warning:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  };

  return (
    <div className="space-y-3">
      {recentAlerts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          ไม่มีการแจ้งเตือนที่ยังดำเนินการ
        </p>
      ) : (
        recentAlerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
          >
            <Badge
              variant="outline"
              className={cn("shrink-0 text-xs", severityStyles[alert.severity])}
            >
              {alert.severity}
            </Badge>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{alert.deviceName}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {alert.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(alert.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function RecentActivity() {
  const recentLogs = mockAuditLogs.slice(0, 6);

  const actionIcons: Record<string, string> = {
    LOGIN: "🔐",
    LOGOUT: "🚪",
    CREATE: "➕",
    UPDATE: "✏️",
    DELETE: "🗑️",
    CONTROL: "🎮",
    VIEW: "👁️",
    EXPORT: "📤",
    ACKNOWLEDGE: "✅",
    CONFIGURE: "⚙️",
  };

  return (
    <div className="space-y-3">
      {recentLogs.map((log) => (
        <div
          key={log.id}
          className="flex items-center gap-3 text-sm border-b border-border/50 pb-2 last:border-0"
        >
          <span className="text-base">{actionIcons[log.action] ?? "📋"}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">
              <span className="text-muted-foreground">{log.userName}</span>{" "}
              <span className="text-xs">
                {log.action} {log.resource}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(log.timestamp, { addSuffix: true })}
            </p>
          </div>
          <Badge
            variant={log.result === "SUCCESS" ? "secondary" : "destructive"}
            className="text-xs shrink-0"
          >
            {log.result}
          </Badge>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const deviceStats: DeviceStats = useMemo(() => getDeviceStats(), []);
  const alertStats: AlertStats = useMemo(() => getAlertStats(), []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          ภาพรวมระบบ Smart Factory — สถานะอุปกรณ์ การแจ้งเตือน และพลังงาน
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="อุปกรณ์ทั้งหมด"
          value={deviceStats.total}
          subtitle={`${deviceStats.online} online / ${deviceStats.offline} offline`}
          icon={Activity}
          variant="default"
          trend="up"
          trendValue="2 เครื่องเพิ่มขึ้นจากเดือนก่อน"
        />
        <KpiCard
          title="อุปกรณ์ออนไลน์"
          value={deviceStats.online}
          subtitle={`${Math.round((deviceStats.online / deviceStats.total) * 100)}% ของทั้งหมด`}
          icon={Wifi}
          variant="success"
          trend="up"
          trendValue="ทำงานปกติ"
        />
        <KpiCard
          title="การแจ้งเตือน Active"
          value={alertStats.active}
          subtitle={`${alertStats.critical} critical, ${alertStats.warning} warning`}
          icon={AlertTriangle}
          variant={alertStats.critical > 0 ? "danger" : "warning"}
          trend="up"
          trendValue={`${alertStats.total} รายการทั้งหมด`}
        />
        <KpiCard
          title="พลังงานวันนี้"
          value={`${mockEnergyStats.totalConsumption.toLocaleString()} ${mockEnergyStats.unit}`}
          subtitle={`ค่าใช้จ่าย ฿${mockEnergyStats.totalCost.toLocaleString()}`}
          icon={Zap}
          variant="default"
          trend="down"
          trendValue="ลดลง 5% จากเมื่อวาน"
        />
      </div>

      {/* Charts & Lists */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Device Status Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">สถานะอุปกรณ์</CardTitle>
          </CardHeader>
          <CardContent>
            <DeviceStatusChart stats={deviceStats} />
          </CardContent>
        </Card>

        {/* Energy Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              แนวโน้มการใช้พลังงาน (30 วัน)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnergyTrendChart data={mockEnergyTrends} compact />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              การแจ้งเตือนล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentAlerts />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">กิจกรรมล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                ประสิทธิภาพพลังงาน
              </span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {mockEnergyStats.averageEfficiency}%
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Peak Demand</span>
              <span className="text-lg font-bold">
                {mockEnergyStats.peakDemand} kW
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                อุปกรณ์ที่ต้องซ่อมบำรุง
              </span>
              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {mockDevices.filter((d) => d.status === "maintenance").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
