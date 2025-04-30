import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authApi from '../services/auth.api';
import { 
  authenticateSockets,
  disconnectSockets,
  refreshSockets
} from '../services/websocket.service';
import { generalSocketService } from '../services/sockets/general.socket.service';
import { useNotification } from './notification';

// Create context first
const UserContext = createContext(null);

// Define hook before provider
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within an UserProvider');
  }
  return context;
};

// Then define the provider
export const UserProvider = ({ children }) => {
  const notify = useNotification();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [socketsReady, setSocketsReady] = useState(false);
  
  // Add affiliate state
  const [affiliateData, setAffiliateData] = useState(null);
  const [referredUsers, setReferredUsers] = useState([]);
  const [affiliateLoading, setAffiliateLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  
  // Add new state for history data
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [battleHistory, setBattleHistory] = useState([]);
  const [boxHistory, setBoxHistory] = useState([]);
  const [upgraderHistory, setUpgraderHistory] = useState([]);
  const [minesHistory, setMinesHistory] = useState([]);
  
  // Add seed history state
  const [seedHistory, setSeedHistory] = useState([]);
  const [currentSeed, setCurrentSeed] = useState(null);
  const [nextSeed, setNextSeed] = useState(null);
  const [seedHistoryLoading, setSeedHistoryLoading] = useState(false);
  const [seedHistoryCount, setSeedHistoryCount] = useState(0);
  
  // Add state for pagination
  const [depositsCount, setDepositsCount] = useState(0);
  const [withdrawalsCount, setWithdrawalsCount] = useState(0);
  const [battleHistoryCount, setBattleHistoryCount] = useState(0);
  const [boxHistoryCount, setBoxHistoryCount] = useState(0);
  const [upgraderHistoryCount, setUpgraderHistoryCount] = useState(0);
  const [minesHistoryCount, setMinesHistoryCount] = useState(0);

  // Add loading states
  const [depositsLoading, setDepositsLoading] = useState(false);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(false);
  const [battleHistoryLoading, setBattleHistoryLoading] = useState(false);
  const [boxHistoryLoading, setBoxHistoryLoading] = useState(false);
  const [upgraderHistoryLoading, setUpgraderHistoryLoading] = useState(false);
  const [minesHistoryLoading, setMinesHistoryLoading] = useState(false);

  // Add methods to fetch history data
  const fetchDeposits = async (page = 1) => {
    try {
      setDepositsLoading(true);
      const response = await generalSocketService.getUserDeposits(page);
      setDeposits(response.deposits);
      setDepositsCount(response.count);
    } catch (error) {
      notify.error(error.message || 'Failed to fetch deposits');
    } finally {
      setDepositsLoading(false);
    }
  };

  const fetchWithdrawals = async (page = 1) => {
    try {
      setWithdrawalsLoading(true);
      const response = await generalSocketService.getUserWithdrawals(page);
      setWithdrawals(response.withdrawals);
      setWithdrawalsCount(response.count);
    } catch (error) {
      notify.error(error.message || 'Failed to fetch withdrawals');
    } finally {
      setWithdrawalsLoading(false);
    }
  };

  const fetchBattleHistory = async (page = 1) => {
    try {
      setBattleHistoryLoading(true);
      const response = await generalSocketService.getUserBattleHistory(page);
      setBattleHistory(response.battles);
      setBattleHistoryCount(response.count);
    } catch (error) {
      notify.error(error.message || 'Failed to fetch battle history');
    } finally {
      setBattleHistoryLoading(false);
    }
  };

  const fetchBoxHistory = async (page = 1) => {
    try {
      setBoxHistoryLoading(true);
      const response = await generalSocketService.getUserBoxHistory(page);
      setBoxHistory(response.boxes);
      setBoxHistoryCount(response.count);
    } catch (error) {
      notify.error(error.message || 'Failed to fetch box history');
    } finally {
      setBoxHistoryLoading(false);
    }
  };

  const fetchUpgraderHistory = async (page = 1) => {
    try {
      setUpgraderHistoryLoading(true);
      const response = await generalSocketService.getUserUpgraderHistory(page);
      setUpgraderHistory(response.upgrades);
      setUpgraderHistoryCount(response.count);
    } catch (error) {
      notify.error(error.message || 'Failed to fetch upgrader history');
    } finally {
      setUpgraderHistoryLoading(false);
    }
  };

  const fetchMinesHistory = async (page = 1) => {
    try {
      setMinesHistoryLoading(true);
      const response = await generalSocketService.getUserMinesHistory(page);
      setMinesHistory(response.mines);
      setMinesHistoryCount(response.count);
    } catch (error) {
      notify.error(error.message || 'Failed to fetch mines history');
    } finally {
      setMinesHistoryLoading(false);
    }
  };

  // Add seed history methods
  const fetchCurrentSeed = useCallback(async () => {
    try {
      setSeedHistoryLoading(true);
      const response = await generalSocketService.getUserSeed();
      if (response.success) {
        setCurrentSeed(response.current);
        setNextSeed(response.next);
      }
    } catch (error) {
      notify.error(error.message || 'Failed to fetch current seed');
    } finally {
      setSeedHistoryLoading(false);
    }
  }, [notify]);

  const fetchSeedHistory = useCallback(async (page = 1) => {
    try {
      setSeedHistoryLoading(true);
      const response = await generalSocketService.getUserSeedHistory(page);
      if (response.success) {
        setSeedHistory(response.history);
        setSeedHistoryCount(response.count);
      }
    } catch (error) {
      notify.error(error.message || 'Failed to fetch seed history');
    } finally {
      setSeedHistoryLoading(false);
    }
  }, [notify]); // Empty dependency array since it doesn't depend on any props or state

  const updateClientSeed = useCallback(async (seed) => {
    try {
      setSeedHistoryLoading(true);
      const response = await generalSocketService.sendUserSeed(seed);
      if (response.success) {
        setCurrentSeed(response.seed);
        setNextSeed(response.next);
        await fetchSeedHistory(1);
        notify.success('Client seed updated successfully');
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.message || 'Failed to update client seed');
      return false;
    } finally {
      setSeedHistoryLoading(false);
    }
  }, [notify, fetchSeedHistory]);

  // Add affiliate methods
  const fetchAffiliateData = async () => {
    try {
      setAffiliateLoading(true);
      const response = await generalSocketService.getAffiliateData();
      setAffiliateData(response.data);
      setReferredUsers(response.referred);
    } catch (error) {
      notify.error(error.message || 'Failed to fetch affiliate data');
    } finally {
      setAffiliateLoading(false);
    }
  };

  const setAffiliateCode = async (code) => {
    try {
      setAffiliateLoading(true);
      const response = await generalSocketService.sendAffiliateCode(code);
      setAffiliateData(response.data);
      notify.success('Affiliate code set successfully');
      return true;
    } catch (error) {
      notify.error(error.message || 'Failed to set affiliate code');
      return false;
    } finally {
      setAffiliateLoading(false);
    }
  };

  const claimAffiliateCode = async (code, captcha) => {
    try {
      setAffiliateLoading(true);
      const response = await generalSocketService.sendAffiliateClaimCode({ code, captcha });
      setUser(prevUser => ({
        ...prevUser,
        ...response.user,
      }));
      notify.success('Affiliate code claimed successfully');
      return true;
    } catch (error) {
      notify.error(error.message || 'Failed to claim affiliate code');
      return false;
    } finally {
      setAffiliateLoading(false);
    }
  };

  const claimAffiliateEarnings = async () => {
    try {
      setClaimLoading(true);
      const response = await generalSocketService.sendAffiliateClaimEarnings();
      setUser(prevUser => ({
        ...prevUser,
        ...response.user,
      }));
      notify.success('Affiliate earnings claimed successfully');
      return true;
    } catch (error) {
      notify.error(error.message || 'Failed to claim affiliate earnings');
      return false;
    } finally {
      setClaimLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      try {
        disconnectSockets();
        
        if (storedToken) {
          authenticateSockets(storedToken);
          
          const response = await authApi.me();
          setUser(response.user);
        }
      } catch (error) {
        localStorage.removeItem('token');
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initAuth();

    return () => {
      disconnectSockets();
    };
  }, []);

  useEffect(() => {
    if (!socketsReady) return;

    const userUpdateCleanup = generalSocketService.onUserUpdate((data) => {
      if (data && data.user) {
        setUser(prevUser => ({
          ...prevUser,
          ...data.user,
          rakeback: data.user.rakeback || prevUser?.rakeback,
          levelBoxes: data.user.levelBoxes || prevUser?.levelBoxes
        }));
      }
    });

    return () => {
      userUpdateCleanup();
    };
  }, [socketsReady]);

  const login = async (data) => {
    localStorage.setItem('token', data.token);
    
    disconnectSockets();
    
    authenticateSockets(data.token);
    
    setUser({
      ...data.user,
      rakeback: data.user.rakeback || {},
      levelBoxes: data.user.levelBoxes || []
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    refreshSockets();
  };

  const getLevel = (inputUser) => {
    if(!inputUser) inputUser = user;
    const level = Math.floor(Math.pow(inputUser.xp / 0.8, 1 / 3));
    return level >= 100 ? 100 : level;
  }

  return (
    <UserContext.Provider 
      value={{
        user,
        setUser,
        getLevel,
        loading,
        isInitialized,
        socketsReady,
        isAuthenticated: !!user,
        login,
        logout,
        // Add seed history data and methods
        seedHistory,
        currentSeed,
        nextSeed,
        seedHistoryLoading,
        seedHistoryCount,
        fetchCurrentSeed,
        fetchSeedHistory,
        updateClientSeed,
        // Add affiliate data and methods
        affiliateData,
        referredUsers,
        affiliateLoading,
        fetchAffiliateData,
        setAffiliateCode,
        claimAffiliateCode,
        claimAffiliateEarnings,
        // Add new history data and methods
        deposits,
        withdrawals,
        battleHistory,
        boxHistory,
        upgraderHistory,
        minesHistory,
        depositsCount,
        withdrawalsCount,
        battleHistoryCount,
        boxHistoryCount,
        upgraderHistoryCount,
        minesHistoryCount,
        depositsLoading,
        withdrawalsLoading,
        battleHistoryLoading,
        boxHistoryLoading,
        upgraderHistoryLoading,
        minesHistoryLoading,
        claimLoading,
        fetchDeposits,
        fetchWithdrawals,
        fetchBattleHistory,
        fetchBoxHistory,
        fetchUpgraderHistory,
        fetchMinesHistory
      }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
}; 