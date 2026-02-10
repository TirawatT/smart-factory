"use client";

import React, { useEffect, useState } from "react";
import { Play, Square, Power } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { deviceRepository } from "@/lib/db";
import { Device, DEVICE_TYPE_LABELS } from "@/types";
import { useAuthStore } from "@/stores/authStore";

export default function ControlPanelPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const user = useAuthStore((s) => s.user);
  const { addToast } = useToast();

  useEffect(() => {
    deviceRepository.findAll().then(setDevices);
  }, []);

  const sendCommand = async (deviceId: string, command: string) => {
    if (!user) return;
    setLoadingIds((prev) => new Set(prev).add(deviceId));
    try {
      await deviceRepository.sendCommand(deviceId, command, {}, user.id);
      const updatedDevices = await deviceRepository.findAll();
      setDevices(updatedDevices);
      addToast("success", `${command} command sent to device`);
    } catch {
      addToast("error", "Failed to send command");
    }
    setLoadingIds((prev) => {
      const next = new Set(prev);
      next.delete(deviceId);
      return next;
    });
  };

  const controllableDevices = devices.filter((d) =>
    ["cnc_machine", "robot_arm", "conveyor", "air_compressor"].includes(d.type),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Control Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Start, stop, and control factory devices
        </p>
      </div>

      {/* Batch Actions */}
      <Card>
        <CardHeader
          title="Batch Controls"
          subtitle="Apply commands to all controllable devices"
        />
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<Play size={16} />}
            onClick={async () => {
              for (const d of controllableDevices.filter(
                (d) => d.status !== "online" && d.status !== "maintenance",
              )) {
                await sendCommand(d.id, "start");
              }
            }}
          >
            Start All Idle
          </Button>
          <Button
            variant="danger"
            icon={<Square size={16} />}
            onClick={async () => {
              for (const d of controllableDevices.filter(
                (d) => d.status === "online",
              )) {
                await sendCommand(d.id, "stop");
              }
            }}
          >
            Stop All Running
          </Button>
        </div>
      </Card>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {controllableDevices.map((device) => (
          <Card key={device.id}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-foreground">{device.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {DEVICE_TYPE_LABELS[device.type]}
                </p>
              </div>
              <StatusBadge status={device.status} />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                icon={<Play size={14} />}
                onClick={() => sendCommand(device.id, "start")}
                loading={loadingIds.has(device.id)}
                disabled={
                  device.status === "online" || device.status === "maintenance"
                }
              >
                Start
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                icon={<Square size={14} />}
                onClick={() => sendCommand(device.id, "stop")}
                loading={loadingIds.has(device.id)}
                disabled={
                  device.status === "offline" || device.status === "maintenance"
                }
              >
                Stop
              </Button>
            </div>

            {device.status === "maintenance" && (
              <p className="text-xs text-warning mt-2">
                Device is under maintenance
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
