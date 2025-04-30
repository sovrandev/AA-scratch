import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useLiveDrops } from "../../contexts/livedrops";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "200px",
    minWidth: "200px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    zIndex: 10,
    overflow: "hidden",
    "@media (max-width: 1200px)": {
      display: "none"
    },
  },
  header: {
    padding: theme.spacing(0, 0, 2, 0.25),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: theme.green,
    marginRight: theme.spacing(1),
    animation: "$pulse 1.5s infinite",
  },
  "@keyframes pulse": {
    "0%": {
      opacity: 1,
      transform: "scale(1)",
    },
    "50%": {
      opacity: 0.6,
      transform: "scale(1.2)",
    },
    "100%": {
      opacity: 1,
      transform: "scale(1)",
    },
  },
  dropsContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  dropItem: {
    padding: theme.spacing(1.5),
    overflow: "hidden",
    background: theme.bg.inner + "80",
    borderRadius: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    height: 175,
    width: "100%",
    gap: theme.spacing(1),
    position: "relative",
    cursor: "pointer",
    "&:hover": {
      background: theme.bg.inner,
      transition: "all 0.2s",
    },
  },
  dropHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  username: {
    color: theme.text.primary,
    fontSize: 14,
    fontWeight: 600,
  },
  timestamp: {
    color: theme.text.secondary,
    fontSize: 12,
  },
  dropContent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    height: 150,
    position: "relative",
    zIndex: 2,
  },
  itemImage: {
    width: "6rem",
    height: "6rem",
    borderRadius: theme.spacing(0.5),
    objectFit: "contain",
    position: "relative",
    zIndex: 2,
  },
  itemName: {
    color: theme.text.secondary,
    fontSize: 13,
    fontWeight: 600,
    marginTop: theme.spacing(1.5),
    position: "relative",
    zIndex: 2,
    maxWidth: 150,
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  itemValue: {
    color: theme.text.primary,
    fontSize: 14,
    fontWeight: 600,
    position: "relative",
    zIndex: 2,
  },
  boxName: {
    color: theme.text.primary,
    fontSize: 12,
  },
  glowEffect: {
    position: "absolute",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    filter: "blur(20px)",
    zIndex: 1,
  },
}));

const LiveDrops = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { drops } = useLiveDrops();

  const getGlowStyle = (ratio) => {
    if(ratio >= 9) {
      return 'radial-gradient(circle, rgba(196, 167, 7, 0.25), transparent 75%)';
    } else if(ratio >= 5) {
      return 'radial-gradient(circle, rgba(237, 27, 91, 0.25), transparent 75%)';
    } else if(ratio >= 1.8) {
      return 'radial-gradient(circle, rgba(147, 51, 234, 0.25), transparent 75%)';
    } else if(ratio >= 0.8) {
      return 'radial-gradient(circle, rgba(27, 149, 237, 0.25), transparent 75%)';
    } else {
      return 'radial-gradient(circle, rgba(141, 155, 172, 0.25), transparent 75%)';
    }
  };

  return (
    <motion.div 
      className={classes.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className={classes.header}>
        <div className={classes.title}>
          <div className={classes.liveIndicator} />
          Live Opens
        </div>
      </div>
      <div className={classes.dropsContainer}>
        <AnimatePresence mode="popLayout">
          {drops.map((drop) => (
            <motion.div
              key={drop.id}
              className={classes.dropItem}
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1,
                transition: { 
                  type: "spring", 
                  stiffness: 300,
                  damping: 25,
                }
              }}
              exit={{
                opacity: 0,
                y: 50,
                scale: 0.8,
                transition: { 
                  duration: 0.2,
                  ease: "easeIn" 
                }
              }}
              layout
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                mass: 0.5
              }}
              onClick={() => { navigate(`/${drop.link}`) }}
            >
              <div className={classes.glowEffect} style={{ background: getGlowStyle(drop.ratio) }} />
              <div className={classes.dropContent}>
                <img
                  src={drop.image}
                  alt={drop.itemName}
                  className={classes.itemImage}
                />
                <div className={classes.itemName}>{drop.name}</div>
                <div className={classes.itemValue}>${drop.amountFixed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LiveDrops; 