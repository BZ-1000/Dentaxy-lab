
"use client";

import * as React from "react"
import { useEffect, useState } from "react";
 
export interface TypewriterProps {
  text: string | string[];
  speed?: number;
  cursor?: string | null;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}
 
export function Typewriter({
  text,
  speed = 120, // Slowed down from 100 to 120
  cursor = "|",
  loop = false,
  deleteSpeed = 80, // Slowed down from 50 to 80
  delay = 2000, // Increased from 1500 to 2000
  className,
  onComplete,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
 
  // Validate and process input text
  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textArrayIndex] || "";
 
  useEffect(() => {
    if (!currentText) return;
    
    // Reset when text changes
    if (typeof text === 'string' && text !== displayText && isComplete) {
      setDisplayText("");
      setCurrentIndex(0);
      setIsComplete(false);
    }
 
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentIndex < currentText.length) {
            setDisplayText((prev) => prev + currentText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          } else {
            if (onComplete && !isComplete) {
              setIsComplete(true);
              onComplete();
            }
            
            if (loop) {
              setTimeout(() => setIsDeleting(true), delay);
            }
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex(0);
            setTextArrayIndex((prev) => (prev + 1) % textArray.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );
 
    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    isDeleting,
    currentText,
    loop,
    speed,
    deleteSpeed,
    delay,
    displayText,
    text,
    textArray,
    textArrayIndex,
    onComplete,
    isComplete
  ]);
 
  return (
    <span className={`text-justify whitespace-pre-wrap ${className || ""}`}>
      {displayText}
      {cursor && <span className="animate-pulse opacity-70">{cursor}</span>}
    </span>
  );
}
