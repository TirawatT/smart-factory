"use client";

import type { DeviceStats } from "@/types";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface DeviceStatusChartProps {
  readonly stats: DeviceStats;
}

const STATUS_COLORS: Record<string, string> = {
  Online: "hsl(142, 76%, 36%)",
  Offline: "hsl(0, 0%, 45%)",
  Error: "hsl(0, 84%, 60%)",
  Maintenance: "hsl(45, 93%, 47%)",
};

export function DeviceStatusChart({ stats }: DeviceStatusChartProps) {
  const data = [
    { name: "Online", value: stats.online },
    { name: "Offline", value: stats.offline },
    { name: "Error", value: stats.error },
    { name: "Maintenance", value: stats.maintenance },
  ].filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}`}
          labelLine={false}
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={STATUS_COLORS[entry.name]}
              strokeWidth={0}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--popover-foreground))",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
