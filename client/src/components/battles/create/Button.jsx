import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { motion, AnimatePresence } from "framer-motion";

const useStyles = makeStyles((theme) => ({
  gradientContainer: props => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center", 
    justifyContent: "center",
    padding: "1px",
    backgroundOrigin: "border-box",
    backgroundClip: "border-box",
    borderRadius: theme.spacing(1),
    opacity: 0.75,
    "&.active": {
      opacity: 1,
    }
  }),
  root: props => ({
    userSelect: "none",
    height: "100%",
    width: "100%", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `${theme.bg.box}`,
    backgroundOrigin: "padding-box",
    backgroundClip: "padding-box",
    position: "relative",
    gap: theme.spacing(1),
    color: theme.text.primary,
    padding: "12px 24px",
    borderRadius: theme.spacing(1),
    transition: "opacity 0.2s ease",
    cursor: "pointer",
    textAlign: "center"
  }),
  text: {
    fontSize: "16px",
    fontWeight: 600,
  },
  tooltip: {
    position: "absolute",
    bottom: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)",
    background: theme.bg.box,
    padding: "8px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    color: theme.text.secondary,
    whiteSpace: "nowrap",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  }
}));

const Button = ({ icon, text, infoText, active, accentColors, changeState }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const styleProps = { accentColors, active };
  const classes = useStyles(styleProps);

  return (
    <motion.div 
      className={`${classes.root} ${active ? 'active' : ''}`} 
      style={{ padding: text ? "12px 24px" : "12px 12px" }}
      animate={{ 
        opacity: active ? 1 : 0.75,
        border: active ? `1px solid ${accentColors}` : `1px solid transparent`,
        backgroundImage: active ? `radial-gradient(circle at center 1000%, ${accentColors} 0%, #13181E 100%)` : '',
      }}
      transition={{ duration: 0.2 }}
      whileHover={{ 
        opacity: 1,
        backgroundImage: `radial-gradient(circle at center 1000%, ${accentColors} 0%, #13181E 100%)`,
      }}
      onClick={changeState}
    >
      <div style={{position: "relative", top: "-2px"}}>{icon}</div>
      <div className={classes.text} style={{ display: text ? "block" : "none" }}>{text}</div>
      {/*
      <div 
        className={classes.infoIcon}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" style={{position: "relative", top: "-3px"}}>
          <path fillRule="evenodd" clipRule="evenodd" d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM6.00001 3.78274C6.28816 3.78274 6.52175 3.54915 6.52175 3.261C6.52175 2.97285 6.28816 2.73926 6.00001 2.73926C5.71186 2.73926 5.47827 2.97285 5.47827 3.261C5.47827 3.54915 5.71186 3.78274 6.00001 3.78274ZM6.52175 9.52187V4.82621H5.47827V9.52187H6.52175Z" fill="#2E3946"/>
        </svg>
        <AnimatePresence>
          {showTooltip && (
            <motion.div 
              className={classes.tooltip}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              {infoText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      */}
    </motion.div>
  );
};

export default Button;
