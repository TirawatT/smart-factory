---
applyTo: "app/**/*.tsx,app/**/*.ts"
---

# Next.js App Router Instructions

## Page Files (`page.tsx`)

- Every page MUST export `metadata` (static) or `generateMetadata()` (dynamic):
  ```tsx
  export const metadata: Metadata = {
    title: "Page Title | Smart Factory",
    description: "Page description",
  };
  ```
- Pages are **Server Components by default**. Only add `"use client"` if the page itself needs client-side interactivity.
- For pages that need client interactivity, create a separate client component and import it:
  ```tsx
  // page.tsx (Server Component)
  import { MonitoringClient } from "./monitoring-client";
  export default function MonitoringPage() {
    return <MonitoringClient />;
  }
  ```

## Layout Files (`layout.tsx`)

- Layouts wrap child routes and persist across navigation.
- Dashboard layout (`app/(dashboard)/layout.tsx`) includes Sidebar, Topbar, and content area.
- Auth layout (`app/(auth)/layout.tsx`) is minimal — centered card, no sidebar.
- Root layout (`app/layout.tsx`) sets up fonts, global providers (AuthContext, ThemeProvider), and global CSS.

## Loading & Error States

- Create `loading.tsx` for each route segment that fetches data — use skeleton components from shadcn/ui.
- Create `error.tsx` (must be `"use client"`) for each route segment:
  ```tsx
  "use client";
  export default function Error({
    error,
    reset,
  }: {
    error: Error;
    reset: () => void;
  }) {
    return (
      <div>
        <h2>Something went wrong</h2>
        <button onClick={reset}>Try again</button>
      </div>
    );
  }
  ```

## Route Groups

- `(auth)` — pages without dashboard layout (login, register)
- `(dashboard)` — pages with sidebar + topbar layout (all main app pages)
- Route groups do NOT affect the URL structure.

## API Routes (`app/api/**/route.ts`)

- Use named exports for HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- Always use `NextRequest` and `NextResponse` from `next/server`.
- See `api.instructions.md` for detailed API conventions.

## Data Fetching

- **Server Components**: Use `fetch()` or direct Prisma queries. In Phase 1, import from `@/lib/mock/`.
- **Client Components**: Use `useSWR` or `fetch` in `useEffect`. Cache and revalidate appropriately.
- **Real-time data**: Use `useSocket` hook from `@/hooks/use-socket`.

## File Organization within Route Segments

```
app/(dashboard)/monitoring/
├── page.tsx                 # Server Component entry point
├── monitoring-client.tsx    # Client Component (if needed)
├── loading.tsx              # Loading skeleton
├── error.tsx                # Error boundary
└── components/              # Page-specific components (optional)
    ├── device-grid.tsx
    └── sensor-chart.tsx
```

## Middleware (`middleware.ts`)

- Located at project root, NOT inside `app/`.
- Handles: JWT validation, route protection, redirect unauthenticated users to `/login`.
- Uses `jose` for JWT verification (Edge Runtime compatible).
- Public routes (no auth required): `/login`, `/register`, `/api/auth/login`, `/api/auth/register`.
