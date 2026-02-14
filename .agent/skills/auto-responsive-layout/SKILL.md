---
description: Guide for creating auto-adjustable, single-view layouts that adapt to any device without unwanted scrolling.
---

# Auto-Adjustable Responsive Layouts

This skill provides the standard protocol for ensuring UI components and layouts automatically adjust to fit the screen ("single view") without requiring scrolling, especially for dashboards and hub interfaces.

## Core Principles

1.  **Viewport Constraints (`vh`, `dvh`)**:
    - Use `min-h-screen` or `h-screen` (preferably `h-dvh` for mobile) for the main container.
    - Prevent overflow on the main axis with `overflow-hidden` when a fixed view is desired.

2.  **Flexbox Scaling**:
    - Use `flex` and `flex-col` for the main layout.
    - Use `flex-1` for the central content area (e.g., the card/carousel) so it takes up available space but shrinks if needed.
    - Use `justify-center` and `items-center` to center content perfectly.

3.  **Relative Sizing & Clamping**:
    - Avoid fixed pixel heights (e.g., `h-[500px]`) for main containers.
    - Use `clamp()` for font sizes and margins (e.g., `text-[clamp(1rem,2vw,1.5rem)]`) to scale text smoothly.
    - Scale components using percentages or `max-h` relative to the viewport.

4.  **Compact Spacing**:
    - Use `gap` instead of fixed margins to manage spacing between elements.
    - Reduce vertical padding (`py`) on smaller screens using breakpoints (e.g., `py-4 md:py-8`).

## Implementation Checklist

- [ ] **Container**: `h-screen w-full overflow-hidden flex flex-col`
- [ ] **Header/Footer**: Fixed or minimal height, `flex-shrink-0`.
- [ ] **Main Content**: `flex-1 flex items-center justify-center min-h-0` (important: `min-h-0` allows flex children to shrink below content size if needed).
- [ ] **Media Queries**: Adjust scale for small screens (e.g., `scale-90` on mobile).

## Example Pattern

```tsx
<div className="h-screen w-full bg-black overflow-hidden flex flex-col relative">
  {/* Header - Fixed Top */}
  <header className="flex-shrink-0 p-4 absolute top-0 left-0 z-50">
    {/* Nav Controls */}
  </header>

  {/* Main Content - Takes remaining space, centers perfectly */}
  <main className="flex-1 w-full flex items-center justify-center p-4 min-h-0">
    <div className="w-full max-w-4xl max-h-full flex flex-col items-center">
       {/* Cards / Visuals */}
    </div>
  </main>

  {/* Footer - Fixed Bottom */}
  <footer className="flex-shrink-0 p-4 absolute bottom-0 w-full">
    {/* Info */}
  </footer>
</div>
```
