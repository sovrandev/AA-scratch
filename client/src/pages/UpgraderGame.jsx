import React, { useState, useEffect, useRef } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useUpgrader } from "../contexts/upgrader";
import { useUser } from "../contexts/user";
import { useNotification } from "../contexts/notification";
import theme from "../styles/theme";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Slider } from "@material-ui/core";
import useLocalStorage from "../hooks/useLocalStorage";

import SortDropdown from "../components/cases/overview/SortDropdown";
import UpgraderItem from "../components/upgrader/UpgraderItem";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Pagination from "../components/common/Pagination";

// Helper functions
const calculateAngle = (ticketNumber) => {
  const maxTicketNumber = 100000;
  return (ticketNumber / maxTicketNumber) * 360;
};

const getRadialGradient = (color = 'white') => {
  switch (color) {
    case 'gold':
      return 'radial-gradient(circle, rgba(255, 215, 0, 0.25), transparent 75%)';
    case 'red':
      return 'radial-gradient(circle, rgba(237, 27, 91, 0.25), transparent 75%)';
    case 'purple':
      return 'radial-gradient(circle, rgba(147, 51, 234, 0.25), transparent 75%)';
    case 'blue':
      return 'radial-gradient(circle, rgba(27, 149, 237, 0.25), transparent 75%)';
    case 'white':
    default:
      return 'radial-gradient(circle, rgba(141, 155, 172, 0.25), transparent 75%)';
  }
};

