import { useEffect } from 'react';
import { useActiveUsers } from './useActiveUsers';
import { trackCopyClick } from '../utils/trackCopyClick';

// Global metrics tracker that initializes all tracking systems
export const useGlobalMetrics = () => {
  // Initialize active users tracking
  useActiveUsers();

  useEffect(() => {
    // Track page visits and interactions
    const trackPageView = async () => {
      try {
        // You can add additional page view tracking here if needed
        console.log('Page loaded - metrics tracking initialized');
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();

    // Add global copy click tracking to all copy operations
    const handleCopyEvent = () => {
      trackCopyClick();
    };

    // Listen for copy events globally
    document.addEventListener('copy', handleCopyEvent);

    return () => {
      document.removeEventListener('copy', handleCopyEvent);
    };
  }, []);
};