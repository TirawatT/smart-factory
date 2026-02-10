"use client";

import React from "react";
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BarChartProps {
  data: Record<string, unknown>[];
  bars: { key: string; color: string; name?: string }[];
  xKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  layout?: "vertical" | "horizontal";
}

export function BarChart({
  data,
  bars,
  xKey,
  height = 300,
  showGrid = true,
  showLegend = false,
  layout = "horizontal",
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar
        data={data}
        layout={layout}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        )}
        {layout === "horizontal" ? (
          <>
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey={xKey}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontSize: 12,
          }}
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            fill={bar.color}
            name={bar.name || bar.key}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBar>
    </ResponsiveContainer>
  );
}
