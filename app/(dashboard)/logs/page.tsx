"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePermission } from "@/hooks/use-permission";
import { mockAuditLogs } from "@/lib/mock";
import { cn } from "@/lib/utils";
import type { AuditAction } from "@/types";
import { format } from "date-fns";
import { Clock, Download, FileText, Search, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const actionColors: Record<AuditAction, string> = {
  LOGIN: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  LOGOUT: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30",
  CREATE:
    "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
  UPDATE:
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  DELETE: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
  CONTROL:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  VIEW: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30",
  EXPORT: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
  ACKNOWLEDGE:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  CONFIGURE:
    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
};

const ACTIONS: AuditAction[] = [
  "LOGIN",
  "LOGOUT",
  "CREATE",
  "UPDATE",
  "DELETE",
  "CONTROL",
  "VIEW",
  "EXPORT",
  "ACKNOWLEDGE",
  "CONFIGURE",
];

const RESOURCES = [
  "auth",
  "device",
  "alert",
  "user",
  "role",
  "settings",
  "energy",
];

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const { hasPermission } = usePermission();
  const canExport = hasPermission("log", "export");

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesResource =
      resourceFilter === "all" || log.resource === resourceFilter;
    const matchesResult = resultFilter === "all" || log.result === resultFilter;
    return matchesSearch && matchesAction && matchesResource && matchesResult;
  });

  const handleExport = () => {
    toast.success("กำลังส่งออก Audit Log เป็น CSV... (Mock)");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            บันทึกกิจกรรมทั้งหมดในระบบ — Immutable & Compliant
          </p>
        </div>
        {canExport && (
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        )}
      </div>

      {/* Info Banner */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4 flex items-center gap-3 text-sm">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <p className="text-muted-foreground">
            Audit Logs เป็น <strong>Immutable</strong> — ไม่สามารถแก้ไขหรือลบได้
            เพื่อความปลอดภัยตามมาตรฐาน ISO 27001 / GDPR
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">รายการทั้งหมด</p>
            <p className="text-xl font-bold">{mockAuditLogs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">สำเร็จ</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {mockAuditLogs.filter((l) => l.result === "SUCCESS").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">ล้มเหลว</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">
              {mockAuditLogs.filter((l) => l.result === "FAIL").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              ผู้ใช้ที่มี Activity
            </p>
            <p className="text-xl font-bold">
              {new Set(mockAuditLogs.map((l) => l.userId)).size}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาตามชื่อผู้ใช้..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุก Action</SelectItem>
            {ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={resourceFilter} onValueChange={setResourceFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Resource" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุก Resource</SelectItem>
            {RESOURCES.map((r) => (
              <SelectItem key={r} value={r} className="capitalize">
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={resultFilter} onValueChange={setResultFilter}>
          <SelectTrigger className="w-full sm:w-[120px]">
            <SelectValue placeholder="Result" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="SUCCESS">SUCCESS</SelectItem>
            <SelectItem value="FAIL">FAIL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>เวลา</TableHead>
              <TableHead>ผู้ใช้</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead className="hidden md:table-cell">รายละเอียด</TableHead>
              <TableHead>ผลลัพธ์</TableHead>
              <TableHead className="hidden lg:table-cell">IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(log.timestamp, "dd/MM HH:mm:ss")}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-sm">
                  {log.userName}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", actionColors[log.action])}
                  >
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize text-sm">
                  {log.resource}
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[200px]">
                  {log.details ? (
                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded">
                      {JSON.stringify(log.details).slice(0, 60)}
                      {JSON.stringify(log.details).length > 60 ? "..." : ""}
                    </code>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      log.result === "SUCCESS" ? "secondary" : "destructive"
                    }
                    className="text-xs"
                  >
                    {log.result}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground font-mono">
                  {log.ipAddress}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>ไม่พบรายการ Log ที่ตรงกับเงื่อนไข</p>
        </div>
      )}
    </div>
  );
}
