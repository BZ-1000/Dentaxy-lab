
import { cn } from "@/lib/utils";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { X, Menu } from "lucide-react";

interface SidebarProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * The position of the Sidebar
   * @default "left"
   */
  position?: "left" | "right";

  /**
   * The children to render
   */
  children: React.ReactNode;

  /**
   * The width of the Sidebar
   * @default "w-72"
   */
  sidebarWidth?: string;

  /**
   * The width of the Sidebar when collapsed
   * @default "w-20"
   */
  sidebarCollapsedWidth?: string;

  /**
   * Whether the Sidebar is collapsed by default
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Whether the hide sidebar button should be shown
   * @default true
   */
  showSidebarCollapseButton?: boolean;

  /**
   * The breakpoint at which the Sidebar should be hidden
   * @default "md"
   */
  breakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";

  /**
   * Whether to enable backdrop on mobile
   * @default true
   */
  enableBackdrop?: boolean;
}

export function ModernSidebar({
  position = "left",
  children,
  sidebarWidth = "w-72",
  sidebarCollapsedWidth = "w-20",
  defaultCollapsed = false,
  className,
  showSidebarCollapseButton = true,
  breakpoint = "md",
  enableBackdrop = true,
  ...props
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [atTop, setAtTop] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Handle scroll to hide/show the header
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (Math.abs(latest - lastScrollY) > 50) {
      const isScrollingUp = latest < lastScrollY;
      setVisible(latest < 100 || isScrollingUp);
      setLastScrollY(latest);
    }
    setAtTop(latest < 50);
  });

  // Close mobile sidebar when screen is resized
  useEffect(() => {
    const handleResize = () => {
      const mobileBreakpoint = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        "2xl": 1536,
      }[breakpoint];

      if (window.innerWidth >= mobileBreakpoint) {
        setShowMobileSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {enableBackdrop && showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Mobile sidebar trigger */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className={cn(
          "fixed top-4 z-50 rounded-full bg-primary shadow-lg text-primary-foreground p-2 flex items-center justify-center",
          position === "left" ? "left-4" : "right-4",
          `block ${breakpoint}:hidden`
        )}
      >
        {showMobileSidebar ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </motion.button>

      {/* Desktop and Mobile sidebar */}
      <motion.aside
        className={cn(
          "fixed top-0 bottom-0 bg-sidebar border-r border-border shadow-lg z-40 flex flex-col",
          position === "left" ? "left-0" : "right-0",
          `${breakpoint}:relative`,
          `${breakpoint}:block`,
          showMobileSidebar ? "block" : "hidden",
          !collapsed ? sidebarWidth : sidebarCollapsedWidth,
          className
        )}
        {...props}
      >
        <div className="overflow-y-auto flex-1 scrollbar-hide">{children}</div>

        {/* Collapse sidebar button */}
        {showSidebarCollapseButton && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "absolute top-4 bg-muted hover:bg-muted/80 transition-all text-muted-foreground rounded-full shadow-xl z-50",
              position === "left"
                ? "-right-3 p-0.5 rotate-180"
                : "-left-3 p-0.5",
              `hidden ${breakpoint}:flex`
            )}
          >
            <ArrowButton collapsed={collapsed} />
          </button>
        )}
      </motion.aside>
    </>
  );
}

function ArrowButton({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "transition-transform duration-300 ease-out",
        collapsed ? "rotate-180" : ""
      )}
    >
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

interface SidebarHeaderProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * The title of the Sidebar
   */
  title?: React.ReactNode;

  /**
   * The description of the Sidebar
   */
  description?: React.ReactNode;

  /**
   * The logo to display in the Sidebar
   */
  logo?: React.ReactNode;

  /**
   * Whether to show the border
   * @default true
   */
  showBorder?: boolean;
}

export function SidebarHeader({
  title,
  description,
  logo,
  showBorder = true,
  className,
  ...props
}: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "p-4 flex flex-col gap-3",
        showBorder && "border-b",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {logo && <div>{logo}</div>}
        <div>
          {title && (
            <h2 className="font-semibold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface SidebarFooterProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Whether to show the border
   * @default true
   */
  showBorder?: boolean;
}

export function SidebarFooter({
  showBorder = true,
  className,
  children,
  ...props
}: SidebarFooterProps) {
  return (
    <div
      className={cn(
        "p-4",
        showBorder && "border-t",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
