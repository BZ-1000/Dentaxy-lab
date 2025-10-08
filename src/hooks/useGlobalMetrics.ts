import { useActiveUsers } from './useActiveUsers';

// Global metrics tracker that initializes all tracking systems
export const useGlobalMetrics = () => {
  // Initialize active users tracking
  useActiveUsers();
};