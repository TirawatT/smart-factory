"use client";

import React, { useEffect, useState } from "react";
import {
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  Activity,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/charts/StatCard";
import { LineChart } from "@/components/charts/LineChart";

interface ServiceStatus {
  name: string;
  status: "healthy" | "degraded" | "down";
  uptime: string;
  latency: string;
  icon: React.ReactNode;
}

export default function SystemHealthPage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [cpuHistory, setCpuHistory] = useState<
    { time: string; cpu: number; memory: number }[]
  >([]);

  useEffect(() => {
    // Mock system health data
    setServices([
      {
        name: "API Server",
        status: "healthy",
        uptime: "99.98%",
        latency: "12ms",
        icon: <Server size={20} />,
      },
      {
        name: "MQTT Broker",
        status: "healthy",
        uptime: "99.95%",
        latency: "3ms",
        icon: <Wifi size={20} />,
      },
      {
        name: "PostgreSQL",
        status: "healthy",
        uptime: "99.99%",
        latency: "5ms",
        icon: <HardDrive size={20} />,
      },
      {
        name: "Redis Cache",
        status: "healthy",
        uptime: "99.97%",
        latency: "1ms",
        icon: <Cpu size={20} />,
      },
      {
        name: "Task Queue",
        status: "degraded",
        uptime: "98.50%",
        latency: "45ms",
        icon: <Clock size={20} />,
      },
      {
        name: "WebSocket Gateway",
        status: "healthy",
        uptime: "99.90%",
        latency: "8ms",
        icon: <Activity size={20} />,
      },
    ]);

    // Generate CPU/Memory history
    const now = Date.now();
    const history = Array.from({ length: 24 }, (_, i) => ({
      time: new Date(now - (23 - i) * 3600000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      cpu: 30 + Math.random() * 40 + (i > 8 && i < 18 ? 15 : 0),
      memory: 55 + Math.random() * 20 + (i > 10 && i < 20 ? 10 : 0),
    }));
    setCpuHistory(history);
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "success";
      case "degraded":
        return "warning";
      case "down":
        return "danger";
      default:
        return "default";
    }
  };

  const healthyCount = services.filter((s) => s.status === "healthy").length;
  const totalCount = services.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Health</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor infrastructure and service health
          </p>
        </div>
        <Button variant="outline" icon={<RefreshCw size={16} />}>
          Refresh
        </Button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Services"
          value={`${healthyCount}/${totalCount}`}
          icon={<Server size={20} className="text-success" />}
          variant={healthyCount === totalCount ? "success" : "warning"}
        />
        <StatCard
          title="Avg CPU"
          value={`${Math.round(cpuHistory.reduce((s, h) => s + h.cpu, 0) / (cpuHistory.length || 1))}%`}
          icon={<Cpu size={20} className="text-primary" />}
          variant="primary"
        />
        <StatCard
          title="Avg Memory"
          value={`${Math.round(cpuHistory.reduce((s, h) => s + h.memory, 0) / (cpuHistory.length || 1))}%`}
          icon={<HardDrive size={20} className="text-info" />}
          variant="default"
        />
        <StatCard
          title="Uptime"
          value="99.95%"
          icon={<Clock size={20} className="text-success" />}
          variant="success"
        />
      </div>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.name} className="!p-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg bg-${statusColor(service.status)}/10 text-${statusColor(service.status)}`}
              >
                {service.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{service.name}</h3>
                  <StatusBadge
                    status={
                      service.status === "healthy"
                        ? "online"
                        : service.status === "degraded"
                          ? "maintenance"
                          : "error"
                    }
                  />
                </div>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Uptime: {service.uptime}</span>
                  <span>Latency: {service.latency}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Resource Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="CPU Usage (24h)" />
          <LineChart
            data={cpuHistory}
            lines={[{ key: "cpu", color: "var(--primary)", name: "CPU %" }]}
            xKey="time"
            height={250}
          />
        </Card>
        <Card>
          <CardHeader title="Memory Usage (24h)" />
          <LineChart
            data={cpuHistory}
            lines={[
              { key: "memory", color: "var(--success)", name: "Memory %" },
            ]}
            xKey="time"
            height={250}
          />
        </Card>
      </div>
    </div>
  );
}
