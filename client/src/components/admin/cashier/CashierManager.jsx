import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { useNotification } from '../../../contexts/notification';
import { adminSocketService } from '../../../services/sockets/admin.socket.service';
import { CircularProgress } from '@material-ui/core';
import { Search, Refresh } from '@material-ui/icons';

const CashierManager = () => {
  const classes = useAdminStyles();
  const { loading } = useAdmin();
  const notify = useNotification();
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  useEffect(() => {
    loadTransactions();
  }, [page, search]);

  const loadTransactions = async () => {
    try {
      const response = await adminSocketService.getCashierList(page, search);
      if (response.success) {
        setTransactions(response.transactions);
        setTotalCount(response.count || 0);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadTransactions();
  };

  const handleApproveTransaction = async (transactionId) => {
    try {
      const response = await adminSocketService.approveCashierTransaction({ transactionId });
      if (response.success) {
        notify.success('Transaction approved successfully');
        loadTransactions();
      }
    } catch (error) {
      notify.error('Failed to approve transaction');
    }
  };

  const handleRejectTransaction = async (transactionId) => {
    try {
      const response = await adminSocketService.rejectCashierTransaction({ transactionId });
      if (response.success) {
        notify.success('Transaction rejected successfully');
        loadTransactions();
      }
    } catch (error) {
      notify.error('Failed to reject transaction');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    notify.info('Transaction ID copied to clipboard');
  };

  const openInNewWindow = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Cashier Manager</h1>
        <div className={classes.controls}>
          <div className={classes.searchContainer}>
            <Search />
            <input
              type="text"
              placeholder="Search transactions..."
              className={classes.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
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
                  <th>ID</th>
                  <th>User</th>
                  <th>Currency</th>
                  <th>Amount</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className={classes.tableRow}>
                    <td onClick={() => copyToClipboard(transaction._id)} style={{ cursor: 'pointer' }}>{transaction._id.substring(0, 8)}...</td>
                    <td onClick={() => openInNewWindow(`/admin/users/${transaction.user._id}`)} style={{ cursor: 'pointer' }}>
                      <div className={classes.avatarContainer}>
                        <img src={transaction.user?.avatar} alt={transaction.user?.username} className={classes.avatar} />
                        <span className={classes.avatarUsername}>{transaction.user?.username || 'Unknown'}</span>
                      </div>
                    </td>
                    <td>{transaction.data.currency}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>{new Date(transaction.createdAt).toLocaleString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                    <td>
                      <span className={`${classes.badge} ${
                        transaction.state === 'completed' ? classes.successBadge :
                        transaction.state === 'pending' ? classes.warningBadge :
                        classes.errorBadge
                      }`}>
                        {transaction.state}
                      </span>
                    </td>
                    <td>
                      {transaction.state === 'pending' && transaction.type === 'withdraw' && (
                        <div className={classes.actionButtons}>
                          <button
                            className={`${classes.successButton}`}
                            onClick={() => handleApproveTransaction(transaction._id)}
                          >
                            Approve
                          </button>
                          <button
                            className={`${classes.dangerButton}`}
                            onClick={() => handleRejectTransaction(transaction._id)}
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
    </div>
  );
};

export default CashierManager; 