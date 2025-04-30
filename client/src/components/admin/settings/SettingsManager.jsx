import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { useSettings } from '../../../contexts/settings';
import { useNotification } from '../../../contexts/notification';
import { TextField, Switch, Tabs, Tab } from '@material-ui/core';

const SettingsManager = () => {
  const classes = useAdminStyles();
  const { settings } = useSettings();
  const { updateSetting } = useAdmin();
  const [activeTab, setActiveTab] = useState(0);
  const [rewardMultiplier, setRewardMultiplier] = useState(settings?.general?.reward?.multiplier || '1');

  useEffect(() => {
    if (settings?.general?.reward?.multiplier) {
      setRewardMultiplier(settings.general.reward.multiplier.toString());
    }
  }, [settings]);

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} className={classes.tabPanel}>
      {value === index && children}
    </div>
  );

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Settings</h1>
      </div>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        className={classes.tabs}
      >
        <Tab label="General" />
        <Tab label="Chat" />
        <Tab label="Games" />
        <Tab label="Cashier" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <div className={classes.settingsGrid}>
          <div className={classes.settingRow}>
            <div className={classes.settingInfo}>
              <span className={classes.settingTitle}>Maintenance Mode</span>
              <span className={classes.settingDescription}>Enable maintenance mode</span>
            </div>
            <Switch
              checked={settings?.general?.maintenance?.enabled || false}
              onChange={() => updateSetting('general.maintenance.enabled', !settings?.general?.maintenance?.enabled)}
              classes={{
                track: classes.switchTrack,
                switchBase: classes.switchBase,
                checked: classes.switchChecked
              }}
            />
          </div>
          <div className={classes.settingRow}>
            <div className={classes.settingInfo}>
              <span className={classes.settingTitle}>Rain</span>
              <span className={classes.settingDescription}>Enable rain</span>
            </div>
            <Switch
              checked={settings?.general?.rain?.enabled || false}
              onChange={() => updateSetting('general.rain.enabled', !settings?.general?.rain?.enabled)}
              classes={{
                track: classes.switchTrack,
                switchBase: classes.switchBase,
                checked: classes.switchChecked
              }}
            />
          </div>
          <div className={classes.settingRow}>
            <div className={classes.settingInfo}>
              <span className={classes.settingTitle}>Leaderboard</span>
              <span className={classes.settingDescription}>Enable leaderboard</span>
            </div>
            <Switch
              checked={settings?.general?.leaderboard?.enabled || false}
              onChange={() => updateSetting('general.leaderboard.enabled', !settings?.general?.leaderboard?.enabled)}
              classes={{
                track: classes.switchTrack,
                switchBase: classes.switchBase,
                checked: classes.switchChecked
              }}
            />
          </div>
          <div className={classes.settingRow}>
            <div className={classes.settingInfo}>
              <span className={classes.settingTitle}>Tip</span>
              <span className={classes.settingDescription}>Enable tip</span>
            </div>
            <Switch
              checked={settings?.general?.tip?.enabled || false}
              onChange={() => updateSetting('general.tip.enabled', !settings?.general?.tip?.enabled)}
              classes={{
                track: classes.switchTrack,
                switchBase: classes.switchBase,
                checked: classes.switchChecked
              }}
            />
          </div>
          <div className={classes.settingRow}>
            <div className={classes.settingInfo}>
              <span className={classes.settingTitle}>Affiliates</span>
              <span className={classes.settingDescription}>Enable affiliates</span>
            </div>
            <Switch
              checked={settings?.general?.affiliate?.enabled || false}
              onChange={() => updateSetting('general.affiliate.enabled', !settings?.general?.affiliate?.enabled)}
              classes={{
                track: classes.switchTrack,
                switchBase: classes.switchBase,
                checked: classes.switchChecked
              }}
            />
          </div>
          <div className={classes.settingRow}>
            <div className={classes.settingInfo}>
              <span className={classes.settingTitle}>Reward Multiplier</span>
              <span className={classes.settingDescription}>Set reward multiplier</span>
            </div>
            <div className={classes.inputRow} style={{ width: 'auto' }}>
              <input
                type="text"
                value={rewardMultiplier}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
                    setRewardMultiplier(newValue);
                  }
                }}
                className={classes.textInput}
                style={{ width: '120px' }}
              />
              <button 
                className={classes.actionButton}
                onClick={() => updateSetting('general.reward.multiplier', parseFloat(rewardMultiplier))}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <div className={classes.settingsGrid}>
          <div className={classes.settingRow}>
            <div className={classes.settingInfo}>
              <span className={classes.settingTitle}>Chat System</span>
              <span className={classes.settingDescription}>Enable chat system</span>
            </div>
            <Switch
              checked={settings?.chat?.enabled || false}
              onChange={() => updateSetting('chat.enabled', !settings?.chat?.enabled)}
              classes={{
                track: classes.switchTrack,
                switchBase: classes.switchBase,
                checked: classes.switchChecked
              }}
            />
          </div>
          {settings?.chat?.rooms && Object.entries(settings.chat.rooms).map(([room, value]) => (
            <div key={room} className={classes.settingRow}>
              <div className={classes.settingInfo}>
                <span className={classes.settingTitle}>{room.toUpperCase()} Room</span>
                <span className={classes.settingDescription}>Enable {room} chat room</span>
              </div>
              <Switch
                checked={value?.enabled || false}
                onChange={() => updateSetting(`chat.rooms.${room}.enabled`, !value?.enabled)}
                classes={{
                  track: classes.switchTrack,
                  switchBase: classes.switchBase,
                  checked: classes.switchChecked
                }}
              />
            </div>
          ))}
        </div>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <div className={classes.settingsGrid}>
          {settings?.games && Object.entries(settings.games).map(([game, value]) => (
            <div key={game} className={classes.settingRow}>
              <div className={classes.settingInfo}>
                <span className={classes.settingTitle}>{game.charAt(0).toUpperCase() + game.slice(1)}</span>
                <span className={classes.settingDescription}>Enable {game}</span>
              </div>
              <Switch
                checked={value?.enabled || false}
                onChange={() => updateSetting(`games.${game}.enabled`, !value?.enabled)}
                classes={{
                  track: classes.switchTrack,
                  switchBase: classes.switchBase,
                  checked: classes.switchChecked
                }}
              />
            </div>
          ))}
        </div>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <div className={classes.settingsGrid}>
          <div className={classes.settingRow}>
            <div className={classes.settingInfo}>
              <span className={classes.settingTitle}>Crypto Manual Withdraw</span>
              <span className={classes.settingDescription}>Enable crypto manual withdraw</span>
            </div>
            <Switch
              checked={settings?.crypto?.manual?.enabled || false}
              onChange={() => updateSetting('crypto.manual.enabled', !settings?.crypto?.manual?.enabled)}
              classes={{
                track: classes.switchTrack,
                switchBase: classes.switchBase,
                checked: classes.switchChecked
              }}
            />
          </div>
          {['crypto', 'gift', 'credit'].map(method => (
            <React.Fragment key={method}>
              <div className={classes.settingRow}>
                <div className={classes.settingInfo}>
                  <span className={classes.settingTitle}>{method.charAt(0).toUpperCase() + method.slice(1)} Deposit</span>
                  <span className={classes.settingDescription}>Enable {method} deposits</span>
                </div>
                <Switch
                  checked={settings?.[method]?.deposit?.enabled || false}
                  onChange={() => updateSetting(`${method}.deposit.enabled`, !settings?.[method]?.deposit?.enabled)}
                  classes={{
                    track: classes.switchTrack,
                    switchBase: classes.switchBase,
                    checked: classes.switchChecked
                  }}
                />
              </div>
              <div className={classes.settingRow}>
                <div className={classes.settingInfo}>
                  <span className={classes.settingTitle}>{method.charAt(0).toUpperCase() + method.slice(1)} Withdraw</span>
                  <span className={classes.settingDescription}>Enable {method} withdrawals</span>
                </div>
                <Switch
                  checked={settings?.[method]?.withdraw?.enabled || false}
                  onChange={() => updateSetting(`${method}.withdraw.enabled`, !settings?.[method]?.withdraw?.enabled)}
                  classes={{
                    track: classes.switchTrack,
                    switchBase: classes.switchBase,
                    checked: classes.switchChecked
                  }}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </TabPanel>
    </div>
  );
};

export default SettingsManager; 