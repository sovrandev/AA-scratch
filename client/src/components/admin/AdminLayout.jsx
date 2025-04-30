import React from 'react';
import { useUser } from '../../contexts/user';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdminStyles } from './styles/adminStyles';
import { 
  Dashboard,
  People,
  Settings,
  FilterList,
  Redeem,
  CloudQueue,
  Group,
  AccountBalance,
  EmojiEvents,
  Assessment,
  AccountBalanceWallet,
  VideoLibrary,
  History
} from '@material-ui/icons';

const ADMIN_ROUTES = [
  { path: '/admin', label: 'Stats', icon: <Assessment /> },
  { path: '/admin/ledger', label: 'Ledger', icon: <AccountBalance /> },
  { path: '/admin/wallet', label: 'Wallet', icon: <AccountBalanceWallet /> },
  { path: '/admin/cashier', label: 'Cashier', icon: <AccountBalance /> },
  { path: '/admin/settings', label: 'Settings', icon: <Settings /> },
  { path: '/admin/users', label: 'Users', icon: <People /> },
  { path: '/admin/streamers', label: 'Streamers', icon: <VideoLibrary /> },
  { path: '/admin/affiliates', label: 'Affiliates', icon: <Group /> },
  { path: '/admin/actions', label: 'Actions Log', icon: <History /> },
  { path: '/admin/leaderboard', label: 'Leaderboard', icon: <EmojiEvents /> },
  { path: '/admin/boxes', label: 'Boxes', icon: <Redeem /> },
  // { path: '/admin/filters', label: 'Filters', icon: <FilterList /> },
  // { path: '/admin/rain', label: 'Rain', icon: <CloudQueue /> },
];

const AdminLayout = () => {
  const classes = useAdminStyles();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  if (user?.rank !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className={classes.adminRoot}>
      <div className={classes.sidebar}>
        {ADMIN_ROUTES.map((route) => (
          <div
            key={route.path}
            className={`${classes.sidebarItem} ${
              location.pathname === route.path ? classes.activeSidebarItem : ''
            }`}
            onClick={() => navigate(route.path)}
          >
            {route.icon}
            <span>{route.label}</span>
          </div>
        ))}
      </div>
      <main className={classes.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 