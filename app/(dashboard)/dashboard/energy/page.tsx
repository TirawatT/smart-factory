"use client";

import React, { useEffect, useState } from "react";
import { Zap, DollarSign, Leaf, Target } from "lucide-react";
import { StatCard } from "@/components/charts/StatCard";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { Card, CardHeader } from "@/components/ui/Card";
import { energyRepository } from "@/lib/db";
import { EnergySummary, ZONE_LABELS } from "@/types";

export default function EnergyPage() {
  const [summary, setSummary] = useState<EnergySummary | null>(null);

  useEffect(() => {
    energyRepository.getSummary(1).then(setSummary);
  }, []);

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading...
      </div>
    );
  }

  const zoneChartData = summary.byZone.map((z) => ({
    zone: ZONE_LABELS[z.zone] || z.zone,
    kwh: z.kwh,
    cost: z.cost,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Energy Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor energy consumption, costs, and optimization
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Energy Today"
          value={`${summary.totalKwh.toLocaleString()} kWh`}
          icon={<Zap size={20} className="text-warning" />}
          variant="warning"
        />
        <StatCard
          title="Cost Today"
          value={`฿${summary.totalCost.toLocaleString()}`}
          icon={<DollarSign size={20} className="text-primary" />}
          variant="primary"
        />
        <StatCard
          title="CO₂ Emission"
          value={`${summary.co2Kg.toLocaleString()} kg`}
          icon={<Leaf size={20} className="text-success" />}
          variant="success"
        />
        <StatCard
          title="vs Target"
          value={`${summary.vsTarget > 0 ? "+" : ""}${summary.vsTarget}%`}
          icon={<Target size={20} className="text-info" />}
          variant={summary.vsTarget > 5 ? "danger" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Trend */}
        <Card>
          <CardHeader
            title="7-Day Energy Trend"
            subtitle="Daily consumption in kWh"
          />
          <LineChart
            data={summary.trend}
            lines={[
              { key: "kwh", color: "var(--warning)", name: "Energy (kWh)" },
            ]}
            xKey="date"
            height={300}
          />
        </Card>

        {/* Zone Breakdown */}
        <Card>
          <CardHeader
            title="Zone Breakdown"
            subtitle="Energy distribution by zone"
          />
          <BarChart
            data={zoneChartData}
            bars={[{ key: "kwh", color: "var(--primary)", name: "kWh" }]}
            xKey="zone"
            height={300}
          />
        </Card>
      </div>

      {/* Zone Detail Table */}
      <Card>
        <CardHeader title="Zone Energy Details" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">
                  Zone
                </th>
                <th className="px-4 py-3 text-right text-muted-foreground font-medium">
                  Energy (kWh)
                </th>
                <th className="px-4 py-3 text-right text-muted-foreground font-medium">
                  Cost (฿)
                </th>
                <th className="px-4 py-3 text-right text-muted-foreground font-medium">
                  Share
                </th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">
                  Distribution
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.byZone.map((z) => (
                <tr
                  key={z.zone}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 font-medium">
                    {ZONE_LABELS[z.zone] || z.zone}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {z.kwh.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ฿{z.cost.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">{z.percentage}%</td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${z.percentage}%` }}
                      />
                    </div>
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
