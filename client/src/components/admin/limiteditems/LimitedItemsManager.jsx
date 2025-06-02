import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../contexts/admin';
import { useAdminStyles } from '../styles/adminStyles';
import { Tabs, Tab } from '@material-ui/core';
import LimitedItemsList from './LimitedItemsList';
import LimitedItemCreate from './LimitedItemCreate';

const LimitedItemsManager = () => {
  const classes = useAdminStyles();
  const { getLimitedItems, updateLimitedItem, deleteLimitedItem, loading } = useAdmin();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const loadItems = async () => {
    try {
      const response = await getLimitedItems(page, search);
      if (response) {
        setItems(response.items || []);
        setTotalPages(response.pages || 1);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, [page, search]);

  const handleItemDeleted = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const success = await deleteLimitedItem(itemId);
        if (success) {
          await loadItems();
        }
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const handleItemEdit = (item) => {
    setSelectedItem(item);
    setActiveTab(1);
  };

  const handleItemCreated = async () => {
    try {
      await loadItems();
      setActiveTab(0);
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to refresh items after creation:', error);
    }
  };

  const handleSearch = (newSearch) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page when searching
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} className={classes.tabPanel}>
      {value === index && children}
    </div>
  );

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Limited Items</h1>
      </div>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        className={classes.tabs}
      >
        <Tab label="Item List" />
        <Tab label={selectedItem ? 'Edit Item' : 'New Item'} />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <LimitedItemsList
          items={items}
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onSearch={handleSearch}
          onItemDeleted={handleItemDeleted}
          onItemEdit={handleItemEdit}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <LimitedItemCreate
          selectedItem={selectedItem}
          onItemCreated={handleItemCreated}
        />
      </TabPanel>
    </div>
  );
};

export default LimitedItemsManager; 