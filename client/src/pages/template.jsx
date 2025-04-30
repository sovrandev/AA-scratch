import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
}));

const Home = () => {
  const classes = useStyles();

  return (  
    <div className={classes.root}>

    </div>
  );
};

export default Home;
