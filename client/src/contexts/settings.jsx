import React, { createContext, useState, useContext, useEffect } from 'react';
import { generalSocketService } from '../services/sockets/general.socket.service';
import { useNotification } from './notification';

/**
 * Context for application settings
 * @type {React.Context}
 */
const SettingsContext = createContext(null);

/**
 * Hook for accessing application settings
 * @returns {Object} Settings context
 * @throws {Error} If used outside of SettingsProvider
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

/**
 * Provider component for application settings
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const notify = useNotification();

  useEffect(() => {
    // Initialize settings from server
    const initCleanup = generalSocketService.onInit((data) => {
      if (data.settings) {
        setSettings(data.settings);
        setIsInitialized(true);
      } else {
        notify.error('Failed to load application settings');
      }
    });

    // Listen for settings updates
    const settingsCleanup = generalSocketService.onSettingsUpdate((data) => {
      if (data && data.settings) {
        setSettings(data.settings);
      }
    });

    return () => {
      initCleanup();
      settingsCleanup();
    };
  }, [notify]);

  return (
    <SettingsContext.Provider 
      value={{ 
        settings,
        isInitialized
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; 