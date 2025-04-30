import React, { createContext, useContext, useState, useEffect } from 'react';
import { generalSocketService } from '../services/sockets/general.socket.service';

const LiveDropsContext = createContext();

export const useLiveDrops = () => useContext(LiveDropsContext);

export const LiveDropsProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    const dropCleanup = generalSocketService.onDrop((data) => {
      setDrops(prev => [data.drop, ...prev]);
    });

    return () => {
      dropCleanup();
    };
  }, []);

  // This will be called from the AppContent component
  const setVisibility = (pathname) => {
    // Pages where LiveDrops should be visible
    const visiblePaths = ['/', '/leaderboard', '/boxes', '/box-battles', '/rewards',];
    
    // Pages where LiveDrops should be hidden even if they match a visible path prefix
    const hiddenPaths = ['/box-battles/create'];
    
    // Check if current path is in the list of hidden paths or matches a pattern that should be hidden
    if (hiddenPaths.includes(pathname) || pathname.match(/^\/box-battles\/[^\/]+$/)) {
      setIsVisible(false);
      return;
    }
    
    // Check if current path is in the list of visible paths
    const shouldBeVisible = visiblePaths.some(path => 
      pathname === path || pathname.startsWith(path + '/')
    );
    
    setIsVisible(shouldBeVisible);
  };

  return (
    <LiveDropsContext.Provider value={{ isVisible, setVisibility, isInitialized, drops }}>
      {children}
    </LiveDropsContext.Provider>
  );
};

export default LiveDropsProvider; 