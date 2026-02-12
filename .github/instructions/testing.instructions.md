---
applyTo: "**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx,**/__tests__/**"
---

# Testing Instructions

## Test Framework

- **Unit/Integration Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright (future)
- Test files live alongside source files: `Component.tsx` → `Component.test.tsx`

## Test File Structure

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DeviceCard } from "./device-card";
import { mockDevices } from "@/lib/mock";

describe("DeviceCard", () => {
  const device = mockDevices[0];

  it("renders device name", () => {
    render(<DeviceCard device={device} />);
    expect(screen.getByText(device.name)).toBeInTheDocument();
  });

  it("shows online status badge when device is online", () => {
    render(<DeviceCard device={{ ...device, status: "online" }} />);
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", () => {
    const onSelect = jest.fn();
    render(<DeviceCard device={device} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledWith(device.id);
  });

  it("handles missing optional props gracefully", () => {
    render(<DeviceCard device={device} />);
    // Should not crash without onSelect
  });
});
```

## Testing Conventions

### What to Test

- **Components**: rendering, user interactions, conditional rendering, error states, loading states
- **Hooks**: state changes, side effects, cleanup
- **Utilities**: edge cases, error handling, type correctness
- **API Routes**: request validation, response format, status codes, RBAC checks
- **RBAC**: permission checks for each role (Admin sees X, Guest doesn't see Y)

### What NOT to Test

- shadcn/ui internal behavior (already tested by the library)
- Tailwind CSS class rendering (visual testing, not unit testing)
- Third-party library internals

### Naming Conventions

- Test files: `[name].test.tsx` or `[name].test.ts`
- Describe blocks: component/function name
- It blocks: plain English description of expected behavior
  - Good: `"shows error message when login fails"`
  - Bad: `"test error"`, `"should work"`

### Mocking

Mock external dependencies:

```typescript
// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    device: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: [] }),
  }),
) as jest.Mock;

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));
```

### Test Coverage Targets

- Utilities (`lib/`): 90%+
- Components (`components/`): 80%+
- API Routes (`app/api/`): 85%+
- Hooks (`hooks/`): 80%+
