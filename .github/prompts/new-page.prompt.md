---
mode: "agent"
description: "Create a new Next.js dashboard page with metadata, loading state, error boundary, and proper structure"
---

# Create New Dashboard Page

Create a new page in the Smart Factory dashboard following App Router conventions.

## Requirements

1. **Page Location**: `app/(dashboard)/{pageName}/page.tsx`
2. **Required Files** (create all of these):
   - `page.tsx` — Main page component (Server Component)
   - `loading.tsx` — Loading skeleton with shadcn/ui Skeleton components
   - `error.tsx` — Error boundary (`"use client"`) with retry button
   - `{pageName}-client.tsx` — Client component if page needs interactivity

3. **Page Template**:

   ```tsx
   import type { Metadata } from "next";

   export const metadata: Metadata = {
     title: "{Page Title} | Smart Factory",
     description: "{description}",
   };

   export default function {PageName}Page() {
     return (
       <div className="space-y-6">
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-bold tracking-tight">{Page Title}</h1>
             <p className="text-muted-foreground">{description}</p>
           </div>
           {/* Action buttons */}
         </div>

         {/* Page content */}
       </div>
     );
   }
   ```

4. **Data Source**: Import from `@/lib/mock/` (Phase 1) or use API calls (Phase 2+).

5. **RBAC**: Check user permissions and conditionally render UI elements:

   ```tsx
   {
     hasPermission("resource", "action") && <ActionButton />;
   }
   ```

6. **Responsive**: Grid layouts must be responsive (1 col mobile → 2-4 cols desktop).

7. **Dark Mode**: All custom styles must include `dark:` variants.

## Ask the user for:

- Page name and route path
- What data/features the page should display
- Which user roles can access this page
- Whether it needs real-time updates
