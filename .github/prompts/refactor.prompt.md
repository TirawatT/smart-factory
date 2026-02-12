---
mode: "agent"
description: "Refactor code to improve readability, performance, or maintainability while preserving behavior"
---

# Refactor Code

Refactor existing code in the Smart Factory application while preserving its behavior.

## Principles

1. **Preserve Behavior**: The refactored code must produce the same output/behavior as the original.
2. **Incremental Changes**: Make small, verifiable changes rather than rewriting everything at once.
3. **Type Safety**: Add or improve TypeScript types where missing.
4. **Conventions**: Align with project coding conventions from `copilot-instructions.md`.

## Common Refactoring Targets

### Component Extraction

- If a component is > 150 lines, consider splitting it into smaller components.
- If JSX is duplicated, extract a reusable component.
- If a component has both data fetching and rendering, separate them.

### Hook Extraction

- If `useState` + `useEffect` logic is repeated, extract a custom hook.
- If event handler logic is complex, extract to a hook.
- Hooks go in `hooks/` directory, named `use-{name}.ts`.

### Utility Extraction

- If business logic is repeated across components/routes, extract to `lib/`.
- If validation schemas are duplicated, consolidate in `lib/validations/`.

### Type Improvement

- Replace `any` with proper types.
- Add `readonly` to props that shouldn't be mutated.
- Use discriminated unions for state machines.
- Extract shared types to `types/` directory.

### Performance

- Add `React.memo()` for expensive pure components.
- Add `useMemo` / `useCallback` where profiling shows benefit.
- Convert synchronous imports to `next/dynamic` for heavy components.
- Replace `useEffect` data fetching with Server Components where possible.

## Process

1. **Analyze**: Read the current code and understand what it does.
2. **Plan**: List specific changes to make and why.
3. **Execute**: Make changes incrementally.
4. **Verify**: Ensure no behavior changes — run lint, check types, test rendering.

## Ask the user for:

- Which file(s) or area to refactor
- What the goal of refactoring is (readability, performance, maintainability)
- Any constraints (preserve API, don't touch certain files)
