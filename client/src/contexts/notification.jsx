import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { makeStyles } from '@material-ui/core';
import { useSound } from './sound';

/**
 * Context for notification functionality
 * @type {React.Context}
 */
const NotificationContext = createContext(null);

/**
 * SVG icons for different notification types
 */
const icons = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none"><g clipPath="url(#clip0_680_6950)"><path d="M14.5 0C6.50446 0 0 6.50446 0 14.5C0 22.4955 6.50446 29 14.5 29C22.4955 29 29 22.4955 29 14.5C29 6.50446 22.4955 0 14.5 0ZM14.39 18.6313C13.9224 19.0989 13.3074 19.3321 12.6899 19.3321C12.0725 19.3321 11.4514 19.0965 10.9789 18.6252L7.61733 15.3676L9.30054 13.6312L12.6754 16.9022L19.6946 10.0135L21.3911 11.7353L14.39 18.6313Z" fill="#37FF63"/></g><defs><clipPath id="clip0_680_6950"><rect width="29" height="29" fill="white"/></clipPath></defs></svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
      <path d="M14.5 0C6.49187 0 0 6.49187 0 14.5C0 22.5081 6.49187 29 14.5 29C22.5081 29 29 22.5081 29 14.5C28.9913 6.49543 22.5046 0.00866602 14.5 0ZM19.3333 17.6259C19.8243 18.0779 19.8561 18.8423 19.4041 19.3333C18.9522 19.8243 18.1878 19.8561 17.6967 19.4041C17.6722 19.3815 17.6486 19.3579 17.6259 19.3333L14.5 16.2086L11.3752 19.3333C10.8952 19.7969 10.1303 19.7836 9.66669 19.3036C9.21447 18.8353 9.21447 18.093 9.66669 17.6248L12.7914 14.5L9.66669 11.3752C9.20308 10.8952 9.21639 10.1303 9.69642 9.66669C10.1647 9.21447 10.907 9.21447 11.3752 9.66669L14.5 12.7914L17.6259 9.66669C18.0779 9.17567 18.8423 9.14395 19.3333 9.59589C19.8243 10.0478 19.8561 10.8122 19.4041 11.3033C19.3815 11.3278 19.3579 11.3514 19.3333 11.3741L16.2086 14.5L19.3333 17.6259Z" fill="#FF3737"/>
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none"><g clipPath="url(#clip0_686_7368)"><path d="M15.95 15.95H13.05V7.25H15.95M15.95 21.75H13.05V18.85H15.95M14.5 0C12.5958 0 10.7103 0.375054 8.95109 1.10375C7.19187 1.83244 5.5934 2.9005 4.24695 4.24695C1.52767 6.96623 0 10.6544 0 14.5C0 18.3456 1.52767 22.0338 4.24695 24.753C5.5934 26.0995 7.19187 27.1676 8.95109 27.8963C10.7103 28.6249 12.5958 29 14.5 29C18.3456 29 22.0338 27.4723 24.753 24.753C27.4723 22.0338 29 18.3456 29 14.5C29 12.5958 28.6249 10.7103 27.8963 8.95109C27.1676 7.19187 26.0995 5.5934 24.753 4.24695C23.4066 2.9005 21.8081 1.83244 20.0489 1.10375C18.2897 0.375054 16.4042 0 14.5 0Z" fill="#FFDF37"/></g><defs><clipPath id="clip0_686_7368"><rect width="29" height="29" fill="white"/></clipPath></defs></svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none"><g clipPath="url(#clip0_686_7383)"><path d="M15.95 10.15H13.05V7.25H15.95M15.95 21.75H13.05V13.05H15.95M14.5 0C12.5958 0 10.7103 0.375054 8.95109 1.10375C7.19187 1.83244 5.5934 2.9005 4.24695 4.24695C1.52767 6.96623 0 10.6544 0 14.5C0 18.3456 1.52767 22.0338 4.24695 24.753C5.5934 26.0995 7.19187 27.1676 8.95109 27.8963C10.7103 28.6249 12.5958 29 14.5 29C18.3456 29 22.0338 27.4723 24.753 24.753C27.4723 22.0338 29 18.3456 29 14.5C29 12.5958 28.6249 10.7103 27.8963 8.95109C27.1676 7.19187 26.0995 5.5934 24.753 4.24695C23.4066 2.9005 21.8081 1.83244 20.0489 1.10375C18.2897 0.375054 16.4042 0 14.5 0Z" fill="#1B95ED"/></g><defs><clipPath id="clip0_686_7383"><rect width="29" height="29" fill="white"/></clipPath></defs></svg>
  )
};

