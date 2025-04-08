
import React from 'react';
import { motion } from 'framer-motion';
import { useSidebar } from './context';

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
