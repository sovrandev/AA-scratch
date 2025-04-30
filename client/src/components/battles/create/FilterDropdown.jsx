import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { motion } from "framer-motion";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%", 
    display: "flex",
    color: theme.text.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 12px",
    backgroundColor: theme.bg.box,
    borderRadius: "8px",
    cursor: "pointer",
    position: "relative",
    gap: theme.spacing(1),
    minWidth: 150,
    userSelect: "none",
    height: 40,
  },
  gameMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    minWidth: "100%",
    backgroundColor: theme.bg.box,
    borderBottomLeftRadius: "8px",
    borderBottomRightRadius: "8px",
    display: "none",
    flexDirection: "column",
    zIndex: 100,
    overflow: "hidden", 
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: "12px",
    color: theme.text.secondary,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.bg.inner,
    },
    "&.active": {
      color: theme.text.primary,
      backgroundColor: theme.bg.inner
    }
  },  
  sortBy: {
    color: theme.text.secondary,
    fontWeight: 600
  }
}));

const Dropdown = ({ options, selectedOption, setSelectedOption }) => {
  const classes = useStyles();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const dropdownAnimate = {
    enter: {
      opacity: 1,
      scale: [0.7, 1],
      transformOrigin: "top center",
      transition: {
        duration: 0.1
      },
      display: "flex"
    },
    exit: {
      opacity: 0,
      scale: [1, 0.7],
      transformOrigin: "top center",
      transition: {
        duration: 0.1
      },
      transitionEnd: {
        display: "none"
      }
    }
  };


  return (
    <motion.div 
      className={classes.root} 
      onClick={() => setOpenDropdown(!openDropdown)}
      style={{ 
        borderBottomLeftRadius: openDropdown ? 0 : 8, 
        borderBottomRightRadius: openDropdown ? 0 : 8 
      }}
    >
      <span className={classes.sortBy}>Sort by:</span> {selectedOption}
      <motion.svg className={classes.dropdownIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clipPath="url(#clip0_2056_2227)"><path d="M6.17917 6.84167L10 10.6625L13.8208 6.84167L15 8.02083L10 13.0208L5 8.02083L6.17917 6.84167Z" fill="#8D9BAC"/></g><defs><clipPath id="clip0_2056_2227"><rect width="20" height="20" fill="white"/></clipPath></defs></motion.svg>
      <motion.div
        className={classes.gameMenu}
        initial="exit"
        animate={openDropdown ? "enter" : "exit"}
        variants={dropdownAnimate}
        ref={dropdownRef}
      >
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            className={`${classes.menuItem} ${selectedOption === option ? 'active' : ''}`}
            onClick={() => setSelectedOption(option)}
          >
            {option}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Dropdown;
