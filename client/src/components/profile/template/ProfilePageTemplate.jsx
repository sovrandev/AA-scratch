import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: theme.text.primary,
    margin: 0,
  },
  count: {
    fontSize: '14px',
    color: theme.text.secondary,
    fontWeight: 500
  },
  content: {
  }
}));

const ProfilePageTemplate = ({ title, count, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.paper}>
        <div className={classes.header}>
          <h2 className={classes.title}>{title}</h2>
          {count !== undefined && (
            <div className={classes.count}>
              {count} Total Items
            </div>
          )}
        </div>
        <div className={classes.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageTemplate; 