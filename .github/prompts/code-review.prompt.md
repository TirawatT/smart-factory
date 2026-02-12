---
mode: "agent"
description: "Review code for quality, security, performance, accessibility, and convention compliance"
---

# Code Review

Review code changes in the Smart Factory application against project standards.

## Review Checklist

### 1. TypeScript Strictness

- [ ] No `any` types — use `unknown` + type guards if uncertain
- [ ] All function parameters and return types are explicitly typed
- [ ] Props interfaces use `readonly`
- [ ] Proper null/undefined handling with optional chaining or type guards

### 2. Security

- [ ] API routes have authentication (JWT) check
- [ ] API routes have authorization (RBAC) check
- [ ] Input validation with Zod before processing
- [ ] No sensitive data in client-side code or logs
- [ ] No SQL injection vectors (Prisma handles this, but check raw queries)
- [ ] XSS prevention (React handles this, but check `dangerouslySetInnerHTML`)
- [ ] CSRF protection for state-changing operations

### 3. Error Handling

- [ ] API routes wrapped in try/catch
- [ ] Generic error messages returned to clients
- [ ] Detailed errors logged server-side
- [ ] Components have error boundaries (error.tsx)
- [ ] Loading states for async operations (loading.tsx)

### 4. Performance

- [ ] No unnecessary re-renders (check state management)
- [ ] Heavy components lazy-loaded with `next/dynamic`
- [ ] Images use `next/image` with proper sizing
- [ ] API queries are paginated (not fetching all records)
- [ ] Expensive computations memoized with `useMemo`

### 5. Accessibility

- [ ] Interactive elements have ARIA labels
- [ ] Images have alt text
- [ ] Forms have associated labels
- [ ] Color is not the only indicator (icons/text alongside)
- [ ] Keyboard navigation works

### 6. Conventions

- [ ] File naming: kebab-case
- [ ] Component naming: PascalCase
- [ ] Named exports (not default, except pages/layouts)
- [ ] Imports use `@/` path alias
- [ ] Import order: React → external → `@/` internal → relative
- [ ] `"use client"` only where needed
- [ ] Uses shadcn/ui components (not duplicating functionality)

### 7. Responsive & Dark Mode

- [ ] Mobile-first responsive design
- [ ] Works at all breakpoints (375px, 768px, 1024px, 1440px)
- [ ] Dark mode styles included (`dark:` variants or CSS variables)

### 8. Data Integrity

- [ ] Audit logging for write operations
- [ ] Soft delete (not hard delete) for user data
- [ ] AuditLog immutability preserved (no update/delete)

### 9. API Routes Specific

- [ ] Consistent response format `{ success, data, error, message }`
- [ ] Correct HTTP status codes
- [ ] Pagination support for list endpoints
- [ ] Zod schema matches TypeScript interface

## Output Format

For each issue found:

```
**[SEVERITY]** File: description of issue
- Current: what the code does now
- Expected: what it should do
- Suggestion: how to fix it
```

Severity levels: `CRITICAL` (security/data loss), `ERROR` (functional bug), `WARNING` (convention/performance), `INFO` (suggestion/improvement)
