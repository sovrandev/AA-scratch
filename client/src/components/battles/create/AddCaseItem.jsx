import React, { memo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import config from "../../../services/config";
import theme from "../../../styles/theme";

const useStyles = makeStyles(theme => ({
  caseBox: {
    userSelect: "none",
    height: "fit-content",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: theme.bg.box,
    borderRadius: "0.5rem",
    padding: "12px",
    position: "relative",
    overflow: "hidden",
    minHeight: 236,
    maxHeight: 236,
    willChange: 'transform, opacity',
  },
  selectedBox: {
    
  },
  caseImage: {
    width: "7rem",
    height: "7rem",
    objectFit: "contain",
    marginBottom: 8
  },
  priceContainer: {
    display: "flex",
    gap: "0.25rem",
    alignItems: "center",
    textAlign: "center",
    verticalAlign: "baseline",
    fontSize: "14px",
    color: theme.text.primary,
    fontWeight: 500
  },
  caseName: {
    color: theme.text.secondary, 
    fontSize: "14px", 
    fontWeight: 600,
  },
  addCaseButton: {
    background: theme.bg.inner,
    color: theme.text.primary,
    fontSize: "12px",
    fontWeight: 600,
    padding: "8px 0px",
    borderRadius: "8px",
    height: 40,
    justifyContent: "center",
    display: "flex",
  },
  addSubContainer: {
    display: "flex",
    flexDirection: "row",
    background: `${theme.bg.main}CC`,
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
    borderRadius: "10px",
    padding: "4px",
  },
  subButton: {
    height: 32,
    width: 32,
    backgroundColor: theme.bg.inner,
    border: `1px solid ${theme.bg.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    color: "#898B8E",
    fontWeight: 600,
    cursor: "pointer",
    borderRadius: "8px",
  },
  quantity: {
    fontSize: "12px",
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
  }
}));

const AddCaseItem = memo(({ item, quantity=0, add, subtract }) => {
  const classes = useStyles();
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const handleClick = (e) => {
    if (!quantity) {
      add(item);
    } else {
      subtract(item);
    }
  };

  const getBoxImageUrl = (boxName) => {
    return `${config.site.backend.url}/public/img/${boxName
      .toLowerCase()
      .replace(/%/g, 'percent')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}.png`;
  };

  return (
    <motion.div 
      className={`${classes.caseBox} ${quantity ? classes.selectedBox : ''}`} 
      onClick={quantity ? () => {} : handleClick} 
      style={{ cursor: quantity ? "default" : "pointer" }}
      onHoverStart={() => !quantity && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.img
        className={classes.caseImage}
        src={getBoxImageUrl(item.name)}
        alt={item.name}
        initial={{ 
          width: quantity ? "6.25rem" : "7rem",
          height: quantity ? "6.25rem" : "7rem"
        }}
        animate={{ 
          width: quantity ? "6.25rem" : "7rem",
          height: quantity ? "6.25rem" : "7rem"
        }}
        transition={{ duration: 0.4, type: "spring" }}       
      />
      
      <motion.div 
        className={classes.caseName}
        initial={{ marginBottom: quantity ? 65 : 35 }}
        animate={{ marginBottom: quantity ? 65 : 35 }}
        transition={{ duration: 0.4, type: "spring" }}          
      >
        {item.name}
      </motion.div>
      
      <AnimatePresence>
        <div className={classes.animationContainer}>
          <motion.div 
            className={classes.addCaseButton}
            style={{ 
              background: !quantity ? !isHovered ? '' : theme.accent.primaryGradient : 'none',
            }}
            initial={quantity ? { opacity: 1, y: 0 } : { opacity: 1, y: 40 }}
            animate={quantity ? { y: 0 } : { y: 40 }}
            transition={{ duration: 0.4, type: "spring" }}          
          >
            <div className={classes.priceContainer} style={{ color: !quantity ? !isHovered ? '' : '#fff' : 'inherit' }}>
              ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </motion.div>
          <motion.div 
            className={classes.addSubContainer}
            initial={quantity ? { opacity: 0, y: 0 } : { opacity: 0, y: 30 }}
            animate={quantity ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4, type: "spring" }}          
          >
            <motion.div 
              className={classes.subButton}
              onClick={(e) => {
                subtract(item);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clip-path="url(#clip0_244_11984)"><path d="M13.1583 6.17917L9.33751 10L13.1583 13.8208L11.9792 15L6.97917 10L11.9792 5L13.1583 6.17917Z" fill="#959597"/></g><defs><clipPath id="clip0_244_11984"><rect width="20" height="20" fill="white" transform="translate(20) rotate(90)"/></clipPath></defs></svg>
            </motion.div>
            <motion.div className={classes.quantity}>{quantity}</motion.div>
            <motion.div 
              className={classes.subButton}
              onClick={(e) => {
                add(item);
              }}
            >
              <svg style={{ transform: "rotate(180deg)"}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clip-path="url(#clip0_244_11984)"><path d="M13.1583 6.17917L9.33751 10L13.1583 13.8208L11.9792 15L6.97917 10L11.9792 5L13.1583 6.17917Z" fill="#959597"/></g><defs><clipPath id="clip0_244_11984"><rect width="20" height="20" fill="white" transform="translate(20) rotate(90)"/></clipPath></defs></svg>
            </motion.div>
          </motion.div>
        </div>
      </AnimatePresence>
    </motion.div>
  );
});

export default AddCaseItem;
