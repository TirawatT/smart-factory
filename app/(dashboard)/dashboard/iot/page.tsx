"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { SearchInput, Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/Table";
import { deviceRepository } from "@/lib/db";
import {
  Device,
  DeviceFilters,
  DEVICE_TYPE_LABELS,
  DEVICE_STATUS_LABELS,
  ZONE_LABELS,
} from "@/types";
import { usePermission } from "@/stores/authStore";

export default function IoTDevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<DeviceFilters>({});
  const canWrite = usePermission("devices:write");

  useEffect(() => {
    deviceRepository.findAll(filters).then(setDevices);
  }, [filters]);

  const statusOptions = Object.entries(DEVICE_STATUS_LABELS).map(
    ([value, label]) => ({ value, label }),
  );
  const typeOptions = Object.entries(DEVICE_TYPE_LABELS).map(
    ([value, label]) => ({ value, label }),
  );
  const zoneOptions = Object.entries(ZONE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">IoT Devices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {devices.length} devices registered
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-[var(--radius-sm)] overflow-hidden">
            <button
              className={`p-2 ${view === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"} cursor-pointer`}
              onClick={() => setView("grid")}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`p-2 ${view === "list" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"} cursor-pointer`}
              onClick={() => setView("list")}
            >
              <List size={16} />
            </button>
          </div>
          {canWrite && <Button icon={<Plus size={16} />}>Add Device</Button>}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchInput
          value={filters.search || ""}
          onChange={(v) =>
            setFilters((f) => ({ ...f, search: v || undefined }))
          }
          placeholder="Search devices..."
          className="w-64"
        />
        <Select
          options={statusOptions}
          placeholder="All Status"
          value={filters.status || ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              status: (e.target.value as Device["status"]) || undefined,
            }))
          }
        />
        <Select
          options={typeOptions}
          placeholder="All Types"
          value={filters.type || ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              type: (e.target.value as Device["type"]) || undefined,
            }))
          }
        />
        <Select
          options={zoneOptions}
          placeholder="All Zones"
          value={filters.zone || ""}
          onChange={(e) =>
            setFilters((f) => ({ ...f, zone: e.target.value || undefined }))
          }
        />
      </div>

      {/* Grid View */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <Link key={device.id} href={`/dashboard/iot/${device.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-foreground">
                      {device.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {DEVICE_TYPE_LABELS[device.type]}
                    </p>
                  </div>
                  <StatusBadge status={device.status} />
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Zone</span>
                    <span className="text-foreground">
                      {ZONE_LABELS[device.zone] || device.zone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>IP</span>
                    <span className="font-mono text-foreground">
                      {device.ipAddress || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Firmware</span>
                    <span className="text-foreground">
                      {device.firmware || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Seen</span>
                    <span className="text-foreground">
                      {device.lastSeen.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card padding={false}>
          <DataTable
            columns={[
              {
                key: "name",
                header: "Name",
                sortable: true,
                render: (d: Device) => (
                  <span className="font-medium">{d.name}</span>
                ),
              },
              {
                key: "type",
                header: "Type",
                render: (d: Device) => DEVICE_TYPE_LABELS[d.type],
              },
              {
                key: "zone",
                header: "Zone",
                render: (d: Device) => ZONE_LABELS[d.zone] || d.zone,
              },
              {
                key: "status",
                header: "Status",
                render: (d: Device) => <StatusBadge status={d.status} />,
              },
              {
                key: "ipAddress",
                header: "IP",
                render: (d: Device) => (
                  <span className="font-mono text-xs">
                    {d.ipAddress || "—"}
                  </span>
                ),
              },
              {
                key: "lastSeen",
                header: "Last Seen",
                render: (d: Device) => d.lastSeen.toLocaleString(),
              },
            ]}
            data={devices}
            onRowClick={(d) => {
              window.location.href = `/dashboard/iot/${d.id}`;
            }}
            rowKey={(d) => d.id}
          />
        </Card>
      )}
    </div>
  );
}
