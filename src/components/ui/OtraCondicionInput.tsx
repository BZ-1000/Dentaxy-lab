"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface OtraCondicionInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
}

const OtraCondicionInput = forwardRef<HTMLTextAreaElement, OtraCondicionInputProps>(
  ({ className, style, autoFocus, rows = 2, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          {...props}
          rows={rows}
          autoFocus={autoFocus}
          className={cn(
            "w-full min-h-[64px] sm:min-h-[72px] resize-none rounded-2xl sm:rounded-3xl border-2 border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-4 sm:px-5 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 outline-none focus:outline-none focus:border-[#00f5a0] dark:focus:border-[#00f5a0] focus:ring-0 focus:shadow-[0_0_14px_rgba(0,245,160,0.45)] dark:placeholder:text-zinc-500 placeholder:text-zinc-400 leading-normal font-sans transition-all duration-200 shadow-sm",
            className
          )}
          style={{ ...style }}
        />
      </div>
    );
  }
);

OtraCondicionInput.displayName = "OtraCondicionInput";

export default OtraCondicionInput;
