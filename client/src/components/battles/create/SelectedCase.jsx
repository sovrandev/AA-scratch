import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { motion, Reorder, useDragControls, useMotionValue } from "framer-motion";
import mark from "../../../assets/img/items/mark.png";
import solIcon from "../../../assets/img/general/sol.svg";
import config from "../../../services/config";

const useStyles = makeStyles(theme => ({
  caseBox: {
    userSelect: "none",
    minWidth: 190,
    minHeight: 262,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.bg.box,
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    position: "relative",
    overflow: "hidden",
    willChange: 'transform, opacity',
  },
  caseImage: {
    width: "8rem",
    height: "8rem",
    objectFit: "contain",
  },
  priceContainer: {
    display: "flex",
    gap: "0.25rem",
    alignItems: "center",
    textAlign: "center",
    verticalAlign: "baseline",
    fontSize: "14px",
    color: theme.text.primary,
    fontWeight: 600
  },
  caseName: {
    color: theme.text.secondary, 
    fontSize: "14px", 
    fontWeight: 600,
  },
  addSubContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: theme.bg.inner,
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
    borderRadius: "8px",
    padding: "4px",
    width: "100%",
  },
  subButton: {
    height: 32,
    width: 32,
    backgroundColor: theme.bg.box,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    color: "#898B8E",
    fontWeight: 600,
    cursor: "pointer",
    borderRadius: "6px",
  },
  quantity: {
    fontSize: "14px",
    height: "100%",
    width: "24px",
    fontWeight: 600,
    color: theme.text.primary,
    padding: "0 4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  animationContainer: {
    position: "absolute",
    bottom: 8,
    lineHeight: "20px",
    width: "100%",
    padding: "0 8px",
    zIndex: 1000
  },
  dragHandle: {
    position: "absolute",
    top: 8,
    right: 8,
    cursor: "grab",
    color: theme.text.secondary,
    padding: 4,
    borderRadius: 4,
    "&:hover": {
      backgroundColor: theme.bg.box,
    },
    "&:active": {
      cursor: "grabbing",
      backgroundColor: theme.bg.box,
    }
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: theme.bg.main,
    cursor: 'not-allowed',
    '&:hover': {
      backgroundColor: theme.bg.main,
    }
  },
}));

const SelectedCase = ({ item, add, subtract, customSorting }) => {
  const classes = useStyles();
  const dragControls = useDragControls();
  const y = useMotionValue(0);

  const getBoxImageUrl = (boxName) => {
    return `${config.site.backend.url}/public/img/${boxName
      .toLowerCase()
      .replace(/%/g, 'percent')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}.png`;
  };

  const content = (
    <Reorder.Item
      value={item}
      className={classes.caseBox}
      dragListener={false}
      dragControls={dragControls}
      style={{ y }}
      whileDrag={{ 
        scale: 1.05,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.25)",
        zIndex: 999
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {customSorting && (
        <motion.div 
          className={classes.dragHandle}
          onPointerDown={(e) => {
            e.preventDefault();
            dragControls.start(e);
          }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 6H12V7.5H4V6ZM4 8.5H12V10H4V8.5Z" />
          </svg>
        </motion.div>
      )}
      {item && (
        <>
          <img
            className={classes.caseImage}
            src={getBoxImageUrl(item.name)}
            alt={item.name}
            draggable={false}
          />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <div className={classes.caseName}>{item.name}</div>
            <div className={classes.priceContainer}>
              ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className={classes.addSubContainer}>
            <div 
              className={classes.subButton}
              onClick={(e) => {
                e.stopPropagation();
                subtract(item);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="2" viewBox="0 0 12 2" fill="none"><path d="M11.8333 1.83329H0.166664V0.166626H11.8333V1.83329Z" fill="currentColor"/></svg>
            </div>
            <div className={classes.quantity}>{item.quantity}</div>
            <div 
              className={`${classes.subButton}`}
              onClick={(e) => {
                e.stopPropagation();
                add(item);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="currentColor"/></svg>
            </div>
          </div>
        </>
      )}
    </Reorder.Item>
  );

  return content;
};

export default SelectedCase;