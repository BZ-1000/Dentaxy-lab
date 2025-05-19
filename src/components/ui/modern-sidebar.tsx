
import * as React from "react"
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModernSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  position?: "left" | "right";
  width?: string;
  children?: React.ReactNode;
  toggleIcon?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  breakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
  overlay?: boolean;
  showCloseButton?: boolean;
}

export function ModernSidebar({
  isOpen = false,
  onToggle,
  position = "left",
  width = "300px",
  children,
  toggleIcon,
  header,
  footer,
  className,
  breakpoint = "md",
  overlay = true,
  showCloseButton = true,
}: ModernSidebarProps) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const backdropRef = useRef<HTMLDivElement>(null);
  
  // Match media query for breakpoint
  const breakpointMap = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  };
  
  const handleWindowResize = () => {
    const mql = window.matchMedia(`(min-width: ${breakpointMap[breakpoint]})`);
    if (mql.matches) {
      setIsVisible(isOpen);
    }
  };
  
  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [breakpoint, isOpen]);
  
  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current && onToggle) {
      onToggle();
    }
  };
  
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: position === "left" ? "-100%" : "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };
  
  const backdropVariants = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };
  
  // This creates a fixed React.ReactNode, not a MotionValue
  const toggleButton = useMemo(() => {
    if (!onToggle) return null;
    
    return (
      <button
        onClick={onToggle}
        className={cn(
          "fixed z-40 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90",
          position === "left" ? "left-4" : "right-4",
          "bottom-4 h-10 w-10"
        )}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {toggleIcon || (isOpen ? "×" : "☰")}
      </button>
    );
  }, [isOpen, onToggle, position, toggleIcon]);
  
  const sidebarContent = (
    <motion.div
      className={cn(
        "fixed z-50 h-full overflow-auto bg-background shadow-lg",
        position === "left" ? "left-0" : "right-0",
        className
      )}
      style={{ width }}
      variants={sidebarVariants}
      initial="closed"
      animate={isVisible ? "open" : "closed"}
    >
      <div className="flex h-full flex-col">
        {header && <div className="flex-shrink-0">{header}</div>}
        {showCloseButton && onToggle && (
          <button
            onClick={onToggle}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80"
            aria-label="Close sidebar"
          >
            ×
          </button>
        )}
        <div className="flex-1 overflow-auto p-4">{children}</div>
        {footer && <div className="flex-shrink-0">{footer}</div>}
      </div>
    </motion.div>
  );
  
  return (
    <>
      {overlay && isVisible && (
        <motion.div
          ref={backdropRef}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="closed"
          animate={isVisible ? "open" : "closed"}
          onClick={handleBackdropClick}
        />
      )}
      {sidebarContent}
      {toggleButton}
    </>
  );
}
