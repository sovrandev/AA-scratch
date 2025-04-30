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
    position: 'relative',
  },
  itemImageContainer: {
    width: 88,
    height: 88,
    objectFit: 'contain',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: "8px"
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
    width: '125px',
  },
  itemPrice: {
    fontSize: 14,
    color: theme.text.primary,
  },
  round: {
    color: theme.text.secondary
  },
  itemChance: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: 4,
    backgroundColor: theme.bg.inner,
    color: theme.text.secondary,
  }
}));

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

const ItemDrop = ({ item, box }) => {
  const classes = useStyles();
  
  if(!item.item) item.item = item;

  const getItemColor = () => {
    if (item.color) return item.color;

    const calculateEstimatedCaseValue = (items) => {
      if (!items || items.length === 0) return 0;
      
      const totalTickets = items.reduce((sum, item) => sum + (item.tickets || 1), 0);
      
      const expectedValue = items.reduce((sum, item) => {
        const probability = (item.tickets || 1) / totalTickets;
        return sum + (item.item.amountFixed * probability);
      }, 0);
      
      return expectedValue;
    };

    if(!box.amount) box.amount = calculateEstimatedCaseValue(box.items);

    // If no color is set but we have price data, calculate it
    if (item.item && item.item.amountFixed && box.amount) {
      const ratio = item.item.amountFixed / box.amount;

      if(ratio >= 9) return 'gold';
      if(ratio >= 5) return 'red';
      if(ratio >= 1.8) return 'purple';
      if(ratio >= 0.8) return 'blue';
      return 'white';
    }
    
    return 'white'; // Default color
  };

  // Calculate percentage chance from tickets
  const getPercentageChance = () => {
    if (!item.tickets) return null;
    
    const percentage = (item.tickets / 100000) * 100;
    return percentage < 0.01 ? '<0.01%' : `${percentage.toFixed(2)}%`;
  };
  
  return (
    <div className={classes.itemDrop}>
      <div className={classes.itemImageContainer}>
        <img 
          src={item.item.image} 
          alt={item.item.name}
          className={classes.itemImage}
          style={{ background: getRadialGradient(getItemColor()) }}
        /> 
      </div>
      <div className={classes.itemInfo}>
        <div className={classes.itemName}>
          {item.item.name}
        </div>
        <div className={classes.itemPrice}>
          ${item.item.amountFixed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div> 
      {getPercentageChance() && (
        <div className={classes.itemChance}>
          {getPercentageChance()}
        </div>
      )}
    </div>
  );
};

export default ItemDrop;