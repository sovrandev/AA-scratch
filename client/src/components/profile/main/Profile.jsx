import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ProfilePageTemplate from '../template/ProfilePageTemplate';
import { useUser } from '../../../contexts/user';
import { useNotification } from '../../../contexts/notification';
import { generalSocketService } from '../../../services/sockets/general.socket.service';
import LevelBox from '../../common/LevelBox';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  section: {
    background: theme.bg.box,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    gap: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    "@media (max-width: 1200px)": {
      padding: theme.spacing(2),
    }
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: theme.text.primary
  },
  userInfoContainer: {
    display: 'flex',
    gap: theme.spacing(3),
    alignItems: 'flex-start',
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      gap: theme.spacing(2),
    }
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    objectFit: 'cover',
    "@media (max-width: 1200px)": {
      width: 80,
      height: 80,
    }
  },
  userDetails: {
    flex: 1,
    position: 'relative',
    "@media (max-width: 1200px)": {
      width: "100%",
    }
  },
  username: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: theme.text.primary,
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  userId: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.text.secondary,
    fontSize: '0.9rem',
    marginBottom: theme.spacing(1),
  },
  copyButton: {
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    color: theme.text.secondary,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      color: theme.text.primary,
    },
  },
  button: {
    background: theme.accent.gradient,
    color: theme.text.primary,
    border: 'none',
    borderRadius: 4,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      opacity: 0.9,
    },
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing(1),
  },
  statItem: {
    background: theme.bg.inner,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  statLabel: {
    color: theme.text.secondary,
    fontSize: 14,
  },
  statValue: {
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: 600,
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleDescription: {
    color: theme.text.secondary,
    fontSize: '0.9rem',
  },
  toggle: {
    position: 'relative',
    width: 44,
    height: 24,
    borderRadius: 12,
    background: props => props.isAnonymous ? theme.palette.success.main : theme.bg.inner,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  toggleHandle: {
    position: 'absolute',
    top: 2,
    left: props => props.isAnonymous ? '22px' : '2px',
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: theme.text.primary,
    transition: 'left 0.2s ease',
  },
  rewardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing(2),
  },
  rewardItem: {
    background: theme.bg.inner,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  rewardLabel: {
    color: theme.text.secondary,
    fontSize: '0.9rem',
  },
  rewardValue: {
    color: theme.palette.success.main,
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginTop: theme.spacing(2)
  },
  inputLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: theme.text.secondary
  },
  inputValue: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    background: theme.bg.main,
    padding: "4px 4px 4px 12px",
    borderRadius: 6,
    width: "100%"
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: theme.text.primary,
    fontSize: "14px",
    fontWeight: 500,
    "&:focus": {
      outline: "none"
    }
  },
  saveButton: {
    background: theme.accent.primaryGradient,
    color: theme.text.primary,
    border: "none",
    minWidth: 80,
    borderRadius: 4,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      opacity: 0.9,
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed"
    }
  },
  rewardsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2)
  },
  sectionTitle: {
    fontSize: 16,
    color: theme.text.primary,
    fontWeight: 600
  },
  rewardsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
  },
  rewardItem: {
    backgroundColor: theme.bg.inner,
    borderRadius: 8,
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rewardInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  },
  rewardIcon: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: theme.bg.box,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rewardDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5)
  },
  rewardLabel: {
    fontSize: 14,
    color: theme.text.secondary,
    fontWeight: 500
  },
  rewardValue: {
    fontSize: 14,
    color: theme.text.primary,
    fontWeight: 600
  },
  createdAt: {
    color: theme.text.secondary,
    fontSize: 14,
    fontWeight: 400,
    position: 'absolute',
    right: 0,
    top: 0
  }
}));

