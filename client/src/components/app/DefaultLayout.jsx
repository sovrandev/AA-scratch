import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Outlet } from "react-router-dom";

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
  },
  mainContent: {
    flex: 1,
    width: "100%",
    maxWidth: "100%",
    "@media (max-width: 1200px)": {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
}));

const DefaultLayout = () => {
  const classes = useStyles();

  return (
    <div className={classes.contentContainer}>
      <div className={classes.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout; 