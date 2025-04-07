
import React, { useState, useEffect, createContext, useContext } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';

interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextType>({
  open: false,
  setOpen: () => {},
  animate: true,
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  animate?: boolean;
}

export const Sidebar = ({ children, open, setOpen, animate = true }: SidebarProps) => {
  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      <div className="h-screen flex">
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 240 }}
              exit={{ width: 0 }}
              transition={{ duration: animate ? 0.3 : 0, ease: 'easeInOut' }}
              className="min-h-screen border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              exit={{ width: 0 }}
              transition={{ duration: animate ? 0.3 : 0, ease: 'easeInOut' }}
              className="min-h-screen border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SidebarContext.Provider>
  );
};

interface SidebarBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarBody = ({ children, className = "" }: SidebarBodyProps) => {
  const { open, animate } = useSidebar();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: animate ? 0.3 : 0, ease: 'easeInOut' }}
      className={`flex flex-col h-screen bg-white dark:bg-neutral-900 ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface SidebarLinkProps {
  link: {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
  };
  className?: string;
}

export const SidebarLink = ({ link, className = "" }: SidebarLinkProps) => {
  const { open } = useSidebar();

  return (
    <div
      onClick={link.onClick}
      className={`flex items-center gap-2 py-2 cursor-pointer ${className}`}
    >
      <div className="flex-shrink-0">
        {link.icon}
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="whitespace-nowrap overflow-hidden"
        >
          {link.label}
        </motion.div>
      )}
    </div>
  );
};

interface LogoProps {
  children: React.ReactNode;
}

export const Logo = ({ children }: LogoProps) => {
  return (
    <div className="flex items-center px-4 py-5 h-14 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
};

interface LogoIconProps {
  children: React.ReactNode;
}

export const LogoIcon = ({ children }: LogoIconProps) => {
  return (
    <div className="flex items-center justify-center py-5 h-14 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
};
