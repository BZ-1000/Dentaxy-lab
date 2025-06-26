
"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
        <motion.div
          className="absolute aspect-square bg-gradient-to-l from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700"
          style={{
            width: 130,
          }}
          animate={{
            offsetDistance: ["0%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "linear",
          }}
        />
      </div>
    );
  }
);

OtraCondicionInput.displayName = "OtraCondicionInput";

export default OtraCondicionInput;
