import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core";
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/user';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "transparent",
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingBottom: "16px"
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
  },
  input: {
    width: "100%",
    height: "40px",
    backgroundColor: theme.bg.box,
    border: `1px solid ${theme.bg.border}`,
    borderRadius: "6px",
    color: theme.text.primary,
    padding: "4px 40px 4px 12px",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "Onest",
    outline: "none",
    "&::placeholder": {
      color: theme.text.secondary,
      opacity: 1,
      fontWeight: 500,
      fontFamily: "Onest"
    },
    "&:disabled": {
      backgroundColor: theme.bg.box,
      cursor: "not-allowed",
    }
  },
  buttonsContainer: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    position: "absolute",
    right: "4px",
  },
  iconButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "4px",
    color: "#D1E6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: `#D1E6FF10`
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
      "&:hover": {
        backgroundColor: "transparent"
      }
    }
  },
  sendButton: {
    background: theme.accent.primaryGradient,
    border: "none",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "4px",
    color: theme.text.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      opacity: 0.8
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed"
    }
  },
  emojiPicker: {
    position: "absolute",
    bottom: "120%",
    right: 0,
    backgroundColor: theme.bg.box,
    border: `1px solid ${theme.bg.border}`,
    width: "100%",
    color: theme.text.primary,
    height: "100px",
    borderRadius: "6px",
    padding: "8px",
    transformOrigin: "bottom center"
  }
}));

const ChatControls = ({ onSendMessage }) => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    
    onSendMessage(message);
    setMessage('');
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <div className={classes.inputContainer}>
        <input
          type="text"
          className={classes.input}
          placeholder={user ? "Enter your message" : "Login to chat"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!user}
        />
        <div className={classes.buttonsContainer}>
          {/*<motion.button
            type="button"
            className={classes.iconButton}
            onClick={toggleEmojiPicker}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ opacity: 0.7 }}
            disabled={!user}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 11C16.3284 11 17 10.3284 17 9.5C17 8.67157 16.3284 8 15.5 8C14.6716 8 14 8.67157 14 9.5C14 10.3284 14.6716 11 15.5 11Z" />
              <path d="M8.5 11C9.32843 11 10 10.3284 10 9.5C10 8.67157 9.32843 8 8.5 8C7.67157 8 7 8.67157 7 9.5C7 10.3284 7.67157 11 8.5 11Z" />
              <path d="M12 16C14.2091 16 16 14.2091 16 12H8C8 14.2091 9.79086 16 12 16Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" />
            </svg>
          </motion.button>*/}
          <motion.button
            type="submit"
            className={classes.sendButton}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ opacity: 0.7 }}
            disabled={!user}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M18.9687 2.27771L15.7968 16.9062C15.7293 17.2244 15.5184 17.4924 15.2231 17.6347C14.9279 17.7771 14.5904 17.7771 14.2868 17.6347L11.9247 16.4959C11.9247 16.4959 8.90467 18.6646 8.28885 18.9493C8.17074 19.008 8.12013 18.9996 8.03577 18.9996C7.91767 18.9996 7.79113 18.9661 7.6899 18.8991C7.51274 18.7819 7.40308 18.5893 7.40308 18.3799V13.9336C7.39464 13.8415 7.40308 13.7494 7.45369 13.6573C7.45369 13.6573 7.46213 13.6405 7.47057 13.6322C7.49587 13.5903 7.52118 13.5484 7.55492 13.5066L15.3244 5.06608L5.66529 12.9539C5.58936 13.0293 5.48813 13.0963 5.37847 13.1214C5.20131 13.1716 5.00729 13.1381 4.85544 13.0377L1.60763 11.5807C1.24488 11.4048 1.01712 11.0531 1.00024 10.6512C0.991808 10.2577 1.20271 9.88922 1.55701 9.69663L17.4165 1.13054C17.7876 0.929577 18.2263 0.963071 18.5722 1.21428C18.9096 1.46548 19.0615 1.87578 18.9771 2.27771H18.9687Z" fill="white"/></svg>
          </motion.button>
        </div>
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div 
              className={classes.emojiPicker}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.15,
                ease: "easeOut"
              }}
            >
              Emoji Picker Placeholder
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};

export default ChatControls; 