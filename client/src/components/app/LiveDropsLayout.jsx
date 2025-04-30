import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import LiveDrops from "../livedrops/LiveDrops";

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    flexDirection: "row",
    position: "relative",
    flex: 1,
    gap: theme.spacing(4),
    paddingTop: theme.spacing(4),
    "@media (max-width: 1200px)": {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  mainContent: {
    flex: 1,
    width: "calc(100% - 232px)",
    maxWidth: "calc(100% - 232px)",
    position: "relative",
    zIndex: 2,
    "@media (max-width: 1200px)": {
      width: "100%",
      maxWidth: "100%",
    },
  },
  liveDropsContainer: {
    width: 200,
    position: "relative",
    marginBottom: 0,
    "@media (max-width: 1200px)": {
      display: "none"
    },
  },
}));

const LiveDropsLayout = () => {
  const classes = useStyles();

  return (
    <div className={classes.contentContainer}>
      <div className={classes.mainContent}>
        <Outlet />
      </div>
      <div className={classes.liveDropsContainer}>
        <AnimatePresence>
          <LiveDrops />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveDropsLayout; 