import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/core";
import { motion, AnimatePresence } from 'framer-motion';
import LevelBox from '../common/LevelBox';

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    overflowY: "auto",
    position: "relative",
    padding: "0px 16px",
    "&::-webkit-scrollbar": {
      display: "none"
    },
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "60px",
      background: `linear-gradient(to bottom, ${theme.bg.nav}, transparent)`,
      pointerEvents: "none",
      zIndex: 1
    },
    maskImage: "linear-gradient(0deg,rgba(0,0,0,1) 70%,rgba(0,0,0,0))",
  },
  messageContainer: {
    display: "flex",
    marginBottom: theme.spacing(2),
    gap: theme.spacing(1),
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: theme.spacing(1),
    objectFit: "cover"
  },
  messageContent: {
    flex: 1
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.75),
    marginBottom: 6
  },
  username: {
    color: theme.text.primary,
    fontSize: "14px",
    fontWeight: 500,
  },
  message: {
    backgroundColor: theme.bg.box,
    padding: theme.spacing(1, 1.5),
    borderRadius: 6,
    color: theme.text.secondary,
    fontSize: "14px",
    wordBreak: "break-word",
  },
  systemMessageContainer: {
    display: "flex",
    marginBottom: theme.spacing(2),
    gap: theme.spacing(1),
  },
  systemAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: `1px solid ${theme.bg.border}`,
    color: theme.bg.border,
    "& svg": {
      width: "16px",
      height: "16px",
    }
  },
  systemMessage: {
    background: "transparent", // `linear-gradient(45deg, #9546FD40 2%, #4E89C740 50%, #0FC39740 98%)`,
    padding: theme.spacing(1, 1.5),
    borderRadius: 6,
    color: theme.text.primary,
    fontSize: "14px",
    wordBreak: "break-word",
    border: `1px solid ${theme.bg.border}`
  },
  pauseButton: {
    position: 'sticky',
    bottom: theme.spacing(2),
    left: '0',
    transform: 'translateX(-50%)',
    width: 'fit-content',
    margin: '0 auto',
    background: theme.bg.box,
    padding: theme.spacing(0.75, 1.5),
    borderRadius: theme.spacing(0.75),
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    zIndex: 2,
    color: theme.text.secondary,
    border: `1px solid ${theme.bg.border}`,
    '&:hover': {
      background: theme.bg.border,
    }
  },
  pauseIcon: {
    width: 16,
    height: 16,
    color: theme.text.secondary
  }
}));
        
