import React from 'react';
import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useUser } from '../../contexts/user';
import {
  Person,
  AccountBalance,
  Payment,
  History,
  CardGiftcard,
  TrendingUp,
  Casino,
  Group,
  Gavel,
  ExitToApp
} from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
  profileRoot: {
    display: "flex",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    marginBottom: "15rem",
    paddingTop: theme.spacing(4),
    gap: "32px",
    zIndex: 1,
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      paddingLeft: "16px",
      paddingRight: "16px",
      gap: "24px",
    }
  },
  sidebar: {
    width: 180,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    height: "100%",
    "@media (max-width: 1200px)": {
      width: "100%",
      flexDirection: "row",
      overflowX: "auto",
      overflowY: "hidden",
      height: "40px",
      gap: 0,
      border: `1px solid ${theme.bg.border}80`,
      borderRadius: "6px",
      overflowX: "scroll",
    }
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    fontWeight: 600,
    fontSize: 14,
    gap: "8px",
    color: theme.text.secondary,
    borderRadius: theme.spacing(0.75),
    cursor: "pointer",
    transition: "all 0.2s",
    textDecoration: "none",
    '&:hover': {
      background: theme.bg.inner,
      color: theme.text.primary
    },
    "@media (max-width: 1200px)": {
      width: "100%",
      whiteSpace: "nowrap",
    }
  },
  activeSidebarItem: {
    color: theme.text.primary,
    background: theme.bg.inner
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    fontWeight: 600,
    fontSize: 14,
    gap: "8px",
    color: theme.palette.error.main + "BF",
    borderRadius: theme.spacing(0.75),
    cursor: "pointer",
    transition: "all 0.2s",
    textDecoration: "none",
    '&:hover': {
      background: theme.palette.error.main + "26",
      color: theme.palette.error.main
    },
  },
  mainContent: {
    flexGrow: 1,
    overflowY: 'auto',
    minHeight: "100vh",
    '&::-webkit-scrollbar': {
      width: '0px',
    },
    "@media (max-width: 1200px)": {
      height: "100%",
    }
  },
  contentWidth: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },
}));

