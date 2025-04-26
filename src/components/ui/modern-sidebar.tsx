
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SidebarProps {
  children: React.ReactNode;
}

// Main ModernSidebar component
const ModernSidebar = ({ children }: SidebarProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(250); // Default width
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Load sidebar width from localStorage or default
    const storedWidth = localStorage.getItem('sidebarWidth');
    if (storedWidth) {
      setSidebarWidth(parseInt(storedWidth, 10));
    }

    // Load collapsed state from localStorage or default
    const storedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (storedCollapsed) {
      setIsCollapsed(storedCollapsed === 'true');
    }
  }, []);

  useEffect(() => {
    // Save sidebar width to localStorage
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());

    // Save collapsed state to localStorage
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
  }, [sidebarWidth, isCollapsed]);
  
  return (
    <motion.div 
      className="fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 shadow-lg z-50"
      style={{ width: isCollapsed ? 80 : sidebarWidth }}
    >
      {children}
    </motion.div>
  );
};

// Sidebar component that wraps the ModernSidebar
export const Sidebar = ({ children, open, setOpen, animate = true }: { 
  children: React.ReactNode; 
  open?: boolean; 
  setOpen?: (open: boolean) => void;
  animate?: boolean;
}) => {
  return <ModernSidebar>{children}</ModernSidebar>;
};

// SidebarBody component
export const SidebarBody = ({ children, className = "" }: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col h-screen p-4 ${className}`}>
      {children}
    </div>
  );
};

// SidebarLink component
export const SidebarLink = ({ 
  link, 
  className = "" 
}: { 
  link: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
  className?: string;
}) => {
  return (
    <button 
      onClick={link.onClick}
      className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
    >
      {link.icon}
      <span>{link.label}</span>
    </button>
  );
};

// Logo component
export const Logo = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center p-2 mb-4">
      {children}
    </div>
  );
};

// LogoIcon component for collapsed state
export const LogoIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center p-2 mb-4">
      {children}
    </div>
  );
};

// Custom hook for sidebar
export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };
  
  return { isOpen, setIsOpen, toggleSidebar };
};

export default ModernSidebar;