/**
 * Styles for notification components
 */
const useStyles = makeStyles(theme => ({
  notificationContainer: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    zIndex: 9999,
  },
  notification: {
    padding: '16px',
    borderRadius: 8,
    minWidth: 300,
    maxWidth: 400,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.bg.box,
    display: 'flex',
    gap: 16,
    background: theme.bg.box,
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      width: '100%',
      height: '100%',
    }
  },
  contentContainer: {
    flex: 1,
   display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  title: {
    color: theme.text.primary,
    fontSize: 14,
    fontWeight: 500,
  },
  message: {
    color: theme.text.secondary,
    fontSize: 12,
    fontWeight: 500,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
    cursor: 'pointer',
    color: theme.text.primary,
    opacity: 0.7,
    '&:hover': {
      opacity: 1,
    },
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  success: {
    background: `linear-gradient(90deg, ${theme.green}20 0%, ${theme.bg.box} 35%), ${theme.bg.box}`,
    '& .icon': {
      color: theme.green,
    },
    '& .progressBar': {
      backgroundColor: theme.green,
    }
  },
  error: {
    background: `linear-gradient(90deg, ${theme.red}20 0%, ${theme.bg.box} 35%), ${theme.bg.box}`,
    '& .icon': {
      color: theme.red,
    },
    '& .progressBar': {
      backgroundColor: theme.red,
    }
  },
  warning: {
    background: `linear-gradient(90deg, ${theme.yellow}20 0%, ${theme.bg.box} 35%), ${theme.bg.box}`,
    '& .icon': {
      color: theme.yellow,
    },
    '& .progressBar': {
      backgroundColor: theme.yellow,
    }
  },
  info: {
    background: `linear-gradient(90deg, ${theme.blue}20 0%, ${theme.bg.box} 35%), ${theme.bg.box}`,
    '& .icon': {
      color: theme.blue,
    },
    '& .progressBar': {
      backgroundColor: theme.blue,
    }
  },
}));

/**
 * Default titles for different notification types
 */
const NOTIFICATION_TITLES = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Information'
};

/**
 * Close icon component for notifications
 */
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M11.8333 1.34585L10.6542 0.166687L6 4.82085L1.34583 0.166687L0.166664 1.34585L4.82083 6.00002L0.166664 10.6542L1.34583 11.8334L6 7.17919L10.6542 11.8334L11.8333 10.6542L7.17916 6.00002L11.8333 1.34585Z" fill="#959597"/>
  </svg>
);

/**
 * Provider component for notification functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const classes = useStyles();
  const { playError, playSuccess } = useSound();

  /**
   * Remove a notification by ID
   * @param {string} id - Notification ID
   */
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  /**
   * Add a new notification
   * @param {string} type - Notification type (success, error, warning, info)
   * @param {string} message - Notification message
   */
  const addNotification = (type, message) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
    
    if (type === 'error') {
      playError();
    } else if (type === 'success') {
      playSuccess();
    }
    
    setTimeout(() => removeNotification(id), 5000);
  };

  const value = {
    /**
     * Display a success notification
     * @param {string} message - Notification message
     */
    success: (message) => addNotification('success', message),
    
    /**
     * Display an error notification
     * @param {string} message - Notification message
     */
    error: (message) => addNotification('error', message),
    
    /**
     * Display a warning notification
     * @param {string} message - Notification message
     */
    warning: (message) => addNotification('warning', message),
    
    /**
     * Display an info notification
     * @param {string} message - Notification message
     */
    info: (message) => addNotification('info', message),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className={classes.notificationContainer}>
        <AnimatePresence>
          {notifications.map(({ id, type, message }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`${classes.notification} ${classes[type]}`}
            >
              <div className={`${classes.icon} icon`}>
                {icons[type]}
              </div>
              <div className={classes.contentContainer}>
                <div className={classes.title}>{NOTIFICATION_TITLES[type]}</div>
                <div className={classes.message}>{message}</div>
              </div>
              <div 
                className={classes.closeButton}
                onClick={() => removeNotification(id)}
              >
                <CloseIcon style={{ fontSize: 16 }} />
              </div>
              <motion.div 
                className={`${classes.progressBar} progressBar`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

/**
 * Hook for accessing notification functionality
 * @returns {Object} Notification context with success, error, warning, and info methods
 * @throws {Error} If used outside of NotificationProvider
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 