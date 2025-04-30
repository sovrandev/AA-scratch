import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { useNotification } from '../../../contexts/notification';
import Loader from '../../common/Loader';
import { Tabs, Tab } from '@material-ui/core';
import { Search } from '@material-ui/icons';

const CountdownTimer = ({ createdAt, durationDays }) => {
  const classes = useAdminStyles();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const startTime = new Date(createdAt).getTime();
      const endTime = startTime + (durationDays * 24 * 60 * 60 * 1000);
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        return 'Ended';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [createdAt, durationDays]);

  return <span className={classes.countdownTimer}>{timeLeft}</span>;
};

const PrizesPopup = ({ winners }) => {
  const classes = useAdminStyles();
  
  if (!winners || winners.length === 0) {
    return (
      <div className={classes.prizesPopup}>
        <div className={classes.prizePopupRow}>No prizes set</div>
      </div>
    );
  }

  return (
    <div className={classes.prizesPopup}>
      {winners.map((winner, index) => (
        <div key={index} className={classes.prizePopupRow}>
          <span>{index + 1}st Place</span>
          <span className={classes.prizeAmount}>{winner.prize} SOL</span>
        </div>
      ))}
    </div>
  );
};

const LeaderboardManager = () => {
  const classes = useAdminStyles();
  const { getLeaderboards, createLeaderboard, stopLeaderboard, loading } = useAdmin();
  const notify = useNotification();
  const [leaderboards, setLeaderboards] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    type: 'wager',
    reward: '',
    duration: '',
    prizes: [{ position: 1, amount: '' }]
  });

  useEffect(() => {
    loadLeaderboards();
  }, [page, search]);

  const loadLeaderboards = async () => {
    const data = await getLeaderboards();
    if (data) setLeaderboards(data);
  };

  const handleCreate = async () => {
    const success = await createLeaderboard({
      ...formData,
      prizes: formData.prizes.map(p => ({ position: p.position, amount: parseFloat(p.amount) }))
    });
    if (success) {
      setFormData({ type: 'wager', reward: '', duration: '', prizes: [{ position: 1, amount: '' }] });
      loadLeaderboards();
      setCurrentTab(0);
    }
  };

  const handleStop = async (leaderboardId) => {
    const success = await stopLeaderboard(leaderboardId);
    if (success) {
      loadLeaderboards();
    }
  };

  const getStatusBadgeClass = (state) => {
    switch (state) {
      case 'active':
        return classes.badge + ' ' + classes.successBadge;
      case 'canceled':
        return classes.badge + ' ' + classes.errorBadge;
      case 'completed':
        return classes.badge + ' ' + classes.warningBadge;
      default:
        return classes.badge + ' ' + classes.secondaryBadge;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const addPrize = () => {
    setFormData(prev => ({
      ...prev,
      prizes: [...prev.prizes, { position: prev.prizes.length + 1, amount: '' }]
    }));
  };

  const removePrize = (index) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index)
    }));
  };

  const updatePrize = (index, amount) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.map((prize, i) => 
        i === index ? { ...prize, amount } : prize
      )
    }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Leaderboards</h1>
        <div className={classes.searchContainer}>
          <Search />
          <input
            type="text"
            className={classes.searchInput}
            placeholder="Search leaderboards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      

      <Tabs
        value={currentTab}
        onChange={(_, newValue) => setCurrentTab(newValue)}
        className={classes.tabs}
      >
        <Tab label="Overview" />
        <Tab label="Create" />
      </Tabs>

      {currentTab === 0 ? (
        <>
          <table className={classes.table}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Duration</th>
                <th>Time Left</th>
                <th>Created</th>
                <th>Status</th>
                <th>Prizes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaderboards.map(leaderboard => (
                <tr className={classes.tableRow} key={leaderboard._id}>
                  <td>{leaderboard.type.charAt(0).toUpperCase() + leaderboard.type.slice(1)}</td>
                  <td>{leaderboard.duration}d</td>
                  <td>
                    {leaderboard.state === 'running' ? (
                      <CountdownTimer 
                        createdAt={leaderboard.createdAt} 
                        durationDays={leaderboard.duration} 
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{formatDate(leaderboard.createdAt)}</td>
                  <td>
                    <span className={getStatusBadgeClass(leaderboard.state)}>
                      {leaderboard.state.charAt(0).toUpperCase() + leaderboard.state.slice(1)}
                    </span>
                  </td>
                  <td className={classes.prizesCell}>
                    <span className={classes.prizesTooltip}>
                      {leaderboard.winners?.length || 0} Places
                      <PrizesPopup winners={leaderboard.winners} />
                    </span>
                  </td>
                  <td>
                    {leaderboard.state === 'running' && (
                      <button
                        className={classes.dangerButton}
                        onClick={() => handleStop(leaderboard._id)}
                      >
                        Stop
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={classes.paginationControls}>
            <button
              className={classes.paginationButton}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className={classes.pageNumber}>Page {page}</span>
            <button
              className={classes.paginationButton}
              onClick={() => setPage(p => p + 1)}
              disabled={leaderboards.length < 10}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className={classes.settingsGrid}>
          <div className={classes.settingRow}>
            <div className={classes.settingInfo}>
              <span className={classes.settingTitle}>Type</span>
              <span className={classes.settingDescription}>Select the type of leaderboard</span>
            </div>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className={classes.textInput}
            >
              <option value="wager">Wager</option>
              <option value="profit">Profit</option>
            </select>
          </div>

          <div className={classes.settingRow}>
            <div className={classes.settingInfo}>
              <span className={classes.settingTitle}>Duration (days)</span>
              <span className={classes.settingDescription}>Set how long the leaderboard will run</span>
            </div>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*$/.test(value)) {
                  setFormData({...formData, duration: value});
                }
              }}
              className={classes.textInput}
              placeholder="Enter duration in days"
              style={{ width: '120px' }}
            />
          </div>

          <div className={classes.settingRow}>
            <div className={classes.settingInfo}>
              <span className={classes.settingTitle}>Prizes</span>
              <span className={classes.settingDescription}>Set the prize amounts for each position</span>
            </div>
            <div className={classes.prizesList} style={{ width: '400px' }}>
              {formData.prizes.map((prize, index) => (
                <div key={index} className={classes.prizeRow}>
                  <span className={classes.prizePosition}>#{prize.position}</span>
                  <input
                    type="text"
                    value={prize.amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        updatePrize(index, value);
                      }
                    }}
                    className={classes.textInput}
                    placeholder="Enter prize amount"
                    style={{ width: '100px' }}
                  />
                  {index > 0 && (
                    <button
                      className={classes.dangerButton}
                      onClick={() => removePrize(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button className={classes.secondaryButton} onClick={addPrize}>
                Add Prize
              </button>
            </div>
          </div>

          <div className={classes.modalActions}>
            <button 
              className={classes.actionButton}
              onClick={handleCreate}
              disabled={!formData.duration || formData.prizes.some(p => !p.amount)}
            >
              Create Leaderboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardManager;