import { useEffect } from 'react';

// Hook to enhance client-side security
export const useSecurityHeaders = () => {
  useEffect(() => {
    // Prevent clickjacking - but only in production and with safety checks
    try {
      if (process.env.NODE_ENV === 'production' && window.self !== window.top) {
        // Add a small delay to ensure proper initialization
        setTimeout(() => {
          if (window.top && window.self) {
            window.top.location.href = window.self.location.href;
          }
        }, 100);
      }
    } catch (error) {
      console.warn('Security header initialization error:', error);
    }

    // Add security event listeners
    const handleContextMenu = (e: Event) => {
      // Allow context menu in development
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
      }
    };

    const handleSelectStart = (e: Event) => {
      // Allow text selection in development
      if (process.env.NODE_ENV === 'production') {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return;
        }
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U in production
      if (process.env.NODE_ENV === 'production') {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'u')
        ) {
          e.preventDefault();
        }
      }
    };

    // Apply security measures only in production
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('selectstart', handleSelectStart);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (process.env.NODE_ENV === 'production') {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('selectstart', handleSelectStart);
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);
};