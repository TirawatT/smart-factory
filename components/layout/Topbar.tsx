"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, User, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/monitoring": "Monitoring",
  "/dashboard/monitoring/digital-twin": "Digital Twin",
  "/dashboard/iot": "IoT Devices",
  "/dashboard/iot/control-panel": "Control Panel",
  "/dashboard/energy": "Energy Management",
  "/dashboard/alerts": "Alerts",
  "/dashboard/alerts/rules": "Alert Rules",
  "/dashboard/logs": "Audit Logs",
  "/dashboard/users": "Users",
  "/dashboard/users/roles": "Roles & Permissions",
  "/dashboard/system": "System Health",
  "/dashboard/system/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Generate breadcrumb from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [];
  let path = "";
  for (const segment of segments) {
    path += `/${segment}`;
    const label =
      routeLabels[path] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({ label, href: path });
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-[var(--topbar-height)] bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.href}>
            {i > 0 && (
              <ChevronRight size={14} className="text-muted-foreground" />
            )}
            {i === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <span className="text-muted-foreground">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* User dropdown */}
        {user && (
          <Dropdown
            trigger={
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-muted transition-colors">
                <Avatar name={user.name} size="sm" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {user.email}
                  </p>
                </div>
              </div>
            }
            items={[
              { label: "Profile", icon: <User size={14} />, onClick: () => {} },
              { label: "", onClick: () => {}, divider: true },
              {
                label: "Sign out",
                icon: <LogOut size={14} />,
                onClick: handleLogout,
                danger: true,
              },
            ]}
          />
        )}
      </div>
    </header>
  );
}
