import React from 'react';
import { makeStyles } from "@material-ui/core";
import Item from "../game/Item";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(2),
    fontSize: 24,
    color: theme.text.primary,
    fontWeight: 600,
    "& svg": {
      filter: "drop-shadow(0 0 8px #1B95ED)"
    }
  },
  itemsContainer: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    },
  }
}));

const BottomSection = ({ box, items }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      
      <div className={classes.itemsContainer}>
        {items.map((item, index) => (
          <Item
            key={`item-${index}`}
            item={item}
            box={box}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomSection; 