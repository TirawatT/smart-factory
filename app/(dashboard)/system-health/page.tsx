"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockLatencyHistory, mockSystemHealth } from "@/lib/mock";
import { cn } from "@/lib/utils";
import type { SystemHealthStatus } from "@/types";
import {
  AlertTriangle,
  CheckCircle,
  Cpu,
  Database,
  HeartPulse,
  MemoryStick,
  MonitorSmartphone,
  Radio,
  Server,
  Users,
  Wifi,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const statusConfig = {
  healthy: {
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
    label: "Healthy",
  },
  degraded: {
    icon: AlertTriangle,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500/10",
    label: "Degraded",
  },
  down: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    label: "Down",
  },
};

const serviceIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "API Server": Server,
  PostgreSQL: Database,
  "MQTT Broker (HiveMQ)": Radio,
  "Real-time Server (Socket.IO)": Wifi,
};

function ServiceCard({ service }: { readonly service: SystemHealthStatus }) {
  const status = statusConfig[service.status];
  const StatusIcon = status.icon;
  const ServiceIcon = serviceIcons[service.service] ?? Server;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("rounded-lg p-2", status.bg)}>
              <ServiceIcon className={cn("h-5 w-5", status.color)} />
            </div>
            <div>
              <h3 className="font-medium text-sm">{service.service}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <StatusIcon className={cn("h-3 w-3", status.color)} />
                <span className={cn("text-xs", status.color)}>
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Latency</p>
            <p className="font-mono font-medium">{service.latency} ms</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Uptime</p>
            <p className="font-mono font-medium">{service.uptime}%</p>
          </div>
        </div>
        {service.details && (
          <div className="mt-3 pt-3 border-t space-y-1">
            {Object.entries(service.details).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className="font-mono">{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SystemHealthPage() {
  const health = mockSystemHealth;
  const overallStatus = statusConfig[health.overallStatus];
  const OverallIcon = overallStatus.icon;

  const latencyData = useMemo(
    () =>
      mockLatencyHistory.map((item) => ({
        ...item,
        time: new Date(item.time).toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        api: Math.round(item.api),
        database: Math.round(item.database),
        mqtt: Math.round(item.mqtt),
        realtime: Math.round(item.realtime),
      })),
    [],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Health</h1>
        <p className="text-muted-foreground">
          ตรวจสอบสถานะระบบ, API Latency, และ Service health
        </p>
      </div>

      {/* Overall Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn("rounded-lg p-3", overallStatus.bg)}>
                <HeartPulse className={cn("h-8 w-8", overallStatus.color)} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Overall System Status</h2>
                <div className="flex items-center gap-1 mt-1">
                  <OverallIcon className={cn("h-4 w-4", overallStatus.color)} />
                  <span
                    className={cn("text-sm font-medium", overallStatus.color)}
                  >
                    {overallStatus.label}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <MonitorSmartphone className="h-3 w-3" />
                  <span className="text-xs">Devices</span>
                </div>
                <p className="text-xl font-bold">{health.connectedDevices}</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span className="text-xs">Users</span>
                </div>
                <p className="text-xl font-bold">{health.activeUsers}</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <Cpu className="h-3 w-3" />
                  <span className="text-xs">CPU</span>
                </div>
                <p className="text-xl font-bold">{health.cpuUsage}%</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <MemoryStick className="h-3 w-3" />
                  <span className="text-xs">Memory</span>
                </div>
                <p className="text-xl font-bold">{health.memoryUsage}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ServiceCard service={health.api} />
        <ServiceCard service={health.database} />
        <ServiceCard service={health.mqttBroker} />
        <ServiceCard service={health.realtimeServer} />
      </div>

      {/* Latency Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Latency History (60 นาทีล่าสุด)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={latencyData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                tickFormatter={(v: number) => `${v}ms`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(value?: number, name?: string) => [
                  `${value ?? 0} ms`,
                  name ?? "",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="api"
                name="API"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="database"
                name="Database"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="mqtt"
                name="MQTT"
                stroke="hsl(45, 93%, 47%)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="realtime"
                name="Realtime"
                stroke="hsl(280, 67%, 54%)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CPU & Memory bars */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="h-4 w-4" /> CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Usage</span>
                <span className="font-medium">{health.cpuUsage}%</span>
              </div>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    health.cpuUsage < 60
                      ? "bg-green-500"
                      : health.cpuUsage < 80
                        ? "bg-yellow-500"
                        : "bg-red-500",
                  )}
                  style={{ width: `${health.cpuUsage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MemoryStick className="h-4 w-4" /> Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Usage</span>
                <span className="font-medium">{health.memoryUsage}%</span>
              </div>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    health.memoryUsage < 60
                      ? "bg-green-500"
                      : health.memoryUsage < 80
                        ? "bg-yellow-500"
                        : "bg-red-500",
                  )}
                  style={{ width: `${health.memoryUsage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
