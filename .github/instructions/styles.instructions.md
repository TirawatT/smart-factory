---
applyTo: "**/*.css,app/**/*.tsx,components/**/*.tsx"
---

# Styling Instructions (Tailwind CSS v4)

## Tailwind v4 Syntax

This project uses Tailwind CSS v4 which is CSS-based (NOT config-file-based like v3):

```css
/* app/globals.css */
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

- No `tailwind.config.js` — configuration is done in CSS with `@theme`.
- PostCSS plugin is `@tailwindcss/postcss` (configured in `postcss.config.mjs`).

## Theme Colors (CSS Variables)

Use CSS variables defined in `globals.css` for all theme colors:

```css
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --primary: ...;
  --secondary: ...;
  --destructive: ...;
  --muted: ...;
  --accent: ...;
  --card: ...;
  --border: ...;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  /* ... dark overrides */
}
```

Reference in Tailwind classes: `bg-background`, `text-foreground`, `border-border`, etc.

## Class Merging with `cn()`

Always use the `cn()` utility for conditional/merged classes:

```tsx
import { cn } from "@/lib/utils";

<div
  className={cn(
    "rounded-lg border p-4", // base styles
    isActive && "border-primary bg-primary/10", // conditional
    className, // external override
  )}
/>;
```

## Responsive Design

Mobile-first approach — base styles apply to mobile, add breakpoints for larger screens:

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* cards */}
</div>
```

Breakpoints:

- (base) — mobile (< 640px)
- `sm:` — ≥ 640px
- `md:` — ≥ 768px
- `lg:` — ≥ 1024px
- `xl:` — ≥ 1280px
- `2xl:` — ≥ 1536px

## Dark Mode

Use `dark:` variant for dark mode styles:

```tsx
<div className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
```

Prefer theme CSS variables (`bg-background`, `text-foreground`) over hardcoded colors — they automatically handle dark mode.

## Style Rules

- **NO inline styles** — use Tailwind utilities exclusively.
- **NO `style` prop** — exception only for dynamic values that can't be expressed in Tailwind (e.g., `style={{ width: `${percentage}%` }}`).
- **NO custom CSS classes** — use Tailwind utilities. Exception: complex animations defined in `globals.css`.
- **Spacing**: Use Tailwind spacing scale (p-1, p-2, p-4, p-6, p-8). Avoid arbitrary values like `p-[13px]`.
- **Colors**: Use theme colors (`text-primary`, `bg-muted`) not raw colors (`text-blue-500`). Exception: severity indicators (red, yellow, green).
- **Typography**: Use `text-sm`, `text-base`, `text-lg`, etc. Use `font-medium`, `font-semibold`, `font-bold` for weight.

## Common Patterns

### Status Badge Colors

```tsx
const statusColors: Record<string, string> = {
  online: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  offline: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  warning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};
```

### Severity Colors

```tsx
const severityColors: Record<string, string> = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  warning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};
```

### Card Layout

```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-lg font-semibold">Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
</Card>
```
