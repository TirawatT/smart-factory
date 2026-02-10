import { IRoleRepository } from "../repositories";
import { Role, Permission, RolePermission } from "@/types";
import { mockRoles } from "./data/roles";
import { mockPermissions, mockRolePermissions } from "./data/permissions";
import { v4 as uuidv4 } from "uuid";

const roles = [...mockRoles];
const rolePermissions = [...mockRolePermissions];

export const mockRoleRepository: IRoleRepository = {
  async findAll(): Promise<Role[]> {
    return roles;
  },

  async findById(id: string): Promise<Role | null> {
    return roles.find((r) => r.id === id) || null;
  },

  async getPermissions(roleId: string): Promise<Permission[]> {
    const permIds = rolePermissions
      .filter((rp) => rp.roleId === roleId)
      .map((rp) => rp.permissionId);
    return mockPermissions.filter((p) => permIds.includes(p.id));
  },

  async getAllPermissions(): Promise<Permission[]> {
    return mockPermissions;
  },

  async getRolePermissions(): Promise<RolePermission[]> {
    return rolePermissions;
  },

  async updateRolePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    // Remove existing
    const toRemove = rolePermissions
      .map((rp, i) => (rp.roleId === roleId ? i : -1))
      .filter((i) => i !== -1)
      .reverse();
    toRemove.forEach((i) => rolePermissions.splice(i, 1));
    // Add new
    permissionIds.forEach((pid) => {
      rolePermissions.push({ roleId, permissionId: pid });
    });
  },

  async create(data: Omit<Role, "id" | "createdAt">): Promise<Role> {
    const newRole: Role = {
      ...data,
      id: `role_${uuidv4().slice(0, 8)}`,
      createdAt: new Date(),
    };
    roles.push(newRole);
    return newRole;
  },

  async delete(id: string): Promise<void> {
    const index = roles.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Role not found");
    if (roles[index].isSystem) throw new Error("Cannot delete system role");
    roles.splice(index, 1);
    // Clean up permissions
    const toRemove = rolePermissions
      .map((rp, i) => (rp.roleId === id ? i : -1))
      .filter((i) => i !== -1)
      .reverse();
    toRemove.forEach((i) => rolePermissions.splice(i, 1));
  },
};
