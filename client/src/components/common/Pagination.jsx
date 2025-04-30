import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    marginTop: '24px',
    marginBottom: '24px'
  },
  pageButton: {
    minWidth: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(0.75),
    background: theme.bg.inner,
    color: theme.text.secondary,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s',
    padding: 0,
    '&:hover': {
      background: theme.bg.light,
      color: theme.text.primary
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      '&:hover': {
        background: theme.bg.inner,
        color: theme.text.secondary
      }
    }
  },
  activePage: {
    background: theme.bg.light,
    color: theme.text.primary
  },
  ellipsis: {
    minWidth: '36px',
    height: '36px',
    borderRadius: theme.spacing(0.75),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.bg.inner,
    color: theme.text.secondary
  }
}));

const Pagination = ({ currentPage, totalPages, onPageChange, style='' }) => {
  const classes = useStyles();

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    if (currentPage > 2) {
      pages.push(
        <button
          key={1}
          className={classes.pageButton}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (currentPage > 3) {
        pages.push(<span key="ellipsis1" className={classes.ellipsis}>...</span>);
      }
    }

    // Show current page and adjacent pages
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(
        <button
          key={i}
          className={`${classes.pageButton} ${i === currentPage ? classes.activePage : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Always show last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push(<span key="ellipsis2" className={classes.ellipsis}>...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className={classes.pageButton}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={classes.paginationContainer} style={style ? style : {}}>
      <button
        className={classes.pageButton}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </button>
      {renderPageNumbers()}
      <button
        className={classes.pageButton}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Pagination; 