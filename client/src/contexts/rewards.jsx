import React, { createContext, useContext, useState, useEffect } from 'react';
import { generalSocketService } from '../services/sockets/general.socket.service';
import { useNotification } from './notification';
import { useUser } from './user';

const RewardsContext = createContext(null);

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};

export const RewardsProvider = ({ children }) => {
  const { user, setUser } = useUser();
  const notify = useNotification();

  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState({
    daily: false,
    weekly: false,
    monthly: false,
    box: false
  });
  const [cooldowns, setCooldowns] = useState({
    daily: null,
    weekly: null,
    monthly: null
  });

  const calculateTimeLeft = (lastClaim, cooldownHours) => {
    if (!lastClaim) return null;
    const now = Date.now();
    const timeLeft = (lastClaim + (cooldownHours * 60 * 60 * 1000)) - now;
    return timeLeft > 0 ? timeLeft : null;
  };

  const updateCooldowns = () => {
    if (!user?.rakeback) return;
    
    setCooldowns({
      daily: calculateTimeLeft(user.rakeback.daily?.lastClaim, 24),
      weekly: calculateTimeLeft(user.rakeback.weekly?.lastClaim, 168),
      monthly: calculateTimeLeft(user.rakeback.monthly?.lastClaim, 720)
    });
  };

  useEffect(() => {
    updateCooldowns();
    const timer = setInterval(updateCooldowns, 1000);
    return () => clearInterval(timer);
  }, [user?.rakeback]);

  const getData = async () => {
    try {
      setLoading(prev => ({ ...prev, daily: true }));
      const response = await generalSocketService.getRakebackData();
      setUser(prevUser => ({
        ...prevUser,
        rakeback: response.rakeback,
        level: response.level,
        levelBoxes: response.levelBoxes || {}
      }));
      return response;
    } catch (err) {
      notify.error(err.message);
    } finally {
      setLoading(prev => ({ ...prev, daily: false }));
    }
  };

  const claimRake = async (type) => {
    try {
      setLoading(prev => ({ ...prev, [type]: true }));
      const response = await generalSocketService.sendRakebackClaim(type);
      setUser(prevUser => ({ ...prevUser, ...response.user }));
      return response;
    } catch (err) {
      notify.error(err.message);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    const initializeRewards = async () => {
      try {
        await getData();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize rewards:', error);
        notify.error('Failed to initialize rewards');
      }
    };
    initializeRewards();
  }, []);

  const value = {
    loading,
    rakebackData: user?.rakeback || {},
    levelBoxes: user?.levelBoxes || {},
    cooldowns,
    getData,
    claimRake,
    isInitialized
  };

  return (
    <RewardsContext.Provider value={value}>
      {children}
    </RewardsContext.Provider>
  );
}; 