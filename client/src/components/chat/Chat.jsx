import React, { useEffect } from 'react';
import { makeStyles } from "@material-ui/core";
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatControls from './ChatControls';
import { useChat } from '../../contexts/chat';
import { useNotification } from '../../contexts/notification';
import { motion, AnimatePresence } from 'framer-motion';

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8 10.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 14H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    height: '100vh',
    flexShrink: 0,
    width: props => props.chatHidden ? '0px' : '300px',
    transition: 'width 0.3s ease',
  },
  root: {
    width: "300px",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    //background: theme.bg.nav,
    //zIndex: 100,
    borderRight: `1px solid ${theme.bg.border}66`,
    // boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
  },
  chatToggle: {
    position: 'absolute',
    bottom: 20,
    zIndex: 99,
    background: theme.bg.nav,
    borderTop: `1px solid ${theme.bg.border}66`,
    borderBottom: `1px solid ${theme.bg.border}66`,
    borderRight: `1px solid ${theme.bg.border}66`,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    color: theme.text.primary,
    left: props => props.chatHidden ? 0 : '300px',
    transition: 'left 0.3s ease',
    borderTopRightRadius: "6px",
    borderBottomRightRadius: "6px",
    "& svg": {
      height: 20,
      width: 20,
    }
  },
  wrapper: {
    overflow: "visible",
    position: "relative",
  }
}));

const Chat = () => {
  const { messages, currentRoom, changeRoom, sendMessage, chatHidden, toggleChat } = useChat();
  const classes = useStyles({ chatHidden });
  const notify = useNotification();

  useEffect(() => {
    window.initialChatRender = true;
    return () => {
      window.initialChatRender = false;
    };
  }, []);

  const handleSendMessage = async (message) => {
    try {
      await sendMessage(message);
    } catch (error) {
      notify.error(error.message);
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <AnimatePresence>
          {!chatHidden && (
            <motion.div 
              key="chat"
              className={classes.root}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              {...(!window.initialChatRender && { initial: false })}
            >
              <ChatHeader currentRoom={currentRoom} onRoomChange={changeRoom}/>
              <ChatMessages messages={messages} />
              <ChatControls onSendMessage={handleSendMessage} />
            </motion.div>
          )}
          <div 
            className={classes.chatToggle}
            onClick={toggleChat}
          >
            <ChatIcon />
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Chat; 