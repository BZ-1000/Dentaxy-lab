
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AnimatedTextareaProps {
  content: string;
  speed?: number;
  readOnly?: boolean;
  autoFocus?: boolean;
  className?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  onAnimationComplete?: () => void;
}

export function AnimatedTextarea({
  content,
  speed = 10,
  readOnly = true,
  autoFocus = false,
  className,
  textAlign = "justify",
  onAnimationComplete,
}: AnimatedTextareaProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!content) {
      setDisplayedText('');
      setIsAnimating(false);
      return;
    }

    // Reset if content changes
    setDisplayedText('');
    setIsAnimating(true);
    
    let currentIndex = 0;
    const maxLength = content.length;

    const typeInterval = setInterval(() => {
      if (currentIndex < maxLength) {
        setDisplayedText(content.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsAnimating(false);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [content, speed, onAnimationComplete]);

  useEffect(() => {
    // Auto-adjust height after animation completes
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [displayedText]);

  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }[textAlign];

  return (
    <Textarea
      ref={textareaRef}
      value={displayedText}
      readOnly={readOnly}
      autoFocus={autoFocus}
      className={cn(
        "min-h-[100px] transition-all duration-200", 
        alignmentClass,
        className
      )}
      style={{ overflow: 'hidden' }}
    />
  );
}
