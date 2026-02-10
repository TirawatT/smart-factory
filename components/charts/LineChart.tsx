"use client";

import React from "react";
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface LineChartProps {
  data: Record<string, unknown>[];
  lines: { key: string; color: string; name?: string }[];
  xKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

export function LineChart({
  data,
  lines,
  xKey,
  height = 300,
  showGrid = true,
  showLegend = false,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLine
        data={data}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        )}
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
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontSize: 12,
          }}
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            name={line.name || line.key}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </RechartsLine>
    </ResponsiveContainer>
  );
}
