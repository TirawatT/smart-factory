---
mode: "agent"
description: "Create a new React component with TypeScript types, shadcn/ui base, responsive design, and dark mode support"
---

# Create New Component

Create a new React component for the Smart Factory application.

## Requirements

1. **File Location**: Determine the correct directory:
   - `components/ui/` — shadcn/ui primitives (use `npx shadcn@latest add` instead)
   - `components/layout/` — Sidebar, Topbar, Breadcrumb, PageHeader
   - `components/dashboard/` — Dashboard widgets, KPI cards, status indicators
   - `components/charts/` — Recharts wrappers (LineChart, BarChart, etc.)
   - `components/forms/` — Form fields, validation display components
   - `app/(dashboard)/{page}/components/` — Page-specific components

2. **Component Structure**:

   ```tsx
   "use client"; // Only if needed

   import { cn } from "@/lib/utils";

   interface ComponentNameProps {
     readonly data: DataType;
     readonly onAction?: (id: string) => void;
     readonly className?: string;
   }

   export function ComponentName({
     data,
     onAction,
     className,
   }: ComponentNameProps) {
     return <div className={cn("base-styles", className)}>{/* content */}</div>;
   }
   ```

3. **Rules**:
   - Named export (NOT default export)
   - TypeScript interface for props with `readonly` fields
   - Accept optional `className` prop
   - Use `cn()` for class merging
   - Use shadcn/ui components as building blocks
   - Mobile-first responsive design
   - Dark mode support via `dark:` variants or CSS variables
   - Proper accessibility (ARIA labels, keyboard navigation)

## Ask the user for:

- Component name and purpose
- What props it needs
- Where it will be used (which page/section)
- Whether it needs interactivity (client component) or is static (server component)
