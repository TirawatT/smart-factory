"use client";

import React, { useEffect, useState } from "react";
import { Shield, Check, X } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { roleRepository } from "@/lib/db";
import { Role, Permission, RolePermission } from "@/types";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [r, p, rp] = await Promise.all([
      roleRepository.findAll(),
      roleRepository.getAllPermissions(),
      roleRepository.getRolePermissions(),
    ]);
    setRoles(r);
    setPermissions(p);
    setRolePermissions(rp);
  };

  const hasPermission = (roleId: string, permissionId: string) => {
    return rolePermissions.some(
      (rp) => rp.roleId === roleId && rp.permissionId === permissionId,
    );
  };

  // Group permissions by module
  const permissionGroups = permissions.reduce<Record<string, Permission[]>>(
    (acc, p) => {
      const module = p.module;
      if (!acc[module]) acc[module] = [];
      acc[module].push(p);
      return acc;
    },
    {},
  );

  const getRoleColor = (roleId: string) => {
    switch (roleId) {
      case "role_admin":
        return "info";
      case "role_manager":
        return "success";
      case "role_operator":
        return "warning";
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Roles & Permissions
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View role-based access control matrix
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="!p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-primary" />
              <Badge
                variant={
                  getRoleColor(role.id) as
                    | "info"
                    | "success"
                    | "warning"
                    | "neutral"
                }
              >
                {role.name}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{role.description}</p>
            <div className="mt-2 text-xs text-muted-foreground">
              {rolePermissions.filter((rp) => rp.roleId === role.id).length} /{" "}
              {permissions.length} permissions
            </div>
          </Card>
        ))}
      </div>

      {/* Permission Matrix */}
      <Card>
        <CardHeader
          title="Permission Matrix"
          subtitle="Green = Granted, Red = Denied"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground sticky left-0 bg-card z-10">
                  Permission
                </th>
                {roles.map((role) => (
                  <th
                    key={role.id}
                    className="px-4 py-3 text-center font-medium text-muted-foreground min-w-[100px]"
                  >
                    <Badge
                      variant={
                        getRoleColor(role.id) as
                          | "info"
                          | "success"
                          | "warning"
                          | "neutral"
                      }
                    >
                      {role.name}
                    </Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(permissionGroups).map(([module, perms]) => (
                <React.Fragment key={module}>
                  <tr className="bg-muted/30">
                    <td
                      colSpan={roles.length + 1}
                      className="px-4 py-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider"
                    >
                      {module}
                    </td>
                  </tr>
                  {perms.map((perm) => (
                    <tr
                      key={perm.id}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-2 sticky left-0 bg-card z-10">
                        <div>
                          <span className="font-medium">{perm.key}</span>
                          <p className="text-[10px] text-muted-foreground">
                            {perm.description}
                          </p>
                        </div>
                      </td>
                      {roles.map((role) => (
                        <td key={role.id} className="px-4 py-2 text-center">
                          {hasPermission(role.id, perm.id) ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success/10">
                              <Check size={14} className="text-success" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-danger/10">
                              <X size={14} className="text-danger" />
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
