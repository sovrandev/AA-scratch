import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { motion } from "framer-motion";
import markUnopened from "../../../assets/img/items/mark-unopened.png";
import solIcon from "../../../assets/img/general/sol.svg";
import { cardClasses } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  itemDrop: {
    background: theme.bg.box,
    padding: "18px 12px",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: "8px",
    width: '100%', 
    height: 172,
    fontWeight: 500,
    borderRadius: 6,
    [theme.breakpoints.down('lg')]: {
      padding: "12px 8px",
      height: 140,
      gap: "4px",
      borderRadius: 4,
    }
  },
  itemImageContainer: {
    width: 88,
    height: 88,
    objectFit: 'contain',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('lg')]: {
      width: 70,
      height: 70,
    }
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: "8px",
    [theme.breakpoints.down('lg')]: {
      borderRadius: "6px",
    }
  },
  itemInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  itemName: {
    fontSize: 12,
    color: theme.text.secondary,
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '65%',
    flexShrink: 1,
    [theme.breakpoints.down('lg')]: {
      fontSize: 10,
      width: '80%',
    }
  },
  itemPrice: {
    fontSize: 14,
    color: theme.text.primary,
    [theme.breakpoints.down('lg')]: {
      fontSize: 12,
    }
  },
  round: {
    color: theme.text.secondary,
    [theme.breakpoints.down('lg')]: {
      fontSize: 12,
    }
  }
}));

const ItemDrop = ({ item, itemIndex, game, roundNumber, boxes }) => {
  const classes = useStyles();
  const [showContent, setShowContent] = useState(false);

  // Check if this is a big spin item (high value item)
  const isBigSpinItem = () => {
    if (!item?.item?.amountFixed || !boxes[itemIndex]?.amount) return false;
    
    // Calculate the ratio of item value to box cost
    const boxAmount = boxes[itemIndex].amount;
    const itemAmount = item.item.amountFixed;
    const ratio = itemAmount / boxAmount;
    
    // Big spin items typically have a ratio of 2.4 or higher
    return ratio >= 2.4;
  };

  useEffect(() => {
    // Don't show items for future rounds
    if (itemIndex > roundNumber - 1) {
      setShowContent(false);
      return;
    }
    
    // Already completed rounds should show immediately
    if (itemIndex < roundNumber - 1) {
      setShowContent(true);
      return;
    }
    
    if (game?.updatedAt) {
      const spinStartTime = new Date(game.updatedAt).getTime();
      const currentTime = Date.now();
      const elapsedTime = currentTime - spinStartTime;
      
      // Regular spin animation takes about 5.5 seconds plus a small buffer
      let spinDuration = 5800;
      
      // Check if this is a big spin item and add extra time if needed
      if (isBigSpinItem()) {
        // Add extra 9 seconds for big spin animation
        spinDuration += 9000;
      }
      
      if (elapsedTime >= spinDuration) {
        // Spin has already completed, show immediately
        setShowContent(true);
      } else {
        // Spin is still in progress, set a timer for the remaining time
        const remainingTime = Math.max(0, spinDuration - elapsedTime);
        const timer = setTimeout(() => {
          setShowContent(true);
        }, remainingTime);
        return () => clearTimeout(timer);
      }
    }
  }, [item, itemIndex, game, roundNumber]);

  const getRadialGradient = (color) => {
    switch (color) {
      case 'gold':
        return 'radial-gradient(circle, rgba(196, 167, 7, 0.15), transparent 75%)';
      case 'red':
        return 'radial-gradient(circle, rgba(237, 27, 91, 0.15), transparent 75%)';
      case 'purple':
        return 'radial-gradient(circle, rgba(147, 51, 234, 0.15), transparent 75%)';
      case 'blue':
        return 'radial-gradient(circle, rgba(27, 149, 237, 0.15), transparent 75%)';
      case 'white':
        return 'radial-gradient(circle, rgba(141, 155, 172, 0.15), transparent 75%)';
      default:
        return 'none';
    }
  };
  
  return (
    <motion.div 
      className={classes.itemDrop}
    >
      {item?.item ? (
        showContent ? (
          <>
            <div className={classes.itemImageContainer}>
              <motion.img 
                src={item.item.image} 
                alt={item.item.name}
                className={classes.itemImage}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                style={{ background: getRadialGradient(item.color) }}
              /> 
            </div>
            <div className={classes.itemInfo}>
              <motion.div 
                className={classes.itemName}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {item.item.name}
              </motion.div>
              <motion.div 
                className={classes.itemPrice}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                ${item.item.amountFixed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
            </div> 
          </>
        ) : (
          <div className={classes.round}>Opening...</div>
        )
      ) : (
        <div className={classes.round}>Round {itemIndex + 1}</div>
      )}
    </motion.div>
  );
};

export default ItemDrop;