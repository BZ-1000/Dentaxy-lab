import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext, ReactNode } from "react";
import { AnimatePresence, motion, MotionValue } from "framer-motion";
import { Menu, X } from "lucide-react";

interface Links {
  label: string;
  href?: string;
  icon: React.JSX.Element | React.ReactNode;
  onClick?: () => void;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return <SidebarContext.Provider value={{
    open,
    setOpen,
    animate
  }}>
      {children}
    </SidebarContext.Provider>;
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>;
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return <>
      <DesktopSidebar {...props} />
      {/* Eliminado el MobileSidebar */}
    </>;
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();

  // Fixed width property - use explicit string width
  const sidebarWidth = animate ? (open ? "300px" : "60px") : "300px";

  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 flex-shrink-0",
        className
      )}
      animate={{
        width: sidebarWidth
      }}
      style={{ width: sidebarWidth }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// MobileSidebar eliminado: no devuelve nada para no renderizar el slide sidebar en móviles.
export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();

  return (
    <div
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer select-none",
        className
      )}
      onClick={link.onClick}
      {...props}
    >
      {link.icon}
      {animate ? (
        open ? (
          <span className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 text-justify">
            {link.label}
          </span>
        ) : null
      ) : (
        <span className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 text-justify">
          {link.label}
        </span>
      )}
    </div>
  );
};

export const Logo = ({
  children
}: {
  children: ReactNode;
}) => {
  return <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      {children}
      <div className="whitespace-pre text-base font-medium text-gray-700">Nube personal de formularios</div>
    </div>;
};

export const LogoIcon = ({
  children
}: {
  children: ReactNode;
}) => {
  return <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      {children}
    </div>;
};
