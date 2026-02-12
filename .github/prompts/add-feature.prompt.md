---
mode: "agent"
description: "Plan and implement a full-stack feature including types, mock data, API routes, UI components, and pages"
---

# Add New Feature

Plan and implement a complete feature for the Smart Factory application.

## Process

### Step 1 — Analyze Requirements

- Understand the feature description and user story
- Identify which existing components/pages are affected
- Determine the data model (types, relationships)
- Identify required RBAC permissions

### Step 2 — Plan Implementation

Create a list of files to create/modify:

1. **Types** (`types/`): New TypeScript interfaces/types
2. **Mock Data** (`lib/mock/`): Realistic test data (Phase 1)
3. **Validations** (`lib/validations/`): Zod schemas for API validation
4. **API Routes** (`app/api/`): REST endpoints with full RBAC + audit logging
5. **Components** (`components/`): Reusable UI components
6. **Pages** (`app/(dashboard)/`): Dashboard pages with metadata, loading, error states
7. **Hooks** (`hooks/`): Custom hooks if needed (auth, permissions, real-time)

### Step 3 — Implement (in this order)

1. Types first — so everything else has type safety
2. Mock data — so UI can render immediately
3. Components — building blocks
4. Pages — compose components with data
5. API routes — backend logic (Phase 1: return mock data)
6. Integration — wire up API calls (Phase 2)

### Step 4 — Verify

- All pages render without errors
- Navigation works
- RBAC hides/shows elements correctly per role
- Responsive on mobile and desktop
- Dark mode works
- Loading and error states display correctly

## Conventions

- Follow all coding conventions from `copilot-instructions.md`
- Use shadcn/ui components as building blocks
- All data from `@/lib/mock/` in Phase 1
- Every API route has Zod validation + RBAC + error handling + audit log
- Every page has metadata + loading.tsx + error.tsx

## Ask the user for:

- Feature description or user story
- Which user roles interact with this feature
- Priority and scope (MVP vs full)
