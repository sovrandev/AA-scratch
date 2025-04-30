import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import theme from '../../styles/theme';

const useStyles = makeStyles(theme => ({
  itemCard: {
    background: theme.bg.box,
    borderRadius: "6px",
    padding: "14px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    transition: theme.transitions.normal,
    border: "1px solid transparent",
    position: "relative",
    "&:hover": {
      background: theme.bg.light,
    }
  },
  selected: {
    background: `${theme.bg.inner} !important`,
    border: `1px solid ${theme.bg.border}`,
  },
  itemImage: {
    height: "90px",
    objectFit: "contain",
    borderRadius: "8px",
    userSelect: "none",
  },
  itemName: {
    fontSize: 12,
    marginTop: "8px",
    fontWeight: 500,
    color: theme.text.secondary,
    textAlign: "center",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.text.primary
  }
}));

const UpgraderItem = ({ item, isSelected, onSelect }) => {
  const classes = useStyles();

  return (
    <div className={`${classes.itemCard} ${isSelected ? classes.selected : ''}`} onClick={() => onSelect(item)}>
      <img 
        src={item.image} 
        alt={item.name} 
        className={classes.itemImage}
        draggable="false"
        style={{ background: "radial-gradient(circle, rgba(141, 155, 172, 0.15), transparent 75%)" }}
      />
      <div className={classes.itemName}>{item.name}</div>
      <div className={classes.itemPrice}>${item.amountFixed?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>
  );
};

export default UpgraderItem; 