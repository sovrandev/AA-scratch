import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { Tabs, Tab } from '@material-ui/core';
import BoxCreate from './BoxCreate';
import BoxList from './BoxList';

const BoxManager = () => {
  const classes = useAdminStyles();
  const { getBoxes, loading } = useAdmin();
  const [boxes, setBoxes] = useState([]);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadBoxes();
  }, [page]);

  const loadBoxes = async () => {
    const data = await getBoxes(page);
    if (data) {
      setBoxes(data.boxes);
      setTotalCount(data.count);
      setItems(data.items);
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} className={classes.tabPanel}>
      {value === index && children}
    </div>
  );

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Boxes</h1>
      </div>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        className={classes.tabs}
      >
        <Tab label="Box List" />
        <Tab label="Create New Box" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <BoxList 
          boxes={boxes} 
          loading={loading}
          page={page}
          totalCount={totalCount}
          onPageChange={setPage}
          onBoxDeleted={loadBoxes}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <div className={classes.section}>
          <BoxCreate items={items} onBoxCreated={loadBoxes} />
        </div>
      </TabPanel>
    </div>
  );
};

export default BoxManager; 