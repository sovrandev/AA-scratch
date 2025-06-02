import React, { createContext, useContext, useState } from 'react';
import { adminSocketService } from '../services/sockets/admin.socket.service';
import { useNotification } from './notification';

/**
 * Context for admin-related functionality
 * @type {React.Context}
 */
const AdminContext = createContext(null);

/**
 * Provider component for admin functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AdminProvider = ({ children }) => {
  const notify = useNotification();
  const [loading, setLoading] = useState(false);

  /**
   * Fetches all leaderboards
   * @returns {Promise<Array>} List of leaderboards
   */
  const getLeaderboards = async () => {
    try {
      setLoading(true);
      const response = await adminSocketService.getLeaderboardList(1, '');
      return response.leaderboards;
    } catch (error) {
      notify.error(error.message || 'Failed to fetch leaderboards');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates a new leaderboard
   * @param {Object} data - Leaderboard data
   * @returns {Promise<Object|null>} Created leaderboard or null on failure
   */
  const createLeaderboard = async (data) => {
    try {
      const response = await adminSocketService.createLeaderboard(data);
      if (response.success) {
        notify.success('Leaderboard created successfully');
        return response.leaderboard;
      }
      return null;
    } catch (error) {
      notify.error(error.message || 'Failed to create leaderboard');
      return null;
    }
  };

  /**
   * Stops an active leaderboard
   * @param {string} leaderboardId - ID of the leaderboard to stop
   * @returns {Promise<boolean>} Success status
   */
  const stopLeaderboard = async (leaderboardId) => {
    try {
      const response = await adminSocketService.stopLeaderboard(leaderboardId);
      if (response.success) {
        notify.success('Leaderboard stopped successfully');
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to stop leaderboard');
      return false;
    }
  };

  /**
   * Fetches users with pagination and search
   * @param {number} page - Page number
   * @param {string} search - Search query
   * @param {string} sort - Sort method
   * @returns {Promise<Array>} List of users
   */
  const getUsers = async (page = 1, search = '', sort = 'newest') => {
    try {
      setLoading(true);
      const response = await adminSocketService.getUserList(page, search, sort);
      return response.users;
    } catch (error) {
      notify.error(error.message || 'Failed to fetch users');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates a user setting
   * @param {string} userId - User ID
   * @param {string} setting - Setting name
   * @param {any} value - New setting value
   * @returns {Promise<Object|null>} Updated user or null on failure
   */
  const updateUserValue = async (userId, setting, value) => {
    try {
      const response = await adminSocketService.sendUserValue(userId, setting, value);
      if (response.success) {
        notify.success('User updated successfully');
        return response.user;
      }
      return null;
    } catch (error) {
      notify.error(error.message || 'Failed to update user');
      return null;
    }
  };

  /**
   * Updates a user's balance
   * @param {string} userId - User ID
   * @param {number} balance - New balance
   * @returns {Promise<void>}
   */
  const updateUserBalance = async (userId, balance) => {
    try {
      const response = await adminSocketService.sendUserBalance(userId, balance);
      notify.success(response.success?.message || 'Balance updated successfully');
    } catch (error) {
      notify.error(error.message || 'Failed to update balance');
    }
  };

  /**
   * Updates a site setting
   * @param {string} setting - Setting name
   * @param {any} value - New setting value
   * @returns {Promise<void>}
   */
  const updateSetting = async (setting, value) => {
    try {
      await adminSocketService.sendSettingValue(setting, value);
      notify.success('Setting updated successfully');
    } catch (error) {
      notify.error(error.message || 'Failed to update setting');
    }
  };

  /**
   * Fetches boxes with pagination and search
   * @param {number} page - Page number
   * @param {string} search - Search query
   * @returns {Promise<Object>} Boxes, items and count
   */
  const getBoxes = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await adminSocketService.getBoxList(page, search);
      return {
        boxes: response.boxes,
        items: response.items,
        count: response.count
      };
    } catch (error) {
      notify.error(error.message || 'Failed to fetch boxes');
      return { boxes: [], items: [], count: 0 };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates a new box
   * @param {Object} boxData - Box data
   * @returns {Promise<Object|null>} Created box or null on failure
   */
  const createBox = async (boxData) => {
    try {
      const response = await adminSocketService.sendBoxCreate({
        name: boxData.name,
        price: boxData.price,
        image: boxData.image,
        categories: boxData.categories,
        type: boxData.type || 'paid',
        levelMin: boxData.levelMin || 0,
        items: boxData.items
      });
      if (response.success) {
        notify.success('Box created successfully');
        return response.box;
      }
    } catch (error) {
      notify.error(error.message);
      return null;
    }
  };

  /**
   * Removes a box
   * @param {string} boxId - Box ID
   * @returns {Promise<boolean>} Success status
   */
  const removeBox = async (boxId) => {
    try {
      const response = await adminSocketService.sendBoxRemove({ boxId });
      if (response.success) {
        notify.success('Box removed successfully');
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to remove box');
      return false;
    }
  };

  /**
   * Fetches filters with pagination and search
   * @param {number} page - Page number
   * @param {string} search - Search query
   * @returns {Promise<Object>} Filters and count
   */
  const getFilters = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await adminSocketService.getFilterList(page, search);
      return {
        filters: response.filters,
        count: response.count
      };
    } catch (error) {
      notify.error(error.message || 'Failed to fetch filters');
      return { filters: [], count: 0 };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates a new filter
   * @param {string} phrase - Filter phrase
   * @returns {Promise<Object|null>} Created filter or null on failure
   */
  const createFilter = async (phrase) => {
    try {
      const response = await adminSocketService.sendFilterCreate({ phrase });
      if (response.success) {
        notify.success('Filter created successfully');
        return response.filter;
      }
      return null;
    } catch (error) {
      notify.error(error.message || 'Failed to create filter');
      return null;
    }
  };

  /**
   * Removes a filter
   * @param {string} filterId - Filter ID
   * @returns {Promise<boolean>} Success status
   */
  const removeFilter = async (filterId) => {
    try {
      const response = await adminSocketService.sendFilterRemove({ filterId });
      if (response.success) {
        notify.success('Filter removed successfully');
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to remove filter');
      return false;
    }
  };

  /**
   * Fetches admin statistics
   * @returns {Promise<Object|null>} Stats data or null on failure
   */
  const getStats = async () => {
    try {
      setLoading(true);
      const response = await adminSocketService.getStatsData();
      return response.stats;
    } catch (error) {
      notify.error(error.message || 'Failed to fetch stats');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches promo codes with pagination and search
   * @param {number} page - Page number
   * @param {string} search - Search query
   * @returns {Promise<Array>} List of promo codes
   */
  const getPromos = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await adminSocketService.getPromoList(page, search);
      if (response.success) {
        return response.promos;
      }
      return [];
    } catch (error) {
      notify.error(error.message || 'Failed to fetch promo codes');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates a new promo code
   * @param {Object} data - Promo code data
   * @returns {Promise<boolean>} Success status
   */
  const createPromo = async (data) => {
    try {
      const response = await adminSocketService.createPromo({
        code: data.code,
        reward: parseFloat(data.reward),
        redeemptionsMax: parseInt(data.maxUses)
      });
      if (response.success) {
        notify.success('Promo code created successfully');
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to create promo code');
      return false;
    }
  };

  /**
   * Removes a promo code
   * @param {string} promoId - Promo code ID
   * @returns {Promise<boolean>} Success status
   */
  const removePromo = async (promoId) => {
    try {
      const response = await adminSocketService.removePromo({ promoId });
      if (response.success) {
        notify.success('Promo code removed successfully');
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to remove promo code');
      return false;
    }
  };

  /**
   * Fetches transactions with pagination, search and type filter
   * @param {number} page - Page number
   * @param {string} search - Search query
   * @param {string} type - Transaction type
   * @returns {Promise<Array>} List of transactions
   */
  const getTransactions = async (page = 1, search = '', type = 'all') => {
    try {
      setLoading(true);
      const response = await adminSocketService.getTransactionList(page, search, type);
      if (response.success) {
        return response.transactions;
      }
      notify.error(response.error || 'Failed to load transactions');
      return [];
    } catch (error) {
      notify.error(error.message || 'Failed to fetch transactions');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Approves a transaction
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<boolean>} Success status
   */
  const approveTransaction = async (transactionId) => {
    try {
      const response = await adminSocketService.approveTransaction(transactionId);
      if (response.success) {
        notify.success('Transaction approved successfully');
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to approve transaction');
      return false;
    }
  };

  /**
   * Rejects a transaction
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<boolean>} Success status
   */
  const rejectTransaction = async (transactionId) => {
    try {
      const response = await adminSocketService.rejectTransaction(transactionId);
      if (response.success) {
        notify.success('Transaction rejected successfully');
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to reject transaction');
      return false;
    }
  };

  /**
   * Fetches ledger transactions with filters and pagination
   * @param {number} page - Page number
   * @param {Array} filters - Array of transaction types to include
   * @param {string} search - Search query
   * @returns {Promise<Object>} Transactions and count
   */
  const getLedgerTransactions = async (page = 1, filters = [], search = '') => {
    try {
      setLoading(true);
      const response = await adminSocketService.getLedgerTransactions(page, filters, search);
      return {
        transactions: response.transactions,
        count: response.count
      };
    } catch (error) {
      notify.error(error.message || 'Failed to fetch ledger transactions');
      return { transactions: [], count: 0 };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches ledger balances
   * @returns {Promise<Object>} Balances object
   */
  const getLedgerBalances = async () => {
    try {
      setLoading(true);
      const response = await adminSocketService.getLedgerBalances();
      return response.balances;
    } catch (error) {
      notify.error(error.message || 'Failed to fetch ledger balances');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches wallet balances
   * @returns {Promise<Array>} Wallet balances
   */
  const getWalletBalances = async () => {
    try {
      setLoading(true);
      const response = await adminSocketService.getWalletBalances();
      return response.wallets;
    } catch (error) {
      notify.error(error.message || 'Failed to fetch wallet balances');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates a wallet address
   * @param {string} currency - Currency code
   * @param {string} address - Wallet address
   * @returns {Promise<boolean>} Success status
   */
  const updateWalletAddress = async (currency, address) => {
    try {
      const response = await adminSocketService.updateWalletAddress(currency, address);
      if (response.success) {
        notify.success('Wallet address updated successfully');
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to update wallet address');
      return false;
    }
  };

  /**
   * Syncs wallet balances with payment provider
   * @returns {Promise<boolean>} Success status
   */
  const syncWalletBalances = async () => {
    try {
      const response = await adminSocketService.syncWalletBalances();
      if (response.success) {
        notify.success('Wallet balances synced successfully');
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to sync wallet balances');
      return false;
    }
  };

  /**
   * Gets all streamers with pagination
   * @param {number} page - Page number
   * @param {string} search - Search keyword
   * @param {string} sort - Sort field
   * @returns {Promise<Object>} Streamers data
   */
  const getStreamers = async (page = 1, search = '', sort = 'username') => {
    setLoading(true);
    try {
      const response = await adminSocketService.getStreamers(page, search, sort);
      if (response.success) {
        return {
          streamers: response.streamers,
          totalCount: response.totalCount
        };
      }
      return null;
    } catch (error) {
      notify.error(error.message || 'Failed to fetch streamers');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gets stats for a specific streamer
   * @param {string} streamerId - Streamer ID
   * @returns {Promise<Object>} Streamer stats
   */
  const getStreamerStats = async (streamerId) => {
    setLoading(true);
    try {
      const response = await adminSocketService.getStreamerStats(streamerId);
      if (response.success) {
        return response.stats;
      }
      return null;
    } catch (error) {
      notify.error(error.message || 'Failed to fetch streamer stats');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates a streamer's active status
   * @param {string} streamerId - Streamer ID
   * @param {boolean} status - New status
   * @returns {Promise<boolean>} Success status
   */
  const updateStreamerStatus = async (streamerId, status) => {
    try {
      const response = await adminSocketService.updateStreamerStatus(streamerId, status);
      if (response.success) {
        notify.success(`Streamer ${status ? 'activated' : 'deactivated'} successfully`);
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to update streamer status');
      return false;
    }
  };

  /**
   * Fetches affiliates with pagination, search and sort
   * @param {number} page - Page number
   * @param {string} search - Search query
   * @param {string} sort - Sort method
   * @returns {Promise<Array|null>} List of affiliates or null on failure
   */
  const getAffiliates = async (page, search, sort) => {
    try {
      const response = await adminSocketService.getAffiliateList(page, search, sort);
      if (response.success) {
        return response.affiliates;
      }
      notify.error(response.error?.message || 'Failed to load affiliates');
      return null;
    } catch (error) {
      notify.error(error.message || 'Failed to load affiliates');
      return null;
    }
  };

  /**
   * Blocks or unblocks an affiliate
   * @param {string} userId - User ID
   * @param {boolean} block - Whether to block or unblock
   * @returns {Promise<boolean>} Success status
   */
  const blockAffiliate = async (userId, block) => {
    try {
      const response = await adminSocketService.sendAffiliateBlock({ userId, block });
      if (response.success) {
        notify.info(`Affiliate ${block ? 'blocked' : 'unblocked'} successfully`);
        return true;
      }
      notify.error(response.error?.message || `Failed to ${block ? 'block' : 'unblock'} affiliate`);
      return false;
    } catch (error) {
      notify.error(error.message || `Failed to ${block ? 'block' : 'unblock'} affiliate`);
      return false;
    }
  };

  /**
   * Clears affiliate data
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  const clearAffiliate = async (userId) => {
    try {
      const response = await adminSocketService.sendAffiliateClear({ userId });
      if (response.success) {
        notify.info('Affiliate data cleared successfully');
        return true;
      }
      notify.error(response.error?.message || 'Failed to clear affiliate data');
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to clear affiliate data');
      return false;
    }
  };

  /**
   * Updates an affiliate code
   * @param {string} userId - User ID
   * @param {string} code - New affiliate code
   * @returns {Promise<boolean>} Success status
   */
  const updateAffiliateCode = async (userId, code) => {
    try {
      const response = await adminSocketService.sendAffiliateCode({ userId, code });
      if (response.success) {
        notify.info('Affiliate code updated successfully');
        return true;
      }
      notify.error(response.error?.message || 'Failed to update affiliate code');
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to update affiliate code');
      return false;
    }
  };

  /**
   * Updates available affiliate amount
   * @param {string} userId - User ID
   * @param {number} amount - New available amount
   * @returns {Promise<boolean>} Success status
   */
  const updateAffiliateAvailable = async (userId, amount) => {
    try {
      const response = await adminSocketService.sendAffiliateAvailable({ userId, amount });
      if (response.success) {
        notify.info('Available amount updated successfully');
        return true;
      }
      notify.error(response.error?.message || 'Failed to update available amount');
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to update available amount');
      return false;
    }
  };

  /**
   * Updates affiliate settings
   * @param {Object} settings - Affiliate settings
   * @returns {Promise<boolean>} Success status
   */
  const updateAffiliateSettings = async (settings) => {
    try {
      const response = await adminSocketService.updateAffiliateSettings(settings);
      if (response.success) {
        notify.info('Settings updated successfully');
        return true;
      }
      notify.error(response.error?.message || 'Failed to update settings');
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to update settings');
      return false;
    }
  };

  /**
   * Fetches limited items with pagination and search
   * @param {number} page - Page number
   * @param {string} search - Search query
   * @returns {Promise<Array>} List of limited items
   */
  const getLimitedItems = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await adminSocketService.getLimitedItems(page, search);
      if (response.success) {
        return {
          items: response.items,
          pages: response.pages
        };
      }
      return { items: [], pages: 0 };
    } catch (error) {
      notify.error(error.message || 'Failed to fetch limited items');
      return { items: [], pages: 0 };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates a new limited item
   * @param {Object} data - Limited item data
   * @returns {Promise<Object|null>} Created item or null on failure
   */
  const createLimitedItem = async (data) => {
    try {
      const response = await adminSocketService.sendLimitedItemCreate({
        name: data.name,
        price: data.price,
        imageUrl: data.imageUrl
      });
      if (response.success) {
        notify.success('Limited item created successfully');
        return response.item;
      }
      return null;
    } catch (error) {
      notify.error(error.message || 'Failed to create limited item');
      return null;
    }
  };

  /**
   * Updates a limited item
   * @param {string} itemId - Item ID
   * @param {Object} data - Updated item data
   * @returns {Promise<Object|null>} Updated item or null on failure
   */
  const updateLimitedItem = async (itemId, data) => {
    try {
      const response = await adminSocketService.sendLimitedItemUpdate({
        itemId,
        name: data.name,
        price: data.price,
        imageUrl: data.imageUrl
      });
      if (response.success) {
        notify.success('Limited item updated successfully');
        return response.item;
      }
      return null;
    } catch (error) {
      notify.error(error.message || 'Failed to update limited item');
      return null;
    }
  };

  /**
   * Deletes a limited item
   * @param {string} itemId - Item ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteLimitedItem = async (itemId) => {
    try {
      const response = await adminSocketService.sendLimitedItemRemove({ itemId });
      if (response.success) {
        notify.success('Limited item deleted successfully');
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to delete limited item');
      return false;
    }
  };

  const value = {
    loading,
    // Leaderboard
    getLeaderboards,
    createLeaderboard,
    stopLeaderboard,
    // Users
    getUsers,
    updateUserValue,
    updateUserBalance,
    // Settings
    updateSetting,
    // Boxes
    getBoxes,
    createBox,
    removeBox,
    // Filters
    getFilters,
    createFilter,
    removeFilter,
    // Stats
    getStats,
    // Promos
    getPromos,
    createPromo,
    removePromo,
    // Transactions
    getTransactions,
    approveTransaction,
    rejectTransaction,
    // Ledger
    getLedgerTransactions,
    getLedgerBalances,
    getWalletBalances,
    updateWalletAddress,
    syncWalletBalances,
    // Streamers
    getStreamers,
    getStreamerStats,
    updateStreamerStatus,
    // Affiliates
    getAffiliates,
    blockAffiliate,
    clearAffiliate,
    updateAffiliateCode,
    updateAffiliateAvailable,
    updateAffiliateSettings,
    // Limited Items
    getLimitedItems,
    createLimitedItem,
    updateLimitedItem,
    deleteLimitedItem,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

/**
 * Hook for accessing admin functionality
 * @returns {Object} Admin context
 * @throws {Error} If used outside of AdminProvider
 */
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}; 