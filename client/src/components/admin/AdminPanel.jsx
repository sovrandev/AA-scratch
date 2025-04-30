import ActionsLog from './actions/ActionsLog';

const sidebarLinks = [
  { label: 'Dashboard', path: `/admin`, icon: <DashboardIcon /> },
  { label: 'Users', path: `/admin/users`, icon: <PeopleIcon /> },
  { label: 'Games', path: `/admin/games`, icon: <SportsEsportsIcon /> },
  { label: 'Cashier', path: `/admin/cashier`, icon: <MonetizationOnIcon /> },
  { label: 'Affiliates', path: `/admin/affiliates`, icon: <AccountTreeIcon /> },
  { label: 'Wallet', path: `/admin/wallet`, icon: <AccountBalanceWalletIcon /> },
  { label: 'Ledger', path: `/admin/ledger`, icon: <AssessmentIcon /> },
  { label: 'Streamers', path: `/admin/streamers`, icon: <VideocamIcon /> },
  { label: 'Actions Log', path: `/admin/actions`, icon: <HistoryIcon /> },
  { label: 'Settings', path: `/admin/settings`, icon: <SettingsIcon /> }
];

<Route path="/admin/actions">
  <ActionsLog />
</Route> 