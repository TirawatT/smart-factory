---
applyTo: "components/**/*.tsx"
---

# React Component Instructions

## Component Structure

Every component MUST follow this pattern:

```tsx
"use client"; // Only if needed (useState, useEffect, event handlers, browser APIs)

import { type ComponentProps } from "react";

// External imports
import { cn } from "@/lib/utils";

// Internal imports
import { Button } from "@/components/ui/button";

// Types
interface DeviceCardProps {
  readonly device: Device;
  readonly onSelect?: (id: string) => void;
  readonly className?: string;
}

// Component (named export, NOT default export)
export function DeviceCard({ device, onSelect, className }: DeviceCardProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      {/* content */}
    </div>
  );
}
```

## Rules

### General

- Use **named exports** for all components (except `page.tsx` and `layout.tsx` which use default export).
- Props interface must use `readonly` for all properties.
- Always accept optional `className` prop for style customization.
- Use `cn()` utility from `@/lib/utils` for conditional class merging.
- Prefer composition over inheritance.
- Keep components focused — one responsibility per component.
- Extract repeated logic into custom hooks (`hooks/` directory).

### shadcn/ui

- Always use shadcn/ui primitives as the base for UI elements.
- Do NOT create custom buttons, inputs, cards, dialogs, etc. that duplicate shadcn/ui.
- Import from `@/components/ui/...`:
  ```tsx
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Badge } from "@/components/ui/badge";
  ```
- Extend shadcn/ui components with variants when needed, don't replace them.

### Accessibility

- All interactive elements must have proper ARIA labels.
- Images must have `alt` text.
- Forms must have associated labels.
- Use semantic HTML (e.g., `<nav>`, `<main>`, `<section>`, `<article>`).
- Ensure keyboard navigation works for all interactive elements.
- Color must not be the only indicator — use icons/text alongside color badges.

### Responsive Design

- Mobile-first approach: base styles → `sm:` → `md:` → `lg:` → `xl:`.
- Sidebar collapses on mobile (use `Sheet` from shadcn/ui).
- Tables become cards on mobile (use responsive table wrapper or card view toggle).
- Test at breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide).

### Dark Mode

- Always include `dark:` variants for custom styles.
- Use CSS variables from `globals.css` for theme colors (not hardcoded colors).
- Test both light and dark modes for every component.

## Component Categories

### `components/ui/` — shadcn/ui Primitives

- Managed by shadcn/ui CLI (`npx shadcn@latest add <component>`).
- Do NOT manually edit these files unless absolutely necessary.

### `components/layout/` — Layout Components

- Sidebar, Topbar, Breadcrumb, PageHeader, Footer.
- These persist across page navigations (used in layouts).

### `components/dashboard/` — Dashboard Widgets

- KPI cards, status indicators, quick-action panels.
- Used on the main dashboard page.

### `components/charts/` — Chart Components

- Wrappers around Recharts (LineChart, BarChart, PieChart, AreaChart).
- Accept typed data arrays + config props.
- Handle loading/empty/error states.
- Responsive by default.

### `components/forms/` — Form Components

- Reusable form fields with validation display.
- Integrate with Zod schemas from `@/lib/validations/`.
- Use `react-hook-form` or controlled components pattern.

## Performance

- Use `React.memo()` for expensive components that receive stable props.
- Use `useCallback` / `useMemo` only when there's a measurable performance benefit.
- Lazy load heavy components (charts, modals) with `dynamic()` from `next/dynamic`.
- Avoid unnecessary re-renders — keep state as local as possible.
