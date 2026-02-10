"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Edit, Trash2, Shield, MoreVertical } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";
import { userRepository, roleRepository } from "@/lib/db";
import { User, Role } from "@/types";
import { usePermission } from "@/stores/authStore";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const canCreate = usePermission("users:create");
  const canEdit = usePermission("users:update");
  const canDelete = usePermission("users:delete");
  const { addToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [u, r] = await Promise.all([
      userRepository.findAll(),
      roleRepository.findAll(),
    ]);
    setUsers(u);
    setRoles(r);
  };

  const getRoleName = (roleId: string) => {
    return roles.find((r) => r.id === roleId)?.name || roleId;
  };

  const getRoleBadgeVariant = (
    roleId: string,
  ): "info" | "success" | "warning" | "neutral" => {
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await userRepository.delete(deleteTarget.id);
    addToast("success", "User deleted");
    setShowDeleteModal(false);
    setDeleteTarget(null);
    loadData();
  };

  const handleToggleActive = async (user: User) => {
    await userRepository.update(user.id, { isActive: !user.isActive });
    addToast("success", `User ${user.isActive ? "deactivated" : "activated"}`);
    loadData();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage users and their roles
          </p>
        </div>
        {canCreate && <Button icon={<UserPlus size={16} />}>Add User</Button>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="text-sm text-muted-foreground">Total Users</div>
          <div className="text-2xl font-bold">{users.length}</div>
        </Card>
        <Card className="!p-4">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-success">
            {users.filter((u) => u.isActive).length}
          </div>
        </Card>
        <Card className="!p-4">
          <div className="text-sm text-muted-foreground">Inactive</div>
          <div className="text-2xl font-bold text-danger">
            {users.filter((u) => !u.isActive).length}
          </div>
        </Card>
        <Card className="!p-4">
          <div className="text-sm text-muted-foreground">Roles</div>
          <div className="text-2xl font-bold">{roles.length}</div>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  User
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Role
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Last Active
                </th>
                {(canEdit || canDelete) && (
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <button
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Avatar name={user.name} size="sm" />
                      <span className="font-medium">{user.name}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getRoleBadgeVariant(user.roleId)}>
                      <Shield size={10} className="mr-1" />
                      {getRoleName(user.roleId)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge
                      status={user.isActive ? "online" : "offline"}
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {user.lastActiveAt
                      ? new Date(user.lastActiveAt).toLocaleString()
                      : "Never"}
                  </td>
                  {(canEdit || canDelete) && (
                    <td className="px-4 py-3 text-right">
                      <Dropdown
                        trigger={
                          <button className="p-1 rounded hover:bg-muted transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        }
                        items={[
                          ...(canEdit
                            ? [
                                {
                                  label: "Edit",
                                  icon: <Edit size={14} />,
                                  onClick: () => {},
                                },
                                {
                                  label: user.isActive
                                    ? "Deactivate"
                                    : "Activate",
                                  onClick: () => handleToggleActive(user),
                                },
                              ]
                            : []),
                          ...(canDelete
                            ? [
                                {
                                  label: "Delete",
                                  icon: <Trash2 size={14} />,
                                  danger: true,
                                  onClick: () => {
                                    setDeleteTarget(user);
                                    setShowDeleteModal(true);
                                  },
                                },
                              ]
                            : []),
                        ]}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Detail Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Details"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={selectedUser.name} size="lg" />
              <div>
                <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="text-muted-foreground">Role</label>
                <p>
                  <Badge variant={getRoleBadgeVariant(selectedUser.roleId)}>
                    {getRoleName(selectedUser.roleId)}
                  </Badge>
                </p>
              </div>
              <div>
                <label className="text-muted-foreground">Department</label>
                <p>-</p>
              </div>
              <div>
                <label className="text-muted-foreground">Status</label>
                <p>
                  <StatusBadge
                    status={selectedUser.isActive ? "online" : "offline"}
                  />
                </p>
              </div>
              <div>
                <label className="text-muted-foreground">Last Active</label>
                <p>
                  {selectedUser.lastActiveAt
                    ? new Date(selectedUser.lastActiveAt).toLocaleString()
                    : "Never"}
                </p>
              </div>
              <div>
                <label className="text-muted-foreground">Created</label>
                <p>{new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Updated</label>
                <p>{new Date(selectedUser.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        title="Delete User"
        size="sm"
      >
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
