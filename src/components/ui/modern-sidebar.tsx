
import React, { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ChevronFirst,
  ChevronLast,
  Menu,
  Moon,
  Sun,
} from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const ModernSidebar = ({ children, className }: SidebarProps) => {
  const [expanded, setExpanded] = useState(true);
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = expanded ? "16rem" : "5rem";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const logo = {
    expanded: (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/diente.png" alt="Logo" className="h-8 w-auto" />
          <span className="font-semibold text-lg">Clínica Dental</span>
        </div>
      </div>
    ),
    collapsed: (
      <div className="flex items-center justify-center">
        <img src="/diente.png" alt="Logo" className="h-8 w-auto" />
      </div>
    ),
  };

  const toggleThemeButton = (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "fixed bottom-4 right-4 p-2 rounded-full bg-opacity-20 backdrop-blur-sm",
        theme === "dark"
          ? "bg-white text-white"
          : "bg-black text-black"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme === "dark" ? "dark" : "light"}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-300" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 text-gray-800 dark:text-white h-screen relative transition-all duration-300 ease-in-out",
        className
      )}
      style={{ width: sidebarWidth }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          {expanded ? logo.expanded : logo.collapsed}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {expanded ? (
              <ChevronFirst className="h-5 w-5" />
            ) : (
              <ChevronLast className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="p-2 flex-1 overflow-y-auto">{children}</div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div
            className={`flex ${
              expanded ? "justify-between" : "justify-center"
            } items-center`}
          >
            {expanded && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-sm font-medium">US</span>
                </div>
                <div>
                  <div className="text-sm font-medium">Usuario</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    usuario@ejemplo.com
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SidebarItem = ({
  icon,
  text,
  active = false,
  expanded = true,
  alert = false,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  expanded?: boolean;
  alert?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`flex items-center gap-2 p-3 my-1 rounded-lg cursor-pointer transition-colors ${
        active
          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
      onClick={onClick}
    >
      <div className="relative">
        {icon}
        {alert && (
          <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </div>
      {expanded && <span className="text-sm">{text}</span>}
    </div>
  );
};
