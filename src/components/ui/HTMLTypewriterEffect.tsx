import React, { useState, useEffect, useRef } from 'react';

interface HTMLTypewriterEffectProps {
    content: string;
    speed?: number;
    onComplete?: () => void;
    className?: string;
}

export const HTMLTypewriterEffect: React.FC<HTMLTypewriterEffectProps> = ({
    content,
    speed = 10,
    onComplete,
    className
}) => {
    // We do NOT use state for content to avoid re-rendering React logic on every character.
    // Direct DOM manipulation is O(1) relative to React's diffing algorithm for this use case.
    const [isComplete, setIsComplete] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    const indexRef = useRef(0);
    const lastUpdateRef = useRef(0);

    useEffect(() => {
        // Reset state when content changes
        setIsComplete(false);
        indexRef.current = 0;

        // Clear previous content
        if (elementRef.current) {
            elementRef.current.innerHTML = "";
        }

        let firstFrame = true;

        const animate = (time: number) => {
            if (firstFrame) {
                lastUpdateRef.current = time;
                firstFrame = false;
                requestRef.current = requestAnimationFrame(animate);
                return;
            }

            if (indexRef.current >= content.length) {
                setIsComplete(true);
                if (onComplete) onComplete();
                return;
            }

            // Visible Character Stepping Logic
            // We rigorously ensure only ONE visual change per interval to prevent "bursts".
            const elapsed = time - lastUpdateRef.current;

            if (elapsed >= speed) {
                let nextIndex = indexRef.current;

                // Process input until we find the next visible cursor position
                if (nextIndex < content.length) {
                    let char = content[nextIndex];

                    if (char === '<') {
                        // Skip entire HTML tag instantly (don't animate internal tag chars)
                        const closingTagIndex = content.indexOf('>', nextIndex);
                        if (closingTagIndex !== -1) {
                            nextIndex = closingTagIndex + 1;
                        } else {
                            nextIndex++;
                        }
                    } else {
                        // Regular character: advance by 1
                        nextIndex++;
                    }
                }

                if (nextIndex !== indexRef.current) {
                    indexRef.current = nextIndex;

                    // DIRECT DOM UPDATE: Bypass React State
                    const currentSubstring = content.substring(0, indexRef.current);
                    if (elementRef.current) {
                        elementRef.current.innerHTML = currentSubstring;
                    }

                    // Reset timer to current time to prevent "catch up" bursts
                    lastUpdateRef.current = time;
                }
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [content, speed, onComplete]);

    // Render an empty container that we will fill manually
    return (
        <div className={className}>
            <div
                ref={elementRef}
                className="inline"
            />
            {!isComplete && (
                <span className="inline-block w-1.5 h-4 bg-indigo-500 animate-pulse ml-0.5 align-middle" />
            )}
        </div>
    );
};
