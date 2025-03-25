
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';

interface SidebarProps {
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  animate?: boolean;
}

interface SidebarBodyProps {
  children: ReactNode;
  className?: string;
}

interface SidebarLinkProps {
  link: {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
  };
  className?: string;
}

const Sidebar = ({ children, open, setOpen, animate = true }: SidebarProps) => {
  return (
    <div className="fixed left-0 top-0 h-full z-40">
      <AnimatePresence>
        {open && animate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-30"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={false}
        animate={{ width: open ? 280 : 64 }}
        transition={{ duration: animate ? 0.3 : 0, ease: 'easeInOut' }}
        className="flex flex-col h-full border-r shadow-sm bg-white dark:bg-neutral-900 dark:border-neutral-700 overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  );
};

// Additional components for the sidebar
const SidebarBody = ({ children, className = '' }: SidebarBodyProps) => {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {children}
    </div>
  );
};

const useSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  return { sidebarOpen, setSidebarOpen, toggleSidebar };
};

const SidebarLink = ({ link, className = '' }: SidebarLinkProps) => {
  return (
    <div
      onClick={link.onClick}
      className={`flex items-center py-2 cursor-pointer ${className}`}
    >
      {link.icon && <div className="w-8">{link.icon}</div>}
      <span className="text-sm font-medium">{link.label}</span>
    </div>
  );
};

const Logo = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-center h-16 border-b dark:border-neutral-700">
      {children}
    </div>
  );
};

const LogoIcon = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-center h-16 border-b dark:border-neutral-700">
      {children}
    </div>
  );
};

export { Sidebar, SidebarBody, SidebarLink, Logo, LogoIcon, useSidebar };
