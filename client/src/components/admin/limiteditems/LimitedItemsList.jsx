import React, { useState, useCallback } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { Search } from '@material-ui/icons';

const LimitedItemsList = ({ items, loading, page, totalPages, onPageChange, onSearch, onItemDeleted, onItemEdit }) => {
  const classes = useAdminStyles();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = useCallback(() => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  }, [onSearch, searchTerm]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <div className={classes.section}>
      <div className={classes.controls}>
        <div className={classes.searchContainer}>
          <div className={classes.inputWithButton} style={{ width: '300px', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className={classes.textInput}
              placeholder="Search items..."
            />
            <button 
              onClick={handleSearchSubmit}
              className={classes.actionButton}
              style={{ marginLeft: '8px', padding: '8px 16px' }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className={classes.boxGrid} style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
        gap: '20px',
        padding: '20px'
      }}>
        {items.map((item) => (
          <div className={classes.card} key={item._id} style={{
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: '100%',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '6px',
                marginBottom: '12px',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <h2 className={classes.title} style={{ 
                  fontSize: '14px', 
                  margin: '0 0 4px 0',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.name}
                </h2>
                <p className={classes.successText} style={{ 
                  margin: '0', 
                  fontSize: '13px',
                  fontWeight: '500' 
                }}>
                  ${(item.amountFixed || 0).toFixed(2)}
                </p>
              </div>
              <div className={classes.actionButtons} style={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                gap: '8px'
              }}>
                <button
                  className={classes.iconButton}
                  onClick={() => onItemEdit({...item, price: item.amountFixed})}
                  style={{ 
                    color: '#4a90e2', 
                    background: 'transparent',
                    border: '1px solid #4a90e2',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    fontSize: '12px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(74, 144, 226, 0.1)';
                    e.currentTarget.style.borderColor = '#2171c7';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#4a90e2';
                  }}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className={classes.iconButton}
                  onClick={() => onItemDeleted(item._id)}
                  style={{ 
                    color: '#e25c5c',
                    background: 'transparent',
                    border: '1px solid #e25c5c',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    fontSize: '12px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(226, 92, 92, 0.1)';
                    e.currentTarget.style.borderColor = '#c72121';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#e25c5c';
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !loading && (
        <div className={classes.emptyState}>
          <p>No limited items found</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className={classes.pagination}>
          <button
            className={classes.paginationButton}
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>
          <span className={classes.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            className={classes.paginationButton}
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LimitedItemsList; 