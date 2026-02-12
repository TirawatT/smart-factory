---
mode: "agent"
description: "Debug and fix a bug with systematic analysis, root cause identification, and verification"
---

# Fix Bug

Systematically debug and fix a bug in the Smart Factory application.

## Process

### Step 1 — Understand the Bug

- What is the expected behavior?
- What is the actual behavior?
- When did it start happening?
- What area of the app is affected? (UI, API, data, auth, real-time)

### Step 2 — Reproduce

- Identify the exact steps to reproduce
- Check browser console for errors
- Check Next.js server logs for errors
- Check network tab for failed API calls

### Step 3 — Identify Root Cause

- Trace the data flow: data source → API → component → render
- Check TypeScript errors (run `npm run lint`)
- Check for common issues:
  - Missing `"use client"` directive
  - Incorrect import paths (should use `@/` alias)
  - Missing `await` on async operations
  - Undefined/null access without guards
  - Zod validation schema mismatch
  - Missing RBAC permission for the action
  - Incorrect response format from API
  - CSS/layout issues (missing responsive classes)

### Step 4 — Fix

- Make the minimal change needed to fix the bug
- Don't introduce new patterns or refactor unrelated code
- Ensure the fix doesn't break other functionality
- Add type guards or null checks where needed

### Step 5 — Verify

- Confirm the bug is fixed
- Check that related features still work
- Run `npm run lint` to check for new errors
- Run `npm run build` to ensure no build errors
- Consider adding a test to prevent regression

## Ask the user for:

- Bug description and steps to reproduce
- Error messages (console, terminal, or UI)
- Which page/component is affected
