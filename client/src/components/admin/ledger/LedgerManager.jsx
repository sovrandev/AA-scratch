import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { Search, Refresh } from '@material-ui/icons';
import Loader from '../../../components/common/Loader';

const LedgerManager = () => {
  const classes = useAdminStyles();
  const { getLedgerTransactions, getLedgerBalances, loading } = useAdmin();
  
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [balances, setBalances] = useState(null);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadTransactions();
    loadBalances();
  }, [page, selectedType]);

  const loadTransactions = async () => {
    try {
      const filters = selectedType !== 'all' ? [selectedType] : [];
      
      const data = await getLedgerTransactions(
        page,
        filters,
        search
      );
      
      if (data) {
        setTransactions(data.transactions || []);
        setTotalCount(data.count || 0);
      }
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

  const loadBalances = async () => {
    try {
      const data = await getLedgerBalances();
      if (data) {
        setBalances(data);
      }
    } catch (error) {
      console.error("Failed to load balances:", error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadTransactions();
  };

  const getTransactionMethod = (transaction) => {
    return transaction.method || 'Unknown';
  };

  const getTransactionAmount = (transaction) => {
    return transaction.amount || 0;
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const getTransactionUser = (transaction) => {
    if (transaction.user && typeof transaction.user === 'object') {
      return transaction.user.username;
    }
    return 'Unknown';
  };

  const openInNewWindow = (url) => {
    window.open(url, '_blank');
  };

  const getTransactionType = (transaction) => {
    if (transaction.type === 'deposit') return 'Deposit';
    if (transaction.type === 'withdraw') return 'Withdraw';
    return transaction.type || 'Unknown';
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Ledger</h1>
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
          <select
            className={classes.textInput}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            {/* Payment Methods */}
            <option value="robux">Robux</option>
            <option value="limited">Limited</option>
            <option value="steam">Steam</option>
            <option value="crypto">Crypto</option>
            <option value="gift">Gift</option>
            <option value="credit">Credit</option>
            <option value="tip">Tip</option>
            <option value="balance">Balance</option>
            {/* Game Types */}
            <option value="crash">Crash</option>
            <option value="roll">Roll</option>
            <option value="blackjack">Blackjack</option>
            <option value="duels">Duels</option>
            <option value="mines">Mines</option>
            <option value="towers">Towers</option>
            <option value="unbox">Unbox</option>
            <option value="battles">Battles</option>
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
        <Loader />
      ) : transactions.length > 0 ? (
        <>
          <div className={classes.tableContainer}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Method</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className={classes.tableRow}>
                    <td>{transaction._id.substring(0, 8)}</td>
                    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                    <td onClick={() => openInNewWindow(`/admin/users/${transaction.user._id}`)} style={{ cursor: 'pointer' }}>
                      <div className={classes.avatarContainer}>
                        <img src={transaction?.user?.avatar} alt={getTransactionUser(transaction)} className={classes.avatar} />
                        <span className={classes.avatarUsername}>{getTransactionUser(transaction)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${classes.badge} ${classes.successBadge}`}>
                        {getTransactionType(transaction)}
                      </span>
                    </td>
                    <td>{getTransactionMethod(transaction)}</td>
                    <td className={transaction.type === 'deposit' ? classes.successText : classes.errorText}>
                      {formatCurrency(getTransactionAmount(transaction))}
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
              Page {page} of {Math.ceil(totalCount / 20) || 1}
            </span>
            <button
              className={classes.paginationButton}
              onClick={() => setPage(p => p + 1)}
              disabled={page * 20 >= totalCount}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className={classes.emptyState}>
          No transactions found matching your criteria
        </div>
      )}
    </div>
  );
};

export default LedgerManager; 