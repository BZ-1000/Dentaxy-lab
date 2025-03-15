import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ModernSidebarProps {
  children: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
}

export function ModernSidebar({
  children,
  className,
  defaultExpanded = false,
}: ModernSidebarProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Change the width to be a string rather than a motion value
  const width = expanded ? "240px" : "80px";

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 z-40 h-screen flex flex-col justify-between border-r border-border bg-sidebar shadow-sm transition-all",
        className
      )}
      style={{ width }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <span
            className={cn(
              "text-xl font-semibold transition-opacity",
              expanded ? "opacity-100" : "opacity-0"
            )}
          >
            Menu
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {expanded ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}

export function SidebarItem({
  icon: Icon,
  label,
  active = false,
  expanded = false,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors dark:text-gray-200",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        active && "bg-gray-100 font-medium dark:bg-gray-800"
      )}
    >
      <Icon className="h-5 w-5" />
      <span
        className={cn(
          "text-sm transition-opacity",
          expanded ? "opacity-100" : "opacity-0"
        )}
      >
        {label}
      </span>
    </button>
  );
}
