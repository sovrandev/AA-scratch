import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { useNotification } from '../../../contexts/notification';
import { adminSocketService } from '../../../services/sockets/admin.socket.service';
import { TextField, CircularProgress } from '@material-ui/core';
import { Search } from '@material-ui/icons';

const RainManager = () => {
  const classes = useAdminStyles();
  const { loading } = useAdmin();
  const notify = useNotification();
  const [rainAmount, setRainAmount] = useState('');
  const [minWager, setMinWager] = useState('');
  const [minDeposit, setMinDeposit] = useState('');
  const [rainHistory, setRainHistory] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadRainHistory();
  }, [search]);

  const loadRainHistory = async () => {
    try {
      const response = await adminSocketService.getRainHistory(search);
      if (response.success) {
        setRainHistory(response.history);
      }
    } catch (error) {
      console.error('Failed to load rain history:', error);
    }
  };

  const handleCreateRain = async () => {
    try {
      const response = await adminSocketService.createRain({
        amount: Number(rainAmount),
        minWager: Number(minWager),
        minDeposit: Number(minDeposit)
      });
      if (response.success) {
        notify.success('Rain created successfully');
        loadRainHistory();
        setRainAmount('');
        setMinWager('');
        setMinDeposit('');
      }
    } catch (error) {
      notify.error('Failed to create rain');
    }
  };

  const handleCancelRain = async (rainId) => {
    try {
      const response = await adminSocketService.cancelRain({ rainId });
      if (response.success) {
        notify.success('Rain cancelled successfully');
        loadRainHistory();
      }
    } catch (error) {
      notify.error('Failed to cancel rain');
    }
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Rain Manager</h1>
        <div className={classes.controls}>
          <div className={classes.searchContainer}>
            <Search />
            <input
              type="text"
              placeholder="Search rain history..."
              className={classes.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>Create Rain</h2>
        <div className={classes.formGrid}>
          <TextField
            label="Rain Amount"
            type="number"
            value={rainAmount}
            onChange={(e) => setRainAmount(e.target.value)}
            className={classes.input}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Minimum Wager"
            type="number"
            value={minWager}
            onChange={(e) => setMinWager(e.target.value)}
            className={classes.input}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Minimum Deposit"
            type="number"
            value={minDeposit}
            onChange={(e) => setMinDeposit(e.target.value)}
            className={classes.input}
            variant="outlined"
            fullWidth
          />
        </div>
        <button className={classes.actionButton} onClick={handleCreateRain}>
          Create Rain
        </button>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>Rain History</h2>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : (
          <table className={classes.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Winners</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rainHistory.map((rain) => (
                <tr key={rain._id}>
                  <td>{rain._id}</td>
                  <td>${rain.amount.toFixed(2)}</td>
                  <td>{rain.winners?.length || 0}</td>
                  <td>
                    <span className={`${classes.badge} ${
                      rain.status === 'active' ? classes.successBadge :
                      rain.status === 'cancelled' ? classes.errorBadge :
                      classes.warningBadge
                    }`}>
                      {rain.status}
                    </span>
                  </td>
                  <td>{new Date(rain.createdAt).toLocaleString()}</td>
                  <td>
                    {rain.status === 'active' && (
                      <button
                        className={classes.errorBadge}
                        onClick={() => handleCancelRain(rain._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RainManager; 