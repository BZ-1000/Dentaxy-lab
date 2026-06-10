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
    const { processedChildren, maxDelay } = useMemo(() => {
        let currentDelay = delay;

        const processNode = (node: React.ReactNode, isTableContext: boolean = false): React.ReactNode => {
            if (typeof node === "string") {
                const parts = node.split(/(\s+)/);

                return parts.map((part, i) => {
                    if (part.length === 0) return null;

                    const isSpace = /^\s+$/.test(part);
                    if (isSpace) {
                        return <span key={i}>{part}</span>;
                    }

                    const myDelay = currentDelay;
                    // Mantener velocidad original para tablas, aumentar velocidad para texto normal (más pausado y premium)
                    const increment = isTableContext ? (speed * 0.05) : (speed * 0.038);
                    currentDelay += increment;

                    return (
                        <span
                            key={i}
                            className="inline-block will-change-[transform,opacity,filter]"
                            style={{
                                opacity: 0,
                                filter: 'blur(3px)',
                                transform: 'translateY(2px) scale(0.98)',
                                animation: `apple-word-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards ${myDelay}s`
                            }}
                        >
                            {part}
                        </span>
                    );
                });
            }

            if (React.isValidElement(node)) {
                const element = node as React.ReactElement<any>;
                
                // Identificar si el elemento pertenece a una tabla
                const isTableElement = typeof element.type === 'string' && ['table', 'thead', 'tbody', 'tr', 'td', 'th'].includes(element.type);
                const currentIsTableContext = isTableContext || isTableElement;

                if (element.props.children) {
                    const childNodes = React.Children.toArray(element.props.children);
                    const processed = childNodes.map(child => processNode(child, currentIsTableContext));
                    return React.cloneElement(element, { ...element.props, key: element.key }, processed);
                }
                return node;
            }

            if (Array.isArray(node)) {
                return node.map(child => processNode(child, isTableContext));
            }

            return node;
        };

        const processed = React.Children.map(children, child => processNode(child, false));
        return { processedChildren: processed, maxDelay: currentDelay };

    }, [children, delay, speed]);

    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        setIsFinished(false);
        const timer = setTimeout(() => {
            setIsFinished(true);
        }, (maxDelay + 0.5) * 1000);
        return () => clearTimeout(timer);
    }, [maxDelay]);

    if (isFinished) {
        return (
            <Component className={cn("leading-relaxed", className)}>
                {children}
            </Component>
        );
    }

    return (
        <Component className={cn("leading-relaxed", className)}>
            <style>{`
                @keyframes apple-word-reveal {
                    0% {
                        opacity: 0;
                        filter: blur(3px);
                        transform: translateY(2px) scale(0.98);
                    }
                    100% {
                        opacity: 1;
                        filter: blur(0px);
                        transform: translateY(0px) scale(1);
                    }
                }
            `}</style>

            {Array.isArray(processedChildren) ? processedChildren : [processedChildren]}
        </Component>
    );
};

