
"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface FancyRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const FancyRadio = React.forwardRef<HTMLInputElement, FancyRadioProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="radio"
            className="peer sr-only"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "h-6 w-6 rounded-full border border-gray-300 flex items-center justify-center",
              "peer-checked:bg-emerald-500 peer-checked:border-emerald-500",
              "transition-all duration-200 ease-in-out",
              "peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-emerald-500/50",
              "hover:border-emerald-400 hover:shadow-sm",
              className
            )}
          >
            <Check className="h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        {label && <span className="text-sm font-medium">{label}</span>}
      </div>
    );
  }
)

FancyRadio.displayName = "FancyRadio"

const FancyRadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
  }
>(
  ({ className, children, value, onValueChange, defaultValue, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
      value || defaultValue
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setSelectedValue(newValue);
      onValueChange?.(newValue);
    };

    // Clone children and add props
    const radioChildren = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          checked: child.props.value === selectedValue,
          onChange: handleChange,
          name: props.id || 'radio-group',
        });
      }
      return child;
    });

    return (
      <div ref={ref} className={cn("flex space-x-4", className)} {...props}>
        {radioChildren}
      </div>
    );
  }
)

FancyRadioGroup.displayName = "FancyRadioGroup"

// New component for clickable tag buttons
interface TagButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  label: string;
}

const TagButton = React.forwardRef<HTMLButtonElement, TagButtonProps>(
  ({ className, active, label, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium transition-all",
          "border border-gray-200 bg-white shadow-sm", 
          "hover:bg-blue-50 hover:border-blue-200 hover:shadow",
          active && "bg-blue-100 border-blue-300 text-blue-700",
          className
        )}
        onClick={onClick}
        type="button"
        {...props}
      >
        {label}
      </button>
    );
  }
)

TagButton.displayName = "TagButton"

export { FancyRadio, FancyRadioGroup, TagButton }
