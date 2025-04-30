import React, { createContext, useState, useContext, useEffect } from 'react';
import { upgraderSocketService } from '../services/sockets/upgrader.socket.service';
import { useNotification } from './notification';

/**
 * Context for upgrader-related functionality
 * @type {React.Context}
 */
const UpgraderContext = createContext(null);

/**
 * Hook for accessing upgrader functionality
 * @returns {Object} Upgrader context
 * @throws {Error} If used outside of UpgraderProvider
 */
export const useUpgrader = () => {
  const context = useContext(UpgraderContext);
  if (!context) {
    throw new Error('useUpgrader must be used within an UpgraderProvider');
  }
  return context;
};

/**
 * Provider component for upgrader functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const UpgraderProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const notify = useNotification();

  /**
   * Get item list with pagination, search and sort
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {string} params.search - Search query
   * @param {string} params.sort - Sort order ('highest' or 'lowest')
   * @param {number} params.minPrice - Minimum price
   * @param {number} params.maxPrice - Maximum price
   * @returns {Promise<Object>} Response data with items and count
   */
  const getItemList = async (params = {}) => {
    try {
      const { 
        page = 1, 
        search = '', 
        sort = 'highest', 
        minPrice = 0, 
        maxPrice = 4000 
      } = params;

      const response = await upgraderSocketService.getItemList(page, search, sort, minPrice, maxPrice);
      if (response.success) {
        setItems(response.items);
        return response;
      } else {
        // Don't show notification here to avoid double notifications
        throw new Error(response.error.message);
      }
    } catch (error) {
      // Only show notification here if there's no error handling in component
      if (!error.handled) {
        notify.error(error.message || 'Failed to fetch items');
      }
      throw error;
    }
  };

  useEffect(() => {
    // Listen for item updates
    const itemUpdateCleanup = upgraderSocketService.onItemUpdate((data) => {
      setItems(prevItems => {
        const updatedItems = [...prevItems];
        const index = updatedItems.findIndex(item => item.id === data.item.id);
        if (index !== -1) {
          updatedItems[index] = data.item;
        } else {
          updatedItems.push(data.item);
        }
        return updatedItems;
      });
    });

    return () => {
      itemUpdateCleanup();
    };
  }, [notify]);

  /**
   * Send a bet to the upgrader
   * @param {number} amount - Bet amount
   * @param {number} amountPayout - Bet payout amount
   * @param {string} mode - Bet mode ('under' or 'over')
   * @returns {Promise<Object>} Response data
   * @throws {Error} If bet fails
   */
  const sendBet = async (amount, amountPayout, mode) => {
    try {
      const response = await upgraderSocketService.sendBet(amount, amountPayout, mode);
      return response;
    } catch (error) {
      // Only show notification here, not in the component
      notify.error(error.message || 'Failed to place bet');
      
      // Mark error as handled to prevent duplicate notifications
      error.handled = true;
      throw error;
    }
  };

  return (
    <UpgraderContext.Provider 
      value={{
        items,
        loading,
        sendBet,
        getItemList
      }}
    >
      {children}
    </UpgraderContext.Provider>
  );
};
