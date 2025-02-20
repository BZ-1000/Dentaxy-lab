
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const isTimeInput = type === 'time';
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
          isTimeInput && "h-12 px-4 bg-white/50 backdrop-blur-sm border-gray-200/50 hover:border-gray-300/50 focus:border-primary/50 shadow-sm hover:shadow-md dark:bg-gray-800/50 dark:border-gray-700/50 dark:hover:border-gray-600/50 dark:focus:border-primary/50 font-mono tracking-wider text-lg md:text-base appearance-none cursor-text selection:bg-primary/20",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
