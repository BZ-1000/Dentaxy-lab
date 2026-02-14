---
name: robust-debugging
description: A systematic protocol for identifying, analyzing, and resolving code errors robustly without altering design or core functionality.
---

# Robust Debugging Protocol

Use this skill when the user asks to "solucionar errores" (solve errors) or when you encounter build/runtime errors that need a "robust" fix.

## Core Principles

1.  **Preserve Design & Function**: NEVER change the UI styling or business logic unless it is the direct cause of the bug. The fix must be invisible to the user experience.
2.  **First-Time Resolution**: Aim for a complete fix in the first attempt by understanding the root cause, not just patching symptoms.
3.  **Dependency Autonomy**: If a missing library is the cause, install it immediately. Do not ask for permission if it's a standard/required package.

## Execution Steps

### 1. Analysis & Diagnosis
Before touching any code:
- **Read the Logs**: Analyze the full error message (terminal output or browser console).
- **Locate Source**: specific file and line number.
- **Understand Context**: Use `view_file` to read the code *around* the error. Don't guess.
- **Check Dependencies**: If the error is "Module not found", check `package.json` to see if it's missing or misconfigured.

### 2. Strategy Formulation
- **Missing Dependency**: Run `npm install <package>`.
- **Type Error (TypeScript)**:
    - If it's a logic error, fix the logic.
    - If it's a missing type definition, install `@types/<package>` or creates a declaration file `src/types/*.d.ts`.
    - **AVOID** just casting to `any` unless absolutely necessary as a temporary measure.
- **Logic/Runtime Error**: Trace the execution flow. Add guard clauses (e.g., `if (!data) return null;`) to prevent crashes.

### 3. Implementation
- Apply the fix using `replace_file_content` or `write_to_file`.
- **Minimal Changes**: Touch only the lines necessary to fix the bug.
- **No Refactoring**: Do not re-organize code or rename variables unless required for the fix.

### 4. Verification (Crucial)
- **Compulsory Check**: After applying the fix, ALWAYS run a verification command to ensure the error is gone.
    - For TS/React: `npx tsc --noEmit`
    - For Build: `npm run build` (if applicable/fast)
- **Loop**: If the error persists, repeat the analysis step with the new error info.

## Example Scenarios

### Scenario A: Missing Module
Error: `Module not found: Can't resolve 'framer-motion'`
Action:
1. Verify `package.json`.
2. Run `npm install framer-motion`.
3. Verify build.

### Scenario B: Property 'x' does not exist on type 'ButtonProps'
Error: `Property 'title' does not exist on type 'ButtonProps'`
Action:
1. Read `ButtonProps` definition.
2. If `title` is used in the component but missing in interface, add it to the interface.
3. If `title` is a mistake, correct the usage.

### Scenario C: Design Regression Risk
Error: A button isn't clicking because of z-index.
Action:
1. Fix the `z-index` or stacking context.
2. **DO NOT** change the button's color, size, or position (layout) unless it's broken.
3. Ensure the visual output remains identical to the intended design.
