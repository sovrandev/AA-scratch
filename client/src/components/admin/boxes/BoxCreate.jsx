import React, { useState, useCallback } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { useNotification } from '../../../contexts/notification';
import { CloudUpload, Search, ArrowUpward, ArrowDownward } from '@material-ui/icons';
import { Tabs, Tab, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import theme from '../../../styles/theme';

const ITEMS_PER_PAGE = 20;

const BoxCreate = ({ items, onBoxCreated }) => {
  const classes = useAdminStyles();
  const { createBox } = useAdmin();
  const notify = useNotification();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [boxType, setBoxType] = useState('site');  // Add boxType state with default 'paid'
  const [levelMin, setLevelMin] = useState(0);     // Add levelMin state with default 0
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [sortOrder, setSortOrder] = useState('none'); // 'none', 'priceAsc', 'priceDesc'

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a regular JavaScript object instead of FormData
    const boxData = {
      name,
      price: parseFloat(price),
      image, // This will be the base64 image data
      categories: ["featured"],
      type: boxType,
      levelMin: boxType === 'free' ? parseInt(levelMin) : 0, // Only include levelMin if free type
      items: selectedItems.map(item => ({
        item: item.id,
        tickets: parseFloat(item.chance) * 1000
      }))
    };

    await createBox(boxData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store the base64 image data directly
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemSelect = (item) => {
    const existingItem = selectedItems.find(i => i.id === item._id);
    if (existingItem) {
      setSelectedItems(selectedItems.filter(i => i.id !== item._id));
    } else {
      setSelectedItems([...selectedItems, { 
        id: item._id, 
        name: item.name, 
        chance: '', 
        image: item.image,
        price: item.amountFixed || 0
      }]);
    }
  };

  const handleChanceChange = (itemId, value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSelectedItems(selectedItems.map(item => 
        item.id === itemId ? { ...item, chance: value } : item
      ));
    }
  };

  // Memoize the search and sort function to prevent re-renders
  const getFilteredAndSortedItems = useCallback(() => {
    // First filter items based on search query
    let result = items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Then sort items based on sort order
    if (sortOrder === 'priceAsc') {
      result = [...result].sort((a, b) => (a.amountFixed || 0) - (b.amountFixed || 0));
    } else if (sortOrder === 'priceDesc') {
      result = [...result].sort((a, b) => (b.amountFixed || 0) - (a.amountFixed || 0));
    }
    
    return result;
  }, [items, searchQuery, sortOrder]);

  const filteredAndSortedItems = getFilteredAndSortedItems();
  const totalChance = selectedItems.reduce((sum, item) => sum + (parseFloat(item.chance) || 0), 0);
  const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && children}
    </div>
  );

  return (
    <>
      <div className={classes.settingRow}>
        <div className={classes.settingInfo}>
          <span className={classes.settingTitle}>Box Image</span>
          <span className={classes.settingDescription}>Upload an image for the box (PNG format recommended)</span>
        </div>
        <div className={classes.imageUploadContainer}>
          <input
            type="file"
            id="case-image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="case-image" className={classes.imageUploadLabel}>
            {imagePreview ? (
              <img src={imagePreview} alt="Case preview" className={classes.imagePreview} />
            ) : (
              <>
                <CloudUpload />
                <span>Upload Image</span>
              </>
            )}
          </label>
        </div>
      </div>

      <div className={classes.settingRow}>
        <div className={classes.settingInfo}>
          <span className={classes.settingTitle}>Box Name</span>
          <span className={classes.settingDescription}>Enter a name for the box</span>
        </div>
        <div className={classes.inputRow} style={{ maxWidth: '200px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={classes.textInput}
            placeholder="Enter box name"
          />
        </div>
      </div>

      <div className={classes.settingRow}>
        <div className={classes.settingInfo}>
          <span className={classes.settingTitle}>Box Type</span>
          <span className={classes.settingDescription}>Select if this box requires payment or is free</span>
        </div>
        <div className={classes.inputRow} style={{ maxWidth: '200px' }}>
          <FormControl variant="outlined" size="small" fullWidth>
            <Select
              value={boxType}
              onChange={(e) => setBoxType(e.target.value)}
              className={classes.select}
            >
              <MenuItem value="site">Site</MenuItem>
              <MenuItem value="free">Free</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {boxType === 'free' && (
        <div className={classes.settingRow}>
          <div className={classes.settingInfo}>
            <span className={classes.settingTitle}>Minimum Level</span>
            <span className={classes.settingDescription}>Minimum level required to open this free box</span>
          </div>
          <div className={classes.inputRow} style={{ maxWidth: '200px' }}>
            <input
              type="number"
              value={levelMin}
              onChange={(e) => setLevelMin(e.target.value)}
              className={classes.textInput}
              placeholder="Enter minimum level"
              min="0"
              step="1"
            />
          </div>
        </div>
      )}

      <div className={classes.settingRow} style={{ flexDirection: 'column', gap: '16px', width: '100%' }}>
        <div className={classes.settingInfo} style={{ width: '100%' }}>
          <span className={classes.settingTitle}>Box Items</span>
          <span className={classes.settingDescription}>Select items and set their drop chances (total must equal 100%)</span>
        </div>
        
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          className={classes.tabs}
          style={{ width: '100%' }}
        >
          <Tab label="Available Items" />
          <Tab label="Selected Items" />
        </Tabs>
        
        <TabPanel value={activeTab} index={0}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', gap: '16px' }}>
            <div className={classes.searchContainer}>
              <Search />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={classes.searchInput}
              />
            </div>
            
            <div style={{ minWidth: '200px' }}>
              <FormControl variant="outlined" size="small" fullWidth>
                <Select
                  labelId="sort-select-label"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  label="Sort By"
                  className={classes.select}
                >
                  <MenuItem value="none">Default</MenuItem>
                  <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                  <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          
          <div className={classes.itemSelectionContainer}>
            <div className={classes.itemGrid}>
              {paginatedItems.map(item => (
                <div
                  key={item._id}
                  className={`${classes.itemCard} ${
                    selectedItems.some(i => i.id === item._id) ? classes.selectedItem : ''
                  }`}
                  onClick={() => handleItemSelect(item)}
                >
                  <img src={item.image} alt={item.name} className={classes.itemImage} />
                  <div className={classes.itemInfo}>
                    <span className={classes.itemName}>{item.name}</span>
                    <span className={classes.itemPrice} style={{ fontWeight: 'bold' }}>
                      ${(item.amountFixed || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className={classes.pagination}>
              <button
                className={classes.paginationButton}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className={classes.pageInfo}>
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                className={classes.paginationButton}
                onClick={() => setCurrentPage(p => Math.min(totalPages || 1, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        </TabPanel>
        
        <TabPanel value={activeTab} index={1}>
          {selectedItems.length > 0 ? (
            <div className={classes.selectedItemsContainer}>
              <div className={classes.selectedItemsList}>
                {selectedItems.map(item => (
                  <div key={item.id} className={classes.selectedItemRow}>
                    <div className={classes.selectedItemInfo}>
                      <img src={item.image} alt={item.name} className={classes.smallItemImage} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className={classes.itemName}>{item.name}</span>
                        <span className={classes.itemPrice} style={{ fontWeight: 'bold' }}>
                          ${(item.price || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className={classes.chanceInput}>
                      <input
                        type="text"
                        value={item.chance}
                        onChange={(e) => handleChanceChange(item.id, e.target.value)}
                        className={classes.textInput}
                        placeholder="Chance %"
                      />
                      <button
                        className={classes.dangerButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItems(selectedItems.filter(i => i.id !== item.id));
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ 
                marginTop: '16px', 
                padding: '12px', 
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#fff',
                border: `1px solid ${theme.bg.border}`
              }}>
                <span>Total Chance: {totalChance.toFixed(2)}%</span>
                {totalChance !== 100 && (
                  <span style={{ fontWeight: 'bold' }}>
                    (Must equal 100%)
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div style={{ 
              padding: '24px', 
              textAlign: 'center', 
              color: '#666',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '4px'
            }}>
              No items selected. Go to the "Available Items" tab to select items for your case.
            </div>
          )}
        </TabPanel>
      </div>

      <div className={classes.settingRow} style={{ justifyContent: 'flex-end', border: 'none' }}>
        <button
          className={classes.actionButton}
          onClick={handleSubmit}
        >
          Create Box
        </button>
      </div>
    </>
  );
};

export default BoxCreate; 