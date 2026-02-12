---
applyTo: "prisma/**"
---

# Prisma & Database Instructions

## Schema Conventions

### Primary Keys

- Always use UUID: `id String @id @default(uuid())`
- NEVER use auto-increment integers for primary keys.

### Timestamps

Every model MUST include:

```prisma
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
```

### Soft Delete

Models that store user data MUST use soft delete:

```prisma
deletedAt DateTime? @map("deleted_at")
```

Never hard delete user data. Use `where: { deletedAt: null }` in all queries.

### Column Mapping

Use `@map()` for snake_case database column names:

```prisma
model User {
  id        String   @id @default(uuid())
  firstName String   @map("first_name")
  lastName  String   @map("last_name")
  roleId    String   @map("role_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  @@map("users")
}
```

### Relations

Always specify `onDelete` behavior:

```prisma
role   Role   @relation(fields: [roleId], references: [id], onDelete: Restrict)
roleId String @map("role_id")
```

Common `onDelete` values:

- `Restrict` — prevent deletion if related records exist (default for most relations)
- `Cascade` — delete related records when parent is deleted (use for logs, tokens)
- `SetNull` — set FK to null when parent is deleted (use with optional relations)

### Indexes

Add indexes for frequently queried fields:

```prisma
@@index([roleId])
@@index([status])
@@index([createdAt])
@@index([email], map: "idx_users_email")
```

## AuditLog — Immutable Model

The AuditLog model is IMMUTABLE. This means:

- **No UPDATE operations** — never call `prisma.auditLog.update()`.
- **No DELETE operations** — never call `prisma.auditLog.delete()` or `deleteMany()`.
- **INSERT only** — only `prisma.auditLog.create()` is allowed.
- Use Prisma middleware or database triggers to enforce immutability.

```prisma
model AuditLog {
  id         String   @id @default(uuid())
  userId     String?  @map("user_id")
  action     String   // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, CONTROL, etc.
  resource   String   // user, device, alert, role, etc.
  resourceId String?  @map("resource_id")
  details    Json?    // Action-specific payload
  result     String   // SUCCESS, FAIL
  ipAddress  String?  @map("ip_address")
  userAgent  String?  @map("user_agent")
  timestamp  DateTime @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([action])
  @@index([resource])
  @@index([timestamp])
  @@map("audit_logs")
}
```

## Prisma Client Singleton

Always import from `@/lib/prisma`:

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

## Query Patterns

### List with Pagination

```typescript
const [items, total] = await Promise.all([
  prisma.device.findMany({
    where: { deletedAt: null, ...filters },
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * limit,
    take: limit,
    include: { zone: true },
  }),
  prisma.device.count({ where: { deletedAt: null, ...filters } }),
]);
```

### Soft Delete

```typescript
await prisma.user.update({
  where: { id },
  data: { deletedAt: new Date() },
});
```

## Seed Data (`prisma/seed.ts`)

- Seed default roles (Admin, Manager, Operator, Guest) with permissions.
- Seed an admin user (email: admin@smartfactory.com).
- Seed sample devices for development.
- Use data from `@/lib/mock/` as the seed source.
- Seed script runs with: `npx prisma db seed`
