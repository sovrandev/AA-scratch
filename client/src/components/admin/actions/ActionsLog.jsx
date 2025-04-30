import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { useNotification } from '../../../contexts/notification';
import { adminSocketService } from '../../../services/sockets/admin.socket.service';
import { Search, FilterList, Refresh } from '@material-ui/icons';
import { CircularProgress } from '@material-ui/core';

const ActionsLog = () => {
  const classes = useAdminStyles();
  const { loading } = useAdmin();
  const notify = useNotification();
  const [search, setSearch] = useState('');
  const [actions, setActions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    loadActions();
  }, [page]);

  const loadActions = async () => {
    try {
      const response = await adminSocketService.getAdminActions({
        page,
        search: search || '',
        filters,
        startDate,
        endDate
      });
      
      if (response.success) {
        setActions(response.actions || []);
        setTotalCount(response.count || 0);
      } else {
        notify.error(response.error?.message || 'Failed to load admin actions');
      }
    } catch (error) {
      console.error('Failed to load admin actions:', error);
      notify.error('Failed to load admin actions');
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadActions();
  };

  const handleFilterChange = (filter) => {
    if (filters.includes(filter)) {
      setFilters(filters.filter(f => f !== filter));
    } else {
      setFilters([...filters, filter]);
    }
  };

  const handleDateChange = (date, type) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const applyDateFilter = () => {
    setPage(1);
    loadActions();
  };

  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setPage(1);
    loadActions();
  };

  const getActionBadgeClass = (actionType) => {
    switch (actionType) {
      case 'create':
      case 'deposit':
      case 'credit':
      case 'approve':
      case 'unblock':
        return classes.successBadge;
      case 'delete':
      case 'withdraw':
      case 'debit':
      case 'reject':
      case 'block':
        return classes.errorBadge;
      case 'update':
      case 'setting_change':
      case 'reset':
        return classes.warningBadge;
      default:
        return classes.infoBadge;
    }
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Admin Actions Log</h1>
        <div className={classes.controls}>
          <div className={classes.searchContainer}>
            <Search />
            <input
              type="text"
              placeholder="Search actions..."
              className={classes.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            className={classes.secondaryButton}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterList /> Filters
          </button>
          <button
            className={classes.secondaryButton}
            onClick={handleSearch}
          >
            <Refresh /> Refresh
          </button>
        </div>
      </div>

      {showFilters && (
        <div className={classes.section}>
          <div className={classes.filterContainer}>
            <div className={classes.filterGroup}>
              <h3 className={classes.filterTitle}>Action Types</h3>
              <div className={classes.filterOptions}>
                <label className={classes.filterOption}>
                  <input
                    type="checkbox"
                    checked={filters.includes('create')}
                    onChange={() => handleFilterChange('create')}
                  />
                  Create
                </label>
                <label className={classes.filterOption}>
                  <input
                    type="checkbox"
                    checked={filters.includes('update')}
                    onChange={() => handleFilterChange('update')}
                  />
                  Update
                </label>
                <label className={classes.filterOption}>
                  <input
                    type="checkbox"
                    checked={filters.includes('delete')}
                    onChange={() => handleFilterChange('delete')}
                  />
                  Delete
                </label>
                <label className={classes.filterOption}>
                  <input
                    type="checkbox"
                    checked={filters.includes('approve')}
                    onChange={() => handleFilterChange('approve')}
                  />
                  Approve
                </label>
                <label className={classes.filterOption}>
                  <input
                    type="checkbox"
                    checked={filters.includes('reject')}
                    onChange={() => handleFilterChange('reject')}
                  />
                  Reject
                </label>
                <label className={classes.filterOption}>
                  <input
                    type="checkbox"
                    checked={filters.includes('setting_change')}
                    onChange={() => handleFilterChange('setting_change')}
                  />
                  Setting Change
                </label>
                <label className={classes.filterOption}>
                  <input
                    type="checkbox"
                    checked={filters.includes('withdraw')}
                    onChange={() => handleFilterChange('withdraw')}
                  />
                  Withdraw
                </label>
                <label className={classes.filterOption}>
                  <input
                    type="checkbox"
                    checked={filters.includes('deposit')}
                    onChange={() => handleFilterChange('deposit')}
                  />
                  Deposit
                </label>
              </div>
            </div>

            <div className={classes.filterGroup}>
              <h3 className={classes.filterTitle}>Date Range</h3>
              <div className={classes.filterDateControls}>
                <div className={classes.datePicker}>
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate ? startDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>
                
                <div className={classes.datePicker}>
                  <label>End Date</label>
                  <input
                    type="date"
                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>
                
                <div className={classes.dateActions}>
                  <button className={classes.actionButton} onClick={applyDateFilter}>
                    Apply
                  </button>
                  <button className={classes.secondaryButton} onClick={clearDateFilter}>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {filters.length > 0 && (
        <div className={classes.activeFilters}>
          <span>Active Filters:</span>
          {filters.map(filter => (
            <span key={filter} className={classes.filterTag}>
              {filter}
              <button 
                className={classes.filterRemove} 
                onClick={() => handleFilterChange(filter)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : actions.length > 0 ? (
        <>
          <div className={classes.tableContainer}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Target</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action) => (
                  <tr key={action._id} className={classes.tableRow}>
                    <td>{new Date(action.createdAt).toLocaleString()}</td>
                    <td>{action.adminUser?.username || 'Unknown'}</td>
                    <td>
                      <span className={`${classes.badge} ${getActionBadgeClass(action.actionType)}`}>
                        {action.actionType}
                      </span>
                    </td>
                    <td>{action.resource}</td>
                    <td>{action.targetUserName || action.targetId?.substring(0, 8) || 'N/A'}</td>
                    <td>
                      {action.details ? (
                        <div className={classes.detailsContainer}>
                          {Object.entries(action.details).map(([key, value]) => (
                            <div key={key} className={classes.detailItem}>
                              <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                            </div>
                          ))}
                        </div>
                      ) : 'No details'}
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
          No admin actions found matching your criteria
        </div>
      )}
    </div>
  );
};

export default ActionsLog; 