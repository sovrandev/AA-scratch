import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { useNotification } from '../../../contexts/notification';
import { Search, Refresh } from '@material-ui/icons';
import { CircularProgress } from '@material-ui/core';
import Loader from "../../common/Loader";

const AffiliateManager = () => {
  const classes = useAdminStyles();
  const { getAffiliates, blockAffiliate, clearAffiliate, updateAffiliateCode, updateAffiliateAvailable, loading } = useAdmin();
  const notify = useNotification();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [affiliates, setAffiliates] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadAffiliates();
  }, [page, sort]);

  const loadAffiliates = async () => {
    try {
      const data = await getAffiliates(page, search, sort);
      if (data) {
        setAffiliates(data);
        // If total count is available in the response, set it
        if (data.totalCount) {
          setTotalCount(data.totalCount);
        }
      }
    } catch (error) {
      console.error('Failed to load affiliates:', error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadAffiliates();
  };

  const handleBlockAffiliate = async (userId, shouldBlock) => {
    try {
      const success = await blockAffiliate(userId, shouldBlock);
      if (success) {
        notify.success(`Affiliate ${shouldBlock ? 'blocked' : 'unblocked'} successfully`);
        loadAffiliates();
      }
    } catch (error) {
      notify.error(`Failed to ${shouldBlock ? 'block' : 'unblock'} affiliate`);
    }
  };

  const handleClearAffiliate = async (userId) => {
    try {
      const success = await clearAffiliate(userId);
      if (success) {
        notify.success('Affiliate data cleared successfully');
        loadAffiliates();
      }
    } catch (error) {
      notify.error('Failed to clear affiliate data');
    }
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Affiliate Manager</h1>
        <div className={classes.controls}>
          <div className={classes.searchContainer}>
            <Search />
            <input
              type="text"
              placeholder="Search affiliates..."
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
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="earnings">Earnings</option>
            <option value="referred">Referred Users</option>
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
      ) : affiliates && affiliates.length > 0 ? (
        <>
          <table className={classes.table}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Code</th>
                <th>Referred</th>
                <th>Total Earnings</th>
                <th>Available</th>
                <th>Generated</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((affiliate) => (
                <tr key={affiliate._id} className={classes.tableRow}>
                  <td>{affiliate.username || 'Unknown'}</td>
                  <td>{affiliate.affiliates?.code || 'None'}</td>
                  <td>{affiliate.affiliates?.referred || 0}</td>
                  <td>{formatCurrency(affiliate.affiliates?.earned)}</td>
                  <td>{formatCurrency(affiliate.affiliates?.available)}</td>
                  <td>{formatCurrency(affiliate.affiliates?.generated)}</td>
                  <td>
                    <span className={`${classes.badge} ${
                      affiliate.limits?.blockAffiliate ? classes.errorBadge : classes.successBadge
                    }`}>
                      {affiliate.limits?.blockAffiliate ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className={classes.settingControls}>
                      {affiliate.limits?.blockAffiliate ? (
                        <button
                          className={classes.badge + ' ' + classes.successBadge}
                          onClick={() => handleBlockAffiliate(affiliate._id, false)}
                          style={{ cursor: 'pointer' }}
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          className={classes.badge + ' ' + classes.errorBadge}
                          onClick={() => handleBlockAffiliate(affiliate._id, true)}
                          style={{ cursor: 'pointer' }}
                        >
                          Block
                        </button>
                      )}
                      <button
                        className={classes.badge + ' ' + classes.warningBadge}
                        onClick={() => handleClearAffiliate(affiliate._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        Clear Data
                      </button>
                    </div>
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
              disabled={affiliates.length < 10}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No affiliates found
        </div>
      )}
    </div>
  );
};

export default AffiliateManager; 