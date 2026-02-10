// Data Access Layer - Barrel Export
// Swap mock implementations for Prisma by changing imports here

export { mockAlertRepository as alertRepository } from "./mock/alert.repository";
export { mockAuditLogRepository as auditLogRepository } from "./mock/audit.repository";
export { mockDeviceRepository as deviceRepository } from "./mock/device.repository";
export { mockEnergyRepository as energyRepository } from "./mock/energy.repository";
export { mockRoleRepository as roleRepository } from "./mock/role.repository";
export { mockUserRepository as userRepository } from "./mock/user.repository";
