"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEVICE_STATUSES, DEVICE_TYPES } from "@/lib/constants";
import { getDeviceStats, mockDevices } from "@/lib/mock";
import { cn } from "@/lib/utils";
import type { Device, DeviceStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  AlertTriangle,
  LayoutGrid,
  List,
  Search,
  Wifi,
  WifiOff,
  Wrench,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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

function DeviceCard({ device }: { readonly device: Device }) {
  const status = statusConfig[device.status];
  const StatusIcon = status.icon;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
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
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Type</span>
            <p className="font-medium capitalize">{device.type}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Zone</span>
            <p className="font-medium">{device.zone}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Location</span>
            <p className="font-medium">{device.location}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Last Heartbeat</span>
            <p className="font-medium">
              {formatDistanceToNow(device.lastHeartbeat, { addSuffix: true })}
            </p>
          </div>
        </div>

        {device.parameters.length > 0 && (
          <div className="border-t pt-2">
            <p className="text-xs text-muted-foreground mb-1">Parameters</p>
            <div className="space-y-1">
              {device.parameters.slice(0, 3).map((param) => (
                <div key={param.name} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{param.name}</span>
                  <span className="font-mono font-medium">
                    {param.value} {param.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MonitoringPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [devices, setDevices] = useState(mockDevices);
  const stats = getDeviceStats();

  // Simulate real-time updates
  const simulateUpdate = useCallback(() => {
    setDevices((prev) =>
      prev.map((device) => ({
        ...device,
        parameters: device.parameters.map((param) => ({
          ...param,
          value:
            Math.round(
              (param.value +
                (Math.random() - 0.5) * (param.max - param.min) * 0.05) *
                100,
            ) / 100,
        })),
        lastHeartbeat:
          device.status === "online" ? new Date() : device.lastHeartbeat,
      })),
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(simulateUpdate, 5000);
    return () => clearInterval(interval);
  }, [simulateUpdate]);

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(search.toLowerCase()) ||
      device.zone.toLowerCase().includes(search.toLowerCase()) ||
      device.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || device.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || device.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Real-time Monitoring
        </h1>
        <p className="text-muted-foreground">
          ติดตามสถานะอุปกรณ์ทุกตัวแบบ Real-time
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">ทั้งหมด</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        {(["online", "offline", "error", "maintenance"] as const).map((s) => {
          const cfg = statusConfig[s];
          const StatusIcon = cfg.icon;
          return (
            <Card key={s}>
              <CardContent className="p-4 flex items-center gap-3">
                <StatusIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{cfg.label}</p>
                  <p className="text-xl font-bold">{stats[s]}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาอุปกรณ์..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="ประเภท" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกประเภท</SelectItem>
            {DEVICE_TYPES.map((t) => (
              <SelectItem key={t} value={t} className="capitalize">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสถานะ</SelectItem>
            {DEVICE_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Device Grid / List */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Heartbeat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => {
                const status = statusConfig[device.status];
                const StatusIcon = status.icon;
                return (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell className="capitalize">{device.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", status.color)}
                      >
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{device.zone}</TableCell>
                    <TableCell>{device.location}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(device.lastHeartbeat, {
                        addSuffix: true,
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {filteredDevices.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>ไม่พบอุปกรณ์ที่ตรงกับเงื่อนไข</p>
        </div>
      )}
    </div>
  );
}
