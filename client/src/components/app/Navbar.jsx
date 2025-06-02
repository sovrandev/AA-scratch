import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Drawer } from '@mui/material';
import { ExitToApp } from '@material-ui/icons';
import theme from "../../styles/theme";
import { motion } from "framer-motion";

import LoginModel from "../login/LoginModel";
import RedeemModel from "../redeem/RedeemModel";
import PrimaryButton from "../common/buttons/PrimaryButton";
import SecondaryButton from "../common/buttons/SecondaryButton";
import LevelBox from "../common/LevelBox";

import logo from "../../assets/img/logo.png";

import { useUser } from '../../contexts/user';
import { useCashier } from '../../contexts/cashier';

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    fontWeight: 600,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    //zIndex: 100,
    //backgroundColor: theme.bg.nav,
    borderBottom: `1px solid ${theme.bg.border}66`,
  },

  drawer: {
    '& .MuiDrawer-paper': {
      width: 280,
      backgroundColor: theme.bg.nav,
      padding: '24px',
      boxSizing: 'border-box',
    }
  },

  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
    position: 'relative',
    marginBottom: '24px',
  },

  drawerAvatar: {
    width: 48,
    height: 48,
    borderRadius: theme.spacing(0.75),
    objectFit: "cover",
  },

  drawerUsername: {
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: 600,
  },

  drawerTitle: {
    color: theme.text.secondary,
    fontSize: 14,
    fontWeight: 500,
    marginBottom: '12px',
  },

  drawerProfileButton: {
    color: theme.text.secondary,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: theme.transitions.normal,
    '&:hover': {
      color: theme.text.primary,
    }
  },

  drawerButton: {
    color: theme.text.primary,
    fontSize: 14,
    fontWeight: 500,
    padding: '8px 0',
    cursor: 'pointer',
    transition: theme.transitions.normal,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    '&:hover': {
      opacity: 0.8
    }
  },

  drawerButtonIcon: {
    display: 'flex',
    alignItems: 'center',
    color: 'inherit',
  },

  drawerDivider: {
    backgroundColor: theme.bg.border,
    margin: '16px 0',
  },

  signOutButton: {
    color: theme.red,
    fontSize: 14,
    fontWeight: 500,
    padding: '8px 0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: theme.transitions.normal,
    '&:hover': {
      opacity: 0.8,
    }
  },

  desktop: {
    width: "100%",
    maxWidth: 1200,
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "@media (max-width:1200px)": {
      display: "none"
    },
  },

  logo: {
    height: 28,
    marginRight: theme.spacing(3),
    cursor: "pointer",
    position: 'relative',
  },

  textButtonRedeem: {
    color: theme.green,
    fontSize: 13,
    cursor: "pointer",
    marginRight: theme.spacing(2),
    transition: "all 0.2s ease",
    "&:hover": {
      filter: "brightness(1.4)"
    }
  },

  brand: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    overflow: "hidden",
    zIndex: 1,
    marginRight: "10px",
  },

  leftSection: {
    display: "flex",
    alignItems: "center",
  },
  
  balanceGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.bg.inner,
    color: theme.text.primary,
    padding: "8px 8px 8px 8px",
    height: 40,
    borderRadius: theme.spacing(0.75),
    userSelect: "none",
    minWidth: 120,
    cursor: "pointer",
    position: "relative",
    gap: theme.spacing(0.75),
    transition: theme.transitions.normal,
    "& svg": {
      color: theme.text.secondary,
    },
    "&:hover": {
      backgroundColor: theme.bg.inner + "CC",
    },
    ["@media (max-width:1200px)"]: {
      borderRadius: theme.spacing(0.5),
      padding: "8px 16px",
      height: 34,
      minWidth: 100,
      fontSize: 12,
    }
  },

  balanceMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    backgroundColor: theme.bg.box,
    borderRadius: theme.spacing(0.75),
    display: "none",
    flexDirection: "column",
    minWidth: "100%",
    width: "fit-content",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
    zIndex: 100,
    overflow: "hidden",
    padding: "4px",
    gap: "2px",
    border: `1px solid ${theme.bg.border}`,
  },

  balanceMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    borderRadius: theme.spacing(0.75),
    padding: "8px 10px",
    color: theme.text.secondary,
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontSize: 14,
    transition: theme.transitions.normal,
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.05)",
      color: theme.text.primary,
      "& svg": {
        color: theme.text.primary,
      },
    },
    "& svg": {
      width: 16,
      height: 16,
      color: theme.text.secondary,
      transition: theme.transitions.normal,
    }
  },

  walletGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.accent.primaryGradient,
    color: theme.text.primary,
    height: 40,
    minWidth: 100,
    borderRadius: theme.spacing(0.75),
    userSelect: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      opacity: 0.8
    },
    ["@media (max-width:1200px)"]: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      padding: "8px 8px",
      borderRadius: theme.spacing(0.5),
      height: 34,
      width: 34,
      minWidth: 0,
      width: "fit-content",
      fontSize: 12,
    }
  },

  balanceChangeNotification: {
    position: "absolute",
    left: 0,
    right: 0,
    width: "fit-content",
    margin: "0 auto",
    padding: "4px 8px",
    borderRadius: theme.spacing(0.5),
    fontWeight: 600,
    fontSize: 14,
    color: theme.text.primary,
    zIndex: 1001,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
  
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: theme.spacing(0.75),
    objectFit: "cover",
    userSelect: "none",
    position: "relative",
    transition: theme.transitions.normal,
    "&:hover": {
      opacity: 0.8
    }
  },

  profileInfo: {
    display: "flex",
    flexDirection: "column",
  },

  username: {
    color: theme.text.primary,
    fontWeight: 600,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.75),
  },

  loginButton: {
    backgroundColor: theme.blue,
    color: theme.text.primary,
    borderRadius: theme.spacing(0.75),
    fontSize: 16,
    fontWeight: 550,
    cursor: "pointer",
    textAlign: "center",
    userSelect: "none",
    width: "fit-content",
    "&:hover": {
      opacity: 0.9
    }
  },

  navTabs: {
    minHeight: '64px',
    '& .MuiTabs-indicator': {
      height: '1px',
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    },
    '& .MuiTab-root': {
      minHeight: '64px',
      color: theme.text.primary,
      fontSize: '14px',
      fontWeight: 600,
      textTransform: 'none',
      minWidth: 'unset',
      padding: '0 16px',
      '&.Mui-selected': {
        color: theme.text.primary,
      },
      '&:hover': {
        color: theme.text.primary,
        backgroundColor: 'transparent',
      },
      '& .MuiTouchRipple-root': {
        display: 'none',
      },
      '&:focus': {
        backgroundColor: 'transparent',
      }
    }
  },

  tabIcon: {
    marginRight: theme.spacing(0.75),
    display: 'flex',
    alignItems: 'center',
  },

  hiddenTab: {
    padding: 0,
    minWidth: '0 !important',
    width: 0,
    overflow: 'hidden',
    opacity: 0,
    "&.css-93wjf5-MuiButtonBase-root-MuiTab-root": {
      padding: 5,
    }
  },

  avatarContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  
  levelBox: {
    position: "absolute",
    bottom: -6,
    right: -6,
    zIndex: 1
  },

  mobile: {
    width: "100%",
    height: 52,
    display: "none",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    ["@media (max-width:1200px)"]: {
      display: "flex"
    }
  },

  burgerMenu: {
    width: 24,
    height: 24,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: theme.text.secondary,
    transition: theme.transitions.normal,
    "&:hover": {
      color: theme.text.primary
    }
  },

  divider: {
    width: "100%",
    margin: theme.spacing(2, 0),
    opacity: 0.5,
    borderTop: `1px solid ${theme.bg.border}`,
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();

  const [loginOpen, setLoginOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);

  const { user, getLevel, logout } = useUser();
  const { setIsOpen } = useCashier();

  const [selectedTab, setSelectedTab] = useState(() => {
    const path = location.pathname.split('/')[1];
    if (path === 'boxes') return 0;
    if (path === 'box-battles') return 1;
    if (path === 'upgrader') return 2;
    if (path === 'mines') return 3;
    if (path === 'leaderboard') return 4;
    if (path === 'rewards') return 5;
    return false;
  });

  useEffect(() => {
    setSelectedTab(() => {
      const path = location.pathname.split('/')[1];
      if (path === 'boxes') return 0;
      if (path === 'box-battles') return 1;
      if (path === 'upgrader') return 2;
      if (path === 'mines') return 3;
      if (path === 'leaderboard') return 4;
      if (path === 'rewards') return 5;
      return false;
    });
  }, [location.pathname]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const dropdownAnimate = {
    enter: {
      opacity: 1,
      scale: [0.7, 1],
      transformOrigin: "top center",
      transition: { duration: 0.1 },
      display: "flex"
    },
    exit: {
      opacity: 0,
      scale: [1, 0.7],
      transformOrigin: "top center",
      transition: { duration: 0.1 },
      transitionEnd: { display: "none" }
    }
  };

  return (
    <div className={classes.root}>
      <LoginModel open={loginOpen} handleClose={() => setLoginOpen(false)} />
      <RedeemModel open={redeemOpen} handleClose={() => setRedeemOpen(false)} />
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        className={classes.drawer}
      >
        {user && (
          <>
            <div className={classes.drawerHeader}>
              <div className={classes.avatarContainer}>
                <img 
                  src={user?.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} 
                  alt="avatar" 
                  className={classes.drawerAvatar}
                />
                <div className={classes.levelBox}>
                  <LevelBox level={getLevel(user)} />
                </div>
              </div>  
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', alignContents: 'center' }}>
                <span className={classes.drawerUsername}>{user.username}</span>
                <span className={classes.drawerProfileButton} onClick={() => handleNavigation('/profile')}>
                  View Profile
                </span>
              </div>
            </div>

            <div className={classes.drawerTitle}>Games</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <div className={classes.drawerButton} onClick={() => handleNavigation('/boxes')}>
                <div className={classes.drawerButtonIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 21 16">
                    <path fill="currentColor" d="m3.346 12.916 7.513 2.514 7.513-2.514V9.005l-5.983 1.955-1.53-2.234-1.53 2.234-5.983-1.955z"></path>
                    <path fill="currentColor" fillRule="evenodd" d="M.856 7.07 3.472 3.2 10.86.57l7.54 2.632 2.462 3.87-8.002 2.631-2-3.096-2 3.096zm5.078-3.56 4.925-1.703 4.924 1.703-4.924 1.703z" clipRule="evenodd"></path>
                  </svg>
                </div>
                Unbox
              </div>
              <div className={classes.drawerButton} onClick={() => handleNavigation('/box-battles')}>
                <div className={classes.drawerButtonIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path fill="currentColor" d="m7.05 13.406 3.534 3.536-1.413 1.414 1.415 1.415-1.414 1.414-2.475-2.475-2.829 2.829-1.414-1.414 2.83-2.83-2.476-2.474 1.414-1.414 1.414 1.413 1.413-1.414zM3 3l3.546.003 11.817 11.818 1.415-1.414 1.414 1.414-2.474 2.475 2.828 2.829-1.414 1.414-2.829-2.829-2.475 2.475-1.414-1.414 1.414-1.415L3.003 6.531zm14.457 0L21 3.003l.002 3.523-4.053 4.052-3.536-3.535z"/>
                  </svg>
                </div>
                Battles
              </div>
              <div className={classes.drawerButton} onClick={() => handleNavigation('/upgrader')}>
                <div className={classes.drawerButtonIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 36 36" fill="currentColor">
                    <g><g><path d="m33.7582016 19.7672596c.1900024.2200317.2799683.5200195.2299805.8100586-1.3099976 7.7799683-7.9899902 13.4199848-15.8800049 13.4199848-8.8800058 0-16.1099854-7.2200336-16.1099854-16.1000385 0-7.8999634 5.6499634-14.5799561 13.4199829-15.8800049.2900391-.0499879.5900278.0300293.8099985.2200317.2300415.1900024.3599854.4699707.3599854.7600098v6.7099609c0 .4400024-.289978.8200073-.6999521.9500122-3.2000122 1-5.3400269 3.9000244-5.3400269 7.2399902 0 4.1700439 3.3900146 7.5599976 7.5599985 7.5599976 3.3300171 0 6.2399902-2.1499634 7.2299805-5.3399658.1300049-.4199829.5200195-.710022.9500122-.710022h6.710022c.2999868 0 .5700064.1300049.7600088.3599854z"/><path d="m19.6281967 9.707262v-6.7099607c0-.2900391.1199951-.5700073.3499756-.7600098.2200317-.1900024.5200195-.2700197.8099976-.2200317 6.7600098 1.1300049 12.0700073 6.4300537 13.2000122 13.1900024.0499878.2900391-.039978.5900269-.2299805.8200073-.1900024.2200317-.460022.3500366-.7600098.3500366h-6.710022c-.4299927 0-.8200073-.2900391-.9500122-.7000122-.7399902-2.4000244-2.6199951-4.2700195-5.0099487-5.0200195-.4200439-.130005-.7000122-.5100099-.7000122-.9500124z"/></g></g></svg>
                </div>
                Upgrader
              </div>
              <div className={classes.drawerButton} onClick={() => handleNavigation('/mines')}>
                <div className={classes.drawerButtonIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 12 12" fill="none">
                    <path d="M4.28657 11.4242C5.84279 11.4242 7.38702 10.4736 7.99736 8.82578C8.74526 6.78351 7.70011 4.50945 5.64347 3.74886C3.56163 2.99009 1.30795 4.07395 0.566542 6.09808C-0.389701 8.70297 1.56622 11.4242 4.28657 11.4242ZM2.14035 6.63804C2.39884 5.93193 2.99424 5.42887 3.73275 5.28576C3.98199 5.23962 4.22189 5.40577 4.27271 5.65502C4.31891 5.90427 4.15733 6.14427 3.90808 6.19498C3.48812 6.27346 3.15582 6.55961 3.0081 6.95653C2.89733 7.25654 2.91119 7.58422 3.04506 7.87504C3.1512 8.11038 3.04968 8.38267 2.81891 8.48881C2.56712 8.59672 2.30655 8.4838 2.20503 8.26266C1.96964 7.75042 1.94654 7.1735 2.14035 6.63804Z" fill="currentColor"/><path d="M11.4543 3.8181L10.5865 3.49961L10.1065 2.86269C9.74198 1.15964 8.20964 0.6981 8.16806 0.68886C7.20353 0.331986 6.16495 0.850944 5.84189 1.81037L5.77699 2.00812L5.47737 1.89809C4.89583 1.68112 4.24961 1.98119 4.0327 2.56735L3.93579 2.82579C5.21618 2.72325 6.5577 3.18197 7.54505 4.15964L7.64196 3.89191C7.74348 3.61038 7.73424 3.30113 7.605 3.02889C7.48038 2.75654 7.25423 2.54887 6.97275 2.44735L6.64474 2.32689L6.71888 2.1012C6.79269 1.87505 6.95427 1.69036 7.17118 1.58884C7.38347 1.48269 7.6281 1.46883 7.88197 1.56574C7.89583 1.56574 9.07728 1.92575 9.23886 3.2827C9.24348 3.30113 9.24348 3.31961 9.2481 3.33347L9.105 3.7212L8.37111 4.27502C8.26959 4.35345 8.21888 4.47807 8.23736 4.6027C8.25573 4.72732 8.33889 4.83347 8.45889 4.87961L9.32653 5.1981L9.88497 5.93655C9.94965 6.02427 10.0512 6.07036 10.1619 6.07036H10.2128C10.3373 6.05194 10.4435 5.96421 10.485 5.84421L10.8034 4.97657L11.5419 4.41807C11.6435 4.34421 11.6943 4.21958 11.6758 4.09502C11.6573 3.97039 11.5697 3.86425 11.4543 3.8181Z" fill="currentColor"/>
                  </svg>
                </div>
                Mines
              </div>
            </div>

            <div className={classes.drawerTitle} style={{ marginTop: "24px" }}>Rewards</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <div className={classes.drawerButton} onClick={() => handleNavigation('/leaderboard')} style={{ color: theme.yellow }}>
                <div className={classes.drawerButtonIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 64 64">
                    <path fill="currentColor" d="M60,4H48c0-2.215-1.789-4-4-4H20c-2.211,0-4,1.785-4,4H4C1.789,4,0,5.785,0,8v8c0,8.836,7.164,16,16,16  c0.188,0,0.363-0.051,0.547-0.059C17.984,37.57,22.379,41.973,28,43.43V56h-8c-2.211,0-4,1.785-4,4v4h32v-4c0-2.215-1.789-4-4-4h-8  V43.43c5.621-1.457,10.016-5.859,11.453-11.488C47.637,31.949,47.812,32,48,32c8.836,0,16-7.164,16-16V8C64,5.785,62.211,4,60,4z   M8,16v-4h8v12C11.582,24,8,20.414,8,16z M56,16c0,4.414-3.582,8-8,8V12h8V16z"/>
                  </svg>
                </div>
                Race
              </div>
              <div className={classes.drawerButton} onClick={() => handleNavigation('/rewards')} style={{ color: theme.green }}>
                <div className={classes.drawerButtonIcon}>
                  <svg width="18" height="18" viewBox="0 0 18 18" focusable="false">
                    <path d="M1.3 10.487H8.25V17.674C8.25 17.7534 8.21839 17.8296 8.16213 17.8857C8.10587 17.9419 8.02956 17.9735 7.95 17.9735H4C3.5925 18.0315 3.17705 17.994 2.78655 17.8641C2.39606 17.7341 2.04123 17.5152 1.75016 17.2247C1.4591 16.9341 1.23978 16.5799 1.10958 16.1901C0.979374 15.8004 0.941858 15.3857 1 14.9789V10.7865C1 10.7472 1.00776 10.7082 1.02284 10.6719C1.03791 10.6356 1.06001 10.6026 1.08787 10.5747C1.11573 10.5469 1.1488 10.5249 1.18519 10.5098C1.22159 10.4948 1.2606 10.487 1.3 10.487ZM16.7 10.487H9.75V17.674C9.75 17.7133 9.75776 17.7523 9.77284 17.7886C9.78791 17.8249 9.81001 17.8579 9.83787 17.8857C9.86572 17.9136 9.8988 17.9356 9.93519 17.9507C9.97159 17.9657 10.0106 17.9735 10.05 17.9735H14C14.4075 18.0315 14.8229 17.994 15.2134 17.8641C15.6039 17.7341 15.9588 17.5152 16.2498 17.2247C16.5409 16.9341 16.7602 16.5799 16.8904 16.1901C17.0206 15.8004 17.0581 15.3857 17 14.9789V10.7865C17 10.7472 16.9922 10.7082 16.9772 10.6719C16.9621 10.6356 16.94 10.6026 16.9121 10.5747C16.8843 10.5469 16.8512 10.5249 16.8148 10.5098C16.7784 10.4948 16.7394 10.487 16.7 10.487ZM18 5.49609V8.6903C18 8.76972 17.9684 8.84589 17.9121 8.90204C17.8559 8.9582 17.7796 8.98975 17.7 8.98975H9.75V5.49609H8.25V8.98975H0.3C0.220435 8.98975 0.144129 8.9582 0.087868 8.90204C0.0316071 8.84589 0 8.76972 0 8.6903V5.49609C0 5.09899 0.158035 4.71814 0.43934 4.43735C0.720644 4.15655 1.10218 3.99881 1.5 3.99881H2.565C2.38874 3.67123 2.28382 3.31017 2.25711 2.93929C2.2304 2.56841 2.2825 2.19609 2.41 1.84671C2.56818 1.38599 2.84687 0.975845 3.2172 0.658757C3.58753 0.341669 4.03605 0.129161 4.51631 0.0432397C4.99657 -0.0426817 5.49111 0.00110656 5.94872 0.17007C6.40632 0.339034 6.81036 0.62703 7.119 1.00424C7.151 1.04416 8.276 2.53746 9 3.49971L10.874 1.01322C11.1757 0.641055 11.57 0.354579 12.0176 0.18251C12.4651 0.0104414 12.9501 -0.0411754 13.424 0.032834C13.8978 0.106843 14.3438 0.303879 14.7173 0.604189C15.0908 0.9045 15.3786 1.29753 15.552 1.7439C15.7005 2.10507 15.767 2.49457 15.7467 2.88444C15.7265 3.27431 15.6201 3.65488 15.435 3.99881H16.5C16.8978 3.99881 17.2794 4.15655 17.5607 4.43735C17.842 4.71814 18 5.09899 18 5.49609ZM7.5 3.99881C6.821 3.10044 6 2.01441 5.948 1.94353C5.83287 1.80424 5.68799 1.69241 5.52395 1.61624C5.35992 1.54008 5.1809 1.5015 5 1.50333C4.66848 1.50333 4.35054 1.63479 4.11612 1.86879C3.8817 2.10278 3.75 2.42015 3.75 2.75107C3.75 3.08199 3.8817 3.39936 4.11612 3.63335C4.35054 3.86735 4.66848 3.99881 5 3.99881H7.5ZM14.25 2.75107C14.2495 2.42031 14.1176 2.10325 13.8833 1.86937C13.649 1.63549 13.3314 1.50386 13 1.50333C12.8157 1.50219 12.6336 1.54263 12.4672 1.62162C12.3008 1.70061 12.1544 1.81612 12.039 1.9595C11.992 2.02039 11.177 3.10044 10.5 3.99881H13C13.3314 3.99828 13.649 3.86665 13.8833 3.63277C14.1176 3.39889 14.2495 3.08183 14.25 2.75107Z" fill="currentColor"></path>
                  </svg>
                </div>
                Rewards
              </div>
            </div>

            <div className={classes.divider} />

            <div className={classes.signOutButton} onClick={() => {
              logout();
              setDrawerOpen(false);
            }}>
              <ExitToApp style={{ fontSize: 20 }} />
              Sign Out
            </div>
          </>
        )}
      </Drawer>

      <div className={classes.desktop}>
        <div className={classes.leftSection}>
          <img src={logo} alt="logo" className={classes.logo} onClick={() => navigate('/')} />
          <Tabs 
            value={selectedTab}
            className={classes.navTabs}
            onChange={handleTabChange}
            TabIndicatorProps={{
              style: {
                background: selectedTab === 4
                    ? '#ECC94B'
                    : '#FFF',
              },
            }}
          >
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                  <div className={classes.tabIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 21 16">
                      <path fill="currentColor" d="m3.346 12.916 7.513 2.514 7.513-2.514V9.005l-5.983 1.955-1.53-2.234-1.53 2.234-5.983-1.955z"></path>
                      <path fill="currentColor" fillRule="evenodd" d="M.856 7.07 3.472 3.2 10.86.57l7.54 2.632 2.462 3.87-8.002 2.631-2-3.096-2 3.096zm5.078-3.56 4.925-1.703 4.924 1.703-4.924 1.703z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  Unbox
                </div>
              }
              style={{ padding: 0, marginRight: 24 }}
              onClick={() => navigate('/boxes')}
            />
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                  <div className={classes.tabIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <path fill="currentColor" d="m7.05 13.406 3.534 3.536-1.413 1.414 1.415 1.415-1.414 1.414-2.475-2.475-2.829 2.829-1.414-1.414 2.83-2.83-2.476-2.474 1.414-1.414 1.414 1.413 1.413-1.414zM3 3l3.546.003 11.817 11.818 1.415-1.414 1.414 1.414-2.474 2.475 2.828 2.829-1.414 1.414-2.829-2.829-2.475 2.475-1.414-1.414 1.414-1.415L3.003 6.531zm14.457 0L21 3.003l.002 3.523-4.053 4.052-3.536-3.535z"/>
                    </svg>
                  </div>
                  Battles
                </div>
              }
              style={{ padding: 0, marginRight: 24 }}
              onClick={() => navigate('/box-battles')}
            />
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                  <div className={classes.tabIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 36 36" fill="currentColor">
                      <g><g><path d="m33.7582016 19.7672596c.1900024.2200317.2799683.5200195.2299805.8100586-1.3099976 7.7799683-7.9899902 13.4199848-15.8800049 13.4199848-8.8800058 0-16.1099854-7.2200336-16.1099854-16.1000385 0-7.8999634 5.6499634-14.5799561 13.4199829-15.8800049.2900391-.0499879.5900278.0300293.8099985.2200317.2300415.1900024.3599854.4699707.3599854.7600098v6.7099609c0 .4400024-.289978.8200073-.6999521.9500122-3.2000122 1-5.3400269 3.9000244-5.3400269 7.2399902 0 4.1700439 3.3900146 7.5599976 7.5599985 7.5599976 3.3300171 0 6.2399902-2.1499634 7.2299805-5.3399658.1300049-.4199829.5200195-.710022.9500122-.710022h6.710022c.2999868 0 .5700064.1300049.7600088.3599854z"/><path d="m19.6281967 9.707262v-6.7099607c0-.2900391.1199951-.5700073.3499756-.7600098.2200317-.1900024.5200195-.2700197.8099976-.2200317 6.7600098 1.1300049 12.0700073 6.4300537 13.2000122 13.1900024.0499878.2900391-.039978.5900269-.2299805.8200073-.1900024.2200317-.460022.3500366-.7600098.3500366h-6.710022c-.4299927 0-.8200073-.2900391-.9500122-.7000122-.7399902-2.4000244-2.6199951-4.2700195-5.0099487-5.0200195-.4200439-.130005-.7000122-.5100099-.7000122-.9500124z"/></g></g></svg>
                  </div>
                  Upgrader
                </div>
              }
              style={{ padding: 0, marginRight: 24 }}
              onClick={() => navigate('/upgrader')}
            />
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                  <div className={classes.tabIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 12 12" fill="none">
                      <path d="M4.28657 11.4242C5.84279 11.4242 7.38702 10.4736 7.99736 8.82578C8.74526 6.78351 7.70011 4.50945 5.64347 3.74886C3.56163 2.99009 1.30795 4.07395 0.566542 6.09808C-0.389701 8.70297 1.56622 11.4242 4.28657 11.4242ZM2.14035 6.63804C2.39884 5.93193 2.99424 5.42887 3.73275 5.28576C3.98199 5.23962 4.22189 5.40577 4.27271 5.65502C4.31891 5.90427 4.15733 6.14427 3.90808 6.19498C3.48812 6.27346 3.15582 6.55961 3.0081 6.95653C2.89733 7.25654 2.91119 7.58422 3.04506 7.87504C3.1512 8.11038 3.04968 8.38267 2.81891 8.48881C2.56712 8.59672 2.30655 8.4838 2.20503 8.26266C1.96964 7.75042 1.94654 7.1735 2.14035 6.63804Z" fill="currentColor"/><path d="M11.4543 3.8181L10.5865 3.49961L10.1065 2.86269C9.74198 1.15964 8.20964 0.6981 8.16806 0.68886C7.20353 0.331986 6.16495 0.850944 5.84189 1.81037L5.77699 2.00812L5.47737 1.89809C4.89583 1.68112 4.24961 1.98119 4.0327 2.56735L3.93579 2.82579C5.21618 2.72325 6.5577 3.18197 7.54505 4.15964L7.64196 3.89191C7.74348 3.61038 7.73424 3.30113 7.605 3.02889C7.48038 2.75654 7.25423 2.54887 6.97275 2.44735L6.64474 2.32689L6.71888 2.1012C6.79269 1.87505 6.95427 1.69036 7.17118 1.58884C7.38347 1.48269 7.6281 1.46883 7.88197 1.56574C7.89583 1.56574 9.07728 1.92575 9.23886 3.2827C9.24348 3.30113 9.24348 3.31961 9.2481 3.33347L9.105 3.7212L8.37111 4.27502C8.26959 4.35345 8.21888 4.47807 8.23736 4.6027C8.25573 4.72732 8.33889 4.83347 8.45889 4.87961L9.32653 5.1981L9.88497 5.93655C9.94965 6.02427 10.0512 6.07036 10.1619 6.07036H10.2128C10.3373 6.05194 10.4435 5.96421 10.485 5.84421L10.8034 4.97657L11.5419 4.41807C11.6435 4.34421 11.6943 4.21958 11.6758 4.09502C11.6573 3.97039 11.5697 3.86425 11.4543 3.8181Z" fill="currentColor"/>
                    </svg>
                  </div>
                  Mines
                </div>
              }
              style={{ padding: 0, marginRight: 24 }}
              onClick={() => navigate('/mines')}
            />
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                  <div className={classes.tabIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 64 64">
                      <path fill="currentColor" d="M60,4H48c0-2.215-1.789-4-4-4H20c-2.211,0-4,1.785-4,4H4C1.789,4,0,5.785,0,8v8c0,8.836,7.164,16,16,16  c0.188,0,0.363-0.051,0.547-0.059C17.984,37.57,22.379,41.973,28,43.43V56h-8c-2.211,0-4,1.785-4,4v4h32v-4c0-2.215-1.789-4-4-4h-8  V43.43c5.621-1.457,10.016-5.859,11.453-11.488C47.637,31.949,47.812,32,48,32c8.836,0,16-7.164,16-16V8C64,5.785,62.211,4,60,4z   M8,16v-4h8v12C11.582,24,8,20.414,8,16z M56,16c0,4.414-3.582,8-8,8V12h8V16z"/>
                    </svg>
                  </div>
                  Race
                </div>
              }
              style={{ padding: 0, color: "#ECC94B", marginRight: 24 }}
              onClick={() => navigate('/leaderboard')}
            />
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                  <div className={classes.tabIcon}>
                    <svg width="16" height="16" viewBox="0 0 18 18" focusable="false">
                      <path d="M1.3 10.487H8.25V17.674C8.25 17.7534 8.21839 17.8296 8.16213 17.8857C8.10587 17.9419 8.02956 17.9735 7.95 17.9735H4C3.5925 18.0315 3.17705 17.994 2.78655 17.8641C2.39606 17.7341 2.04123 17.5152 1.75016 17.2247C1.4591 16.9341 1.23978 16.5799 1.10958 16.1901C0.979374 15.8004 0.941858 15.3857 1 14.9789V10.7865C1 10.7472 1.00776 10.7082 1.02284 10.6719C1.03791 10.6356 1.06001 10.6026 1.08787 10.5747C1.11573 10.5469 1.1488 10.5249 1.18519 10.5098C1.22159 10.4948 1.2606 10.487 1.3 10.487ZM16.7 10.487H9.75V17.674C9.75 17.7133 9.75776 17.7523 9.77284 17.7886C9.78791 17.8249 9.81001 17.8579 9.83787 17.8857C9.86572 17.9136 9.8988 17.9356 9.93519 17.9507C9.97159 17.9657 10.0106 17.9735 10.05 17.9735H14C14.4075 18.0315 14.8229 17.994 15.2134 17.8641C15.6039 17.7341 15.9588 17.5152 16.2498 17.2247C16.5409 16.9341 16.7602 16.5799 16.8904 16.1901C17.0206 15.8004 17.0581 15.3857 17 14.9789V10.7865C17 10.7472 16.9922 10.7082 16.9772 10.6719C16.9621 10.6356 16.94 10.6026 16.9121 10.5747C16.8843 10.5469 16.8512 10.5249 16.8148 10.5098C16.7784 10.4948 16.7394 10.487 16.7 10.487ZM18 5.49609V8.6903C18 8.76972 17.9684 8.84589 17.9121 8.90204C17.8559 8.9582 17.7796 8.98975 17.7 8.98975H9.75V5.49609H8.25V8.98975H0.3C0.220435 8.98975 0.144129 8.9582 0.087868 8.90204C0.0316071 8.84589 0 8.76972 0 8.6903V5.49609C0 5.09899 0.158035 4.71814 0.43934 4.43735C0.720644 4.15655 1.10218 3.99881 1.5 3.99881H2.565C2.38874 3.67123 2.28382 3.31017 2.25711 2.93929C2.2304 2.56841 2.2825 2.19609 2.41 1.84671C2.56818 1.38599 2.84687 0.975845 3.2172 0.658757C3.58753 0.341669 4.03605 0.129161 4.51631 0.0432397C4.99657 -0.0426817 5.49111 0.00110656 5.94872 0.17007C6.40632 0.339034 6.81036 0.62703 7.119 1.00424C7.151 1.04416 8.276 2.53746 9 3.49971L10.874 1.01322C11.1757 0.641055 11.57 0.354579 12.0176 0.18251C12.4651 0.0104414 12.9501 -0.0411754 13.424 0.032834C13.8978 0.106843 14.3438 0.303879 14.7173 0.604189C15.0908 0.9045 15.3786 1.29753 15.552 1.7439C15.7005 2.10507 15.767 2.49457 15.7467 2.88444C15.7265 3.27431 15.6201 3.65488 15.435 3.99881H16.5C16.8978 3.99881 17.2794 4.15655 17.5607 4.43735C17.842 4.71814 18 5.09899 18 5.49609ZM7.5 3.99881C6.821 3.10044 6 2.01441 5.948 1.94353C5.83287 1.80424 5.68799 1.69241 5.52395 1.61624C5.35992 1.54008 5.1809 1.5015 5 1.50333C4.66848 1.50333 4.35054 1.63479 4.11612 1.86879C3.8817 2.10278 3.75 2.42015 3.75 2.75107C3.75 3.08199 3.8817 3.39936 4.11612 3.63335C4.35054 3.86735 4.66848 3.99881 5 3.99881H7.5ZM14.25 2.75107C14.2495 2.42031 14.1176 2.10325 13.8833 1.86937C13.649 1.63549 13.3314 1.50386 13 1.50333C12.8157 1.50219 12.6336 1.54263 12.4672 1.62162C12.3008 1.70061 12.1544 1.81612 12.039 1.9595C11.992 2.02039 11.177 3.10044 10.5 3.99881H13C13.3314 3.99828 13.649 3.86665 13.8833 3.63277C14.1176 3.39889 14.2495 3.08183 14.25 2.75107Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  Rewards
                </div>
              }
              style={{ padding: 0 }}
              onClick={() => navigate('/rewards')}
            />
          </Tabs>
        </div>

        {user?._id ? (
          <>
            <div className={classes.rightSection}>
              <motion.div className={classes.balanceGroup} onClick={() => setIsOpen(true)}>
                ${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {/*<motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none"
                  animate={{ rotate: balanceOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path 
                    d="M6.17917 6.84167L10 10.6625L13.8208 6.84167L15 8.02083L10 13.0208L5 8.02083L6.17917 6.84167Z" 
                    fill="currentColor"
                  />
                </motion.svg>

                <motion.div
                  className={classes.balanceMenu}
                  initial="exit"
                  animate={balanceOpen ? "enter" : "exit"}
                  variants={dropdownAnimate}
                >
                  <div className={classes.balanceMenuItem} onClick={() => {
                    setIsOpen(true);
                    setBalanceOpen(false);
                  }}>
                    Deposit
                  </div>
                  <div className={classes.balanceMenuItem} onClick={() => {
                    setIsOpen(true);
                    setBalanceOpen(false);
                  }}>
                    Withdraw
                  </div>
                  <div className={classes.balanceMenuItem} onClick={() => {
                    setIsOpen(true);
                    setBalanceOpen(false);
                  }}>
                    Coupon
                  </div>
                </motion.div>*/}
              </motion.div>
              {/* <div className={classes.walletGroup} onClick={() => setIsOpen(true)}>Wallet</div> */}
              <div className={classes.avatarContainer} onClick={() => navigate('/profile')}>
                <img 
                  src={user?.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} 
                  alt="avatar" 
                  className={classes.avatar}
                  style={{ cursor: 'pointer' }}
                />
                <div className={classes.levelBox}>
                  <LevelBox level={getLevel(user)} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SecondaryButton
              label={'Log In'}
              onClick={() => setLoginOpen(!loginOpen)}
              style={{ height: 40, padding: "6px 28px", fontSize: 13 }}
            />
            <PrimaryButton
              label={'Register'}
              onClick={() => setLoginOpen(!loginOpen)}
              style={{ height: 40, padding: "6px 28px", fontSize: 13 }}
            />
          </div>
        )}
      </div>

      <div className={classes.mobile}>
        <svg onClick={() => navigate('/')} style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 118 118" fill="none"><path d="M32.5897 76.5201L10.3472 77.0994C9.81229 77.0994 9.54485 77.7679 9.90144 78.169L22.3377 90.9149C22.4714 91.0486 22.516 91.1823 22.516 91.3606V91.6725C22.516 91.8508 22.4714 91.9845 22.3377 92.1182L0.184247 114.357C-0.0831984 114.624 -0.0386242 115.025 0.184247 115.248L2.72498 117.61C2.99243 117.833 3.34902 117.833 3.57189 117.61L25.859 95.6835C25.9928 95.5498 26.1265 95.5052 26.3048 95.5052H26.6168C26.7951 95.5052 26.9288 95.5498 27.0625 95.6835L39.6325 107.85C40.0336 108.251 40.7023 107.939 40.7023 107.404L41.148 85.0322L32.5897 76.5201Z" fill="url(#paint0_linear_2451_18057)"/><path d="M116.791 6.23926L83.5381 39.6193L99.9415 56.0196L116.701 39.2182C116.835 39.0845 116.88 38.9508 116.88 38.8171L117.86 6.72949C117.905 6.10556 117.192 5.83816 116.791 6.23926Z" fill="url(#paint1_linear_2451_18057)"/><path d="M46.3632 90.291L45.9175 108.519C45.9175 109.098 46.5861 109.365 46.9872 108.964L56.0358 99.9173L46.3632 90.291Z" fill="url(#paint2_linear_2451_18057)"/><path d="M17.9248 61.8578L8.87623 70.9047C8.47506 71.3058 8.78708 71.9743 9.32197 71.9743L27.5529 71.5287L17.9248 61.8578Z" fill="url(#paint3_linear_2451_18057)"/><path d="M111.174 0L79.0807 0.980455C78.9024 0.980455 78.7687 1.06959 78.635 1.15872L61.8751 17.9156L78.2784 34.3159L111.62 1.02502C112.066 0.668492 111.754 0 111.174 0Z" fill="url(#paint4_linear_2451_18057)"/><path d="M77.3869 76.4755L107.653 77.2777C108.188 77.2777 108.455 77.9462 108.099 78.3473L95.7069 91.1378C95.5732 91.2715 95.5286 91.4052 95.5286 91.5834V91.8954C95.5286 92.0736 95.5732 92.2073 95.7069 92.341L117.816 114.58C118.083 114.847 118.039 115.248 117.816 115.471L115.275 117.833C115.008 118.056 114.651 118.056 114.428 117.833L92.141 95.8172C92.0073 95.6835 91.8735 95.6389 91.6952 95.6389H91.3832C91.2049 95.6389 91.0712 95.6835 90.9375 95.8172L78.3675 107.984C77.9664 108.385 77.2977 108.073 77.2977 107.538L76.7183 77.0549C76.7183 76.7429 77.0303 76.4309 77.3869 76.4755Z" fill="url(#paint5_linear_2451_18057)"/><path d="M71.1019 76.4755L1.20946 6.37296C0.808287 5.97186 0.139673 6.28383 0.139673 6.81862L1.12031 38.9062C1.12031 39.0845 1.20946 39.2182 1.2986 39.3073L71.0128 109.098C71.4139 109.499 72.0825 109.187 72.0825 108.652L71.2802 76.8766C71.2802 76.7429 71.2356 76.5646 71.1019 76.4755Z" fill="url(#paint6_linear_2451_18057)"/><path d="M76.4508 71.1276L6.38007 1.20329C5.9789 0.802191 6.29092 0.133698 6.82581 0.133698L38.9193 1.11415C39.0976 1.11415 39.2313 1.20329 39.3205 1.29242L109.124 71.0384C109.525 71.4395 109.213 72.108 108.678 72.108L76.8966 71.3058C76.7183 71.3058 76.54 71.2613 76.4508 71.1276Z" fill="url(#paint7_linear_2451_18057)"/><defs><linearGradient id="paint0_linear_2451_18057" x1="118.064" y1="118.101" x2="-0.0900401" y2="-0.0106078" gradientUnits="userSpaceOnUse"><stop stop-color="#5A9CFF"/><stop offset="1" stop-color="#3584FC"/></linearGradient><linearGradient id="paint1_linear_2451_18057" x1="118.064" y1="118.101" x2="-0.0900401" y2="-0.0106078" gradientUnits="userSpaceOnUse"><stop stop-color="#5A9CFF"/><stop offset="1" stop-color="#3584FC"/></linearGradient><linearGradient id="paint2_linear_2451_18057" x1="118.064" y1="118.101" x2="-0.0900401" y2="-0.0106078" gradientUnits="userSpaceOnUse"><stop stop-color="#5A9CFF"/><stop offset="1" stop-color="#3584FC"/></linearGradient><linearGradient id="paint3_linear_2451_18057" x1="118.064" y1="118.101" x2="-0.0900401" y2="-0.0106078" gradientUnits="userSpaceOnUse"><stop stop-color="#5A9CFF"/><stop offset="1" stop-color="#3584FC"/></linearGradient><linearGradient id="paint4_linear_2451_18057" x1="118.064" y1="118.101" x2="-0.0900401" y2="-0.0106078" gradientUnits="userSpaceOnUse"><stop stop-color="#5A9CFF"/><stop offset="1" stop-color="#3584FC"/></linearGradient><linearGradient id="paint5_linear_2451_18057" x1="118.064" y1="118.101" x2="-0.0900401" y2="-0.0106078" gradientUnits="userSpaceOnUse"><stop stop-color="#5A9CFF"/><stop offset="1" stop-color="#3584FC"/></linearGradient><linearGradient id="paint6_linear_2451_18057" x1="118.064" y1="118.101" x2="-0.0900401" y2="-0.0106078" gradientUnits="userSpaceOnUse"><stop stop-color="#5A9CFF"/><stop offset="1" stop-color="#3584FC"/></linearGradient><linearGradient id="paint7_linear_2451_18057" x1="118.064" y1="118.101" x2="-0.0900401" y2="-0.0106078" gradientUnits="userSpaceOnUse"><stop stop-color="#5A9CFF"/><stop offset="1" stop-color="#3584FC"/></linearGradient></defs></svg>        
          
        {user?._id && (
          <div style={{ display: "flex", alignItems: "center" }}>
              <motion.div className={classes.balanceGroup} onClick={() => setIsOpen(true)}>
                ${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {/*<motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none"
                  animate={{ rotate: balanceOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path 
                    d="M6.17917 6.84167L10 10.6625L13.8208 6.84167L15 8.02083L10 13.0208L5 8.02083L6.17917 6.84167Z" 
                    fill="currentColor"
                  />
                </motion.svg>

                <motion.div
                  className={classes.balanceMenu}
                  initial="exit"
                  animate={balanceOpen ? "enter" : "exit"}
                  variants={dropdownAnimate}
                >
                  <div className={classes.balanceMenuItem} onClick={() => {
                    setIsOpen(true);
                    setBalanceOpen(false);
                  }}>
                    Deposit
                  </div>
                  <div className={classes.balanceMenuItem} onClick={() => {
                    setIsOpen(true);
                    setBalanceOpen(false);
                  }}>
                    Withdraw
                  </div>
                  <div className={classes.balanceMenuItem} onClick={() => {
                    setIsOpen(true);
                    setBalanceOpen(false);
                  }}>
                    Coupon
                  </div>
                </motion.div>*/}
              </motion.div>
          </div>
        )}

        {user?._id ? (
          <div className={classes.burgerMenu} onClick={handleDrawerToggle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="none">
              <path d="M0 0H18V2H0V0ZM0 5H18V7H0V5ZM0 10H18V12H0V10Z" fill="currentColor"/>
            </svg>
          </div>
        ) : (
          <PrimaryButton
            label={'Log In'}
            onClick={() => setLoginOpen(!loginOpen)}
            style={{ height: 34, padding: "6px 28px", fontSize: 13 }}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;