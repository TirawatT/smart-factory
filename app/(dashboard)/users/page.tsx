"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermission } from "@/hooks/use-permission";
import { ROLES } from "@/lib/constants";
import { mockRolePermissionMatrix, mockUsers } from "@/lib/mock";
import { cn } from "@/lib/utils";
import type { UserRole, UserStatus } from "@/types";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  Mail,
  MoreHorizontal,
  Search,
  Shield,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const roleColors: Record<UserRole, string> = {
  admin:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  manager: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  operator:
    "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
  guest: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30",
};

const statusStyles: Record<UserStatus, { color: string; label: string }> = {
  active: { color: "text-green-600 dark:text-green-400", label: "Active" },
  inactive: { color: "text-gray-500", label: "Inactive" },
  suspended: { color: "text-red-600 dark:text-red-400", label: "Suspended" },
};

function CreateUserDialog() {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>เพิ่มผู้ใช้ใหม่</DialogTitle>
        <DialogDescription>สร้างบัญชีผู้ใช้ใหม่ในระบบ</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>ชื่อ-นามสกุล</Label>
          <Input placeholder="ชื่อ นามสกุล" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="email@smartfactory.com" />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select defaultValue="operator">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ROLES).map(([key, role]) => (
                <SelectItem key={key} value={key}>
                  {role.displayName} — {role.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>รหัสผ่าน</Label>
          <Input type="password" placeholder="••••••••" />
        </div>
      </div>
      <Button
        className="w-full"
        onClick={() => toast.success("สร้างผู้ใช้ใหม่เรียบร้อย (Mock)")}
      >
        สร้างผู้ใช้
      </Button>
    </DialogContent>
  );
}

function PermissionMatrix() {
  const resources = [
    "dashboard",
    "device",
    "alert",
    "alert_rule",
    "user",
    "role",
    "log",
    "energy",
    "settings",
    "system_health",
    "digital_twin",
  ];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-background">
              Resource
            </TableHead>
            {mockRolePermissionMatrix.map((rpm) => (
              <TableHead key={rpm.role} className="text-center capitalize">
                {rpm.role}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource}>
              <TableCell className="sticky left-0 bg-background font-medium capitalize">
                {resource.replace("_", " ")}
              </TableCell>
              {mockRolePermissionMatrix.map((rpm) => {
                const perms = rpm.permissions[resource] ?? [];
                return (
                  <TableCell key={rpm.role} className="text-center">
                    {perms.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-1">
                        {perms.map((p) => (
                          <Badge
                            key={p}
                            variant="secondary"
                            className="text-[10px] px-1"
                          >
                            {p}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const { hasPermission } = usePermission();
  const canCreate = hasPermission("user", "create");
  const canUpdate = hasPermission("user", "update");
  const canDelete = hasPermission("user", "delete");

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const roleStats = Object.entries(ROLES).map(([key, role]) => ({
    role: key as UserRole,
    displayName: role.displayName,
    count: mockUsers.filter((u) => u.role === key).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            จัดการผู้ใช้, Role, และสิทธิ์การเข้าถึง
          </p>
        </div>
        {canCreate && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> เพิ่มผู้ใช้
              </Button>
            </DialogTrigger>
            <CreateUserDialog />
          </Dialog>
        )}
      </div>

      {/* Role Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {roleStats.map((rs) => (
          <Card key={rs.role}>
            <CardContent className="p-4 flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {rs.displayName}
                </p>
                <p className="text-xl font-bold">{rs.count}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="mr-1 h-4 w-4" /> ผู้ใช้ ({mockUsers.length})
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="mr-1 h-4 w-4" /> Permission Matrix
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาผู้ใช้..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ผู้ใช้</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">สถานะ</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    เข้าสู่ระบบล่าสุด
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    สร้างเมื่อ
                  </TableHead>
                  {(canUpdate || canDelete) && <TableHead></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {user.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", roleColors[user.role])}
                      >
                        {ROLES[user.role].displayName}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        {user.status === "active" ? (
                          <CheckCircle
                            className={cn(
                              "h-3 w-3",
                              statusStyles[user.status].color,
                            )}
                          />
                        ) : (
                          <XCircle
                            className={cn(
                              "h-3 w-3",
                              statusStyles[user.status].color,
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            "text-xs",
                            statusStyles[user.status].color,
                          )}
                        >
                          {statusStyles[user.status].label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {user.lastLoginAt
                        ? format(user.lastLoginAt, "dd/MM/yyyy HH:mm")
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(user.createdAt, "dd/MM/yyyy")}
                      </span>
                    </TableCell>
                    {(canUpdate || canDelete) && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canUpdate && (
                              <DropdownMenuItem
                                onClick={() => toast.info("แก้ไขผู้ใช้ (Mock)")}
                              >
                                แก้ไข
                              </DropdownMenuItem>
                            )}
                            {canUpdate && (
                              <DropdownMenuItem
                                onClick={() =>
                                  toast.info("เปลี่ยน Role (Mock)")
                                }
                              >
                                เปลี่ยน Role
                              </DropdownMenuItem>
                            )}
                            {canDelete && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    toast.warning("ปิดใช้งานผู้ใช้ (Mock)")
                                  }
                                >
                                  ปิดใช้งาน
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Role-Permission Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PermissionMatrix />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
