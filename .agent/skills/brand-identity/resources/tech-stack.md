# Preferred Tech Stack & Implementation Rules

When generating code or UI components for Dentaxy, you **MUST** strictly adhere to the following technology choices.

## Core Stack
* **Framework:** React (Vite) + TypeScript
* **Styling Engine:** Tailwind CSS (Mandatory).
* **Component Library:** shadcn/ui (Use these primitives as the base).
* **Icons:** Lucide React (Default) or custom SVGs if strictly required.
* **State Management:** Zustand (observed in package.json).
* **Routing:** react-router-dom.

## Implementation Guidelines

### 1. Tailwind Usage
* Use utility classes directly in JSX.
* Utilize the color tokens (primary, secondary) defined in `tailwind.config.ts`.
* **Dark Mode:** Support dark mode using Tailwind's `dark:` variant modifier.
* **Glassmorphism:** Use `backdrop-blur-sm bg-white/30` (or similar) heavily for panels/cards to achieve the modern/futuristic look.

### 2. Component Patterns
* **Buttons:** Primary actions must use the solid Primary color. Secondary actions should use the 'Ghost' or 'Outline' variants.
* **Forms:** Inputs should simulate the "Google/Apple Style" defined in global CSS: `rounded-xl border-transparent bg-secondary/30 backdrop-blur-sm`.
* **Layout:** Use Flexbox and CSS Grid via Tailwind utilities.
* **Organic Shapes:** Prefer rounded corners (`rounded-xl`, `rounded-2xl`) over sharp edges.

### 3. Forbidden Patterns
* Do NOT use jQuery.
* Do NOT use Bootstrap classes.
* Do NOT create new CSS files; keep styles located within component files via Tailwind.
* Do NOT use Class Components; use Functional Components with Hooks.

### 4. Special "AI" Logic
* **Redaction Simulation:** Logic for clinical history generation must be LOCAL and DETERMINISTIC string assembly. DO NOT call external AI APIs for text generation unless explicitly authorized.
