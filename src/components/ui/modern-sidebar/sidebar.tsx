
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SidebarContext } from './context';

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
