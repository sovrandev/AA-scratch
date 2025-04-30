import React from 'react';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  levelBoxContainer: {
    background: theme.bg.box,
    borderRadius: theme.spacing(0.75),
    width: "fit-content",
  },
  levelBox: props => ({
    backgroundColor: `${props.color}40`,
    color: props.color,
    padding: "0px 4px",
    borderRadius: theme.spacing(0.75),
    fontSize: 10,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    lineHeight: 1,
    height: 18
  })
}));

const getLevelStyles = (level) => {
  if(level === "bot") {
    return { color: "#337fde" };
  }
  if(level === "system") {
    return { color: "#181B26" };
  }

  if (level >= 90) {
    return { color: "#5D9DFE" };
  } else if (level >= 80) {
    return { color: "#FFD700" };
  } else if (level >= 70) {
    return { color: "#9C27B0" };
  } else if (level >= 60) {
    return { color: "#3F51B5" };
  } else if (level >= 50) {
    return { color: "#FF5E37" };
  } else if (level >= 40) {
    return { color: "#2ECC71" };
  } else if (level >= 30) {
    return { color: "#8B0000" };
  } else if (level >= 20) {
    return { color: "#1B95ED" };
  } else if (level >= 10) {
    return { color: "#9B59B6" };
  } else {
    return { color: "#9399A7" };
  }
};

const LevelBox = ({ level }) => {
  const styles = getLevelStyles(level);
  const classes = useStyles(styles);

  return (
    <div className={classes.levelBoxContainer}>
    <div className={classes.levelBox} style={{ border: level === "system" ? `1px solid #181B26` : "none" }}>
      {level == "bot" || level == "system" ? <svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
      <path d="M11.4545 6H10.9091C10.9091 4.065 9.20182 2.5 7.09091 2.5H6.54545V1.865C6.87273 1.695 7.09091 1.37 7.09091 1C7.09091 0.45 6.60545 0 6 0C5.39455 0 4.90909 0.45 4.90909 1C4.90909 1.37 5.12727 1.695 5.45455 1.865V2.5H4.90909C2.79818 2.5 1.09091 4.065 1.09091 6H0.545455C0.245455 6 0 6.225 0 6.5V8C0 8.275 0.245455 8.5 0.545455 8.5H1.09091V9C1.09091 9.555 1.58182 10 2.18182 10H9.81818C10.4236 10 10.9091 9.555 10.9091 9V8.5H11.4545C11.7545 8.5 12 8.275 12 8V6.5C12 6.225 11.7545 6 11.4545 6ZM4.79455 7.25C4.58182 6.81 4.10727 6.5 3.54545 6.5C2.98364 6.5 2.50909 6.81 2.29636 7.25C2.22545 7.095 2.18182 6.93 2.18182 6.75C2.18182 6.06 2.79273 5.5 3.54545 5.5C4.29818 5.5 4.90909 6.06 4.90909 6.75C4.90909 6.93 4.86545 7.095 4.79455 7.25ZM9.70364 7.25C9.49091 6.81 9 6.5 8.45455 6.5C7.90909 6.5 7.41818 6.81 7.20545 7.25C7.13455 7.095 7.09091 6.93 7.09091 6.75C7.09091 6.06 7.70182 5.5 8.45455 5.5C9.20727 5.5 9.81818 6.06 9.81818 6.75C9.81818 6.93 9.77455 7.095 9.70364 7.25Z" fill="currentColor"/>
      </svg> : level}
      {!level && 0}
    </div>
    </div>
    
  );
};

export default LevelBox; 