const menuItems = [
  { text: 'Profile', icon: <Person style={{ fontSize: 20 }} />, path: '/profile' },
  { text: 'Deposits', icon: <AccountBalance style={{ fontSize: 20 }} />, path: '/profile/deposits' },
  { text: 'Withdrawals', icon: <Payment style={{ fontSize: 20 }} />, path: '/profile/withdrawals' },
  { text: 'Battle History', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="m7.05 13.406 3.534 3.536-1.413 1.414 1.415 1.415-1.414 1.414-2.475-2.475-2.829 2.829-1.414-1.414 2.83-2.83-2.476-2.474 1.414-1.414 1.414 1.413 1.413-1.414zM3 3l3.546.003 11.817 11.818 1.415-1.414 1.414 1.414-2.474 2.475 2.828 2.829-1.414 1.414-2.829-2.829-2.475 2.475-1.414-1.414 1.414-1.415L3.003 6.531zm14.457 0L21 3.003l.002 3.523-4.053 4.052-3.536-3.535z"/></svg>, path: '/profile/battle-history' },
  { text: 'Box History', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 21 16"><path fill="currentColor" d="m3.346 12.916 7.513 2.514 7.513-2.514V9.005l-5.983 1.955-1.53-2.234-1.53 2.234-5.983-1.955z"></path><path fill="currentColor" fillRule="evenodd" d="M.856 7.07 3.472 3.2 10.86.57l7.54 2.632 2.462 3.87-8.002 2.631-2-3.096-2 3.096zm5.078-3.56 4.925-1.703 4.924 1.703-4.924 1.703z" clipRule="evenodd"></path></svg>, path: '/profile/box-history' },
  { text: 'Upgrader History', icon: <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 36 36" fill="currentColor"><g><g><path d="m33.7582016 19.7672596c.1900024.2200317.2799683.5200195.2299805.8100586-1.3099976 7.7799683-7.9899902 13.4199848-15.8800049 13.4199848-8.8800058 0-16.1099854-7.2200336-16.1099854-16.1000385 0-7.8999634 5.6499634-14.5799561 13.4199829-15.8800049.2900391-.0499879.5900278.0300293.8099985.2200317.2300415.1900024.3599854.4699707.3599854.7600098v6.7099609c0 .4400024-.289978.8200073-.6999521.9500122-3.2000122 1-5.3400269 3.9000244-5.3400269 7.2399902 0 4.1700439 3.3900146 7.5599976 7.5599985 7.5599976 3.3300171 0 6.2399902-2.1499634 7.2299805-5.3399658.1300049-.4199829.5200195-.710022.9500122-.710022h6.710022c.2999868 0 .5700064.1300049.7600088.3599854z"/><path d="m19.6281967 9.707262v-6.7099607c0-.2900391.1199951-.5700073.3499756-.7600098.2200317-.1900024.5200195-.2700197.8099976-.2200317 6.7600098 1.1300049 12.0700073 6.4300537 13.2000122 13.1900024.0499878.2900391-.039978.5900269-.2299805.8200073-.1900024.2200317-.460022.3500366-.7600098.3500366h-6.710022c-.4299927 0-.8200073-.2900391-.9500122-.7000122-.7399902-2.4000244-2.6199951-4.2700195-5.0099487-5.0200195-.4200439-.130005-.7000122-.5100099-.7000122-.9500124z"/></g></g></svg>, path: '/profile/upgrader-history' },
  { text: 'Mines History', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none"><path d="M4.28657 11.4242C5.84279 11.4242 7.38702 10.4736 7.99736 8.82578C8.74526 6.78351 7.70011 4.50945 5.64347 3.74886C3.56163 2.99009 1.30795 4.07395 0.566542 6.09808C-0.389701 8.70297 1.56622 11.4242 4.28657 11.4242ZM2.14035 6.63804C2.39884 5.93193 2.99424 5.42887 3.73275 5.28576C3.98199 5.23962 4.22189 5.40577 4.27271 5.65502C4.31891 5.90427 4.15733 6.14427 3.90808 6.19498C3.48812 6.27346 3.15582 6.55961 3.0081 6.95653C2.89733 7.25654 2.91119 7.58422 3.04506 7.87504C3.1512 8.11038 3.04968 8.38267 2.81891 8.48881C2.56712 8.59672 2.30655 8.4838 2.20503 8.26266C1.96964 7.75042 1.94654 7.1735 2.14035 6.63804Z" fill="currentColor"/><path d="M11.4543 3.8181L10.5865 3.49961L10.1065 2.86269C9.74198 1.15964 8.20964 0.6981 8.16806 0.68886C7.20353 0.331986 6.16495 0.850944 5.84189 1.81037L5.77699 2.00812L5.47737 1.89809C4.89583 1.68112 4.24961 1.98119 4.0327 2.56735L3.93579 2.82579C5.21618 2.72325 6.5577 3.18197 7.54505 4.15964L7.64196 3.89191C7.74348 3.61038 7.73424 3.30113 7.605 3.02889C7.48038 2.75654 7.25423 2.54887 6.97275 2.44735L6.64474 2.32689L6.71888 2.1012C6.79269 1.87505 6.95427 1.69036 7.17118 1.58884C7.38347 1.48269 7.6281 1.46883 7.88197 1.56574C7.89583 1.56574 9.07728 1.92575 9.23886 3.2827C9.24348 3.30113 9.24348 3.31961 9.2481 3.33347L9.105 3.7212L8.37111 4.27502C8.26959 4.35345 8.21888 4.47807 8.23736 4.6027C8.25573 4.72732 8.33889 4.83347 8.45889 4.87961L9.32653 5.1981L9.88497 5.93655C9.94965 6.02427 10.0512 6.07036 10.1619 6.07036H10.2128C10.3373 6.05194 10.4435 5.96421 10.485 5.84421L10.8034 4.97657L11.5419 4.41807C11.6435 4.34421 11.6943 4.21958 11.6758 4.09502C11.6573 3.97039 11.5697 3.86425 11.4543 3.8181Z" fill="currentColor"/></svg>, path: '/profile/mines-history' },
  { text: 'Affiliates', icon: <Group style={{ fontSize: 20 }} />, path: '/profile/affiliates' },
  { text: 'Fairness', icon: <Gavel style={{ fontSize: 20 }} />, path: '/profile/fairness' },
];

const ProfileLayout = () => {
  const classes = useStyles();
  const location = useLocation();
  const { isAuthenticated, logout } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className={classes.profileRoot}>
      <div className={classes.sidebar}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`${classes.sidebarItem} ${
              (item.path === '/profile' && location.pathname === '/profile') || 
              (item.path !== '/profile' && location.pathname.startsWith(item.path)) 
                ? classes.activeSidebarItem 
                : ''
            }`}
          >
            {item.icon}
            {item.text}
          </NavLink>
        ))}
        <div onClick={logout} className={classes.logoutButton}>
          <ExitToApp style={{ fontSize: 20 }} />
          Logout
        </div>
      </div>
      <div className={classes.mainContent}>
        <div className={classes.contentWidth}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout; 