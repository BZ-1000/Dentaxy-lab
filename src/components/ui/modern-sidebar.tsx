
import React, { useEffect, useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Create a context for the sidebar
type SidebarContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export interface SidebarProps {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  open = false,
  setOpen,
  animate = true,
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(open);
  
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (setOpen) setOpen(newState);
  };

  const sidebarVariants = {
    open: {
      width: "280px",
      transition: {
        duration: 0.3
      }
    },
    closed: {
      width: "64px",
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <SidebarContext.Provider value={{ open: isOpen, setOpen: setOpen || setIsOpen }}>
      <motion.div
        className={cn(
          "h-full border-r border-neutral-200 dark:border-neutral-800 flex flex-col",
          className
        )}
        initial={false}
        animate={animate ? (isOpen ? "open" : "closed") : undefined}
        variants={animate ? sidebarVariants : undefined}
        style={!animate ? { width: isOpen ? "280px" : "64px" } : undefined}
      >
        {children}
        <button
          className="absolute right-0 top-[72px] -mr-3 flex h-6 w-6 translate-x-1/2 items-center justify-center rounded-full border bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
          onClick={toggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")}
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </motion.div>
    </SidebarContext.Provider>
  );
};

export interface SidebarBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export const SidebarBody: React.FC<SidebarBodyProps> = ({ 
  children, 
  className 
}) => {
  const { open } = useSidebar();
  
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      {children}
    </div>
  );
};

export interface SidebarLinkProps {
  link: {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  };
  className?: string;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  link, 
  className 
}) => {
  const { open } = useSidebar();
  
  return (
    <button
      onClick={link.onClick}
      className={cn(
        "flex items-center gap-2 py-2 text-sm text-neutral-600 dark:text-neutral-300 transition-colors hover:text-black dark:hover:text-white",
        className
      )}
    >
      {link.icon && <div className="w-5 h-5">{link.icon}</div>}
      {open && <span>{link.label}</span>}
    </button>
  );
};

export interface LogoProps {
  children?: React.ReactNode;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn("flex items-center gap-2 py-5 px-4", className)}>
      {children}
    </div>
  );
};

export interface LogoIconProps {
  children?: React.ReactNode;
  className?: string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn("flex justify-center items-center py-5", className)}>
      {children}
    </div>
  );
};
