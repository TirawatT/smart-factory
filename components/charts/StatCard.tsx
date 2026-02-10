"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-primary-light",
  success: "bg-success-light",
  warning: "bg-warning-light",
  danger: "bg-danger-light",
};

const iconBg = {
  default: "bg-muted",
  primary: "bg-primary/10",
  success: "bg-success/10",
  warning: "bg-warning/10",
  danger: "bg-danger/10",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
}: StatCardProps) {
  return (
    <div
      className={`${variantStyles[variant]} border border-border rounded-[var(--radius-lg)] p-5`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              {trend.value > 0 ? (
                <TrendingUp size={14} className="text-success" />
              ) : trend.value < 0 ? (
                <TrendingDown size={14} className="text-danger" />
              ) : (
                <Minus size={14} className="text-muted-foreground" />
              )}
              <span
                className={
                  trend.value > 0
                    ? "text-success"
                    : trend.value < 0
                      ? "text-danger"
                      : "text-muted-foreground"
                }
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-[var(--radius)] ${iconBg[variant]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
