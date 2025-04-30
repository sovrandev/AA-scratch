import React, { createContext, useContext, useState, useEffect } from 'react';
import { generalSocketService } from '../services/sockets/general.socket.service';
import { useNotification } from './notification';

/**
 * Context for leaderboard-related functionality
 * @type {React.Context}
 */
const LeaderboardContext = createContext(null);

/**
 * Provider component for leaderboard functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const LeaderboardProvider = ({ children }) => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const notify = useNotification();

  /**
   * Fetches leaderboard data from the server
   * @returns {Promise<void>}
   */
  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await generalSocketService.getLeaderboardData();
      if (response.success) {
        setLeaderboard(response.leaderboard);
      } else {
        notify.error(response.error || 'Failed to fetch leaderboard data');
      }
    } catch (error) {
      notify.error(error.message || 'Failed to fetch leaderboard');
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // Set up interval to refresh leaderboard data
    const interval = setInterval(fetchLeaderboard, 1000 * 60 * 5); // Every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  return (
    <LeaderboardContext.Provider value={{ leaderboard, loading, refetch: fetchLeaderboard, isInitialized }}>
      {children}
    </LeaderboardContext.Provider>
  );
};

/**
 * Hook for accessing leaderboard functionality
 * @returns {Object} Leaderboard context
 * @throws {Error} If used outside of LeaderboardProvider
 */
export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
}; 