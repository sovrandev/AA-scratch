import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
      width: '0px'
    },
    scrollbarWidth: 'none',
    msOverflowStyle: 'none'
  }
}));

const HistoryGrid = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.gridContainer}>
      {children}
    </div>
  );
};

export default HistoryGrid; 