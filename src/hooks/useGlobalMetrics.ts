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
        // Track page view (you can add additional page view tracking here if needed)
        console.log('Page loaded - metrics tracking initialized for:', window.location.href);
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();

    // Note: Individual copy tracking is handled in specific components
    // This avoids duplicate tracking since components already import trackCopyClick
    
  }, []);
};