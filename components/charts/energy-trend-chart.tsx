"use client";

import type { EnergyTrend } from "@/types";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EnergyTrendChartProps {
  readonly data: EnergyTrend[];
  readonly compact?: boolean;
}

export function EnergyTrendChart({
  data,
  compact = false,
}: EnergyTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={compact ? 200 : 350}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(217, 91%, 60%)"
              stopOpacity={0.3}
            />
            <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(142, 76%, 36%)"
              stopOpacity={0.3}
            />
            <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
          tickFormatter={(v: string) => v.slice(5)}
        />
        {!compact && (
          <YAxis
            tick={{ fontSize: 12 }}
            className="fill-muted-foreground"
            tickFormatter={(v: number) => `${v}`}
          />
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--popover-foreground))",
          }}
          formatter={(value?: number) => [
            `${(value ?? 0).toFixed(1)} kWh`,
            undefined,
          ]}
          labelFormatter={(label) => `Date: ${String(label)}`}
        />
        <Area
          type="monotone"
          dataKey="consumption"
          name="Consumption"
          stroke="hsl(217, 91%, 60%)"
          fillOpacity={1}
          fill="url(#colorConsumption)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="target"
          name="Target"
          stroke="hsl(142, 76%, 36%)"
          fillOpacity={1}
          fill="url(#colorTarget)"
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
