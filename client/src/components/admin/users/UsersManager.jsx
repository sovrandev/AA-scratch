import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { useNotification } from '../../../contexts/notification';
import { adminSocketService } from '../../../services/sockets/admin.socket.service';
import { TextField, Switch, Tabs, Tab } from '@material-ui/core';
import { Search, NavigateNext } from '@material-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../common/Loader';

const UsersManager = () => {
  const classes = useAdminStyles();
  const { loading, getUsers, updateUserValue, updateUserBalance } = useAdmin();
  const notify = useNotification();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [userHistory, setUserHistory] = useState({
    games: [],
    transactions: [],
    bets: []
  });
  const [muteReason, setMuteReason] = useState('');
  const [muteExpire, setMuteExpire] = useState('');
  const [banReason, setBanReason] = useState('');
  const [banExpire, setBanExpire] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState('');
  const [rank, setRank] = useState('user');
  const [betToWithdraw, setBetToWithdraw] = useState('0');
  const [betToRain, setBetToRain] = useState('0');
  const [limitTip, setLimitTip] = useState('0');
  const [leaderboardPoints, setLeaderboardPoints] = useState('0');

  useEffect(() => {
    if (!userId) {
      loadUsers();
    } else {
      loadUserData();
    }
  }, [userId, search, sort, page]);

  useEffect(() => {
    if (userId && (activeTab === 2 || activeTab === 3)) {
      loadUserHistory();
    }
  }, [userId, activeTab, historyPage]);

  useEffect(() => {
    setHistoryPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (userData) {
      setAvatarUrl(userData.avatar || '');
      setUsername(userData.username || '');
      setBalance(userData.balance?.toString() || '0');
      setRank(userData.rank || 'user');
      setBetToWithdraw(userData.limits?.betToWithdraw?.toString() || '0');
      setBetToRain(userData.limits?.betToRain?.toString() || '0');
      setLimitTip(userData.limits?.limitTip?.toString() || '0');
      setLeaderboardPoints(userData.leaderboard?.points?.toString() || '0');
    }
  }, [userData]);

  const loadUsers = async () => {
    const data = await getUsers(page, search, sort);
    setUsers(data);
  };

  const loadUserData = async () => {
    try {
      const response = await adminSocketService.getUserData({ userId });
      if (response.success) {
        setUserData(response.data);
      } else {
        notify.error(response.error?.message || 'Failed to load user data');
        navigate('/admin/users');
      }
    } catch (error) {
      notify.error(error.message || 'Failed to load user data');
      navigate('/admin/users');
    }
  };

  const loadUserHistory = async () => {
    if (!userId) return;

    const type = activeTab === 2 ? 'games' : 
                activeTab === 3 ? 'transactions' : null;

    if (type) {
      try {
        let response;
        if (type === 'games') {
          response = await adminSocketService.getUserGameList(userId, historyPage);
          if (response.success) {
            setUserHistory(prev => ({
              ...prev,
              games: response.games || []
            }));
          }
        } else if (type === 'transactions') {
          response = await adminSocketService.getUserTransactionList(userId, historyPage);
          if (response.success) {
            setUserHistory(prev => ({
              ...prev,
              transactions: response.transactions || []
            }));
          }
        }
      } catch (error) {
        notify.error(error.message || 'Failed to load history');
      }
    }
  };

  const handleSaveField = async (field, value) => {
    try {
      let response;
      if (field === 'balance') {
        response = await adminSocketService.sendUserBalance({ 
          userId, 
          balance: parseFloat(value) 
        });
      } else {
        response = await adminSocketService.sendUserValue({ 
          userId, 
          setting: field, 
          value 
        });
      }
      if (response.success) {
        notify.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
        loadUserData();
      }
    } catch (error) {
      notify.error(error.message || `Failed to update ${field}`);
    }
  };

  const handleMute = async () => {
    try {
      const response = await adminSocketService.sendUserMute({ 
        userId, 
        time: parseInt(muteExpire), 
        reason: muteReason 
      });
      if (response.success) {
        notify.success('User muted successfully');
        loadUserData();
        setMuteExpire('');
        setMuteReason('');
      }
    } catch (error) {
      notify.error(error.message || 'Failed to mute user');
    }
  };

  const handleBan = async () => {
    try {
      const response = await adminSocketService.sendUserBan({ 
        userId, 
        time: parseInt(banExpire), 
        reason: banReason 
      });
      if (response.success) {
        notify.success('User banned successfully');
        loadUserData();
        setBanExpire('');
        setBanReason('');
      }
    } catch (error) {
      notify.error(error.message || 'Failed to ban user');
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} className={classes.tabPanel}>
      {value === index && children}
    </div>
  );

  const renderGameHistory = () => {
    return (
      <>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Payout</th>
              <th>Profit</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {userHistory.games?.map((game) => (
              <tr key={game._id} className={classes.tableRow}>
                <td>
                  <div 
                    className={classes.copyId} 
                    onClick={() => {
                      navigator.clipboard.writeText(game._id);
                      notify.info('Game ID copied to clipboard');
                    }}
                  >
                    {game._id.substring(0, 12)}...
                  </div>
                </td>
                <td>{game.method}</td>
                <td>${(game.amount || 0).toFixed(2)}</td>
                <td>${(game.payout || 0).toFixed(2)}</td>
                <td>
                  <span className={`${classes.badge} ${(game.payout - game.amount) >= 0 ? classes.successBadge : classes.errorBadge}`}>
                    ${((game.payout || 0) - (game.amount || 0)).toFixed(2)}
                  </span>
                </td>
                <td>{new Date(game.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={classes.paginationControls}>
          <button 
            className={classes.paginationButton} 
            onClick={() => setHistoryPage(prev => Math.max(1, prev - 1))}
            disabled={historyPage === 1}
          >
            Previous
          </button>
          <span className={classes.pageNumber}>Page {historyPage}</span>
          <button 
            className={classes.paginationButton} 
            onClick={() => setHistoryPage(prev => prev + 1)}
            disabled={!userHistory.games?.length}
          >
            Next
          </button>
        </div>
      </>
    );
  };

  const getTransactionType = (transaction) => {
    if (transaction.deposit) return 'Deposit';
    if (transaction.withdraw) return 'Withdraw';
    if (transaction.sender) return 'Sent Tip';
    if (transaction.receiver) return 'Received Tip';
    if (transaction.type) return transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
    return 'Unknown';
  };

  const getTransactionAmount = (transaction) => {
    if (transaction.deposit) return transaction.deposit.amount;
    if (transaction.withdraw) return transaction.withdraw.amount;
    if (transaction.sender || transaction.receiver) return transaction.amount;
    return transaction.amount || 0;
  };

  const getTransactionStatus = (transaction) => {
    if (transaction.state === 'completed') return 'Completed';
    if (transaction.state === 'pending') return 'Pending';
    if (transaction.state === 'canceled') return 'Canceled';
    if (transaction.state === 'sent') return 'Sent';
    return transaction.state || 'Unknown';
  };

  const renderTransactionHistory = () => {
    return (
      <>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {userHistory.transactions?.map((transaction) => (
              <tr key={transaction._id} className={classes.tableRow}>
                <td>
                  <div 
                    className={classes.copyId} 
                    onClick={() => {
                      navigator.clipboard.writeText(transaction._id);
                      notify.info('Transaction ID copied to clipboard');
                    }}
                  >
                    {transaction._id.substring(0, 12)}...
                  </div>
                </td>
                <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                <td>{getTransactionType(transaction)}</td>
                <td>${(getTransactionAmount(transaction) || 0).toFixed(2)}</td>
                <td>
                  <span className={`${classes.badge} ${
                    transaction.state === 'completed' ? classes.successBadge :
                    transaction.state === 'pending' ? classes.warningBadge :
                    classes.errorBadge
                  }`}>
                    {getTransactionStatus(transaction)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={classes.paginationControls}>
          <button 
            className={classes.paginationButton} 
            onClick={() => setHistoryPage(prev => Math.max(1, prev - 1))}
            disabled={historyPage === 1}
          >
            Previous
          </button>
          <span className={classes.pageNumber}>Page {historyPage}</span>
          <button 
            className={classes.paginationButton} 
            onClick={() => setHistoryPage(prev => prev + 1)}
            disabled={!userHistory.transactions?.length}
          >
            Next
          </button>
        </div>
      </>
    );
  };

  const renderIPHistory = () => {
    return (
      <table className={classes.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>IP Address</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {userData?.ips?.map((ip) => (
            <tr key={ip._id} className={classes.tableRow}>
              <td>
                <div 
                  className={classes.copyId} 
                  onClick={() => {
                    navigator.clipboard.writeText(ip._id);
                    notify.info('IP ID copied to clipboard');
                  }}
                >
                  {ip._id.substring(0, 12)}...
                </div>
              </td>
              <td>{ip.address}</td>
              <td>{new Date(ip.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 
            className={classes.title}
            onClick={() => navigate('/admin/users')}
            style={{ cursor: 'pointer' }}
          >
            Users
          </h1>
          {userId && (
            <>
              <NavigateNext style={{ color: '#FFFFFF' }} />
              <h1 className={classes.title}>{userData?.username || userId}</h1>
            </>
          )}
        </div>
        {!userId && (
          <div className={classes.controls}>
            <div className={classes.searchContainer}>
              <Search />
              <input
                type="text"
                placeholder="Search users..."
                className={classes.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className={classes.textInput}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="balance">Balance</option>
              <option value="rank">Rank</option>
            </select>
          </div>
          )}
      </div>

      {loading ? (
        <Loader />
      ) : userId ? (
        <>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            className={classes.tabs}
          >
            <Tab label="General" />
            <Tab label="Info" />
            <Tab label="Game History" />
            <Tab label="Transactions" />
            <Tab label="IP History" />
            <Tab label="Raw Data" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <div className={classes.editGrid}>
              <div className={classes.userSection}>
                <div className={classes.userHeader}>
                  <img 
                    src={userData?.avatar || '/default-avatar.png'} 
                    alt="User avatar"
                    className={classes.userAvatar}
                  />
                  <div className={classes.userInfo}>
                    <div className={classes.inputWithButton}>
                      <div className={classes.inputLabel}>Avatar URL</div>
                      <div className={classes.inputRow}>
                        <input
                          type="text"
                          value={avatarUrl}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setAvatarUrl(newValue);
                          }}
                          className={classes.textInput}
                        />
                        <button 
                          className={classes.actionButton}
                          onClick={() => handleSaveField('avatar', avatarUrl)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                    <div className={classes.inputWithButton}>
                      <div className={classes.inputLabel}>Username</div>
                      <div className={classes.inputRow}>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setUsername(newValue);
                          }}
                          className={classes.textInput}
                        />
                        <button 
                          className={classes.actionButton}
                          onClick={() => handleSaveField('username', username)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                    <div className={classes.balanceRow}>
                      <div className={classes.inputWithButton}>
                        <div className={classes.inputLabel}>Balance</div>
                        <div className={classes.inputRow}>
                          <input
                            type="text"
                            value={balance}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
                                setBalance(newValue);
                              }
                            }}
                            className={classes.textInput}
                          />
                          <button 
                            className={classes.actionButton}
                            onClick={() => handleSaveField('balance', balance)}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                      <div className={classes.inputWithButton}>
                        <div className={classes.inputLabel}>Rank</div>
                        <div className={classes.inputRow}>
                          <select
                            value={rank}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setRank(newValue);
                            }}
                            className={classes.textInput}
                          >
                            <option value="user">User</option>
                            <option value="creator">Creator</option>
                            <option value="mod">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button 
                            className={classes.actionButton}
                            onClick={() => handleSaveField('rank', rank)}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={classes.userControls}>
                  <div className={classes.inputWithButton}>
                    <div className={classes.inputLabel}>Mute User</div>
                    <div className={classes.inputRow}>
                      <select
                        value={muteReason}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setMuteReason(newValue);
                        }}
                        className={classes.textInput}
                      >
                        <option value="">Select Reason</option>
                        <option value="insulting">Insulting</option>
                        <option value="racism">Racism</option>
                        <option value="begging">Begging</option>
                        <option value="self promotion">Self Promotion</option>
                        <option value="other">Other</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Minutes"
                        value={muteExpire}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (newValue === '' || /^\d*$/.test(newValue)) {
                            setMuteExpire(newValue);
                          }
                        }}
                        className={classes.textInput}
                        style={{ width: '120px' }}
                      />
                      <button 
                        className={classes.actionButton}
                        onClick={handleMute}
                      >
                        Mute
                      </button>
                    </div>
                  </div>
                  <div className={classes.inputWithButton}>
                    <div className={classes.inputLabel}>Ban User</div>
                    <div className={classes.inputRow}>
                      <select
                        value={banReason}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setBanReason(newValue);
                        }}
                        className={classes.textInput}
                      >
                        <option value="">Select Reason</option>
                        <option value="cheating">Cheating</option>
                        <option value="scamming">Scamming</option>
                        <option value="self request">Self Request</option>
                        <option value="other">Other</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Minutes"
                        value={banExpire}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (newValue === '' || /^\d*$/.test(newValue)) {
                            setBanExpire(newValue);
                          }
                        }}
                        className={classes.textInput}
                        style={{ width: '120px' }}
                      />
                      <button 
                        className={classes.actionButton}
                        onClick={handleBan}
                      >
                        Ban
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={classes.settingsGrid}>
                <div className={classes.settingRow}>
                  <div className={classes.settingInfo}>
                    <span className={classes.settingTitle}>Block Rain</span>
                    <span className={classes.settingDescription}>Prevent user from participating in rain events</span>
                  </div>
                  <Switch
                    checked={userData?.limits?.blockRain || false}
                    onChange={() => handleSaveField('limits.blockRain', !userData?.limits?.blockRain)}
                    classes={{
                      track: classes.switchTrack,
                      switchBase: classes.switchBase,
                      checked: classes.switchChecked
                    }}
                  />
                </div>
                <div className={classes.settingRow}>
                  <div className={classes.settingInfo}>
                    <span className={classes.settingTitle}>Block Tip</span>
                    <span className={classes.settingDescription}>Prevent user from sending or receiving tips</span>
                  </div>
                  <Switch
                    checked={userData?.limits?.blockTip || false}
                    onChange={() => handleSaveField('limits.blockTip', !userData?.limits?.blockTip)}
                    classes={{
                      track: classes.switchTrack,
                      switchBase: classes.switchBase,
                      checked: classes.switchChecked
                    }}
                  />
                </div>
                <div className={classes.settingRow}>
                  <div className={classes.settingInfo}>
                    <span className={classes.settingTitle}>Block Leaderboard</span>
                    <span className={classes.settingDescription}>Prevent user from appearing on leaderboards</span>
                  </div>
                  <Switch
                    checked={userData?.limits?.blockLeaderboard || false}
                    onChange={() => handleSaveField('limits.blockLeaderboard', !userData?.limits?.blockLeaderboard)}
                    classes={{
                      track: classes.switchTrack,
                      switchBase: classes.switchBase,
                      checked: classes.switchChecked
                    }}
                  />
                </div>
                <div className={classes.settingRow}>
                  <div className={classes.settingInfo}>
                    <span className={classes.settingTitle}>Block Sponsor</span>
                    <span className={classes.settingDescription}>Prevent user from using sponsor features</span>
                  </div>
                  <Switch
                    checked={userData?.limits?.blockSponsor || false}
                    onChange={() => handleSaveField('limits.blockSponsor', !userData?.limits?.blockSponsor)}
                    classes={{
                      track: classes.switchTrack,
                      switchBase: classes.switchBase,
                      checked: classes.switchChecked
                    }}
                  />
                </div>
                <div className={classes.settingRow}>
                  <div className={classes.settingInfo}>
                    <span className={classes.settingTitle}>Block Affiliate</span>
                    <span className={classes.settingDescription}>Prevent user from using affiliate features</span>
                  </div>
                  <Switch
                    checked={userData?.limits?.blockAffiliate || false}
                    onChange={() => handleSaveField('limits.blockAffiliate', !userData?.limits?.blockAffiliate)}
                    classes={{
                      track: classes.switchTrack,
                      switchBase: classes.switchBase,
                      checked: classes.switchChecked
                    }}
                  />
                </div>
                <div className={classes.settingRow}>
                  <div className={classes.settingInfo}>
                    <span className={classes.settingTitle}>Bet to Withdraw</span>
                    <span className={classes.settingDescription}>Amount user needs to bet before withdrawing</span>
                  </div>
                  <div className={classes.inputRow} style={{ width: 'auto' }}>
                    <input
                      type="text"
                      value={betToWithdraw}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
                          setBetToWithdraw(newValue);
                        }
                      }}
                      className={classes.textInput}
                      style={{ width: '120px' }}
                    />
                    <button 
                      className={classes.actionButton}
                      onClick={() => handleSaveField('limits.betToWithdraw', parseFloat(betToWithdraw))}
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className={classes.settingRow}>
                  <div className={classes.settingInfo}>
                    <span className={classes.settingTitle}>Bet to Rain</span>
                    <span className={classes.settingDescription}>Amount user needs to bet before participating in rain</span>
                  </div>
                  <div className={classes.inputRow} style={{ width: 'auto' }}>
                    <input
                      type="text"
                      value={betToRain}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
                          setBetToRain(newValue);
                        }
                      }}
                      className={classes.textInput}
                      style={{ width: '120px' }}
                    />
                    <button 
                      className={classes.actionButton}
                      onClick={() => handleSaveField('limits.betToRain', parseFloat(betToRain))}
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className={classes.settingRow}>
                  <div className={classes.settingInfo}>
                    <span className={classes.settingTitle}>Tip Limit</span>
                    <span className={classes.settingDescription}>Maximum amount user can tip</span>
                  </div>
                  <div className={classes.inputRow} style={{ width: 'auto' }}>
                    <input
                      type="text"
                      value={limitTip}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
                          setLimitTip(newValue);
                        }
                      }}
                      className={classes.textInput}
                      style={{ width: '120px' }}
                    />
                    <button 
                      className={classes.actionButton}
                      onClick={() => handleSaveField('limits.limitTip', parseFloat(limitTip))}
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className={classes.settingRow}>
                  <div className={classes.settingInfo}>
                    <span className={classes.settingTitle}>Leaderboard Points</span>
                    <span className={classes.settingDescription}>User's points on the leaderboard</span>
                  </div>
                  <div className={classes.inputRow} style={{ width: 'auto' }}>
                    <input
                      type="text"
                      value={leaderboardPoints}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue === '' || /^\d*$/.test(newValue)) {
                          setLeaderboardPoints(newValue);
                        }
                      }}
                      className={classes.textInput}
                      style={{ width: '120px' }}
                    />
                    <button 
                      className={classes.actionButton}
                      onClick={() => handleSaveField('leaderboard.points', parseInt(leaderboardPoints))}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <div className={classes.userStats}>
              <div className={classes.statCard}>
                <div className={classes.statLabel}>Email</div>
                <div className={classes.statValue}>{userData?.email || 'N/A'}</div>
              </div>
              <div className={classes.statCard}>
                <div className={classes.statLabel}>Vault Amount</div>
                <div className={classes.statValue}>${userData?.vault?.amount?.toFixed(2) || '0.00'}</div>
              </div>
              <div className={classes.statCard}>
                <div className={classes.statLabel}>XP</div>
                <div className={classes.statValue}>{userData?.xp || 0}</div>
              </div>
              <div className={classes.statCard}>
                <div className={classes.statLabel}>Total Bet</div>
                <div className={classes.statValue}>${userData?.stats?.bet?.toFixed(2) || '0.00'}</div>
              </div>
              <div className={classes.statCard}>
                <div className={classes.statLabel}>Total Won</div>
                <div className={classes.statValue}>${userData?.stats?.won?.toFixed(2) || '0.00'}</div>
              </div>
              <div className={classes.statCard}>
                <div className={classes.statLabel}>Total Deposits</div>
                <div className={classes.statValue}>${userData?.stats?.deposit?.toFixed(2) || '0.00'}</div>
              </div>
              <div className={classes.statCard}>
                <div className={classes.statLabel}>Total Withdrawals</div>
                <div className={classes.statValue}>${userData?.stats?.withdraw?.toFixed(2) || '0.00'}</div>
              </div>
              <div className={classes.statCard}>
                <div className={classes.statLabel}>Leaderboard Points</div>
                <div className={classes.statValue}>{userData?.leaderboard?.points || 0}</div>
              </div>
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {renderGameHistory()}
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            {renderTransactionHistory()}
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            {renderIPHistory()}
          </TabPanel>

          <TabPanel value={activeTab} index={5}>
            <pre className={classes.codeBlock}>
              <code>
                {JSON.stringify(userData, null, 2)}
              </code>
            </pre>
          </TabPanel>
        </>
      ) : (
        <>
          <table className={classes.table}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Balance</th>
                <th>Rank</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user._id} 
                  onClick={() => navigate(`/admin/users/${user._id}`)}
                  style={{ cursor: 'pointer' }}
                  className={classes.tableRow}
                >
                  <td>
                    <div className={classes.userInfo}>
                      <span>{user.username}</span>
                    </div>
                  </td>
                  <td>${user.balance?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`${classes.badge} ${
                      user.rank === 'admin' ? classes.errorBadge :
                      user.rank === 'mod' ? classes.warningBadge :
                      classes.successBadge
                    }`}>
                      {user.rank || 'user'}
                    </span>
                  </td>
                  <td>
                    <span className={`${classes.badge} ${
                      user.flags?.banned ? classes.errorBadge : 
                      user.flags?.muted ? classes.warningBadge : 
                      classes.successBadge
                    }`}>
                      {user.flags?.banned ? 'banned' : user.flags?.muted ? 'muted' : 'active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={classes.pagination}>
            <button 
              className={classes.paginationButton}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className={classes.pageInfo}>Page {page}</span>
            <button 
              className={classes.paginationButton}
              onClick={() => setPage(p => p + 1)}
              disabled={users.length < 10}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersManager; 