import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';

const LimitedItemCreate = ({ selectedItem, onItemCreated }) => {
  const classes = useAdminStyles();
  const { createLimitedItem, updateLimitedItem, loading } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        name: selectedItem.name || '',
        price: selectedItem.amountFixed || '',
        imageUrl: selectedItem.image || '',
      });
    }
  }, [selectedItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let success;
      if (selectedItem) {
        success = await updateLimitedItem(selectedItem._id, formData);
      } else {
        success = await createLimitedItem(formData);
      }

      if (success) {
        setFormData({ name: '', price: '', imageUrl: '' });
        onItemCreated();
      }
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  return (
    <div className={classes.section}>
      <form onSubmit={handleSubmit}>
        <div className={classes.inputWithButton}>
          <label className={classes.inputLabel}>Item Name</label>
          <input
            type="text"
            className={classes.textInput}
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        <div className={classes.inputWithButton}>
          <label className={classes.inputLabel}>Price</label>
          <input
            type="number"
            step="0.01"
            className={classes.textInput}
            required
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </div>

        <div className={classes.inputWithButton}>
          <label className={classes.inputLabel}>Image URL</label>
          <input
            type="text"
            className={classes.textInput}
            required
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />
        </div>

        <div style={{ marginTop: '24px' }}>
          <button
            type="submit"
            className={classes.actionButton}
            disabled={loading}
          >
            {selectedItem ? 'Update Limited Item' : 'Create Limited Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LimitedItemCreate; 