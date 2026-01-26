import { useEffect, useRef } from "react";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight: number;
}

export function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = (reset?: boolean) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        if (reset) {
            textarea.style.height = `${minHeight}px`;
            return;
        }

        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = "auto";

        // Calculate new height
        const newHeight = Math.min(
            Math.max(textarea.scrollHeight, minHeight),
            maxHeight
        );

        textarea.style.height = `${newHeight}px`;
    };

    useEffect(() => {
        // Initial adjustment
        adjustHeight();

        // Resize observer to handle dynamic changes
        const textarea = textareaRef.current;
        if (!textarea) return;

        const resizeObserver = new ResizeObserver(() => {
            adjustHeight();
        });

        resizeObserver.observe(textarea);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return {
        textareaRef,
        adjustHeight,
    };
}
