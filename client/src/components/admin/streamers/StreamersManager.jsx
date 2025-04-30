import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { useNotification } from '../../../contexts/notification';
import { Search, Refresh } from '@material-ui/icons';
import { CircularProgress } from '@material-ui/core';

const StreamersManager = () => {
  const classes = useAdminStyles();
  const { getStreamers, getStreamerStats, updateStreamerStatus, loading } = useAdmin();
  const notify = useNotification();

  const [streamers, setStreamers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('username');
  const [selectedStreamer, setSelectedStreamer] = useState(null);
  const [streamerStats, setStreamerStats] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadStreamers();
  }, [page, sort]);

  const loadStreamers = async () => {
    const data = await getStreamers(page, search, sort);
    if (data) {
      setStreamers(data.streamers);
      setTotalCount(data.totalCount);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadStreamers();
  };

  const handleViewStreamer = async (streamerId) => {
    const stats = await getStreamerStats(streamerId);
    if (stats) {
      setStreamerStats(stats);
      setSelectedStreamer(streamers.find(s => s._id === streamerId));
      setDialogOpen(true);
    }
  };

  const handleStatusChange = async (streamerId, status) => {
    const success = await updateStreamerStatus(streamerId, status);
    if (success) {
      notify.success(`Streamer ${status ? 'activated' : 'deactivated'} successfully`);
      loadStreamers();
    }
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Streamers Manager</h1>
        <div className={classes.controls}>
          <div className={classes.searchContainer}>
            <Search />
            <input
              type="text"
              placeholder="Search streamers..."
              className={classes.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <select
            className={classes.textInput}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="username">Username</option>
            <option value="userCount">User Count</option>
            <option value="profit">Net Profit</option>
            <option value="cashouts">Cashouts</option>
            <option value="earnings">Earnings</option>
          </select>
          <button
            className={classes.secondaryButton}
            onClick={handleSearch}
          >
            <Refresh /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className={classes.tableContainer}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Referrals</th>
                  <th>Net Profit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {streamers.map((streamer) => (
                  <tr key={streamer._id} className={classes.tableRow}>
                    <td>{streamer.username}</td>
                    <td>{streamer.affiliates?.referred || 0}</td>
                    <td>{formatCurrency(streamer.affiliates?.earned - streamer.affiliates?.available)}</td>
                    <td>
                      <span className={`${classes.badge} ${
                        streamer.roles?.includes('creator') ? classes.successBadge : classes.errorBadge
                      }`}>
                        {streamer.roles?.includes('creator') ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className={classes.actionButtons}>
                        <button
                          className={classes.actionButton}
                          onClick={() => handleViewStreamer(streamer._id)}
                        >
                          View
                        </button>
                        {streamer.roles?.includes('creator') ? (
                          <button
                            className={`${classes.actionButton} ${classes.errorButton}`}
                            onClick={() => handleStatusChange(streamer._id, false)}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className={`${classes.actionButton} ${classes.successButton}`}
                            onClick={() => handleStatusChange(streamer._id, true)}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={classes.pagination}>
            <button
              className={classes.paginationButton}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className={classes.pageInfo}>
              Page {page} of {Math.ceil(totalCount / 10) || 1}
            </span>
            <button
              className={classes.paginationButton}
              onClick={() => setPage(p => p + 1)}
              disabled={page * 10 >= totalCount}
            >
              Next
            </button>
          </div>
        </>
      )}

      {dialogOpen && selectedStreamer && streamerStats && (
        <div className={classes.modalOverlay} onClick={() => setDialogOpen(false)}>
          <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
            <div className={classes.modalHeader}>
              <h2 className={classes.modalTitle}>{selectedStreamer.username} - Streamer Stats</h2>
            </div>
            <div className={classes.modalContent}>
              <div className={classes.statsGrid}>
                <div className={classes.statCard}>
                  <div className={classes.statTitle}>Total Users</div>
                  <div className={classes.statValue}>{streamerStats.userCount || 0}</div>
                </div>
                <div className={classes.statCard}>
                  <div className={classes.statTitle}>Total Deposits</div>
                  <div className={classes.statValue}>{formatCurrency(streamerStats.totalDeposits)}</div>
                </div>
                <div className={classes.statCard}>
                  <div className={classes.statTitle}>Total Withdrawals</div>
                  <div className={classes.statValue}>{formatCurrency(streamerStats.totalWithdrawals)}</div>
                </div>
                <div className={classes.statCard}>
                  <div className={classes.statTitle}>Net Profit</div>
                  <div className={classes.statValue}>{formatCurrency(streamerStats.profit)}</div>
                </div>
              </div>

              <h3 className={classes.sectionTitle}>Referred Users</h3>
              {streamerStats.referredUsers && streamerStats.referredUsers.length > 0 ? (
                <div className={classes.tableContainer}>
                  <table className={classes.table}>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Balance</th>
                        <th>Deposits</th>
                        <th>Withdrawals</th>
                      </tr>
                    </thead>
                    <tbody>
                      {streamerStats.referredUsers.map((user) => (
                        <tr key={user._id} className={classes.tableRow}>
                          <td>{user.username}</td>
                          <td>{formatCurrency(user.balance)}</td>
                          <td>{formatCurrency(user.stats?.deposit)}</td>
                          <td>{formatCurrency(user.stats?.withdraw)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={classes.emptyState}>No referred users found</div>
              )}
            </div>
            <div className={classes.modalActions}>
              <button className={classes.actionButton} onClick={() => setDialogOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamersManager; 