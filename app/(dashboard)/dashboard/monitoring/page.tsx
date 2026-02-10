"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Thermometer, Droplets, Zap, Box } from "lucide-react";
import { StatCard } from "@/components/charts/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { deviceRepository } from "@/lib/db";
import { Device, ZONE_LABELS } from "@/types";

export default function MonitoringPage() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    deviceRepository.findAll().then(setDevices);
  }, []);

  const zones = ["zone-a", "zone-b", "zone-c", "zone-d"];

  const getZoneDevices = (zone: string) =>
    devices.filter((d) => d.zone === zone);
  const getZoneOnline = (zone: string) =>
    getZoneDevices(zone).filter((d) => d.status === "online").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Real-time Monitoring
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Factory zone overview and live metrics
          </p>
        </div>
        <Link href="/dashboard/monitoring/digital-twin">
          <Button variant="outline" icon={<Box size={16} />}>
            Digital Twin 3D
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Avg Temperature"
          value="42.5°C"
          icon={<Thermometer size={20} className="text-danger" />}
        />
        <StatCard
          title="Avg Humidity"
          value="52.3%"
          icon={<Droplets size={20} className="text-info" />}
        />
        <StatCard
          title="Total Power"
          value="285 kW"
          icon={<Zap size={20} className="text-warning" />}
        />
        <StatCard
          title="Production Rate"
          value="94.2%"
          icon={<Activity size={20} className="text-success" />}
        />
      </div>

      {/* Zone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone) => {
          const zoneDevices = getZoneDevices(zone);
          const onlineCount = getZoneOnline(zone);
          return (
            <Card key={zone}>
              <CardHeader
                title={ZONE_LABELS[zone] || zone}
                subtitle={`${onlineCount}/${zoneDevices.length} devices online`}
              />
              <div className="space-y-2">
                {zoneDevices.map((device) => (
                  <Link
                    key={device.id}
                    href={`/dashboard/iot/${device.id}`}
                    className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {device.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {device.type.replace(/_/g, " ")}
                      </p>
                    </div>
                    <StatusBadge status={device.status} />
                  </Link>
                ))}
                {zoneDevices.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No devices in this zone
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
