---
description: How to add new components (pages, sections, UI elements) to Dentaxy Studio for inspection and cloning.
---

# Adding Components to Dentaxy Studio

This skill guides you through the process of registering new components into the Dentaxy Studio environment. Once added, components become fully inspectable, allowing for property cloning and visual testing.

## Prerequisites
- The component must be a valid React component.
- The component should be importable from `src/`.

## Procedure

1.  **Locate Dentaxy Studio File**
    - File: `src/core/packages/studio/DentaxyStudio.tsx`

2.  **Import Your Component**
    - Add the import statement at the top of the file.
    - Example: `import LandingPage from '@/pages/Landing';`

3.  **Add to Sidebar Configuration**
    - Locate the sidebar configuration object (usually an array of groups inside the `nav` section or a configuration constant).
    - Add a new entry to the appropriate group (e.g., 'UI System', 'Pages', 'Components').

    ```typescript
    {
        name: 'ComponentName', // Internal ID
        label: 'Readable Label', // Sidebar Display Name
        type: 'Type' as const, // 'View', 'Component', 'Page', 'Utility'
        path: '/src/path/to/component', // Source path for reference
        icon: YourIcon // Lucide icon
    }
    ```

4.  **Handle Rendering in Preview Area**
    - Navigate to the `MAIN CONTENT AREA` -> `PREVIEW CARD` section in `DentaxyStudio.tsx`.
    - Locate the conditional rendering block (currently checks `inspectedFile.name`).
    - Add a condition for your new component.

    ```tsx
    {inspectedFile.name === 'YourComponentName' ? (
        <div className="w-full scale-[0.8] origin-top h-full overflow-hidden border border-black/5 shadow-2xl rounded-xl">
             <YourComponent />
        </div>
    ) : ...}
    ```
    > **Tip**: Use `scale-[0.8]` or similar if the component is a full page, to fit it nicely within the studio canvas. Ensure `origin-top` is set.

5.  **Verify**
    - Open Dentaxy Studio.
    - Click on your new item in the sidebar.
    - Verify it renders correctly.
    - Enable "Selector" mode and verify you can inspect elements within it.

## Best Practices
- **Full Pages:** Wrap full pages in a `div` with `scale` to simulate a browser viewport within the studio.
- **Context:** If your component requires specific providers (Theme, Auth), ensure they are present or mock them within the rendering block.
- **Isolation:** Studio components should ideally be isolated. If they rely on global state that isn't present, they may crash.
