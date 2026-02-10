import React from "react";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  danger: "bg-danger-light text-danger",
  info: "bg-info-light text-info",
  neutral: "bg-muted text-muted-foreground",
  outline: "border border-border text-muted-foreground",
};

export function Badge({
  children,
  variant = "neutral",
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full
      ${variantStyles[variant]}
      ${className}
    `}
    >
      {dot && (
        <span
          className={`
          w-1.5 h-1.5 rounded-full animate-pulse-dot
          ${
            variant === "success"
              ? "bg-success"
              : variant === "warning"
                ? "bg-warning"
                : variant === "danger"
                  ? "bg-danger"
                  : variant === "info"
                    ? "bg-info"
                    : "bg-muted-foreground"
          }
        `}
        />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    online: { variant: "success", label: "Online" },
    offline: { variant: "neutral", label: "Offline" },
    error: { variant: "danger", label: "Error" },
    maintenance: { variant: "warning", label: "Maintenance" },
    active: { variant: "danger", label: "Active" },
    acknowledged: { variant: "warning", label: "Acknowledged" },
    resolved: { variant: "success", label: "Resolved" },
    success: { variant: "success", label: "Success" },
    failure: { variant: "danger", label: "Failure" },
    pending: { variant: "info", label: "Pending" },
    sent: { variant: "success", label: "Sent" },
    failed: { variant: "danger", label: "Failed" },
  };

  const c = config[status] || {
    variant: "neutral" as BadgeVariant,
    label: status,
  };
  return (
    <Badge variant={c.variant} dot>
      {c.label}
    </Badge>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    critical: { variant: "danger", label: "Critical" },
    warning: { variant: "warning", label: "Warning" },
    info: { variant: "info", label: "Info" },
  };

  const c = config[severity] || {
    variant: "neutral" as BadgeVariant,
    label: severity,
  };
  return <Badge variant={c.variant}>{c.label}</Badge>;
}