const Input = withStyles(theme => ({
  root: {
    background: theme.bg.box,
    borderRadius: "6px",
    height: "40px",
    flex: 1,
    opacity: 1,
    width: "100%",
    "& :before": {
      display: "none",
    },
    "& :after": {
      display: "none",
    },
    "& label": {
      color: "#8D9BAC",
      fontSize: 14,
      display: "none"
    },
    "& .MuiInputBase-root": {
      height: "40px",
      height: "100%",
      opacity: 1,
      background: "transparent !important",
      "&:hover": {
        background: "transparent !important"
      },
      "&.Mui-focused": {
        background: "transparent !important"
      },
    },
    "& .MuiFilledInput-root": {
      backgroundColor: "transparent !important",
      "&:hover": {
        backgroundColor: "transparent !important"
      },
      "&.Mui-focused": {
        backgroundColor: "transparent !important"
      }
    },
    "& div input": {
      color: theme.text.secondary,
      opacity: 1,
      fontFamily: "Onest",
      fontSize: 14,
      fontWeight: 500,
      height: "100%",
      padding: "0 0.5rem",
      height: "40px",
      paddingLeft: "2rem",
      textAlign: "left",
      "&:hover": {
        background: "transparent"
      },
      "&:focus": {
        background: "transparent"
      }
    },
    "& .MuiInputAdornment-root": {
      borderRadius: "6px",
      position: "absolute",
      left: "0.75rem",
      height: "100%",
      maxHeight: "none",
      display: "flex",
      alignItems: "center",
      margin: 0
    }
  }
}))(TextField);

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    gap: "110px",
    color: theme.text.primary,
    marginBottom: "15rem",
    ["@media (max-width: 1200px)"]: {
      gap: "0",
      flexDirection: "column",
      alignItems: "center",
    }
  },
  leftContainer: {
    minWidth: "620px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    ["@media (max-width: 1200px)"]: {
      display: "none"
    }
  },
  mobileAddItemButton: {
    display: "none",
    ["@media (max-width: 1200px)"]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      background: theme.accent.primaryGradient,
      color: "#fff",
      borderRadius: "4px",
      padding: "10px 24px",
      cursor: "pointer",
      textAlign: "center",
      transition: "all 0.2s ease-in-out",
      fontWeight: 600,
      fontSize: "14px",
      border: "none",
      marginTop: "16px",
      "&:hover": {
        opacity: 0.9
      }
    }
  },
  itemsPopup: {
    display: "none",
    ["@media (max-width: 1200px)"]: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: theme.bg.nav,
      zIndex: 1000,
      flexDirection: "column",
      padding: "24px",
      overflow: "auto"
    }
  },
  popupHeader: {
    display: "none",
    ["@media (max-width: 1200px)"]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px"
    }
  },
  popupTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: theme.text.primary
  },
  closeButton: {
    background: "none",
    border: "none",
    color: theme.text.secondary,
    cursor: "pointer",
    padding: "8px",
    "&:hover": {
      color: theme.text.primary
    }
  },
  mobileItemsGrid: {
    display: "none",
    ["@media (max-width: 1200px)"]: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))",
      gap: "8px",
      width: "100%"
    }
  },
  mobileSearchContainer: {
    display: "none",
    ["@media (max-width: 1200px)"]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      width: "100%",
      marginBottom: "8px"
    }
  },
  mobilePriceRangeContainer: {
    display: "none",
    ["@media (max-width: 1200px)"]: {
      display: "flex",
      width: "100%",
      background: theme.bg.box,
      borderRadius: "6px",
      padding: "12px 16px",
      marginBottom: "16px",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "8px"
    }
  },
  mobilePaginationWrapper: {
    display: "none",
    ["@media (max-width: 1200px)"]: {
      display: "flex",
      width: "100%",
      justifyContent: "center",
      marginTop: "16px"
    }
  },
  rightContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "32px"
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%"
  },
  priceRangeContainer: {
    width: "100%",
    background: theme.bg.box,
    borderRadius: "6px",
    padding: "12px 16px 12px 16px",
    marginTop: "-8px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px"
  },
  priceRangeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceRangeLabel: {
    fontSize: "12px",
    color: theme.text.secondary,
    minWidth: "90px",
    fontWeight: 600
  },
  priceRangeValue: {
    fontSize: "12px",
    color: theme.text.primary,
    fontWeight: 600,
    minWidth: "90px",
    textAlign: "right"
  },
  priceRangeSlider: {
    color: theme.accent.primary,
    height: 4,
    maxWidth: "400px",
    padding: 0,
    '& .MuiSlider-thumb': {
      height: 12,
      width: 12,
      backgroundColor: '#fff',
      border: `2px solid ${theme.accent.primary}`,
      marginTop: "-3px",
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiSlider-track': {
      height: 6,
      borderRadius: 2,
    },
    '& .MuiSlider-rail': {
      height: 6,
      borderRadius: 2,
      backgroundColor: theme.bg.main,
    },
  },
  itemsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))",
    gap: "8px",
    width: "100%"
  },
  itemsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px"
  },
  itemsHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  itemName: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: theme.text.primary
  },
  paginationWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  spinnerContainer: {
    marginTop: "10px",
    height: "400px",
    width: "400px",
    "@media (max-width: 1200px)": {
      height: "325px",
      width: "325px",
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "relative",
    background: theme.bg.main,
    borderRadius: "50%",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-6px",
      left: "-6px",
      right: "-6px",
      bottom: "-6px",
      borderRadius: "50%",
      background: theme.bg.box,
    },
  },
  progressCircle: {
    position: "absolute",
    height: "400px",
    width: "400px",
    "@media (max-width: 1200px)": {
      height: "325px",
      width: "325px",
    },
  },
  spinnerMirror: {
    borderRadius: "50%",
    position: "absolute",
    height: "375px",
    width: "375px",
    "@media (max-width: 1200px)": {
      height: "300px",
      width: "300px",
    },
    zIndex: 1,
    transition: `all 5s cubic-bezier(0.05, 0.1, 0.1, 1)`,
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  spinnerSelector: {
    position: "absolute",
    top: "-15px",
    left: "50%",
    transform: "translate(-50%, -25%)",
  },
  spinnerCircle: {
    background: `radial-gradient(2106.42% 100% at 50.21% 0%, ${theme.accent.primary}1A 0%, ${theme.accent.primary}00 100%), radial-gradient(50% 50% at 50% 50%, ${theme.bg.box} 0%, ${theme.bg.box} 100%)`,
    borderRadius: "50%",
    height: "380px",
    width: "380px",
    "@media (max-width: 1200px)": {
      height: "300px",
      width: "300px",
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    position: "relative",
    overflow: "hidden",
    "&::after": {
      content: '""',
      position: "absolute",
      top: "8px",
      left: "8px",
      right: "8px",
      bottom: "8px",
      borderRadius: "50%",
      border: `2px dashed ${theme.accent.primary}`,
      pointerEvents: "none"
    }
  },
  itemPositioner: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  selectedItemContainer: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "300px",
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    transform: "translate(-50%, -50%) !important"
  },
  selectedItemImage: {
    maxWidth: "100%",
    height: "124px",
    objectFit: "contain",
    willChange: "transform",
    filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.1))",
    borderRadius: "12px"
  },
  selectedItemImageContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  radialGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: getRadialGradient(),
    opacity: 0.8,
    zIndex: -1
  },
  selectedItemDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    marginTop: "12px",
    width: "100%",
    textAlign: "center"
  },
  selectedItemName: {
    color: theme.text.secondary,
    fontSize: "14px",
    fontWeight: 600,
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%"
  },
  selectedItemPrice: {
    color: theme.text.primary,
    fontSize: "16px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  priceIcon: {
    width: "16px",
    height: "16px"
  },
  betControlsContainer: {
    width: "100%",
    maxWidth: "435px",
    background: theme.bg.box,
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    padding: "12px",
    gap: "12px"
  },
  betInputsRow: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
  },
  betInputWrapper: {

  },
  betInputLabel: {
    fontSize: "12px",
    color: theme.text.secondary,
    marginBottom: "6px",
    fontWeight: 600
  },
  betInput: {
    width: "100%",
    background: theme.bg.main,
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    color: theme.text.primary,
    fontSize: "14px",
    fontFamily: "Onest",
    "&:focus": {
      outline: "none"
    }
  },
  betSlider: {
    padding: "16px",
    background: theme.bg.darker
  },
  upgradeButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: "8px"
  },
  upgradeButton: {
    background: theme.accent.primaryGradient,
    color: "#fff",
    borderRadius: "4px",
    padding: "10px 24px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.2s ease-in-out",
    fontWeight: 600,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "none",
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed"
    }
  },
  actionButton: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.bg.box,
    borderRadius: "4px",
    cursor: "pointer",
    color: theme.text.secondary,
    border: "none",
    transition: "all 0.2s ease-in-out",
    border: `1px solid transparent`,
    "&:hover": {
      color: theme.text.primary,
      background: theme.bg.darker,
      border: `1px solid ${theme.bg.border}`
    }
  },
  fastSpinButton: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.bg.box,
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s ease-in-out",
    border: `1px solid transparent`,
    color: theme.text.secondary,
    "&:hover": {
      background: theme.bg.darker,
      border: `1px solid ${theme.bg.border}`
    }
  },
  trashButton: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(220, 53, 69, 0.1)",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#dc3545",
    border: "none",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      color: "#fff",
      background: "#dc3545"
    }
  },
  upgradeIcon: {
    width: "16px",
    height: "16px"
  },
  percentageButtonsContainer: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
    width: "100%"
  },
  percentageButton: {
    flex: 1,
    padding: "6px 0",
    background: theme.bg.inner,
    color: theme.text.secondary,
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "12px",
    transition: theme.transitions.normal,
    "&:hover": {
      filter: "brightness(1.1)",
      color: theme.text.primary
    },
    "&.active": {
      background: theme.accent.primaryGradient,
      color: theme.text.primary
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed"
    }
  },
  ticketNumber: {
    fontSize: "12px",
    color: theme.text.secondary,
    fontWeight: 500,
    textAlign: "center",
    padding: "8px",
    background: theme.bg.main,
    borderRadius: "4px"
  },
  showItemsPopup: {
    display: "block"
  },
  progressCircleContainer: {
    height: "400px",
    width: "400px",
    position: "absolute",
    "@media (max-width: 1200px)": {
      height: "325px",
      width: "325px",
    },
  }
}));

