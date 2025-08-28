
"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, Transition } from "framer-motion";

type BorderTrailProps = {
  className?: string;
  size?: number;
  transition?: Transition;
  delay?: number;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
};

export function BorderTrail({
  className,
  size = 60,
  transition,
  delay,
  onAnimationComplete,
  style,
}: BorderTrailProps) {
  const BASE_TRANSITION: Transition = {
    repeat: Infinity,
    duration: 5,
    ease: "linear",
  };

  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className={cn("absolute aspect-square bg-zinc-500", className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          ...style,
        }}
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        transition={{
          ...(transition ?? BASE_TRANSITION),
          delay: delay,
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}

interface OtraCondicionInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
}

const OtraCondicionInput = forwardRef<HTMLTextAreaElement, OtraCondicionInputProps>(
  ({ className, style, autoFocus, ...props }, ref) => {
    return (
      <div className="relative h-10 w-full overflow-hidden rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-200">
        <textarea
          ref={ref}
          {...props}
          autoFocus={autoFocus}
          rows={1}
          className={cn(
            "h-full w-full resize-none rounded-md bg-transparent px-2 py-1 text-sm outline-none dark:placeholder:text-zinc-500 placeholder:text-zinc-400",
            className
          )}
          style={{ ...style, overflow: "hidden" }}
        />
        <BorderTrail
          className="bg-gradient-to-l from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700"
          size={130}
        />
      </div>
    );
  }
);

OtraCondicionInput.displayName = "OtraCondicionInput";

export default OtraCondicionInput;
