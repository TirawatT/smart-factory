# Smart Factory — Copilot Instructions

## Project Summary

Smart Factory is a web application for real-time industrial monitoring and control. It provides:

- **Real-time Monitoring**: Live sensor data from IoT devices via MQTT + Socket.IO
- **IoT Control Panel**: Start/Stop devices, adjust parameters remotely
- **Digital Twin**: 3DVista virtual tour embedded via iframe
- **Energy Management**: Usage tracking, optimization, cost estimation
- **RBAC**: Role-based access control (Admin, Manager, Operator, Guest) with dynamic permission config
- **Audit Trail**: Immutable action logging for compliance (ISO 27001, GDPR)
- **Alert System**: Event-driven alerts with threshold rules, popup/email notifications
- **System Health**: API latency, DB status, MQTT broker status monitoring

## Tech Stack

| Layer               | Technology                                   | Version |
| ------------------- | -------------------------------------------- | ------- |
| Framework           | Next.js (App Router)                         | 16.x    |
| UI                  | React                                        | 19.x    |
| Language            | TypeScript (strict)                          | 5.x     |
| Styling             | Tailwind CSS                                 | 4.x     |
| UI Components       | shadcn/ui + Radix UI                         | latest  |
| Database            | PostgreSQL + Prisma ORM                      | latest  |
| Auth                | Custom JWT via `jose`                        | latest  |
| Password            | bcryptjs                                     | latest  |
| Validation          | Zod                                          | latest  |
| Charts              | Recharts                                     | latest  |
| Icons               | Lucide React                                 | latest  |
| Dates               | date-fns                                     | latest  |
| Real-time (browser) | Socket.IO client                             | latest  |
| Real-time (IoT)     | MQTT.js                                      | latest  |
| Digital Twin        | 3DVista (iframe embed)                       | —       |
| Deploy              | Vercel (Next.js) + Railway (realtime server) | —       |
| DB Hosting          | Neon (PostgreSQL)                            | —       |
| MQTT Broker         | HiveMQ Cloud                                 | —       |

## Project Architecture

```
smart-factory/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, register) — no sidebar
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Dashboard pages — with sidebar layout
│   │   ├── layout.tsx            # Dashboard shell (sidebar + topbar)
│   │   ├── page.tsx              # Main dashboard overview
│   │   ├── monitoring/           # Real-time device monitoring
│   │   ├── digital-twin/         # 3DVista iframe embed
│   │   ├── iot-control/          # IoT device control panel
│   │   ├── energy/               # Energy management
│   │   ├── users/                # User & role management (Admin)
│   │   ├── logs/                 # Audit trail viewer
│   │   ├── alerts/               # Alert dashboard + rules
│   │   ├── settings/             # System settings
│   │   └── system-health/        # Performance monitoring
│   ├── api/                      # API route handlers (REST)
│   │   ├── auth/                 # Auth endpoints (login, register, refresh, me)
│   │   ├── users/                # User CRUD
│   │   ├── roles/                # Role CRUD
│   │   ├── devices/              # Device CRUD + telemetry
│   │   ├── alerts/               # Alert CRUD + rules
│   │   ├── energy/               # Energy data queries
│   │   ├── logs/                 # Audit log queries (read-only)
│   │   └── health/               # System health checks
│   ├── globals.css               # Tailwind CSS v4 + theme
│   ├── layout.tsx                # Root layout (fonts, providers)
│   └── page.tsx                  # Landing / redirect
├── components/                   # React components
│   ├── ui/                       # shadcn/ui primitives (Button, Card, Input, etc.)
│   ├── layout/                   # Sidebar, Topbar, Breadcrumb
│   ├── dashboard/                # Dashboard-specific widgets
│   ├── charts/                   # Chart components (Recharts wrappers)
│   └── forms/                    # Form components
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts
│   ├── use-socket.ts
│   └── use-permission.ts
├── lib/                          # Utilities and business logic
│   ├── auth.ts                   # JWT sign/verify, password hashing
│   ├── prisma.ts                 # Prisma client singleton
│   ├── rbac.ts                   # Permission checking utilities
│   ├── utils.ts                  # General utilities (cn, formatDate, etc.)
│   ├── constants.ts              # App-wide constants
│   ├── validations/              # Zod schemas per resource
│   └── mock/                     # Mock data (Phase 1)
│       ├── index.ts
│       ├── users.ts
│       ├── devices.ts
│       ├── alerts.ts
│       ├── alert-rules.ts
│       ├── audit-logs.ts
│       ├── energy.ts
│       ├── notifications.ts
│       ├── system-health.ts
│       └── roles-permissions.ts
├── contexts/                     # React Context providers
│   └── auth-context.tsx
├── types/                        # TypeScript type definitions
│   ├── index.ts
│   ├── auth.ts
│   ├── device.ts
│   ├── alert.ts
│   ├── energy.ts
│   └── audit.ts
├── prisma/                       # Prisma ORM
│   ├── schema.prisma
│   └── seed.ts
├── middleware.ts                  # Next.js middleware (JWT check, route protection)
├── realtime-server/              # Separate Node.js service (Socket.IO + MQTT bridge)
├── scripts/                      # Utility scripts
│   ├── device-simulator.ts       # Mock IoT device simulator
│   └── seed-historical.ts       # Historical data seeder
├── docs/                         # Project documentation
├── next.config.ts
├── tailwind.config.ts            # (Tailwind v4 uses CSS-based config, minimal)
├── tsconfig.json
└── package.json
```

## Coding Conventions

### TypeScript

- **Strict mode always** — never use `any`. Use `unknown` + type guards if type is uncertain.
- Use `interface` for object shapes, `type` for unions/intersections/utility types.
- All function parameters and return types must be explicitly typed.
- Use `as const` for literal arrays/objects where appropriate.
- Prefer `readonly` for props and immutable data.

