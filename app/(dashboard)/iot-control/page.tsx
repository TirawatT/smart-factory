"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePermission } from "@/hooks/use-permission";
import { mockDevices } from "@/lib/mock";
import { cn } from "@/lib/utils";
import type { Device, DeviceStatus } from "@/types";
import {
  AlertTriangle,
  Play,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Square,
  Wifi,
  WifiOff,
  Wrench,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const statusConfig: Record<
  DeviceStatus,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  online: {
    label: "Online",
    color:
      "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
    icon: Wifi,
  },
  offline: {
    label: "Offline",
    color: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30",
    icon: WifiOff,
  },
  error: {
    label: "Error",
    color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
    icon: AlertTriangle,
  },
  maintenance: {
    label: "Maintenance",
    color:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    icon: Wrench,
  },
};

function ParameterAdjustDialog({ device }: { readonly device: Device }) {
  const [params, setParams] = useState(
    device.parameters.map((p) => ({ ...p })),
  );

  const handleSave = useCallback(() => {
    toast.success(`ปรับพารามิเตอร์ ${device.name} เรียบร้อย`, {
      description: params
        .map((p) => `${p.name}: ${p.value} ${p.unit}`)
        .join(", "),
    });
  }, [device.name, params]);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>ปรับพารามิเตอร์ — {device.name}</DialogTitle>
        <DialogDescription>
          ปรับค่าพารามิเตอร์ของอุปกรณ์แบบ Remote
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        {params.map((param, idx) => (
          <div key={param.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">{param.name}</Label>
              <span className="text-xs text-muted-foreground">
                {param.min} – {param.max} {param.unit}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={param.min}
                max={param.max}
                value={param.value}
                onChange={(e) => {
                  const newParams = [...params];
                  newParams[idx] = {
                    ...newParams[idx],
                    value: Number(e.target.value),
                  };
                  setParams(newParams);
                }}
                className="font-mono"
              />
              <span className="text-sm text-muted-foreground w-12">
                {param.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleSave} className="w-full">
        บันทึกการเปลี่ยนแปลง
      </Button>
    </DialogContent>
  );
}

function DeviceControlCard({ device }: { readonly device: Device }) {
  const { hasPermission } = usePermission();
  const canControl = hasPermission("device", "control");
  const status = statusConfig[device.status];
  const StatusIcon = status.icon;
  const [isRunning, setIsRunning] = useState(device.status === "online");

  const handleStart = useCallback(() => {
    setIsRunning(true);
    toast.success(`เริ่มการทำงาน ${device.name}`);
  }, [device.name]);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    toast.warning(`หยุดการทำงาน ${device.name}`);
  }, [device.name]);

  const handleRestart = useCallback(() => {
    setIsRunning(false);
    setTimeout(() => setIsRunning(true), 1500);
    toast.info(`รีสตาร์ท ${device.name}...`);
  }, [device.name]);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium truncate">
            {device.name}
          </CardTitle>
          <Badge
            variant="outline"
            className={cn("text-xs shrink-0", status.color)}
          >
            <StatusIcon className="mr-1 h-3 w-3" />
            {status.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {device.zone} — {device.location}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Running Toggle */}
        <div className="flex items-center justify-between border rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                isRunning ? "bg-green-500 animate-pulse" : "bg-gray-400",
              )}
            />
            <span className="text-sm">
              {isRunning ? "กำลังทำงาน" : "หยุดทำงาน"}
            </span>
          </div>
          <Switch
            checked={isRunning}
            onCheckedChange={(checked) => {
              if (checked) handleStart();
              else handleStop();
            }}
            disabled={!canControl || device.status === "maintenance"}
          />
        </div>

        {/* Parameters */}
        {device.parameters.length > 0 && (
          <div className="space-y-1">
            {device.parameters.slice(0, 3).map((param) => (
              <div key={param.name} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{param.name}</span>
                <span className="font-mono">
                  {param.value} {param.unit}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={handleStart}
            disabled={!canControl || isRunning}
          >
            <Play className="mr-1 h-3 w-3" /> Start
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={handleStop}
            disabled={!canControl || !isRunning}
          >
            <Square className="mr-1 h-3 w-3" /> Stop
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={handleRestart}
            disabled={!canControl}
          >
            <RotateCcw className="mr-1 h-3 w-3" /> Restart
          </Button>
        </div>

        {/* Adjust Parameters */}
        {canControl && device.parameters.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="secondary" className="w-full text-xs">
                <SlidersHorizontal className="mr-1 h-3 w-3" /> ปรับพารามิเตอร์
              </Button>
            </DialogTrigger>
            <ParameterAdjustDialog device={device} />
          </Dialog>
        )}

        {!canControl && (
          <p className="text-xs text-muted-foreground text-center">
            คุณไม่มีสิทธิ์ควบคุมอุปกรณ์
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function IoTControlPage() {
  const [search, setSearch] = useState("");

  const filteredDevices = mockDevices.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.zone.toLowerCase().includes(search.toLowerCase()),
  );

  const controlTypes = ["actuator", "plc", "gateway"];
  const controllableDevices = filteredDevices.filter((d) =>
    controlTypes.includes(d.type),
  );
  const sensorDevices = filteredDevices.filter(
    (d) => !controlTypes.includes(d.type),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">IoT Control Panel</h1>
        <p className="text-muted-foreground">
          ควบคุมอุปกรณ์ IoT — Start/Stop, ปรับพารามิเตอร์ แบบ Remote
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาอุปกรณ์..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Controllable Devices */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          อุปกรณ์ที่ควบคุมได้ ({controllableDevices.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {controllableDevices.map((device) => (
            <DeviceControlCard key={device.id} device={device} />
          ))}
        </div>
      </div>

      {/* Sensor Devices */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          เซนเซอร์ ({sensorDevices.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sensorDevices.map((device) => (
            <DeviceControlCard key={device.id} device={device} />
          ))}
        </div>
      </div>
    </div>
  );
}
