---
applyTo: "app/api/**/*.ts"
---

# API Route Instructions

## Standard API Route Template

Every API route handler MUST follow this structure:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// 1. Define Zod schema for request validation
const createSchema = z.object({
  name: z.string().min(1).max(255),
  // ... other fields
});

// 2. Handler with try/catch, validation, RBAC, audit logging
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // a. Authenticate — verify JWT from cookies
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // b. Authorize — check RBAC permissions
    if (!checkPermission(user.role, "resource", "create")) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    // c. Validate — parse request body with Zod
    const body = await request.json();
    const validated = createSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validated.error.flatten(),
        },
        { status: 400 },
      );
    }

    // d. Execute — business logic (Prisma query or mock data)
    const result = await createResource(validated.data);

    // e. Audit — log the action
    await createAuditLog({
      userId: user.id,
      action: "CREATE",
      resource: "resource_name",
      resourceId: result.id,
      details: validated.data,
      result: "SUCCESS",
    });

    // f. Respond
    return NextResponse.json(
      { success: true, data: result, message: "Resource created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("[API] POST /api/resource error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

## Response Format

Always use this consistent format:

```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: unknown; // Validation error details
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## HTTP Status Codes

| Code | Usage                               |
| ---- | ----------------------------------- |
| 200  | Successful GET, PATCH, DELETE       |
| 201  | Successful POST (resource created)  |
| 400  | Validation error, malformed request |
| 401  | Missing or invalid authentication   |
| 403  | Authenticated but lacks permission  |
| 404  | Resource not found                  |
| 409  | Conflict (duplicate entry)          |
| 500  | Unexpected server error             |

## Query Parameters for GET (List) Endpoints

Support these standard query parameters:

```typescript
const searchParams = request.nextUrl.searchParams;
const page = parseInt(searchParams.get("page") ?? "1");
const limit = parseInt(searchParams.get("limit") ?? "20");
const search = searchParams.get("search") ?? "";
const sortBy = searchParams.get("sortBy") ?? "createdAt";
const sortOrder = searchParams.get("sortOrder") ?? "desc";
const status = searchParams.get("status"); // filter
```

## Dynamic Route Parameters

For routes like `app/api/users/[id]/route.ts`:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  // ... use id
}
```

## Security Rules

- NEVER expose stack traces or internal error messages to clients.
- NEVER log passwords, tokens, or PII.
- Always validate ALL input — never trust client data.
- Always check authentication BEFORE authorization.
- Always check authorization BEFORE executing business logic.
- Use parameterized queries (Prisma handles this automatically).

## Phase 1 (Mock Data)

In Phase 1, use mock data instead of Prisma queries:

```typescript
import { mockDevices, getDeviceById } from "@/lib/mock";

export async function GET(request: NextRequest): Promise<NextResponse> {
  // ... auth checks ...
  const devices = mockDevices;
  return NextResponse.json({ success: true, data: devices });
}
```

## Phase 2+ (Real Database)

Replace mock imports with Prisma queries:

```typescript
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  // ... auth checks ...
  const devices = await prisma.device.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, data: devices });
}
```
