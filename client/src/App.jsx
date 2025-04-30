import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import theme from './styles/theme';

// Import AppProviders
import { AppProviders } from "./contexts";

// Import Preloader
import Preloader from "./components/app/Preloader";

// Import Chat
import Chat from "./components/chat/Chat";

// Layouts
import LiveDropsLayout from "./components/app/LiveDropsLayout";
import DefaultLayout from "./components/app/DefaultLayout";

// User Pages
import Navbar from "./components/app/Navbar";
import Footer from "./components/app/Footer";
import Home from "./pages/Home";
import Rewards from "./pages/Rewards";
import VIPClub from "./pages/VIPClub";
import Leaderboard from "./pages/Leaderboard";
import BoxesOverview from "./pages/BoxesOverview";
import BoxesGame from "./pages/BoxesGame";
import BattlesOverview from "./pages/BattlesOverview";
import BattlesCreate from "./pages/BattlesCreate";
import BattlesGame from "./pages/BattlesGame";
import UpgraderGame from "./pages/UpgraderGame";
import MinesGame from "./pages/MinesGame";

// Admin Pages
import AdminLayout from "./components/admin/AdminLayout";
import BoxManager from "./components/admin/boxes/BoxManager";
import FilterManager from "./components/admin/filter/FilterManager";
import StatsManager from "./components/admin/stats/StatsManager";
import SettingsManager from "./components/admin/settings/SettingsManager";
import LeaderboardManager from "./components/admin/leaderboard/LeaderboardManager";
import PromoManager from "./components/admin/promo/PromoManager";
import UsersManager from "./components/admin/users/UsersManager";
import RainManager from './components/admin/rain/RainManager';
import AffiliateManager from './components/admin/affiliate/AffiliateManager';
import CashierManager from './components/admin/cashier/CashierManager';
import LedgerManager from './components/admin/ledger/LedgerManager';
import WalletManager from './components/admin/wallet/WalletManager';
import StreamersManager from './components/admin/streamers/StreamersManager';
import ActionsLog from './components/admin/actions/ActionsLog';

// Modals
import CashierModal from "./components/cashier/CashierModal";

// Profile Components
import ProfileLayout from "./components/profile/ProfileLayout";
import Profile from "./components/profile/main/Profile";
import Deposits from "./components/profile/deposits/Deposits";
import Withdrawals from "./components/profile/withdrawals/Withdrawals";
import BattleHistory from "./components/profile/history/BattleHistory";
import BoxHistory from "./components/profile/history/BoxHistory";
import UpgraderHistory from "./components/profile/history/UpgraderHistory";
import MinesHistory from "./components/profile/history/MinesHistory";
import Affiliates from "./components/profile/affiliates/Affiliates";
import Fairness from "./components/profile/fairness/Fairness";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.bg.main,
    height: "100vh",
    fontFamily: "Onest",
    display: "flex", 
    overflow: "hidden", 
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    height: "100vh",
    overflow: "hidden",
  },
  body: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  content: {
    position: "relative",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto", 
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: theme.bg.box,
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.bg.border,
      borderRadius: '6px',
    },
  },
  backgroundImage: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${require('./assets/img/background.png')})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    opacity: 0.04,
    mixBlendMode: "luminosity",
    pointerEvents: "none",
    zIndex: 0,
    minHeight: "100vh",
    width: "100%",
  },
  radialGradientOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    //background: `radial-gradient(circle at center, ${theme.bg.main} 0%, ${theme.bg.main} 30%, transparent 100%)`,
    pointerEvents: "none",
    zIndex: 0,
  },
}));

const AppContent = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Chat />
      <div className={classes.mainContainer}>
        <Navbar />
        <div className={classes.body}>
          <div className={classes.content}>
            <div className={classes.backgroundImage} />
            <div className={classes.radialGradientOverlay} />

            <Routes>
              {/* Profile Routes */}
              <Route path="/profile" element={<ProfileLayout />}>
                <Route index element={<Profile />} />
                <Route path="deposits" element={<Deposits />} />
                <Route path="withdrawals" element={<Withdrawals />} />
                <Route path="battle-history" element={<BattleHistory />} />
                <Route path="box-history" element={<BoxHistory />} />
                <Route path="upgrader-history" element={<UpgraderHistory />} />
                <Route path="mines-history" element={<MinesHistory />} />
                <Route path="affiliates" element={<Affiliates />} />
                <Route path="fairness" element={<Fairness />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<StatsManager />} />
                <Route path="users" element={<UsersManager />} />
                <Route path="users/:userId" element={<UsersManager />} />
                <Route path="boxes" element={<BoxManager />} />
                <Route path="filters" element={<FilterManager />} />
                <Route path="rain" element={<RainManager />} />
                <Route path="affiliates" element={<AffiliateManager />} />
                <Route path="settings" element={<SettingsManager />} />
                <Route path="leaderboard" element={<LeaderboardManager />} />
                <Route path="promo" element={<PromoManager />} />
                <Route path="cashier" element={<CashierManager />} />
                <Route path="ledger" element={<LedgerManager />} />
                <Route path="wallet" element={<WalletManager />} />
                <Route path="streamers" element={<StreamersManager />} />
                <Route path="actions" element={<ActionsLog />} />
              </Route>

              {/* Pages with LiveDrops */}
              <Route element={<LiveDropsLayout />}>
                <Route index element={<Home />} />
                <Route path="boxes" element={<BoxesOverview />} />
                <Route path="box-battles" element={<BattlesOverview />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="rewards" element={<Rewards />} />
              </Route>

              {/* Pages without LiveDrops */}
              <Route element={<DefaultLayout />}>
                <Route path="boxes/:boxSlug" element={<BoxesGame />} />
                <Route path="box-battles/create" element={<BattlesCreate />} />
                <Route path="box-battles/:id" element={<BattlesGame />} />
                <Route path="upgrader" element={<UpgraderGame />} />
                <Route path="mines" element={<MinesGame />} />
                <Route path="vip-club" element={<VIPClub />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </div>
        </div>
        <CashierModal />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppProviders>
          <Preloader>
            <AppContent />
          </Preloader>
        </AppProviders>
      </Router>
    </ThemeProvider>
  );
};

export default App;