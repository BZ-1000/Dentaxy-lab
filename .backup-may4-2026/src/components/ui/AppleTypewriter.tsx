import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

interface AppleTypewriterProps {
    children: React.ReactNode;
    className?: string;
    speed?: number; // Duration per phrase in seconds
    delay?: number; // Initial delay
    as?: React.ElementType;
}

export const AppleTypewriter: React.FC<AppleTypewriterProps> = ({
    children,
    className,
    speed = 1.5,
    delay = 0,
    as: Component = "div"
}) => {
    // Use a ref-like logic inside useMemo to calculate staggered delays for the tree
    const processedChildren = useMemo(() => {
        let currentDelay = delay;

        const processNode = (node: React.ReactNode): React.ReactNode => {
            if (typeof node === "string") {
                // Split text into sentences (Phrase by phrase)
                // Regex looks for punctuation followed by space or end of string.
                // We capture the delimiter to keep it.
                // const phrases = node.split(/([.?!]+\s+)/).filter(Boolean);

                // Re-assemble phrases correctly (content + delimiter)
                // Actually split keeps delimiter if captured in group.
                // "Hello. World." -> ["Hello", ". ", "World", "."] or similar depending on regex

                // Simpler approach: Match sentences.
                // But preventing loss of formatting/spaces is key.

                // Let's just treat the string as chunks if it's long.
                // Or strictly split by ". "

                // const chunks = [];
                // let buffer = "";

                // WORD-STREAM LOGIC:
                // Maximum fluidity. Split by words/spaces.
                // This avoids "mask clipping" on wrapped lines and ensures constant "writing" speed.
                const parts = node.split(/(\s+)/);

                return parts.map((part, i) => {
                    // Handle empty strings from split
                    if (part.length === 0) return null;

                    const myDelay = currentDelay;

                    // Increment delay: Fast per-word pace.
                    // If part is a newline/space, we can go faster or same.
                    // 0.1s * speed is roughly "10 words per second" at speed=1.
                    // Let's optimize for "Redaction" feel.
                    // If speed=0.8 (user default for body), increment should be small ~0.04s.
                    // Normalizing: speed 1.0 = 0.05s increment.
                    const increment = (speed * 0.05);
                    currentDelay += increment;

                    return (
                        <span
                            key={i}
                            style={{
                                opacity: 0,
                                animation: `apple-word-reveal 0.3s ease-out forwards ${myDelay}s`
                            }}
                        >
                            {part}
                        </span>
                    );
                });
            }

            if (React.isValidElement(node)) {
                const element = node as React.ReactElement<any>;
                if (element.props.children) {
                    const childNodes = React.Children.toArray(element.props.children);
                    const processed = childNodes.map(processNode);
                    return React.cloneElement(element, { ...element.props, key: element.key }, processed);
                }
                return node;
            }

            if (Array.isArray(node)) {
                return node.map(processNode);
            }

            return node;
        };

        return React.Children.map(children, processNode);

    }, [children, delay, speed]);


    return (
        <Component className={cn("leading-relaxed", className)}>
            <style>{`
        @keyframes apple-word-reveal {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>

            {Array.isArray(processedChildren) ? processedChildren : [processedChildren]}
        </Component>
    );
};
