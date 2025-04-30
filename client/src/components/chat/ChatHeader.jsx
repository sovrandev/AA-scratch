import React from 'react';
import { makeStyles } from "@material-ui/core";
import { useChat } from "../../contexts/chat";

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8 10.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 14H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: theme.text.primary,
    background: theme.bg.nav,
    padding: "16px 20px",
    height: "64px",
    borderBottom: `1px solid ${theme.bg.border}66`,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    gap: theme.spacing(0.5),
  },
  chatIcon: {
    color: theme.blue,
    width: 20,
    height: 20,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.text.primary,
  },
  onlineCount: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1),
    background: theme.bg.box,
    padding: "4px 12px",
    borderRadius: "6px",
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.green,
  },
  onlineText: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.text.primary,
  }
}));

const ChatHeader = () => {
  const classes = useStyles();
  const { online } = useChat();

  return (
    <div className={classes.root}>
      <div className={classes.leftSection}>
        <div className={classes.chatIcon}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.66666C5.39765 1.66666 1.66669 5.39761 1.66669 9.99999C1.66669 11.5127 2.07045 12.933 2.77608 14.1569C2.91979 14.4062 2.94444 14.7097 2.82316 14.9706L2.11174 16.5013C1.6749 17.3277 2.27282 18.3333 3.21801 18.3333H10C14.6024 18.3333 18.3334 14.6023 18.3334 9.99999C18.3334 5.39761 14.6024 1.66666 10 1.66666ZM7.50002 7.49999C7.03979 7.49999 6.66669 7.87309 6.66669 8.33332C6.66669 8.79357 7.03979 9.16666 7.50002 9.16666H9.16669C9.62694 9.16666 10 8.79357 10 8.33332C10 7.87309 9.62694 7.49999 9.16669 7.49999H7.50002ZM7.50002 10.8333C7.03979 10.8333 6.66669 11.2064 6.66669 11.6667C6.66669 12.1269 7.03979 12.5 7.50002 12.5H12.5C12.9603 12.5 13.3334 12.1269 13.3334 11.6667C13.3334 11.2064 12.9603 10.8333 12.5 10.8333H7.50002Z" fill="#5D9DFE"/></svg>
        </div>
        <div className={classes.chatTitle}>Chat</div>
      </div>

      <div className={classes.onlineCount}>
        <div className={classes.onlineDot} />
        <span className={classes.onlineText}>{online ? online.toLocaleString() : "3,450"}</span>
      </div>
    </div>
  );
};

export default ChatHeader;