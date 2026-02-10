"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Square, Settings, Clock } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { LineChart } from "@/components/charts/LineChart";
import { StatCard } from "@/components/charts/StatCard";
import { DataTable } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { deviceRepository } from "@/lib/db";
import {
  Device,
  DeviceTelemetry,
  DeviceCommand,
  DEVICE_TYPE_LABELS,
  ZONE_LABELS,
} from "@/types";
import { usePermission } from "@/stores/authStore";
import { useAuthStore } from "@/stores/authStore";

export default function DeviceDetailPage() {
  const params = useParams();
  const deviceId = params.deviceId as string;
  const [device, setDevice] = useState<Device | null>(null);
  const [telemetry, setTelemetry] = useState<DeviceTelemetry[]>([]);
  const [latestTelemetry, setLatestTelemetry] =
    useState<DeviceTelemetry | null>(null);
  const [commands, setCommands] = useState<DeviceCommand[]>([]);
  const [commandLoading, setCommandLoading] = useState(false);
  const canCommand = usePermission("devices:command");
  const user = useAuthStore((s) => s.user);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadData() {
      const [dev, history, latest, cmds] = await Promise.all([
        deviceRepository.findById(deviceId),
        deviceRepository.getTelemetryHistory(deviceId),
        deviceRepository.getLatestTelemetry(deviceId),
        deviceRepository.getCommands(deviceId),
      ]);
      setDevice(dev);
      setTelemetry(history);
      setLatestTelemetry(latest);
      setCommands(cmds);
    }
    loadData();
  }, [deviceId]);

  const sendCommand = async (command: string) => {
    if (!user) return;
    setCommandLoading(true);
    try {
      await deviceRepository.sendCommand(deviceId, command, {}, user.id);
      const [dev, cmds] = await Promise.all([
        deviceRepository.findById(deviceId),
        deviceRepository.getCommands(deviceId),
      ]);
      setDevice(dev);
      setCommands(cmds);
      addToast("success", `Command "${command}" sent successfully`);
    } catch {
      addToast("error", "Failed to send command");
    }
    setCommandLoading(false);
  };

  if (!device) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading...
      </div>
    );
  }

  // Prepare chart data from telemetry
  const chartData = telemetry.slice(-50).map((t) => ({
    time: t.timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    ...t.metrics,
  }));

  const metricKeys = latestTelemetry
    ? Object.keys(latestTelemetry.metrics)
    : [];
  const chartColors = ["#2563eb", "#dc2626", "#16a34a", "#d97706", "#0891b2"];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/iot">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />}>
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                {device.name}
              </h1>
              <StatusBadge status={device.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {DEVICE_TYPE_LABELS[device.type]} · {ZONE_LABELS[device.zone]}
            </p>
          </div>
        </div>
        {canCommand && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              icon={<Play size={16} />}
              onClick={() => sendCommand("start")}
              loading={commandLoading}
              disabled={device.status === "online"}
            >
              Start
            </Button>
            <Button
              variant="danger"
              icon={<Square size={16} />}
              onClick={() => sendCommand("stop")}
              loading={commandLoading}
              disabled={device.status === "offline"}
            >
              Stop
            </Button>
          </div>
        )}
      </div>

      {/* Device Info + Latest Readings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader title="Device Info" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID</span>
              <span className="font-mono">{device.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IP</span>
              <span className="font-mono">{device.ipAddress || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Firmware</span>
              <span>{device.firmware || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Seen</span>
              <span>{device.lastSeen.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {latestTelemetry &&
          metricKeys
            .slice(0, 3)
            .map((key) => (
              <StatCard
                key={key}
                title={key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (s) => s.toUpperCase())}
                value={`${latestTelemetry.metrics[key]}`}
                icon={<Settings size={18} className="text-primary" />}
              />
            ))}
      </div>

      {/* Telemetry Chart */}
      <Card>
        <CardHeader title="Telemetry History" subtitle="Last 24 hours" />
        {chartData.length > 0 ? (
          <LineChart
            data={chartData}
            lines={metricKeys.slice(0, 3).map((key, i) => ({
              key,
              color: chartColors[i % chartColors.length],
              name: key.replace(/([A-Z])/g, " $1"),
            }))}
            xKey="time"
            height={300}
            showLegend
          />
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No telemetry data available
          </p>
        )}
      </Card>

      {/* Command History */}
      <Card padding={false}>
        <div className="p-6 pb-0">
          <CardHeader title="Command History" />
        </div>
        <DataTable
          columns={[
            {
              key: "command",
              header: "Command",
              render: (c: DeviceCommand) => (
                <Badge variant="outline">{c.command}</Badge>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (c: DeviceCommand) => <StatusBadge status={c.status} />,
            },
            {
              key: "sentBy",
              header: "Sent By",
              render: (c: DeviceCommand) => c.sentBy,
            },
            {
              key: "createdAt",
              header: "Sent At",
              render: (c: DeviceCommand) => c.createdAt.toLocaleString(),
            },
            {
              key: "respondedAt",
              header: "Response At",
              render: (c: DeviceCommand) =>
                c.respondedAt ? c.respondedAt.toLocaleString() : "—",
            },
          ]}
          data={commands}
          rowKey={(c) => c.id}
          emptyMessage="No commands sent yet"
        />
      </Card>
    </div>
  );
}
