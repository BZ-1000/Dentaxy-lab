
import React from 'react';
import { cn } from '@/lib/utils';

interface UnderlinedHeadingProps {
  text: string;
  className?: string;
  textColor?: string;
  bgColor?: string;
  padding?: string;
  borderRadius?: string;
}

export function UnderlinedHeading({
  text,
  className,
  textColor = "text-white",
  bgColor = "bg-blue-500",
  padding = "px-4 py-2",
  borderRadius = "rounded-full"
}: UnderlinedHeadingProps) {
  return (
    <div className={cn(
      bgColor,
      padding,
      borderRadius,
      textColor,
      "font-medium inline-block text-sm tracking-wide",
      className
    )}>
      {text}
    </div>
  );
}
