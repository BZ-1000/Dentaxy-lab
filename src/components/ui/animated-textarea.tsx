"use client";

import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AnimatedTextareaProps {
  content?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  speed?: number;
  readOnly?: boolean;
  autoFocus?: boolean;
  className?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  onAnimationComplete?: () => void;
}

export function AnimatedTextarea({
  content,
  value,
  placeholder,
  onChange,
  speed = 10,
  readOnly = true,
  autoFocus = false,
  className,
  textAlign = "justify",
  onAnimationComplete,
}: AnimatedTextareaProps) {
  const [displayedText, setDisplayedText] = useState(value || '');
  const [isAnimating, setIsAnimating] = useState(!!content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // If in edit mode (with onChange handler), just use the value directly
    if (onChange) {
      setDisplayedText(value || '');
      return;
    }

    // Otherwise, use animation mode with content
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
  }, [content, speed, onAnimationComplete, onChange, value]);

  useEffect(() => {
    // Auto-adjust height after animation completes or when value changes
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

  // If in edit mode (with onChange handler), render an editable textarea
  if (onChange) {
    return (
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={false}
        autoFocus={autoFocus}
        className={cn(
          "min-h-[100px] transition-all duration-200", 
          alignmentClass,
          className
        )}
      />
    );
  }

  // Otherwise, render an animated read-only textarea
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
