"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FileText, Download, Filter, Eye } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select, SearchInput } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Table";
import { auditLogRepository } from "@/lib/db";
import { AuditLog, AuditAction, AuditResult } from "@/types";
import { usePermission } from "@/stores/authStore";

const ACTION_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Actions" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
  { value: "device_start", label: "Device Start" },
  { value: "device_stop", label: "Device Stop" },
  { value: "device_command", label: "Device Command" },
  { value: "user_create", label: "User Create" },
  { value: "user_update", label: "User Update" },
  { value: "user_delete", label: "User Delete" },
  { value: "role_update", label: "Role Update" },
  { value: "alert_acknowledge", label: "Alert Ack" },
  { value: "alert_resolve", label: "Alert Resolve" },
  { value: "settings_update", label: "Settings Update" },
  { value: "data_export", label: "Data Export" },
];

const RESULT_OPTIONS = [
  { value: "", label: "All Results" },
  { value: "success", label: "Success" },
  { value: "failure", label: "Failure" },
];

const PAGE_SIZE = 10;

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const canExport = usePermission("logs:export");

  useEffect(() => {
    loadLogs();
  }, [page, actionFilter, resultFilter, search]);

  const loadLogs = async () => {
    const result = await auditLogRepository.findAll(
      {
        action: (actionFilter || undefined) as AuditAction | undefined,
        result: (resultFilter || undefined) as AuditResult | undefined,
        search: search || undefined,
      },
      page,
      PAGE_SIZE,
    );
    setLogs(result.data);
    setTotalCount(result.total);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleExport = () => {
    const headers = [
      "Timestamp",
      "User",
      "Action",
      "Resource",
      "Result",
      "IP",
      "Details",
    ];
    const rows = logs.map((l) => [
      new Date(l.timestamp).toISOString(),
      l.userName,
      l.action,
      `${l.resource}:${l.resourceId || ""}`,
      l.result,
      l.ipAddress,
      JSON.stringify(l.details),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getResultBadge = (result: AuditResult) => {
    switch (result) {
      case "success":
        return <Badge variant="success">Success</Badge>;
      case "failure":
        return <Badge variant="danger">Failure</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            System activity logs for compliance and security
          </p>
        </div>
        {canExport && (
          <Button
            variant="outline"
            icon={<Download size={16} />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="!p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Filter size={16} className="text-muted-foreground" />
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search user, details..."
            className="w-60"
          />
          <Select
            options={ACTION_OPTIONS}
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="w-44"
          />
          <Select
            options={RESULT_OPTIONS}
            value={resultFilter}
            onChange={(e) => {
              setResultFilter(e.target.value);
              setPage(1);
            }}
            className="w-36"
          />
          <span className="text-xs text-muted-foreground ml-auto">
            {totalCount} records
          </span>
        </div>
      </Card>

      {/* Logs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  User
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Action
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Resource
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Result
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  IP
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{log.userName}</td>
                  <td className="px-4 py-3">
                    <Badge variant="neutral">
                      {log.action.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono">
                    {log.resource}:{log.resourceId?.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3">{getResultBadge(log.result)}</td>
                  <td className="px-4 py-3 text-xs font-mono">
                    {log.ipAddress}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<Eye size={14} />}
                      onClick={() => setSelectedLog(log)}
                    />
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-4 border-t border-border">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>

      {/* Log Detail Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Log Details"
        size="md"
      >
        {selectedLog && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-muted-foreground">Timestamp</label>
                <p>{new Date(selectedLog.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-muted-foreground">User</label>
                <p className="font-medium">
                  {selectedLog.userName} ({selectedLog.userId.slice(0, 8)})
                </p>
              </div>
              <div>
                <label className="text-muted-foreground">Action</label>
                <p>
                  <Badge variant="info">
                    {selectedLog.action.replace(/_/g, " ")}
                  </Badge>
                </p>
              </div>
              <div>
                <label className="text-muted-foreground">Result</label>
                <p>{getResultBadge(selectedLog.result)}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Resource</label>
                <p className="font-mono text-xs">
                  {selectedLog.resource}: {selectedLog.resourceId}
                </p>
              </div>
              <div>
                <label className="text-muted-foreground">IP Address</label>
                <p className="font-mono">{selectedLog.ipAddress}</p>
              </div>
            </div>
            {selectedLog.details &&
              Object.keys(selectedLog.details).length > 0 && (
                <div>
                  <label className="text-muted-foreground">Details</label>
                  <pre className="bg-muted/50 p-3 rounded-lg mt-1 font-mono text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
}
