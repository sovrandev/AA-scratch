import React from 'react';
import { makeStyles } from "@material-ui/core";
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from "framer-motion";

const useStyles = makeStyles(theme => ({
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "500px",
    minHeight: "500px"
  },
}));

const Loader = () => {
  const classes = useStyles();

  return (
    <motion.div className={classes.container} initial={{ scale: 0.75, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <CircularProgress sx={{ color: "#ffffff" }}/>
    </motion.div>
  );
};

export default Loader; 