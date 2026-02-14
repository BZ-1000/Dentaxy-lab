---
description: Guide to adding new animations to the Dentaxy Studio Animation Showcase for visualization and cloning.
---

# Adding Animations to Dentaxy Studio Showcase

This skill provides a standardized workflow for adding new animation variants to the `AnimationsShowcase` component within Dentaxy Studio. This allows for centralized visualization and easy cloning of animation configurations.

## Location
- **File**: `src/core/packages/studio/showcase/AnimationsShowcase.tsx`

## Procedure

### 1. Define the Animation Variant
   - Locate the animation variants section at the top of the file (after imports).
   - Define your new variant using Framer Motion object syntax.
   - Use descriptive names (e.g., `slideInRight`, `bounceIn`, `pulseGlow`).

   ```typescript
   // Example: New Variant
   const slideInRight = {
       hidden: { opacity: 0, x: 50 },
       visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
   };
   ```

### 2. Add Visual Element to Live Preview
   - Locate the `LIVE PREVIEW AREA` comment block.
   - Find the main `motion.div` container.
   - Add a new element (text, icon wrapper, button, or card) that uses your new variant.
   - **Important**: Ensure it is wrapped or placed within a `motion` component that consumes the variant (e.g., `variants={slideInRight}`).

   ```typescript
   // Inside the preview container
   <motion.div variants={slideInRight} className="...">
       {/* Your visual content here */}
   </motion.div>
   ```

### 3. Add Tech Specs to Cloning Box
   - Scroll down to the `CLONING BOX / SPECS` section.
   - Locate the grid container (`grid grid-cols-1 md:grid-cols-3 gap-6`).
   - Add a new card block for your animation. Copy an existing card structure for consistency.
   - **Update the following**:
     - **Title**: The variable name of your variant.
     - **Color**: Choose a unique Tailwind color (e.g., `text-orange-400`, `bg-orange-500`).
     - **Code Block**: Update the displayed CSS/Prop logic to match your definition.

   ```typescript
   {/* Variant: Slide In Right */}
   <div className="bg-black/40 rounded-2xl p-5 border border-white/5 hover:border-orange-500/30 transition-colors group/card">
       <div className="flex justify-between items-start mb-3">
           <span className="text-orange-400 font-bold text-xs uppercase tracking-wider">slideInRight</span>
           <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(251,146,60,0.5)]" />
       </div>
       <code className="text-[10px] text-slate-400 font-mono block leading-relaxed group-hover/card:text-orange-300 transition-colors">
           opacity: 0 → 1<br/>
           x: 50 → 0<br/>
           spring stiffness: 100
       </code>
   </div>
   ```

### 4. Update the Copy Logic (Optional)
   - If you want the "Copy JSON" button to include this new animation, update the `handleCopy` function call in the header of the cloning box.
   - Add your new variant variable to the object being stringified.

   ```typescript
   onClick={() => handleCopy(JSON.stringify({ fadeUp, staggerContainer, scaleIn, slideInRight }, null, 2))}
   ```

## Verification
1.  Navigate to Dentaxy Studio (`/core` Phase 3).
2.  Select "Animations Showcase".
3.  Click the "Replay" (Play icon) button.
4.  Verify your new element animates as expected in the preview area.
5.  Verify the new spec card appears in the dark "Cloning Box" grid.
