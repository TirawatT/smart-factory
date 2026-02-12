"use client";

import { EnergyTrendChart } from "@/components/charts/energy-trend-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  mockEnergyByZone,
  mockEnergyStats,
  mockEnergySuggestions,
  mockEnergyTrends,
} from "@/lib/mock";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Gauge,
  Lightbulb,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ZONE_COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(142, 76%, 36%)",
  "hsl(45, 93%, 47%)",
  "hsl(0, 84%, 60%)",
  "hsl(280, 67%, 54%)",
  "hsl(190, 90%, 50%)",
];

const priorityStyles = {
  high: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
  medium:
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
};

export default function EnergyPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Energy Management</h1>
        <p className="text-muted-foreground">
          ติดตามการใช้พลังงาน ค่าใช้จ่าย และคำแนะนำในการประหยัด
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  การใช้พลังงานรวม
                </p>
                <p className="text-2xl font-bold">
                  {mockEnergyStats.totalConsumption.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mockEnergyStats.unit}
                </p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ค่าใช้จ่ายรวม</p>
                <p className="text-2xl font-bold">
                  ฿{mockEnergyStats.totalCost.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">วันนี้</p>
              </div>
              <div className="rounded-lg bg-green-500/10 p-3">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ประสิทธิภาพ</p>
                <p className="text-2xl font-bold">
                  {mockEnergyStats.averageEfficiency}%
                </p>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUp className="h-3 w-3 mr-1" /> +2.5% จากเมื่อวาน
                </div>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Peak Demand</p>
                <p className="text-2xl font-bold">
                  {mockEnergyStats.peakDemand}
                </p>
                <p className="text-xs text-muted-foreground">kW</p>
              </div>
              <div className="rounded-lg bg-orange-500/10 p-3">
                <Gauge className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            แนวโน้มการใช้พลังงานรายวัน (30 วัน)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EnergyTrendChart data={mockEnergyTrends} />
        </CardContent>
      </Card>

      {/* Zone Breakdown + Suggestions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Zone Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">การใช้พลังงานตามโซน</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mockEnergyByZone}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  type="number"
                  className="fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="zone"
                  className="fill-muted-foreground"
                  tick={{ fontSize: 11 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                  formatter={(value: number | undefined) => [
                    `${value ?? 0} kWh`,
                    "Consumption",
                  ]}
                />
                <Bar dataKey="consumption" radius={[0, 4, 4, 0]}>
                  {mockEnergyByZone.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={ZONE_COLORS[idx % ZONE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Zone Table */}
            <div className="mt-4 space-y-2">
              {mockEnergyByZone.map((zone, idx) => (
                <div
                  key={zone.zone}
                  className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: ZONE_COLORS[idx % ZONE_COLORS.length],
                      }}
                    />
                    <span>{zone.zone}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{zone.consumption} kWh</span>
                    <span>฿{zone.cost.toLocaleString()}</span>
                    <span>{zone.deviceCount} devices</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              คำแนะนำการประหยัดพลังงาน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEnergySuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="border rounded-lg p-4 space-y-2 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        priorityStyles[suggestion.priority],
                      )}
                    >
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    {suggestion.deviceName && (
                      <span className="text-muted-foreground">
                        อุปกรณ์: {suggestion.deviceName}
                      </span>
                    )}
                    <span className="font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                      <ArrowDown className="h-3 w-3" />
                      ประหยัดได้ {suggestion.potentialSaving}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