### Naming

- **Files**: `kebab-case.ts` / `kebab-case.tsx` (e.g., `use-auth.ts`, `alert-rules.tsx`)
- **Components**: `PascalCase` (e.g., `DeviceCard`, `AlertBadge`)
- **Functions/variables**: `camelCase` (e.g., `getDeviceById`, `isOnline`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`, `API_BASE_URL`)
- **Types/Interfaces**: `PascalCase` (e.g., `Device`, `AlertRule`, `UserRole`)
- **Enums**: `PascalCase` name, `UPPER_SNAKE_CASE` values

### Imports

- Always use `@/` path alias (maps to project root): `import { Button } from "@/components/ui/button"`
- Group imports in order: (1) React/Next.js, (2) external libraries, (3) `@/` internal, (4) relative
- Use named exports for everything except Next.js pages/layouts (which use default export).

### React / Next.js

- **Server Components by default**. Only add `"use client"` when the component needs: useState, useEffect, event handlers, browser APIs, or context consumers.
- Every `page.tsx` must export `metadata` or `generateMetadata()`.
- Use `loading.tsx` and `error.tsx` for each route segment.
- Use route groups `(groupName)` to organize without affecting URL structure.
- Prefer React Server Components for data fetching. Use `fetch()` in server components, `useSWR`/`useQuery` in client components.

### API Routes

- Use `NextRequest` / `NextResponse` from `next/server`.
- Every endpoint must have: Zod schema validation, try/catch error handling, RBAC permission check, audit log entry.
- Consistent response format: `{ success: boolean, data?: T, error?: string, message?: string }`.
- HTTP status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Server Error).
- Never expose internal error details to clients.

### Styling

- Tailwind CSS v4 with `@import "tailwindcss"` syntax.
- Use `cn()` utility (from `lib/utils.ts`) for conditional class merging.
- Mobile-first responsive design: base → `sm:` → `md:` → `lg:` → `xl:`.
- Dark mode via `dark:` variant.
- No inline styles — use Tailwind utilities exclusively.
- Use CSS variables defined in `globals.css` for theme colors.

### Database (Prisma)

- UUID for all primary keys (`@id @default(uuid())`).
- Every model includes `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`.
- Soft delete pattern: `deletedAt DateTime?` — never hard delete user data.
- AuditLog is **immutable**: no UPDATE or DELETE operations allowed.
- Use `@map()` for snake_case database column names.
- Always specify `onDelete` behavior on relations.

### Security

- Passwords: bcrypt with 12 salt rounds.
- JWT: short-lived access tokens (15 min), long-lived refresh tokens (7 days), stored in httpOnly cookies.
- Input validation: Zod on every API endpoint before processing.
- RBAC: check permissions on both API and UI levels.
- Never log sensitive data (passwords, tokens, PII).

### Error Handling

- API routes: always wrap in try/catch, return appropriate HTTP status + error message.
- Components: use Error Boundaries (`error.tsx`) for each route segment.
- Log errors server-side for debugging, return generic messages to clients.

## Build & Development Commands

```bash
# Install dependencies (always run first)
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Prisma commands (after schema changes)
npx prisma generate          # Generate client
npx prisma migrate dev       # Create + apply migration
npx prisma db seed           # Seed database
npx prisma studio            # Visual DB browser

# Device simulator (Phase 2)
npx ts-node scripts/device-simulator.ts --devices=10 --interval=3000
```

## Key Configuration Files

| File                   | Purpose                                                 |
| ---------------------- | ------------------------------------------------------- |
| `next.config.ts`       | Next.js configuration (redirects, headers, env)         |
| `tsconfig.json`        | TypeScript config (strict, path aliases `@/*`)          |
| `postcss.config.mjs`   | PostCSS with `@tailwindcss/postcss` plugin              |
| `app/globals.css`      | Tailwind v4 import + theme CSS variables                |
| `eslint.config.mjs`    | ESLint 9 flat config (core-web-vitals + TypeScript)     |
| `prisma/schema.prisma` | Database schema and models                              |
| `middleware.ts`        | Route protection, JWT validation, redirects             |
| `.env.local`           | Environment variables (DB URL, JWT secret, MQTT config) |

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="..."
JWT_REFRESH_SECRET="..."

# MQTT
MQTT_BROKER_URL="mqtt://..."
MQTT_USERNAME="..."
MQTT_PASSWORD="..."

# Real-time Server
NEXT_PUBLIC_REALTIME_URL="wss://..."

# 3DVista
NEXT_PUBLIC_DIGITAL_TWIN_URL="https://..."

# Email (for alerts)
SMTP_HOST="..."
SMTP_PORT="..."
SMTP_USER="..."
SMTP_PASS="..."
```

## Development Phases

- **Phase 1** (current): UI + Mock Data — all pages functional with `lib/mock/` data, no DB/MQTT/real devices
- **Phase 2**: Database + MQTT + real API — connect PostgreSQL, MQTT broker, device simulator
- **Phase 3+**: Digital Twin integration, email notifications, security hardening, testing, deployment

## Important Rules

1. Trust these instructions. Only search for additional context if information here is incomplete or found incorrect.
2. When creating new pages, always follow the App Router conventions and include metadata, loading, and error states.
3. When creating API routes, always include Zod validation, RBAC checks, and audit logging.
4. In Phase 1, always import data from `@/lib/mock/`. In Phase 2+, use Prisma queries or API calls.
5. All UI must be responsive (mobile + desktop) and support dark mode.
6. Never delete or modify AuditLog entries — they are immutable by design.
7. Use shadcn/ui components as the base for all UI elements. Do not create custom components that duplicate shadcn/ui functionality.
