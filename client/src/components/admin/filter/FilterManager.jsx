import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { useNotification } from '../../../contexts/notification';
import { Search } from '@material-ui/icons';
import Loader from '../../common/Loader';

const FilterManager = () => {
  const classes = useAdminStyles();
  const { getFilters, createFilter, removeFilter, loading } = useAdmin();
  const notify = useNotification();
  const [filters, setFilters] = useState([]);
  const [newFilter, setNewFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadFilters();
  }, [page, search]);

  const loadFilters = async () => {
    const data = await getFilters(page, search);
    if (data?.filters) {
      setFilters(data.filters);
    }
  };

  const handleAddFilter = async (e) => {
    e.preventDefault();
    if (!newFilter.trim()) {
      return notify.error('Please enter a word or phrase to filter');
    }

    const filter = await createFilter(newFilter.trim());
    if (filter) {
      setNewFilter('');
      loadFilters();
    }
  };

  const handleDeleteFilter = async (filterId) => {
    const success = await removeFilter(filterId);
    if (success) {
      loadFilters();
    }
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Chat Filter</h1>
        <div className={classes.controls}>
          <div className={classes.searchContainer}>
            <Search />
            <input
              type="text"
              placeholder="Search filters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={classes.searchInput}
            />
          </div>
        </div>
      </div>

      <div className={classes.settingsGrid}>
        <div className={classes.settingRow}>
          <div className={classes.settingInfo}>
            <span className={classes.settingTitle}>Add New Filter</span>
            <span className={classes.settingDescription}>Enter a word or phrase to filter from chat</span>
          </div>
          <form onSubmit={handleAddFilter} className={classes.inputRow}>
            <input
              type="text"
              value={newFilter}
              onChange={(e) => setNewFilter(e.target.value)}
              className={classes.textInput}
              placeholder="Enter word or phrase..."
            />
            <button type="submit" className={classes.actionButton} disabled={!newFilter.trim()}>
              Add Filter
            </button>
          </form>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className={classes.settingRow} style={{ flexDirection: 'column', gap: '16px' }}>
            <div className={classes.settingInfo}>
              <span className={classes.settingTitle}>Filter List</span>
              <span className={classes.settingDescription}>List of currently filtered words and phrases</span>
            </div>

            <div className={classes.filterGrid}>
              {filters.map(filter => (
                <div key={filter._id} className={classes.filterCard}>
                  <span className={classes.filterPhrase}>{filter.phrase}</span>
                  <button
                    className={classes.dangerButton}
                    onClick={() => handleDeleteFilter(filter._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

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
                disabled={filters.length < 10}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterManager; 