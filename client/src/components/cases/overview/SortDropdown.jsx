import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { motion } from "framer-motion";

const useStyles = makeStyles((theme) => ({
  root: {
    userSelect: "none",
    height: "100%",
    display: "flex",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 16px",
    backgroundColor: theme.bg.box,
    borderRadius: "6px",
    height: 40,
    cursor: "pointer",
    position: "relative",
    gap: theme.spacing(0.5),
    fontSize: "14px",
    color: theme.text.secondary,
    "& > span": {
      color: theme.text.primary
    },
    "@media (max-width: 1200px)": {
      width: "100%",
    },
  },
  menu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    backgroundColor: theme.bg.box,
    borderRadius: "6px",
    display: "none",
    flexDirection: "column",
    minWidth: "100%",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
    zIndex: 100,
    overflow: "hidden"
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: "12px 16px",
    color: theme.text.secondary,
    cursor: "pointer",
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.05)",
    },
    "&.active": {
      color: theme.text.primary,
      backgroundColor: "rgba(255,255,255,0.05)"
    }
  }
}));

const SortDropdown = ({ value, onChange }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const dropdownAnimate = {
    enter: {
      opacity: 1,
      scale: [0.7, 1],
      transformOrigin: "top center",
      transition: { duration: 0.1 },
      display: "flex"
    },
    exit: {
      opacity: 0,
      scale: [1, 0.7],
      transformOrigin: "top center",
      transition: { duration: 0.1 },
      transitionEnd: { display: "none" }
    }
  };

  const options = [
    { value: "highToLow", label: "High to Low" },
    { value: "lowToHigh", label: "Low to High" }
  ];

  return (
    <motion.div className={classes.root} onClick={() => setOpen(!open)}>
      <span>Price:</span> {options.find(opt => opt.value === value)?.label}
      <motion.svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 20 20" 
        fill="none"
      >
        <path 
          d="M6.17917 6.84167L10 10.6625L13.8208 6.84167L15 8.02083L10 13.0208L5 8.02083L6.17917 6.84167Z" 
          fill="currentColor"
        />
      </motion.svg>
      
      <motion.div
        className={classes.menu}
        initial="exit"
        animate={open ? "enter" : "exit"}
        variants={dropdownAnimate}
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={`${classes.menuItem} ${value === option.value ? 'active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SortDropdown; 