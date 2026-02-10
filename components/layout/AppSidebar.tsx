"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Cpu,
  Zap,
  Bell,
  ScrollText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Factory,
  Shield,
  MonitorCheck,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: string;
  children?: { label: string; href: string; permission?: string }[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Monitoring",
    href: "/dashboard/monitoring",
    icon: <Activity size={20} />,
    permission: "monitoring:view",
    children: [
      { label: "Overview", href: "/dashboard/monitoring" },
      {
        label: "Digital Twin",
        href: "/dashboard/monitoring/digital-twin",
        permission: "monitoring:digital_twin",
      },
    ],
  },
  {
    label: "IoT Devices",
    href: "/dashboard/iot",
    icon: <Cpu size={20} />,
    permission: "devices:read",
    children: [
      { label: "All Devices", href: "/dashboard/iot" },
      {
        label: "Control Panel",
        href: "/dashboard/iot/control-panel",
        permission: "devices:command",
      },
    ],
  },
  {
    label: "Energy",
    href: "/dashboard/energy",
    icon: <Zap size={20} />,
    permission: "energy:read",
  },
  {
    label: "Alerts",
    href: "/dashboard/alerts",
    icon: <Bell size={20} />,
    permission: "alerts:read",
    children: [
      { label: "All Alerts", href: "/dashboard/alerts" },
      {
        label: "Alert Rules",
        href: "/dashboard/alerts/rules",
        permission: "alerts:manage_rules",
      },
    ],
  },
  {
    label: "Audit Logs",
    href: "/dashboard/logs",
    icon: <ScrollText size={20} />,
    permission: "logs:read",
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: <Users size={20} />,
    permission: "users:read",
    children: [
      { label: "All Users", href: "/dashboard/users" },
      {
        label: "Roles & Permissions",
        href: "/dashboard/users/roles",
        permission: "roles:read",
      },
    ],
  },
  {
    label: "System",
    href: "/dashboard/system",
    icon: <MonitorCheck size={20} />,
    permission: "system:health",
    children: [
      { label: "Health", href: "/dashboard/system" },
      {
        label: "Settings",
        href: "/dashboard/system/settings",
        permission: "system:settings",
      },
    ],
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const pathname = usePathname();
  const permissions = useAuthStore((s) => s.permissions);

  const hasPermission = (perm?: string) => {
    if (!perm) return true;
    return permissions.includes(perm);
  };

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label],
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const visibleItems = menuItems.filter((item) =>
    hasPermission(item.permission),
  );

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-sidebar-bg text-sidebar-foreground
        flex flex-col z-40 transition-all duration-200 border-r border-white/5
        ${collapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-[var(--topbar-height)] border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Factory size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-white whitespace-nowrap">
              Smart Factory
            </h1>
            <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap">
              IoT Platform
            </p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {visibleItems.map((item) => {
          const active = isActive(item.href);
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedGroups.includes(item.label);
          const visibleChildren = item.children?.filter((c) =>
            hasPermission(c.permission),
          );

          return (
            <div key={item.label}>
              {hasChildren && visibleChildren && visibleChildren.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)]
                      text-sm transition-colors cursor-pointer
                      ${active ? "bg-sidebar-active text-white" : "text-sidebar-foreground hover:bg-sidebar-hover"}
                    `}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronRight
                          size={14}
                          className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        />
                      </>
                    )}
                  </button>
                  {!collapsed && isExpanded && (
                    <div className="ml-8 mt-1 space-y-0.5">
                      {visibleChildren.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`
                            block px-3 py-2 rounded-[var(--radius-sm)] text-sm transition-colors
                            ${
                              pathname === child.href
                                ? "text-white bg-sidebar-hover"
                                : "text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-hover"
                            }
                          `}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)]
                    text-sm transition-colors
                    ${active ? "bg-sidebar-active text-white" : "text-sidebar-foreground hover:bg-sidebar-hover"}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[var(--radius-sm)]
            text-sidebar-foreground/60 hover:text-white hover:bg-sidebar-hover text-sm transition-colors cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
