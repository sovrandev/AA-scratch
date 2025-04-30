// User related contexts
import { UserProvider, useUser } from './user';

// Game related contexts
import { UnboxProvider, useUnbox } from './unbox';
import { BattlesProvider, useBattles } from './battles';
import { UpgraderProvider, useUpgrader } from './upgrader';
import { MinesProvider, useMines } from './mines';

// Misc contexts
import { NotificationProvider, useNotification } from './notification';
import { SoundProvider, useSound } from './sound';
import { CashierProvider, useCashier } from './cashier';
import { LeaderboardProvider, useLeaderboard } from './leaderboard';
import { LiveDropsProvider, useLiveDrops } from './livedrops';
import { RewardsProvider, useRewards } from './rewards';
import { ChatProvider, useChat } from './chat';

// Admin contexts
import { AdminProvider, useAdmin } from './admin';
import { SettingsProvider, useSettings } from './settings';

// Export all hooks and providers
export { UserProvider, useUser } from './user';
export { UnboxProvider, useUnbox } from './unbox';
export { BattlesProvider, useBattles } from './battles';
export { UpgraderProvider, useUpgrader } from './upgrader';
export { MinesProvider, useMines } from './mines';
export { NotificationProvider, useNotification } from './notification';
export { SoundProvider, useSound } from './sound';
export { CashierProvider, useCashier } from './cashier';
export { LeaderboardProvider, useLeaderboard } from './leaderboard';
export { LiveDropsProvider, useLiveDrops } from './livedrops';
export { RewardsProvider, useRewards } from './rewards';
export { AdminProvider, useAdmin } from './admin';
export { SettingsProvider, useSettings } from './settings';
export { ChatProvider, useChat } from './chat';

/**
 * AppProviders component for wrapping the app with all context providers
 * Providers are nested in a specific order to ensure proper dependency resolution
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AppProviders = ({ children }) => {
  return (
    <SoundProvider>
      <NotificationProvider>
        <LeaderboardProvider>
          <SettingsProvider>
            <UnboxProvider>
              <BattlesProvider>
                <UpgraderProvider>
                  <MinesProvider>
                    <CashierProvider>
                      <UserProvider>
                        <ChatProvider>
                          <AdminProvider>
                            <LiveDropsProvider>
                              <RewardsProvider>
                                {children}
                              </RewardsProvider>
                            </LiveDropsProvider>
                          </AdminProvider>
                        </ChatProvider>
                      </UserProvider>
                    </CashierProvider>
                  </MinesProvider>
                </UpgraderProvider>         
              </BattlesProvider>
            </UnboxProvider>
          </SettingsProvider>
        </LeaderboardProvider>
      </NotificationProvider>
    </SoundProvider>
  );
};