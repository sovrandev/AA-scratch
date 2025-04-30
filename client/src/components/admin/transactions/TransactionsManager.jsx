import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { Search } from '@material-ui/icons';
import { CircularProgress } from '@material-ui/core';

const TransactionsManager = () => {
  const classes = useAdminStyles();
  const { getTransactions, approveTransaction, rejectTransaction, loading } = useAdmin();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, [search, type]);

  const loadTransactions = async () => {
    const data = await getTransactions(1, search, type);
    setTransactions(data || []);
  };

  const handleApprove = async (transactionId) => {
    if (await approveTransaction(transactionId)) {
      loadTransactions();
    }
  };

  const handleReject = async (transactionId) => {
    if (await rejectTransaction(transactionId)) {
      loadTransactions();
    }
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Transactions</h1>
        <div className={classes.controls}>
          <div className={classes.searchContainer}>
            <Search />
            <input
              type="text"
              placeholder="Search transactions..."
              className={classes.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className={classes.select}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdraw">Withdrawals</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </div>
      ) : transactions.length > 0 ? (
        <table className={classes.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction._id}</td>
                <td>{transaction.user?.username || 'Unknown'}</td>
                <td>{transaction.type}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>
                  <span className={`${classes.badge} ${
                    transaction.status === 'pending' ? classes.warningBadge :
                    transaction.status === 'completed' ? classes.successBadge :
                    classes.errorBadge
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                <td>
                  {transaction.status === 'pending' && (
                    <div className={classes.settingControls}>
                      <button
                        className={classes.successBadge}
                        onClick={() => handleApprove(transaction._id)}
                      >
                        Approve
                      </button>
                      <button
                        className={classes.errorBadge}
                        onClick={() => handleReject(transaction._id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px',
          color: '#666'
        }}>
          No transactions found
        </div>
      )}
    </div>
  );
};

export default TransactionsManager; 