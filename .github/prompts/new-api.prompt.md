---
mode: "agent"
description: "Create a new REST API route handler with Zod validation, RBAC, error handling, and audit logging"
---

# Create New API Route

Create a new API route handler for the Smart Factory application.

## Requirements

1. **File Location**: `app/api/{resource}/route.ts` (or `app/api/{resource}/[id]/route.ts` for dynamic routes)

2. **Every route handler MUST include**:
   - Zod schema for request body/query validation
   - JWT authentication check via `getCurrentUser(request)`
   - RBAC permission check via `checkPermission()`
   - try/catch error handling
   - Audit log entry for write operations
   - Consistent response format: `{ success, data, error, message }`

3. **Standard Exports**:
   - `GET` — List/Read (with pagination, filtering, sorting)
   - `POST` — Create
   - `PATCH` — Update (in `[id]/route.ts`)
   - `DELETE` — Soft delete (in `[id]/route.ts`)

4. **Response Format**:

   ```typescript
   // Success
   { success: true, data: T, message: "..." }

   // Error
   { success: false, error: "Error description" }

   // List with pagination
   { success: true, data: T[], pagination: { page, limit, total, totalPages } }
   ```

5. **Phase 1**: Use mock data from `@/lib/mock/`. Return filtered/paginated mock data.
6. **Phase 2+**: Use Prisma queries against PostgreSQL.

## Ask the user for:

- Resource name (e.g., "devices", "alerts", "users")
- Which HTTP methods are needed
- What fields the resource has
- Which roles can access which operations
