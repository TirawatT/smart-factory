---
mode: "agent"
description: "Create mock data for a new entity with realistic values, TypeScript types, and helper functions"
---

# Create Mock Data

Create mock data for the Smart Factory application (Phase 1 development).

## Requirements

1. **File Location**: `lib/mock/{entity-name}.ts`

2. **File Structure**:

   ```typescript
   import type { EntityType } from "@/types";

   // Mock data array with realistic values
   export const mockEntities: EntityType[] = [
     {
       id: "uuid-format-id",
       name: "Realistic Name",
       // ... all fields with realistic industrial/factory values
       createdAt: new Date("2026-01-15T08:00:00Z"),
       updatedAt: new Date("2026-02-10T14:30:00Z"),
     },
     // 10-20 items minimum
   ];

   // Helper functions
   export function getEntityById(id: string): EntityType | undefined {
     return mockEntities.find((e) => e.id === id);
   }

   export function getEntitiesByStatus(status: string): EntityType[] {
     return mockEntities.filter((e) => e.status === status);
   }
   ```

3. **Data Guidelines**:
   - Use UUID format for IDs (e.g., `"d1a2b3c4-..."`)
   - Use realistic industrial values:
     - Temperature: 20-85°C
     - Pressure: 1.0-5.0 bar
     - Power: 0.5-50 kW
     - Speed: 100-3000 RPM
   - Include variety: different statuses, types, severities
   - Timestamps should be recent (Jan-Feb 2026)
   - Names should be industrial/factory themed

4. **Re-export**: Add the new mock data to `lib/mock/index.ts`:

   ```typescript
   export * from "./entity-name";
   ```

5. **TypeScript Types**: If types don't exist yet, create them in `types/{entity-name}.ts`.

## Ask the user for:

- Entity name and purpose
- What fields it has
- How many mock records to generate
- Any specific scenarios to cover (e.g., mix of online/offline devices)
