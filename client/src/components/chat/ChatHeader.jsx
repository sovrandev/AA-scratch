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
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.00008 0.666992C4.39771 0.666992 0.666748 4.39795 0.666748 9.00033C0.666748 10.5131 1.07051 11.9333 1.77614 13.1572C1.91985 13.4065 1.9445 13.71 1.82322 13.9709L1.1118 15.5017C0.674965 16.3281 1.27288 17.3337 2.21807 17.3337H9.00008C13.6024 17.3337 17.3334 13.6027 17.3334 9.00033C17.3334 4.39795 13.6024 0.666992 9.00008 0.666992ZM6.50008 6.50033C6.03985 6.50033 5.66675 6.87343 5.66675 7.33366C5.66675 7.79391 6.03985 8.16699 6.50008 8.16699H8.16675C8.627 8.16699 9.00008 7.79391 9.00008 7.33366C9.00008 6.87343 8.627 6.50033 8.16675 6.50033H6.50008ZM6.50008 9.83366C6.03985 9.83366 5.66675 10.2067 5.66675 10.667C5.66675 11.1272 6.03985 11.5003 6.50008 11.5003H11.5001C11.9603 11.5003 12.3334 11.1272 12.3334 10.667C12.3334 10.2067 11.9603 9.83366 11.5001 9.83366H6.50008Z" fill="url(#paint0_linear_3224_5829)"/>
<defs>
<linearGradient id="paint0_linear_3224_5829" x1="1.00006" y1="17.0003" x2="17.0001" y2="1.00034" gradientUnits="userSpaceOnUse">
<stop stop-color="#9546FD"/>
<stop offset="0.5" stop-color="#4E89C7"/>
<stop offset="1" stop-color="#0FC397"/>
</linearGradient>
</defs>
</svg>        </div>
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