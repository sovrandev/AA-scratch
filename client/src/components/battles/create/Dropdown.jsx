import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { motion } from "framer-motion";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%", 
    display: "flex",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 16px",
    backgroundColor: theme.bg.inner,
    borderRadius: theme.spacing(1),
    height: 48,
    cursor: "pointer",
    position: "relative",
    gap: theme.spacing(1),
    border: `1px solid transparent`
  },
  gameMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    backgroundColor: theme.bg.inner,
    borderRadius: theme.spacing(1),
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
    padding: "12px",
    color: theme.text.secondary,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.05)",
    },
    "&.active": {
      color: theme.text.primary,
      backgroundColor: "rgba(255,255,255,0.05)"
    }
  },
  modeDisplay: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    "& svg": {
      width: 14,
      height: 14,
      filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))" // Add shadow to SVG
    }
  },
  iconGroup: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    "& svg": {
      width: 16,
      height: 16,
      filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))" // Add shadow to SVG
    }
  }
  
}));

const Dropdown = ({ mode, setMode }) => {
  const classes = useStyles();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const dropdownAnimate = {
    enter: {
      opacity: 1,
      scale: [0.7, 1],
      transformOrigin: "top left",
      transition: {
        duration: 0.1
      },
      display: "flex"
    },
    exit: {
      opacity: 0,
      scale: [1, 0.7],
      transformOrigin: "top left",
      transition: {
        duration: 0.1
      },
      transitionEnd: {
        display: "none"
      }
    }
  };

  const personSvg = (color = "#8D9BAC") => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0C9.06087 0 10.0783 0.421427 10.8284 1.17157C11.5786 1.92172 12 2.93913 12 4C12 5.06087 11.5786 6.07828 10.8284 6.82843C10.0783 7.57857 9.06087 8 8 8C6.93913 8 5.92172 7.57857 5.17157 6.82843C4.42143 6.07828 4 5.06087 4 4C4 2.93913 4.42143 1.92172 5.17157 1.17157C5.92172 0.421427 6.93913 0 8 0ZM8 10C12.42 10 16 11.79 16 14V16H0V14C0 11.79 3.58 10 8 10Z" fill="${color}"/></svg>`;
  const swordsSvg = (color = "#535D68") => `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" fill="none"><g opacity="1"><path d="M3.63521 9.30042C3.92707 9.86406 3.84875 10.5781 3.38701 11.0518C3.10887 11.3368 2.73866 11.4936 2.3441 11.4936C1.94954 11.4936 1.57933 11.3368 1.3014 11.0518C0.735302 10.4712 0.735302 9.52571 1.30119 8.94466C1.74838 8.48612 2.46327 8.40259 3.01621 8.6819L3.91484 7.7603L2.65001 6.46278C2.48146 6.28975 2.48509 6.01289 2.65791 5.84413C2.83116 5.6758 3.1078 5.67836 3.27678 5.85182L3.74656 6.33373L8.31315 0.949174C8.38514 0.864152 8.48661 0.809892 8.59727 0.797502L11.1212 0.509538C11.2532 0.491593 11.3848 0.540299 11.4793 0.633866C11.5735 0.727433 11.62 0.859025 11.6057 0.991044L11.325 3.58016C11.3133 3.68782 11.2622 3.78737 11.1815 3.85957L5.91531 8.55856L6.40165 9.05745C6.5702 9.23048 6.56657 9.50734 6.39375 9.6761C6.30851 9.75899 6.1985 9.80043 6.08827 9.80043C5.97441 9.80043 5.86076 9.75642 5.77488 9.66841L4.52578 8.38705L3.63521 9.30042Z" fill="${color}"/><path d="M2.87878 0.509462C2.74753 0.491945 2.61626 0.540064 2.52002 0.631948C2.42814 0.728212 2.38002 0.859457 2.39313 0.990701L2.67314 3.58069C2.68628 3.68569 2.73877 3.78633 2.81752 3.8607L3.88502 4.81445L6.4269 1.82196L5.68752 0.951315C5.61315 0.863836 5.51251 0.811338 5.40313 0.7982L2.87878 0.509462Z" fill="${color}"/><path d="M10.9856 8.68196L10.0844 7.75881L11.3488 6.46383C11.5194 6.28882 11.515 6.01319 11.34 5.84259C11.1694 5.67633 10.8938 5.67633 10.7231 5.85132L10.255 6.33258L10.0275 6.06134L7.65626 8.17444L8.085 8.55944L7.59938 9.0582C7.42875 9.22883 7.43313 9.50881 7.60814 9.67506C7.69127 9.75819 7.80064 9.80195 7.91002 9.80195C8.02377 9.80195 8.1375 9.75819 8.22501 9.66633L9.47625 8.38881L10.3644 9.29882C10.0713 9.86318 10.15 10.5763 10.6138 11.0532C10.8894 11.3376 11.2613 11.4951 11.655 11.4951C12.0488 11.4951 12.4206 11.3376 12.7006 11.0532C13.265 10.4713 13.265 9.52633 12.7006 8.94444C12.25 8.48508 11.5369 8.40195 10.9856 8.68196Z" fill="${color}"/></g></svg>`;

  const modes = [
    { id: "1v1", players: [1, 1], count: 2, team: false },
    { id: "1v1v1", players: [1, 1, 1], count: 3, team: false },
    { id: "1v1v1v1", players: [1, 1, 1, 1], count: 4, team: false },
    { id: "1v1v1v1v1v1", players: [1, 1, 1, 1, 1, 1], count: 6, team: false },
    { id: "2v2", players: [2, 2], count: 4, team: true },
    { id: "3v3", players: [3, 3], count: 6, team: true }
  ];

  const renderModeIcons = (players, isActive = false) => {
    return (
      <div className={classes.modeDisplay}>
        {players.map((count, index) => (
          <React.Fragment key={index}>
            {index > 0 && <div dangerouslySetInnerHTML={{ __html: swordsSvg(isActive ? "#fff" : "#8D9BAC") }} />}
            <div className={classes.iconGroup}>
              {[...Array(count)].map((_, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: personSvg(isActive ? "#fff" : "#8D9BAC") }} />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <motion.div className={classes.root} onClick={() => setOpenDropdown(!openDropdown)}>
      {renderModeIcons((modes.find(m => m.id === mode) || modes[0]).players)}
      <motion.svg className={classes.dropdownIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clipPath="url(#clip0_2056_2227)"><path d="M6.17917 6.84167L10 10.6625L13.8208 6.84167L15 8.02083L10 13.0208L5 8.02083L6.17917 6.84167Z" fill="#8D9BAC"/></g><defs><clipPath id="clip0_2056_2227"><rect width="20" height="20" fill="white"/></clipPath></defs></motion.svg>
      <motion.div
        className={classes.gameMenu}
        initial="exit"
        animate={openDropdown ? "enter" : "exit"}
        variants={dropdownAnimate}
        ref={dropdownRef}
      >
        {modes.map((modeOption) => (
          <div
            key={modeOption.id}
            className={`${classes.menuItem} ${mode === modeOption.id ? 'active' : ''}`}
            onClick={() => setMode([modeOption.count, modeOption.team, modeOption.id])}
          >
            {renderModeIcons(modeOption.players, mode === modeOption.id)}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Dropdown;
