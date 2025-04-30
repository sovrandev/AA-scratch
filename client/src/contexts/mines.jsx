import React, { createContext, useContext, useState, useEffect } from "react";
import { minesSocketService } from "../services/sockets/mines.socket.service";
import { useNotification } from "./notification";

/**
 * Context for mines game functionality
 * @type {React.Context}
 */
const MinesContext = createContext(null);

/**
 * Hook for accessing mines game functionality
 * @returns {Object} Mines context
 * @throws {Error} If used outside of MinesProvider
 */
export const useMines = () => {
  const context = useContext(MinesContext);
  if (!context) {
    throw new Error("useMines must be used within a MinesProvider");
  }
  return context;
};

/**
 * Provider component for mines game functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const MinesProvider = ({ children }) => {
  const [game, setGame] = useState(null);
  const notify = useNotification();

  useEffect(() => {
    const gameCleanup = minesSocketService.onInit((gameData) => {
      setGame(gameData.game);
    });
    
    return () => {
      gameCleanup();
    };
  }, []);

  /**
   * Place a bet in the mines game
   * @param {number} amount - Bet amount
   * @param {number} minesCount - Number of mines to place
   * @returns {Promise<Object>} Game data
   * @throws {Error} If bet placement fails
   */
  const placeBet = async (amount, minesCount) => {
    try {
      const response = await minesSocketService.sendBet(amount, minesCount);
      setGame(response.game);
      return response;
    } catch (error) {
      notify.error(error.message || "Failed to place bet");
      throw error;
    }
  };

  /**
   * Reveal a tile in the mines game
   * @param {number} tile - Tile index to reveal
   * @returns {Promise<Object>} Game data
   * @throws {Error} If tile reveal fails
   */
  const revealTile = async (tile) => {
    try {
      const response = await minesSocketService.sendReveal(tile);
      setGame(response.game);
      return response;
    } catch (error) {
      notify.error(error.message || "Failed to reveal tile");
      throw error;
    }
  };

  /**
   * Cash out current winnings in the mines game
   * @returns {Promise<Object>} Game data
   * @throws {Error} If cashout fails
   */
  const cashout = async () => {
    try {
      const response = await minesSocketService.sendCashout();
      setGame(response.game);
      return response;
    } catch (error) {
      notify.error(error.message || "Failed to cash out");
      throw error;
    }
  };

  return (
    <MinesContext.Provider 
      value={{
        game,
        placeBet,
        revealTile,
        cashout,
      }}
    >
      {children}
    </MinesContext.Provider>
  );
};