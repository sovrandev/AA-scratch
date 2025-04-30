import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    background: theme.accent.primaryGradient,
    gap: theme.spacing(0.75),
    padding: "12px 24px",
    borderRadius: theme.spacing(0.75),
    cursor: "pointer",
    userSelect: "none",
    fontWeight: 600,
    textShadow: "0px 2px 3px rgba(0, 0, 0, 0.25)",
    width: "fit-content",
    transition: 'all 0.2s ease',
    '&:hover': {
      opacity: 0.8
    }
  },
}));

const PrimaryButton = ({ icon='', label='', onClick=() => {}, style={} }) => {
  const classes = useStyles();

  return (
    <div className={classes.root} onClick={onClick} style={style}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default PrimaryButton;