const UpgraderGame = () => {
  const classes = useStyles();
  const notify = useNotification();
  const { items, sendBet, getItemList } = useUpgrader();
  const { user, setUser } = useUser();
  const [showItemsPopup, setShowItemsPopup] = useState(false);

  const [searchInputState, setSearchInputState] = useState("");
  const [sortOrder, setSortOrder] = useState("highToLow");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const ITEMS_PER_PAGE = 16;

  const [upgrading, setUpgrading] = useState(false);
  const [rotateEndpoint, setRotateEndpoint] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [isUnder, setIsUnder] = useState(true);
  const [lastTicket, setLastTicket] = useState(0);
  const [fastSpin, setFastSpin] = useLocalStorage("fast_spin_upgrader", false);
  const [priceRange, setPriceRange] = useState([0, 4000]);

  // Add a ROTATE_ENDPOINT ref to track the rotation outside of state
  const ROTATE_ENDPOINT_REF = useRef(0);

  const fetchItems = async () => {
    try {
      const response = await getItemList({
        page: currentPage,
        search: searchInputState,
        sort: sortOrder === "highToLow" ? "highest" : "lowest",
        minPrice: priceRange[0],
        maxPrice: priceRange[1]
      });
      setTotalItems(response.count);
    } catch (error) {
      notify.error(error.message || "Failed to fetch items");
    }
  };

  // Effect for fetching items when filters change
  useEffect(() => {
    fetchItems();
  }, [currentPage, searchInputState, sortOrder, priceRange]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemSelect = (item) => {
    if (upgrading) return; // Prevent item selection during spin
    if (selectedItem && selectedItem._id === item._id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  const simulateAnimation = (data) => {
    const remainder = ROTATE_ENDPOINT_REF.current % 360;
    const adding = 360 - remainder;
    const extra = 720 + ROTATE_ENDPOINT_REF.current;
    const angle = calculateAngle(data.ticket);

    ROTATE_ENDPOINT_REF.current = extra + angle + adding;
    setRotateEndpoint(ROTATE_ENDPOINT_REF.current);
    
    setTimeout(() => {
      setLastTicket(data.ticket / 100000);
      setUpgrading(false);
    }, fastSpin ? 2000 : 5000);
  };
  
  // Update all values when bet amount, percentage, or selected item changes
  const updateAll = (newBetAmount, newPercentage) => {
    if (upgrading) return;
    if (!user || !selectedItem) return;
    
    // Update bet amount
    setBetAmount(newBetAmount);
    
    // Update percentage
    setPercentage(newPercentage);
  };
  
  // Handle bet amount change
  const handleBetAmountChange = (e) => {
    const newBetAmount = parseFloat(e.target.value) || 0;
    
    // Prevent negative values
    if (newBetAmount < 0) return;
    
    // Calculate percentage based on bet amount (incorporating house edge)
    let newPercentage = 0;
    if (selectedItem && selectedItem.amountFixed > 0) {
      // House edge is considered by dividing by 1.1 (item price * 1.1 represents house edge)
      newPercentage = ((newBetAmount / (selectedItem.amountFixed * 1.1)) * 100).toFixed(2);
      
      // Cap percentage at 80% for safety
      if (newPercentage > 80) {
        newPercentage = 80;
        const cappedBetAmount = (selectedItem.amountFixed * 1.1 * 0.8).toFixed(2);
        updateAll(cappedBetAmount, newPercentage);
        return;
      }
    }
    
    updateAll(newBetAmount, newPercentage);
  };
  
  // Handle percentage change
  const handlePercentageChange = (e) => {
    const newPercentage = parseFloat(e.target.value) || 0;
    
    // Prevent negative values
    if (newPercentage < 0) return;
    
    // Cap percentage at 80% for safety
    if (newPercentage > 80) {
      // Calculate bet amount with house edge for 80% chance
      if (selectedItem && selectedItem.amountFixed > 0) {
        const maxBetAmount = (selectedItem.amountFixed * 1.1 * 0.8).toFixed(2);
        updateAll(maxBetAmount, 80);
      } else {
        updateAll(betAmount, 80);
      }
      return;
    }
    
    // Calculate bet amount based on percentage (incorporating house edge)
    let newBetAmount = 0;
    if (selectedItem && selectedItem.amountFixed > 0) {
      // Apply house edge by multiplying by 1.1 (10% house edge)
      newBetAmount = ((newPercentage / 100) * selectedItem.amountFixed * 1.1).toFixed(2);
    }
    
    updateAll(newBetAmount, newPercentage);
  };
  
  // Reset values when selected item changes
  useEffect(() => {
    if (selectedItem) {
      // Reset values
      setPercentage(0);
      setBetAmount(0);
      
      // Play selection sound if available
      // playSound(selectAudio);
    }
  }, [selectedItem]);
  
  // Update the handleUpgrade function to use the socket
  const handleUpgrade = async () => {
    if (!selectedItem || upgrading || !user) return;
    if (betAmount <= 0) {
      notify.error("Please enter a bet amount");
      return;
    }
    
    try {
      setUpgrading(true);
      
      // Send the bet using the context's sendBet function
      const response = await sendBet(betAmount, selectedItem.amountFixed, isUnder ? "under" : "over");
      
      // Extract game data from response
      const gameData = response.games;
      
      // Update user data from response with current balance (bet amount deducted)
      if (response.user) {
        setUser(prevUser => ({
          ...prevUser,
          balance: response.user.balance,
          rakeback: response.user.rakeback
        }));
      }
      
      // Simulate animation with the game outcome
      simulateAnimation({
        ticket: gameData.outcome,
        success: gameData.payout > 0
      });

      if (gameData.payout > 0) {
        // After spin animation, update balance with won amount
        setTimeout(() => {
          // Update user balance with the won amount
          setUser(prevUser => ({
            ...prevUser,
            balance: prevUser.balance + selectedItem.amountFixed,
            rakeback: response.user.rakeback
          }));
        }, fastSpin ? 2000 : 5000);
      }

    } catch (error) {
      setUpgrading(false);
    }
  };

  const handleFlip = () => {
    setIsUnder(!isUnder);
  };

  const handleClear = () => {
    setSelectedItem(null);
    setBetAmount(0);
    setPercentage(0);
  };

  // Add percentage button handler
  const handlePercentageButton = (percent) => {
    if (!selectedItem || upgrading) return;
    
    // Calculate bet amount based on percentage of item price
    const newPercentage = percent;
    let newBetAmount = 0;
    
    if (selectedItem && selectedItem.amountFixed > 0) {
      // Apply house edge
      newBetAmount = ((newPercentage / 100) * selectedItem.amountFixed * 1.1).toFixed(2);
    }
    
    updateAll(newBetAmount, newPercentage);
  };

  // Add bet amount button handlers
  const handleBetAmountButton = (type) => {
    if (!selectedItem || upgrading || !user) return;
    
    let newBetAmount = 0;
    
    switch (type) {
      case 'plus10':
        newBetAmount = parseFloat(betAmount || 0) + 10;
        break;
      case 'half':
        // Half of current bet amount (not balance)
        newBetAmount = parseFloat(betAmount || 0) / 2;
        break;
      case 'double':
        // Double current bet amount
        newBetAmount = parseFloat(betAmount || 0) * 2;
        break;
      case 'max':
        // Calculate 80% max possible bet based on item price
        const maxPossibleBet = selectedItem.amountFixed * 1.1 * 0.8;
        // Take the smaller of user balance or max possible bet
        newBetAmount = Math.min(user.balance, maxPossibleBet);
        break;
      default:
        newBetAmount = betAmount;
    }
    
    // Ensure it doesn't exceed user balance
    if (newBetAmount > user.balance) {
      newBetAmount = user.balance;
    }
    
    // Ensure it's not negative
    if (newBetAmount < 0) {
      newBetAmount = 0;
    }
    
    // Calculate percentage based on bet amount
    let newPercentage = 0;
    if (selectedItem && selectedItem.amountFixed > 0) {
      // Apply house edge
      newPercentage = ((newBetAmount / (selectedItem.amountFixed * 1.1)) * 100).toFixed(2);
      
      // Cap percentage at 80%
      if (newPercentage > 80) {
        newPercentage = 80;
        newBetAmount = (selectedItem.amountFixed * 1.1 * 0.8).toFixed(2);
        
        // Ensure it doesn't exceed user balance again
        if (newBetAmount > user.balance) {
          newBetAmount = user.balance;
          newPercentage = ((newBetAmount / (selectedItem.amountFixed * 1.1)) * 100).toFixed(2);
        }
      }
    }
    
    updateAll(newBetAmount, newPercentage);
  };

  return (  
    <div className={classes.root}>
      <div className={classes.leftContainer}>
        <div className={classes.searchContainer}>
          <Input
            variant="filled"
            value={searchInputState}
            onChange={(e) => {
              setSearchInputState(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ margin: 0 }}>
                  <SearchIcon style={{ color: theme.text.secondary }} />
                </InputAdornment>
              ),
            }}
          />
          <SortDropdown 
            value={sortOrder}
            onChange={(newValue) => {
              setSortOrder(newValue);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className={classes.priceRangeContainer}>
          <div className={classes.priceRangeLabel}>Price Range</div>
          <Slider
            value={priceRange}
            onChange={(event, newValue) => setPriceRange(newValue)}
            // valueLabelDisplay="auto"
            min={0}
            max={4000}
            step={100}
            className={classes.priceRangeSlider}
          />
          <div className={classes.priceRangeValue}>
            ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
          </div>
        </div>
        <div className={classes.itemsGrid}>
          {items.map((item) => (
            <UpgraderItem
              key={item._id}
              item={item}
              isSelected={selectedItem?._id === item._id}
              onSelect={handleItemSelect}
            />
          ))}
        </div>
        <div className={classes.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            style={{ marginTop: "0" }}
          />
        </div>
      </div>
      <div className={classes.rightContainer}>
        <div className={classes.spinnerContainer}>
          <motion.div 
            className={classes.spinnerMirror} 
            style={{ transform: `rotate(${rotateEndpoint}deg)`}}
            animate={{ transform: `rotate(${rotateEndpoint}deg)` }}
            transition={{ 
              duration: fastSpin ? 2 : 5,
              ease: [0.05, 0.1, 0.1, 1]
            }}
          >
            <svg className={classes.spinnerSelector} xmlns="http://www.w3.org/2000/svg" width="19" height="16" viewBox="0 0 19 16" fill="none">
              <path d="M9.89186 15.7471L0.908122 0.186788L18.8756 0.186787L9.89186 15.7471Z" fill="white"/>
            </svg>
          </motion.div>
          <div className={classes.spinnerCircle}>
            <div className={classes.itemPositioner}>
              {!selectedItem && (
                <button 
                  className={classes.mobileAddItemButton}
                  onClick={() => setShowItemsPopup(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                  Add Item
                </button>
              )}
              <AnimatePresence mode="wait">
                {selectedItem && (
                  <motion.div 
                    key={selectedItem._id}
                    className={classes.selectedItemContainer}
                    initial={{ 
                      y: 300,
                      opacity: 0,
                      scale: 0.8
                    }}
                    animate={{ 
                      y: 0,
                      opacity: 1,
                      scale: 1
                    }}
                    exit={{ 
                      y: -300,
                      opacity: 0,
                      scale: 0.8,
                      transition: {
                        duration: 0.3,
                        ease: "easeIn"
                      }
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                    style={{ 
                      transform: "translate(-50%, -50%)"
                    }}
                  >
                    <motion.div className={classes.selectedItemImageContainer}>
                      <div className={classes.radialGradient}></div>
                      <motion.img 
                        src={selectedItem.image} 
                        alt={selectedItem.name}
                        className={classes.selectedItemImage}
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ 
                          scale: 1, 
                          y: 0,
                          transition: {
                            duration: 0.3,
                            ease: "easeOut"
                          }
                        }}
                      />
                    </motion.div>
                    <motion.div 
                      className={classes.selectedItemDetails}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.1,
                        duration: 0.3
                      }}
                    >
                      <div className={classes.selectedItemName}>
                        {selectedItem.name}
                      </div>
                      <div className={classes.selectedItemPrice}>
                        ${selectedItem.amountFixed?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className={classes.progressCircleContainer} style={{ transform: isUnder ? "none" : "scaleX(-1)"}}>
            <CircularProgressbar
              value={percentage}
              className={classes.progressCircle}
              styles={buildStyles({
                strokeLinecap: 'butt',
                pathColor: theme.accent.primary,
                trailColor: theme.bg.main,
                strokeWidth: 2
              })}
            />
          </div>
        </div>

        <div className={classes.upgradeButtonContainer}>
          <button
            className={classes.fastSpinButton}
            onClick={() => setFastSpin(!fastSpin)}
            disabled={upgrading}
            style={{ 
              color: fastSpin ? theme.accent.primary : "", 
              border: fastSpin ? `1px solid ${theme.accent.primary}` : "",
              opacity: upgrading ? 0.5 : 1
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.8335 1.66663L3.41142 10.5732C3.12075 10.922 2.97541 11.0964 2.97319 11.2437C2.97126 11.3717 3.02832 11.4935 3.12792 11.574C3.2425 11.6666 3.46952 11.6666 3.92357 11.6666H10.0002L9.16688 18.3333L16.589 9.42675C16.8797 9.07794 17.025 8.90354 17.0272 8.75624C17.0292 8.62819 16.9721 8.50637 16.8725 8.42588C16.7579 8.33329 16.5309 8.33329 16.0768 8.33329H10.0002L10.8335 1.66663Z" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button
            className={classes.upgradeButton}
            onClick={handleUpgrade}
            disabled={!selectedItem || upgrading}
          >
            <svg className={classes.upgradeIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {upgrading ? "Upgrading..." : "Upgrade"}
          </button>
          
          <button
            className={classes.actionButton}
            onClick={handleFlip}
            disabled={upgrading}
            style={{ opacity: upgrading ? 0.5 : 1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M15.4751 3.49996L12.1418 0.166626V2.66663H6.30843V4.33329H12.1418V6.83329M3.80843 5.16663L0.475098 8.49996L3.80843 11.8333V9.33329H9.64176V7.66663H3.80843V5.16663Z" fill="currentColor"/>
            </svg>
          </button>
          
          <button
            className={classes.trashButton}
            onClick={handleClear}
            disabled={upgrading}
            style={{ opacity: upgrading ? 0.5 : 1 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.8333 5.83333L15.1105 15.9767C15.0482 17.0557 14.1431 17.9167 13.0622 17.9167H6.93778C5.85691 17.9167 4.95184 17.0557 4.88951 15.9767L4.16667 5.83333M8.33333 9.16667V14.1667M11.6667 9.16667V14.1667M12.5 5.83333V3.33333C12.5 2.8731 12.1269 2.5 11.6667 2.5H8.33333C7.8731 2.5 7.5 2.8731 7.5 3.33333V5.83333M3.33333 5.83333H16.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={classes.betControlsContainer}>
          <div className={classes.betInputsRow}>
            <div className={classes.betInputWrapper}>
              <div className={classes.betInputLabel}>Percent Chance</div>
              <input
                className={classes.betInput}
                type="number"
                value={percentage || ""}
                onChange={handlePercentageChange}
                placeholder="0.00%"
                disabled={!selectedItem || upgrading}
                min="0"
                max="80"
              />
              <div className={classes.percentageButtonsContainer}>
                <button 
                  className={`${classes.percentageButton} ${percentage === 10 ? 'active' : ''}`}
                  onClick={() => handlePercentageButton(10)}
                  disabled={!selectedItem || upgrading}
                >
                  10%
                </button>
                <button 
                  className={`${classes.percentageButton} ${percentage === 25 ? 'active' : ''}`}
                  onClick={() => handlePercentageButton(25)}
                  disabled={!selectedItem || upgrading}
                >
                  25%
                </button>
                <button 
                  className={`${classes.percentageButton} ${percentage === 50 ? 'active' : ''}`}
                  onClick={() => handlePercentageButton(50)}
                  disabled={!selectedItem || upgrading}
                >
                  50%
                </button>
                <button 
                  className={`${classes.percentageButton} ${percentage === 75 ? 'active' : ''}`}
                  onClick={() => handlePercentageButton(75)}
                  disabled={!selectedItem || upgrading}
                >
                  75%
                </button>
              </div>
            </div>
            <div className={classes.betInputWrapper}>
              <div className={classes.betInputLabel}>Bet Amount</div>
              <input
                className={classes.betInput}
                type="number"
                value={betAmount || ""}
                onChange={handleBetAmountChange}
                placeholder="$0.00"
                disabled={!selectedItem || upgrading}
                min="0"
              />
              <div className={classes.percentageButtonsContainer}>
                <button 
                  className={classes.percentageButton}
                  onClick={() => handleBetAmountButton('plus10')}
                  disabled={!selectedItem || upgrading || !user}
                >
                  +$10
                </button>
                <button 
                  className={classes.percentageButton}
                  onClick={() => handleBetAmountButton('half')}
                  disabled={!selectedItem || upgrading || !user}
                >
                  1/2
                </button>
                <button 
                  className={classes.percentageButton}
                  onClick={() => handleBetAmountButton('double')}
                  disabled={!selectedItem || upgrading || !user || !betAmount}
                >
                  2x
                </button>
                <button 
                  className={classes.percentageButton}
                  onClick={() => handleBetAmountButton('max')}
                  disabled={!selectedItem || upgrading || !user}
                >
                  Max
                </button>
              </div>
            </div>
          </div>
          {lastTicket > 0 && (
            <div className={classes.ticketNumber}>
              Ticket Number: {(lastTicket * 100000).toFixed(0)}
            </div>
          )}
        </div>
      </div>

      <div className={`${classes.itemsPopup} ${showItemsPopup ? classes.showItemsPopup : ''}`}>
        <div className={classes.popupHeader}>
          <div className={classes.popupTitle}>Select Item</div>
          <button 
            className={classes.closeButton}
            onClick={() => setShowItemsPopup(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={classes.mobileSearchContainer}>
          <Input
            variant="filled"
            value={searchInputState}
            onChange={(e) => {
              setSearchInputState(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ margin: 0 }}>
                  <SearchIcon style={{ color: theme.text.secondary }} />
                </InputAdornment>
              ),
            }}
          />
          <SortDropdown 
            value={sortOrder}
            onChange={(newValue) => {
              setSortOrder(newValue);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className={classes.mobilePriceRangeContainer}>
          <div className={classes.priceRangeLabel}>Price Range</div>
          <Slider
            value={priceRange}
            onChange={(event, newValue) => setPriceRange(newValue)}
            min={0}
            max={4000}
            step={100}
            className={classes.priceRangeSlider}
          />
          <div className={classes.priceRangeValue}>
            ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
          </div>
        </div>

        <div className={classes.mobileItemsGrid}>
          {items.map((item) => (
            <UpgraderItem
              key={item._id}
              item={item}
              isSelected={selectedItem?._id === item._id}
              onSelect={(item) => {
                handleItemSelect(item);
                setShowItemsPopup(false);
              }}
            />
          ))}
        </div>

        <div className={classes.mobilePaginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            style={{ marginTop: "0" }}
          />
        </div>
      </div>
    </div>
  );
};

export default UpgraderGame;