const Profile = () => {
  const { user, getLevel } = useUser();
  const notify = useNotification();
  const [isAnonymous, setIsAnonymous] = useState(user?.anonymous || false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [newAvatar, setNewAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const classes = useStyles({ isAnonymous });

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user._id);
    notify.success('User ID copied to clipboard');
  };

  const handleToggleAnonymous = async () => {
    try {
      const response = await generalSocketService.sendUserAnonymous(!isAnonymous);
      if (response.success) {
        setIsAnonymous(!isAnonymous);
        notify.success(`Anonymous mode ${!isAnonymous ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      notify.error(error.message || 'Failed to toggle anonymous mode');
    }
  };

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      notify.error('Please enter a username');
      return;
    }

    setLoading(true);
    try {
      const response = await generalSocketService.sendUserUpdateUsername(newUsername);
      if (response.success) {
        notify.success('Username updated successfully');
      }
    } catch (error) {
      notify.error(error.message || 'Failed to update username');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    if (!newAvatar.trim()) {
      notify.error('Please enter an avatar URL');
      return;
    }

    setLoading(true);
    try {
      const response = await generalSocketService.sendUserUpdateAvatar(newAvatar);
      if (response.success) {
        notify.success('Avatar updated successfully');
      }
    } catch (error) {
      notify.error(error.message || 'Failed to update avatar');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <ProfilePageTemplate title="Profile">
      <div className={classes.root}>
        <div className={classes.section}>
          <div className={classes.userInfoContainer}>
            <img src={user?.avatar} alt="Avatar" className={classes.avatar} />
            <div className={classes.userDetails}>
              <div className={classes.createdAt}>
                Joined {new Date(user?.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className={classes.username}>
                {user?.username}
                <LevelBox level={getLevel()} />
              </div>
              <div className={classes.userId}>
                ID: {user?._id}
                <button className={classes.copyButton} onClick={handleCopyUserId}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z"/>
                    <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"/>
                  </svg>
                </button>
              </div>

              <div className={classes.inputGroup}>
                <div className={classes.inputLabel}>Username</div>
                <div className={classes.inputValue}>
                  <input
                    type="text"
                    className={classes.input}
                    placeholder="Enter new username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                  <button
                    className={classes.saveButton}
                    onClick={handleSaveUsername}
                    disabled={loading || !newUsername.trim() || newUsername === user?.username}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              <div className={classes.inputGroup}>
                <div className={classes.inputLabel}>Avatar URL</div>
                <div className={classes.inputValue}>
                  <input
                    type="text"
                    className={classes.input}
                    placeholder="Enter avatar URL"
                    value={newAvatar}
                    onChange={(e) => setNewAvatar(e.target.value)}
                  />
                  <button
                    className={classes.saveButton}
                    onClick={handleSaveAvatar}
                    disabled={loading || !newAvatar.trim() || newAvatar === user?.avatar}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>Statistics</div>
          <div className={classes.statsGrid}>
            <div className={classes.statItem}>
              <div className={classes.statLabel}>Total Wagered</div>
              <div className={classes.statValue}>${formatNumber(user?.stats?.bet || 0)}</div>
            </div>
            <div className={classes.statItem}>
              <div className={classes.statLabel}>Total Won</div>
              <div className={classes.statValue}>${formatNumber(user?.stats?.won || 0)}</div>
            </div>
            <div className={classes.statItem}>
              <div className={classes.statLabel}>Total Deposited</div>
              <div className={classes.statValue}>${formatNumber(user?.stats?.deposit || 0)}</div>
            </div>
            <div className={classes.statItem}>
              <div className={classes.statLabel}>Total Withdrawn</div>
              <div className={classes.statValue}>${formatNumber(user?.stats?.withdraw || 0)}</div>
            </div>
          </div>
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>Rewards Statistics</div>
          <div className={classes.rewardsList}>
            <div className={classes.rewardItem}>
              <div className={classes.rewardInfo}>
                <div className={classes.rewardIcon}>🎁</div>
                <div className={classes.rewardDetails}>
                  <div className={classes.rewardLabel}>Total rakeback claimed</div>
                </div>
              </div>
              <div className={classes.rewardValue}>
                ${formatNumber(user?.stats?.rakebackClaimed || 0)}
              </div>
            </div>

            <div className={classes.rewardItem}>
              <div className={classes.rewardInfo}>
                <div className={classes.rewardIcon}>🏆</div>
                <div className={classes.rewardDetails}>
                  <div className={classes.rewardLabel}>Total Leaderboard earnings</div>
                </div>
              </div>
              <div className={classes.rewardValue}>
              ${formatNumber(user?.stats?.leaderboardEarnings || 0)}
              </div>
            </div>

            <div className={classes.rewardItem}>
              <div className={classes.rewardInfo}>
                <div className={classes.rewardIcon}>📦</div>
                <div className={classes.rewardDetails}>
                  <div className={classes.rewardLabel}>Total daily box earnings</div>
                </div>
              </div>
              <div className={classes.rewardValue}>
              ${formatNumber(user?.stats?.dailyBoxEarnings || 0)}
              </div>
            </div>
          </div>
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>Privacy Settings</div>
          <div className={classes.toggleContainer}>
            <div className={classes.toggleDescription}>
              Hide your profile and statistics from other users
            </div>
            <div className={classes.toggle} onClick={handleToggleAnonymous}>
              <div className={classes.toggleHandle} />
            </div>
          </div>
        </div>
      </div>
    </ProfilePageTemplate>
  );
};

export default Profile; 