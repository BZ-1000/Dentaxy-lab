import { useState, useCallback, useEffect, RefObject } from 'react';

export interface InspectedElement {
    tagName: string;
    className: string;
    rect: DOMRect;
    relativeRect: { top: number; left: number; width: number; height: number };
    computedStyles: CSSStyleDeclaration;
    text?: string;
    element: HTMLElement;
}

export const useElementInspector = (
    containerRef: RefObject<HTMLElement>,
    isActive: boolean
) => {
    const [hoveredElement, setHoveredElement] = useState<InspectedElement | null>(null);
    const [selectedElement, setSelectedElement] = useState<InspectedElement | null>(null);

    const getElementInfo = (element: HTMLElement): InspectedElement => {
        const rect = element.getBoundingClientRect();
        const computedStyles = window.getComputedStyle(element);

        // Calculate relative position
        let relativeRect = { top: 0, left: 0, width: rect.width, height: rect.height };
        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            relativeRect.top = rect.top - containerRect.top + containerRef.current.scrollTop; // Add scrollTop if container is scrollable? 
            // Wait, getBoundingClientRect is viewport relative. 
            // If container is scrollable, rect.top changes as we scroll? 
            // No, rect.top is viewport relative. containerRect.top is viewport relative.
            // diff is relative to container visible top-left.
            // If we want absolute position inside a scrollable container, we usually need to add scrollTop.
            // The container in DentaxyStudio has `overflow-hidden` at top level, but the preview area might be scrollable?
            // "overflow-auto" is on line 261 of DentaxyStudio: <main className="flex-1 p-8 overflow-auto ...">
            // And previewContainerRef is on line 291: <div ref={previewContainerRef} ... relative>
            // This div is INSIDE the main overflow-auto.
            // So previewContainer moves with scroll? No, it's inside the scrollable area.
            // If `previewContainerRef` is the content wrapper inside the scroll view, then `rect.top - containerRect.top` is always 0 relative to itself?
            // Wait. We want the position relative to `previewContainerRef`.
            // If `previewContainerRef` is the relative parent.
            // `element` is inside `previewContainerRef`.
            // `rect.top` (viewport) - `containerRect.top` (viewport) gives offset from container's current visual top.
            // If container is `relative`, absolute child uses this offset effectively?
            // NO. If we scroll down, the element moves up. `rect.top` decreases. `containerRect.top` stays same (if container itself is not moving).
            // So `top` becomes negative?
            // If the highlighter is `absolute` inside `previewContainerRef`, it scrolls WITH the container.
            // So we need the position relative to the *content flow*, not the viewport.
            // If `previewContainerRef` encompasses the *entire* scrollable content, then it's fine.
            // But `DentaxyStudio` structure:
            // <main overflow-auto>
            //   <div ref={previewContainerRef} relative> ... content ... </div>
            // </main>
            // If `previewContainerRef` is just a wrapper around the content, it might be the thing that scrolls?
            // No, `main` scrolls. `previewContainerRef` is a child.
            // implementation: top = rect.top - containerRect.top.
            // If I scroll main, `rect.top` changes. `containerRect.top` changes differently?
            // If `previewContainerRef` is inside `main`, and `main` scrolls, `previewContainerRef` moves UP.
            // So `containerRect.top` decreases. `rect.top` (child) also decreases.
            // Difference remains constant?
            // YES! If both move together, the difference is the static offset within the container.
            // So `rect.top - containerRect.top` should be the correct `top` for `absolute` positioning inside that container.

            relativeRect.top = rect.top - containerRect.top;
            relativeRect.left = rect.left - containerRect.left;
        }

        // Clean up class names if possible (remove excessive whitespace)
        const className = element.className
            ? (typeof element.className === 'string' ? element.className : '')
            : '';

        return {
            tagName: element.tagName.toLowerCase(),
            className,
            rect,
            relativeRect,
            computedStyles,
            text: element.innerText?.substring(0, 50),
            element
        };
    };

    const handleMouseOver = useCallback((e: MouseEvent) => {
        if (!isActive || !containerRef.current) return;

        const target = e.target as HTMLElement;

        // Ensure we are inside the container
        if (!containerRef.current.contains(target)) return;
        if (target === containerRef.current) return; // Don't highlight the container itself

        e.stopPropagation();
        setHoveredElement(getElementInfo(target));
    }, [isActive, containerRef]);

    const handleMouseOut = useCallback((e: MouseEvent) => {
        if (!isActive) return;
        // Optional: Clear hover when leaving? 
        // Usually better to keep last hovered or clear if leaving container completely.
    }, [isActive]);

    const handleClick = useCallback((e: MouseEvent) => {
        if (!isActive || !containerRef.current) return;

        const target = e.target as HTMLElement;
        if (!containerRef.current.contains(target)) return;

        e.preventDefault();
        e.stopPropagation(); // Stop normal click behavior (e.g. form submission)

        setSelectedElement(getElementInfo(target));
    }, [isActive, containerRef]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        if (isActive) {
            container.addEventListener('mouseover', handleMouseOver);
            container.addEventListener('mouseout', handleMouseOut);
            container.addEventListener('click', handleClick, { capture: true }); // Capture to prevent default actions safely

            // Cursor style
            container.style.cursor = 'crosshair';
        } else {
            container.removeEventListener('mouseover', handleMouseOver);
            container.removeEventListener('mouseout', handleMouseOut);
            container.removeEventListener('click', handleClick, { capture: true });

            container.style.cursor = '';
            setHoveredElement(null);
            // We might want to keep selected element even if we turn off inspector? 
            // For now, let's keep it until user clears it or selects a new file.
        }

        return () => {
            container.removeEventListener('mouseover', handleMouseOver);
            container.removeEventListener('mouseout', handleMouseOut);
            container.removeEventListener('click', handleClick, { capture: true });
            container.style.cursor = '';
        };
    }, [isActive, containerRef, handleMouseOver, handleMouseOut, handleClick]);

    return {
        hoveredElement,
        selectedElement,
        setSelectedElement // Allow external clearing
    };
};
