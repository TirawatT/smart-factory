"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cpu, AlertTriangle, Zap, Activity, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/charts/StatCard";
import { LineChart } from "@/components/charts/LineChart";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge, SeverityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { deviceRepository, alertRepository, energyRepository } from "@/lib/db";
import { Device, Alert, EnergySummary } from "@/types";

export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeAlertCount, setActiveAlertCount] = useState(0);
  const [energySummary, setEnergySummary] = useState<EnergySummary | null>(
    null,
  );

  useEffect(() => {
    async function loadData() {
      const [devs, counts, allAlerts, activeCount, summary] = await Promise.all(
        [
          deviceRepository.findAll(),
          deviceRepository.getStatusCounts(),
          alertRepository.findAll(),
          alertRepository.getActiveCount(),
          energyRepository.getSummary(1),
        ],
      );
      setDevices(devs);
      setStatusCounts(counts);
      setAlerts(allAlerts.slice(0, 5));
      setActiveAlertCount(activeCount);
      setEnergySummary(summary);
    }
    loadData();
  }, []);

  const totalDevices = devices.length;
  const onlineDevices = statusCounts.online || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Smart Factory overview and key metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Devices Online"
          value={`${onlineDevices}/${totalDevices}`}
          subtitle={`${statusCounts.error || 0} with errors`}
          icon={<Cpu size={20} className="text-primary" />}
          variant="primary"
          trend={{ value: 2.5, label: "vs last week" }}
        />
        <StatCard
          title="Active Alerts"
          value={activeAlertCount}
          subtitle={`${alerts.filter((a) => a.severity === "critical").length} critical`}
          icon={<AlertTriangle size={20} className="text-danger" />}
          variant={activeAlertCount > 3 ? "danger" : "default"}
          trend={{ value: -12, label: "vs yesterday" }}
        />
        <StatCard
          title="Energy Today"
          value={
            energySummary
              ? `${energySummary.totalKwh.toLocaleString()} kWh`
              : "—"
          }
          subtitle={
            energySummary ? `฿${energySummary.totalCost.toLocaleString()}` : ""
          }
          icon={<Zap size={20} className="text-warning" />}
          variant="warning"
          trend={
            energySummary
              ? { value: energySummary.vsTarget, label: "vs target" }
              : undefined
          }
        />
        <StatCard
          title="System Uptime"
          value="99.7%"
          subtitle="Last 30 days"
          icon={<Activity size={20} className="text-success" />}
          variant="success"
          trend={{ value: 0.3, label: "vs last month" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Energy Trend */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Energy Consumption (7 days)"
            subtitle="kWh per day"
          />
          {energySummary && (
            <LineChart
              data={energySummary.trend}
              lines={[
                { key: "kwh", color: "var(--warning)", name: "Energy (kWh)" },
              ]}
              xKey="date"
              height={250}
            />
          )}
        </Card>

        {/* Device Status */}
        <Card>
          <CardHeader
            title="Device Status"
            action={
              <Link href="/dashboard/iot">
                <Button variant="ghost" size="sm">
                  View all <ArrowRight size={14} />
                </Button>
              </Link>
            }
          />
          <div className="space-y-3">
            {[
              {
                label: "Online",
                count: statusCounts.online || 0,
                color: "bg-success",
              },
              {
                label: "Offline",
                count: statusCounts.offline || 0,
                color: "bg-muted-foreground",
              },
              {
                label: "Error",
                count: statusCounts.error || 0,
                color: "bg-danger",
              },
              {
                label: "Maintenance",
                count: statusCounts.maintenance || 0,
                color: "bg-warning",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {item.count}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Total
                </span>
                <span className="text-sm font-bold text-foreground">
                  {totalDevices}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader
          title="Recent Alerts"
          action={
            <Link href="/dashboard/alerts">
              <Button variant="ghost" size="sm">
                View all <ArrowRight size={14} />
              </Button>
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                  Severity
                </th>
                <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                  Device
                </th>
                <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                  Message
                </th>
                <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-2.5">
                    <SeverityBadge severity={alert.severity} />
                  </td>
                  <td className="px-4 py-2.5 font-medium">
                    {alert.deviceName}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground max-w-xs truncate">
                    {alert.message}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={alert.status} />
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                    {alert.triggeredAt.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
