import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../contexts/admin';
import { useAdminStyles } from '../styles/adminStyles';
import { adminSocketService } from '../../../services/sockets/admin.socket.service';
import { Line } from 'react-chartjs-2';
import { Tabs, Tab, CircularProgress } from '@material-ui/core';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatsManager = () => {
  const classes = useAdminStyles();
  const { getStats, loading } = useAdmin();
  const [stats, setStats] = useState(null);
  const [statsList, setStatsList] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [chartMetric, setChartMetric] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadStats();
    loadStatsList();
  }, [page]);

  const loadStats = async () => {
    const data = await getStats();
    if (data) {
      setStats(data);
    }
  };

  const loadStatsList = async () => {
    try {
      const response = await adminSocketService.getStatsList({ page });
      if (response.success) {
        setStatsList(response.stats);
      }
    } catch (error) {
      console.error('Failed to load stats list:', error);
    }
  };

  const formatChartData = () => {
    if (!statsList.length) return { labels: [], datasets: [] };

    // Sort by date ascending
    const sortedStats = [...statsList].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    // Get the last 7 days of data
    const last7Days = sortedStats.slice(-7);

    const labels = last7Days.map(stat => new Date(stat.createdAt).toLocaleDateString());
    
    // Create datasets based on the selected metric
    const datasets = [];
    
    if (chartMetric === 'deposits' || chartMetric === 'all') {
      datasets.push({
        label: 'Deposits',
        data: last7Days.map(stat => stat.stats.total.deposit || 0),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      });
    }
    
    if (chartMetric === 'withdrawals' || chartMetric === 'all') {
      datasets.push({
        label: 'Withdrawals',
        data: last7Days.map(stat => stat.stats.total.withdraw || 0),
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4
      });
    }
    
    if (chartMetric === 'users' || chartMetric === 'all') {
      datasets.push({
        label: 'New Users',
        data: last7Days.map(stat => stat.stats.total.user || 0),
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4
      });
    }

    return { labels, datasets };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#959597'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#959597'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#959597'
        }
      }
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && children}
    </div>
  );

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Statistics Dashboard</h1>
      </div>

      {loading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className={classes.statsGrid} style={{ marginBottom: '16px' }}>
            <StatCard 
              title="Daily Profit" 
              value={`$${stats?.daily?.profit?.toFixed(2) || '0.00'}`}
            />
            <StatCard 
              title="Weekly Profit" 
              value={`$${stats?.weekly?.profit?.toFixed(2) || '0.00'}`}
            />
            <StatCard 
              title="Monthly Profit" 
              value={`$${stats?.monthly?.profit?.toFixed(2) || '0.00'}`}
            />
            <StatCard 
              title="All Time Profit" 
              value={`$${stats?.total?.profit?.toFixed(2) || '0.00'}`}
            />
          </div>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            className={classes.tabs}
          >
            <Tab label="Chart View" />
            <Tab label="Table View" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <div className={classes.chartControls} style={{ marginBottom: '16px' }}>
              <select 
                className={classes.textInput}
                value={chartMetric}
                onChange={(e) => setChartMetric(e.target.value)}
              >
                <option value="all">All Metrics</option>
                <option value="deposits">Deposits</option>
                <option value="withdrawals">Withdrawals</option>
                <option value="users">New Users</option>
              </select>
            </div>
            <div className={classes.chartContainer} style={{ height: '400px' }}>
              <Line options={chartOptions} data={formatChartData()} />
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Deposits</th>
                  <th>Withdrawals</th>
                  <th>New Users</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {statsList.map((stat) => (
                  <tr key={stat._id} className={classes.tableRow}>
                    <td>{new Date(stat.createdAt).toLocaleDateString()}</td>
                    <td>${stat.stats.total.deposit?.toFixed(2) || '0.00'}</td>
                    <td>${stat.stats.total.withdraw?.toFixed(2) || '0.00'}</td>
                    <td>{stat.stats.total.user || 0}</td>
                    <td className={classes.successText}>
                      ${(stat.stats.total.deposit - stat.stats.total.withdraw).toFixed(2)}
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
              <span className={classes.pageInfo}>
                Page {page}
              </span>
              <button
                className={classes.paginationButton}
                onClick={() => setPage(p => p + 1)}
                disabled={statsList.length < 10}
              >
                Next
              </button>
            </div>
          </TabPanel>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, trend }) => {
  const classes = useAdminStyles();
  
  return (
    <div className={classes.statCard}>
      <div className={classes.statTitle}>{title}</div>
      <div className={classes.statValue}>{value}</div>
      {trend && (
        <div className={`${classes.statTrend} ${trend > 0 ? classes.successText : classes.errorText}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  );
};

export default StatsManager; 