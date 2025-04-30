import React from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import Loader from '../../common/Loader';
import config from '../../../services/config';

const BoxList = ({ boxes, loading, page, totalCount, onPageChange, onBoxDeleted }) => {
  const classes = useAdminStyles();
  const { removeBox } = useAdmin();

  const getBoxImageUrl = (boxName) => {
    return `${config.site.backend.url}/public/img/${boxName
      .toLowerCase()
      .replace(/%/g, 'percent')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}.png`;
  };

  const handleDelete = async (boxId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this box?')) {
      const success = await removeBox(boxId);
      if (success) {
        onBoxDeleted();
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={classes.tableContainer}>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Total Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {boxes.map((box) => (
            <tr key={box._id} className={classes.tableRow}>
              <td>
                <img
                  src={getBoxImageUrl(box.name)}
                  alt={box.name}
                  className={classes.boxImage}
                />
              </td>
              <td>{box.name}</td>
              <td>${box.amount.toFixed(2)}</td>
              <td>{box.items.length}</td>
              <td>
                <button
                  className={classes.dangerButton}
                  onClick={(e) => handleDelete(box._id, e)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={classes.pagination}>
        <button
          className={classes.paginationButton}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className={classes.pageInfo}>
          Page {page}
        </span>
        <button
          className={classes.paginationButton}
          onClick={() => onPageChange(page + 1)}
          disabled={boxes.length < 10}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BoxList; 