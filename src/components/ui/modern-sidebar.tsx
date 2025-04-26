import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SidebarProps {
  children: React.ReactNode;
}

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
      style={{ width: sidebarWidth }}
    >
      {children}
    </motion.div>
  );
};

export default ModernSidebar;
