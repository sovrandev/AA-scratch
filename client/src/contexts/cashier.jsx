import React, { createContext, useState, useContext, useEffect } from 'react';
import { cashierSocketService } from '../services/sockets/cashier.socket.service';
import { useSettings } from './settings';
import { useNotification } from './notification';

/**
 * Context for cashier-related functionality
 * @type {React.Context}
 */
const CashierContext = createContext(null);

/**
 * Hook for accessing cashier functionality
 * @returns {Object} Cashier context
 * @throws {Error} If used outside of CashierProvider
 */
export const useCashier = () => {
  const context = useContext(CashierContext);
  if (!context) {
    throw new Error('useCashier must be used within a CashierProvider');
  }
  return context;
};

/**
 * Provider component for cashier functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const CashierProvider = ({ children }) => {
  const { settings } = useSettings();
  const notify = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('deposit');
  const [cryptoData, setCryptoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState([]);

  /**
   * Fetch crypto data for deposits and withdrawals
   * @returns {Promise<void>}
   */
  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const response = await cashierSocketService.getCryptoData();
      if (response.success) {
        setCryptoData(response.data);

        console.log(response.data);
        
        // Set pending transactions from data if available
        if (response.data.transactions) {
          const pending = response.data.transactions.filter(
            tx => tx.type === 'deposit' && tx.state === 'pending'
          );
          setPendingTransactions(pending);
        }
      } else {
        notify.error(response.error || 'Failed to fetch crypto data');
      }
    } catch (error) {
      notify.error(error.message || 'Error fetching crypto data');
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle deposit requests
   * @param {string} method - Deposit method (crypto, credit, gift)
   * @param {number|string} amount - Deposit amount or gift code
   * @param {string} [currency] - Cryptocurrency for crypto deposits
   * @returns {Promise<Object>} Response data
   * @throws {Error} If deposit fails
   */
  const handleDeposit = async (method, amount, currency) => {
    setLoading(true);
    try {
      let response;
      switch (method) {
        case 'crypto':
          // For crypto deposits, we'll need to handle address generation
          response = await cashierSocketService.getCryptoData();
          break;
        case 'credit':
          response = await cashierSocketService.sendCreditDeposit(amount);
          break;
        case 'gift':
          response = await cashierSocketService.sendGiftRedeem(amount); // amount is the gift code in this case
          break;
        default:
          throw new Error('Invalid deposit method');
      }
      return response;
    } catch (error) {
      notify.error(error.message || `Failed to process ${method} deposit`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle withdrawal requests
   * @param {string} method - Withdrawal method (crypto)
   * @param {number} amount - Withdrawal amount
   * @param {Object} [data] - Additional data for withdrawal
   * @param {string} [data.currency] - Cryptocurrency
   * @param {string} [data.address] - Wallet address
   * @returns {Promise<Object>} Response data
   * @throws {Error} If withdrawal fails
   */
  const handleWithdraw = async (method, amount, data = {}) => {
    setLoading(true);
    try {
      let response;
      switch (method) {
        case 'crypto':
          response = await cashierSocketService.sendCryptoWithdraw(
            data.currency,
            data.address,
            amount
          );
          break;
        default:
          throw new Error('Invalid withdrawal method');
      }
      return response;
    } catch (error) {
      notify.error(error.message || `Failed to process ${method} withdrawal`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch crypto data when modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchCryptoData();
    }
  }, [isOpen]);

  // Listen for transaction updates
  useEffect(() => {
    const cleanup = cashierSocketService.onTransaction((data) => {
      // Display notification based on status
      if (data.status && data.message) {
        switch (data.status) {
          case 'pending':
            notify.info(data.message);
            break;
          case 'confirming':
            notify.info(data.message);
            break;
          case 'completed':
            notify.success(data.message);
            break;
          case 'failed':
            notify.error(data.message);
            break;
          default:
            // For other statuses or backward compatibility
            break;
        }
      }

      // Update relevant state based on transaction type
      if (data.transaction) {
        const { transaction } = data;
        
        // For deposits
        if (transaction.type === 'deposit') {
          if (transaction.state === 'pending') {
            // Add to pending transactions if not already there
            setPendingTransactions(prev => {
              const exists = prev.some(tx => tx._id === transaction._id);
              if (!exists) {
                return [...prev, transaction];
              }
              return prev;
            });
          } else if (transaction.state === 'completed') {
            // Remove from pending transactions if it was there
            setPendingTransactions(prev => 
              prev.filter(tx => tx._id !== transaction._id)
            );
          }
          
          // Update transactions in cryptoData
          setCryptoData(prev => {
            if (!prev || !prev.transactions) return prev;
            
            // Replace if exists, otherwise add
            const transactions = prev.transactions.some(tx => tx._id === transaction._id)
              ? prev.transactions.map(tx => tx._id === transaction._id ? transaction : tx)
              : [...prev.transactions, transaction];
              
            return { ...prev, transactions };
          });
        }
      }
    });

    return () => cleanup();
  }, [notify]);

  return (
    <CashierContext.Provider
      value={{
        isOpen,
        setIsOpen,
        activeTab,
        setActiveTab,
        cryptoData,
        loading,
        settings,
        pendingTransactions,
        handleDeposit,
        handleWithdraw,
        fetchCryptoData
      }}
    >
      {children}
    </CashierContext.Provider>
  );
};
