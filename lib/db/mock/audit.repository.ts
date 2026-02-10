import { IAuditLogRepository } from "../repositories";
import { AuditLog, AuditLogFilters, PaginatedResult } from "@/types";
import { mockAuditLogs } from "./data/audit-logs";
import { v4 as uuidv4 } from "uuid";

const logs = [...mockAuditLogs];

export const mockAuditLogRepository: IAuditLogRepository = {
  async findAll(
    filters?: AuditLogFilters,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<PaginatedResult<AuditLog>> {
    let result = [...logs];

    if (filters?.userId)
      result = result.filter((l) => l.userId === filters.userId);
    if (filters?.action)
      result = result.filter((l) => l.action === filters.action);
    if (filters?.resource)
      result = result.filter((l) => l.resource === filters.resource);
    if (filters?.result)
      result = result.filter((l) => l.result === filters.result);
    if (filters?.startDate)
      result = result.filter((l) => l.timestamp >= filters.startDate!);
    if (filters?.endDate)
      result = result.filter((l) => l.timestamp <= filters.endDate!);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.userName.toLowerCase().includes(s) ||
          l.action.toLowerCase().includes(s) ||
          l.resource.toLowerCase().includes(s),
      );
    }

    // Sort by timestamp descending
    result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const total = result.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = result.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  },

  async create(data: Omit<AuditLog, "id">): Promise<AuditLog> {
    const log: AuditLog = {
      ...data,
      id: `log_${uuidv4().slice(0, 8)}`,
    };
    logs.unshift(log); // Most recent first
    return log;
  },
};
