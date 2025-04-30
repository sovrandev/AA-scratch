import React, { createContext, useState, useContext, useEffect } from 'react';
import { unboxSocketService } from '../services/sockets/unbox.socket.service';
import { useNotification } from './notification';

/**
 * Context for unboxing functionality
 * @type {React.Context}
 */
const UnboxContext = createContext(null);

/**
 * Hook for accessing unboxing functionality
 * @returns {Object} Unbox context
 * @throws {Error} If used outside of UnboxProvider
 */
export const useUnbox = () => {
  const context = useContext(UnboxContext);
  if (!context) {
    throw new Error('useUnbox must be used within a UnboxProvider');
  }
  return context;
};

/**
 * Provider component for unboxing functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const UnboxProvider = ({ children }) => {
  const [boxes, setBoxes] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const notify = useNotification();

  useEffect(() => {
    // Initialize boxes data
    const initCleanup = unboxSocketService.onInit((data) => {
      if (data.boxes) {
        setBoxes(data.boxes);
        setIsInitialized(true);
      } else {
        notify.error('Failed to load boxes data');
      }
    });

    return () => {
      initCleanup();
    };
  }, [notify]);

  /**
   * Fetches detailed data for a specific box
   * @param {string} boxId - Box ID
   * @returns {Promise<Object>} Box data
   * @throws {Error} If fetching fails
   */
  const getBoxData = async (boxId) => {
    try {
      const response = await unboxSocketService.getBoxData(boxId);

      return response;
    } catch (error) {
      notify.error(error.message || 'Failed to fetch box data');
      throw new Error(error.message || 'Failed to fetch box data');
    }
  };

  /**
   * Opens one or more boxes
   * @param {string} boxId - Box ID
   * @param {number} count - Number of boxes to open
   * @returns {Promise<Object>} Unboxing results
   * @throws {Error} If opening fails
   */
  const openBox = async (boxId, count = 1) => {
    try {
      const response = await unboxSocketService.openBox(boxId, count);
      return response;
    } catch (error) {
      notify.error(error.message || 'Failed to open box');
      throw new Error(error.message || 'Failed to open box');
    }
  };

  return (
    <UnboxContext.Provider 
      value={{
        boxes,
        getBoxData,
        openBox,
        isInitialized
      }}
    >
      {children}
    </UnboxContext.Provider>
  );
}; 