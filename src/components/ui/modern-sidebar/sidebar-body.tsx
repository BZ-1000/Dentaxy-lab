
import React from 'react';
import { motion } from 'framer-motion';
import { useSidebar } from './context';

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