const ChatMessages = ({ messages }) => {
  const classes = useStyles();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = () => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPosition = scrollHeight - scrollTop - clientHeight;
    const isBottom = scrollPosition < 50; // Within 50px of bottom

    setIsNearBottom(isBottom);
    if (isBottom && !autoScroll) {
      setAutoScroll(true);
    } else if (!isBottom && autoScroll) {
      setAutoScroll(false);
    }
  };

  const toggleAutoScroll = () => {
    if (!autoScroll) {
      setAutoScroll(true);
      scrollToBottom();
    }
  };

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages, autoScroll]);

  const renderMessage = (msg) => {
    if (msg.type === "rainCompleted") {
      return null;
      return (
        <motion.div
          key={msg._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={classes.systemMessageContainer}
        >
          <div className={classes.systemAvatar}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M11.4545 6H10.9091C10.9091 4.065 9.20182 2.5 7.09091 2.5H6.54545V1.865C6.87273 1.695 7.09091 1.37 7.09091 1C7.09091 0.45 6.60545 0 6 0C5.39455 0 4.90909 0.45 4.90909 1C4.90909 1.37 5.12727 1.695 5.45455 1.865V2.5H4.90909C2.79818 2.5 1.09091 4.065 1.09091 6H0.545455C0.245455 6 0 6.225 0 6.5V8C0 8.275 0.245455 8.5 0.545455 8.5H1.09091V9C1.09091 9.555 1.58182 10 2.18182 10H9.81818C10.4236 10 10.9091 9.555 10.9091 9V8.5H11.4545C11.7545 8.5 12 8.275 12 8V6.5C12 6.225 11.7545 6 11.4545 6ZM4.79455 7.25C4.58182 6.81 4.10727 6.5 3.54545 6.5C2.98364 6.5 2.50909 6.81 2.29636 7.25C2.22545 7.095 2.18182 6.93 2.18182 6.75C2.18182 6.06 2.79273 5.5 3.54545 5.5C4.29818 5.5 4.90909 6.06 4.90909 6.75C4.90909 6.93 4.86545 7.095 4.79455 7.25ZM9.70364 7.25C9.49091 6.81 9 6.5 8.45455 6.5C7.90909 6.5 7.41818 6.81 7.20545 7.25C7.13455 7.095 7.09091 6.93 7.09091 6.75C7.09091 6.06 7.70182 5.5 8.45455 5.5C9.20727 5.5 9.81818 6.06 9.81818 6.75C9.81818 6.93 9.77455 7.095 9.70364 7.25Z" fill="currentColor"/></svg></div>
          <div className={classes.messageContent}>
            <div className={classes.userInfo}>
              <div className={classes.username}>System</div>
            </div>
            <div className={classes.systemMessage}>
              Rain has ended! {(msg.rain.amount / 100).toFixed(2)} was split among users.
            </div>
          </div>
        </motion.div>
      );
    }

    if (msg.type === "rainTip") {
      return null;
      return (
        <motion.div
          key={msg._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={classes.systemMessageContainer}
        >
          <div className={classes.systemAvatar}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M11.4545 6H10.9091C10.9091 4.065 9.20182 2.5 7.09091 2.5H6.54545V1.865C6.87273 1.695 7.09091 1.37 7.09091 1C7.09091 0.45 6.60545 0 6 0C5.39455 0 4.90909 0.45 4.90909 1C4.90909 1.37 5.12727 1.695 5.45455 1.865V2.5H4.90909C2.79818 2.5 1.09091 4.065 1.09091 6H0.545455C0.245455 6 0 6.225 0 6.5V8C0 8.275 0.245455 8.5 0.545455 8.5H1.09091V9C1.09091 9.555 1.58182 10 2.18182 10H9.81818C10.4236 10 10.9091 9.555 10.9091 9V8.5H11.4545C11.7545 8.5 12 8.275 12 8V6.5C12 6.225 11.7545 6 11.4545 6ZM4.79455 7.25C4.58182 6.81 4.10727 6.5 3.54545 6.5C2.98364 6.5 2.50909 6.81 2.29636 7.25C2.22545 7.095 2.18182 6.93 2.18182 6.75C2.18182 6.06 2.79273 5.5 3.54545 5.5C4.29818 5.5 4.90909 6.06 4.90909 6.75C4.90909 6.93 4.86545 7.095 4.79455 7.25ZM9.70364 7.25C9.49091 6.81 9 6.5 8.45455 6.5C7.90909 6.5 7.41818 6.81 7.20545 7.25C7.13455 7.095 7.09091 6.93 7.09091 6.75C7.09091 6.06 7.70182 5.5 8.45455 5.5C9.20727 5.5 9.81818 6.06 9.81818 6.75C9.81818 6.93 9.77455 7.095 9.70364 7.25Z" fill="currentColor"/></svg></div>
          <div className={classes.messageContent}>
            <div className={classes.userInfo}>
              <div className={classes.username}>System</div>
            </div>
            <div className={classes.systemMessage}>
              {msg.transaction.user.username} tipped ${(Math.abs(msg.transaction.amount) / 100).toFixed(2)} to the rain!
            </div>
          </div>
        </motion.div>
      );
    }

    if (msg.type === "system") {
      return (
        <motion.div
          key={msg._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={classes.systemMessageContainer}
        >
          <div className={classes.systemAvatar}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M11.4545 6H10.9091C10.9091 4.065 9.20182 2.5 7.09091 2.5H6.54545V1.865C6.87273 1.695 7.09091 1.37 7.09091 1C7.09091 0.45 6.60545 0 6 0C5.39455 0 4.90909 0.45 4.90909 1C4.90909 1.37 5.12727 1.695 5.45455 1.865V2.5H4.90909C2.79818 2.5 1.09091 4.065 1.09091 6H0.545455C0.245455 6 0 6.225 0 6.5V8C0 8.275 0.245455 8.5 0.545455 8.5H1.09091V9C1.09091 9.555 1.58182 10 2.18182 10H9.81818C10.4236 10 10.9091 9.555 10.9091 9V8.5H11.4545C11.7545 8.5 12 8.275 12 8V6.5C12 6.225 11.7545 6 11.4545 6ZM4.79455 7.25C4.58182 6.81 4.10727 6.5 3.54545 6.5C2.98364 6.5 2.50909 6.81 2.29636 7.25C2.22545 7.095 2.18182 6.93 2.18182 6.75C2.18182 6.06 2.79273 5.5 3.54545 5.5C4.29818 5.5 4.90909 6.06 4.90909 6.75C4.90909 6.93 4.86545 7.095 4.79455 7.25ZM9.70364 7.25C9.49091 6.81 9 6.5 8.45455 6.5C7.90909 6.5 7.41818 6.81 7.20545 7.25C7.13455 7.095 7.09091 6.93 7.09091 6.75C7.09091 6.06 7.70182 5.5 8.45455 5.5C9.20727 5.5 9.81818 6.06 9.81818 6.75C9.81818 6.93 9.77455 7.095 9.70364 7.25Z" fill="currentColor"/></svg></div>
          <div className={classes.messageContent}>
            <div className={classes.userInfo}>
              <div className={classes.username}>System</div>
            </div>
            <div className={classes.systemMessage}>
              {msg.message}
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={msg._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={classes.messageContainer}
      >
        <img 
          src={msg.user.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} 
          alt={msg.user.userSname} 
          className={classes.avatar} 
        />
        <div className={classes.messageContent}>
          <div className={classes.userInfo}>
            <LevelBox level={msg.user.level} />
            <div className={classes.username}>{msg.user.username}</div>
          </div>
          <div className={classes.message}>{msg.message}</div>
        </div>
      </motion.div>
    );
  };

  return (
    <div 
      className={classes.root} 
      ref={containerRef}
      onScroll={handleScroll}
    >
      <AnimatePresence initial={false}>
        {messages.map((msg) => renderMessage(msg))}
      </AnimatePresence>
      <AnimatePresence>
        {false && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={classes.pauseButton}
            onClick={toggleAutoScroll}
          >
            <svg className={classes.pauseIcon} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="currentColor"/><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/><path d="M14 9L14 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/><path d="M10 9L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/></svg>
            Scroll paused
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages; 