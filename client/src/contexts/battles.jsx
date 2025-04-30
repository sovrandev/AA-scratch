import React, { createContext, useState, useContext, useEffect } from 'react';
import { battlesSocketService } from '../services/sockets/battles.socket.service';
import { useNotification } from './notification';

/**
 * Context for battles-related functionality
 * @type {React.Context}
 */
const BattlesContext = createContext(null);

/**
 * Hook for accessing battles functionality
 * @returns {Object} Battles context
 * @throws {Error} If used outside of BattlesProvider
 */
export const useBattles = () => {
  const context = useContext(BattlesContext);
  if (!context) {
    throw new Error('useBattles must be used within a BattlesProvider');
  }
  return context;
};

/**
 * Provider component for battles functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const BattlesProvider = ({ children }) => {
  const [battles, setBattles] = useState({ games: [], history: [], boxes: [] });
  const [isInitialized, setIsInitialized] = useState(false);
  const notify = useNotification();

  useEffect(() => {
    // Initialize battles data
    const initCleanup = battlesSocketService.onInit((data) => {
      setBattles(data);
      setIsInitialized(true);
    });

    // Listen for game updates
    const gameCleanup = battlesSocketService.onGame(({ game }) => {
      setBattles(prev => ({
        ...prev,
        games: prev.games.map(g => g._id === game._id ? game : g).concat(
          !prev.games.some(g => g._id === game._id) ? [game] : []
        )
      }));
    });

    return () => {
      initCleanup();
      gameCleanup();
    };
  }, []);

  /**
   * Join a battle
   * @param {string} gameId - Game ID
   * @param {number} slot - Slot number
   * @returns {Promise<Object>} Response data
   * @throws {Error} If joining fails
   */
  const joinBattle = async (gameId, slot) => {
    try {
      const response = await battlesSocketService.sendJoin(gameId, slot);
      return response;
    } catch (error) {
      notify.error(error.message || 'Failed to join battle');
      throw new Error(error.message || 'Failed to join battle');
    }
  };

  /**
   * Call bots to join a battle
   * @param {string} gameId - Game ID
   * @returns {Promise<Object>} Response data
   * @throws {Error} If calling bots fails
   */
  const callBots = async (gameId) => {
    try {
      const response = await battlesSocketService.sendBot(gameId);
      return response;
    } catch (error) {
      notify.error(error.message || 'Failed to call bots');
      throw new Error(error.message || 'Failed to call bots');
    }
  };

  /**
   * Get game data for a specific battle
   * @param {string} gameId - Game ID
   * @returns {Promise<Object>} Game data
   * @throws {Error} If fetching game data fails
   */
  const gameData = async (gameId) => {
    try {
      const response = await battlesSocketService.sendGetGameData(gameId);
      return response;
    } catch (error) {
      notify.error(error.message || 'Failed to fetch game data');
      throw new Error(error.message || 'Failed to fetch game data');
    }
  };

  return (
    <BattlesContext.Provider 
      value={{
        battles,
        isInitialized,
        games: battles.games,
        history: battles.history,
        boxes: battles.boxes,
        joinBattle,
        callBots,
        gameData
      }}
    >
      {children}
    </BattlesContext.Provider>
  );
}; 