import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  boxItem: {
    border: "1px solid " + theme.bg.border,
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    color: theme.text.secondary
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: "1px solid " + theme.bg.border,
    padding: theme.spacing(1, 2),
    borderTopLeftRadius: theme.spacing(0.75),
    borderTopRightRadius: theme.spacing(0.75),
    fontWeight: 500,  
    fontSize: 14
  },
  itemBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: theme.spacing(2),
  },
  itemHeaderTitle: {
    fontWeight: 300,
    color: theme.text.primary,
  },
  itemBodyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: 14
  },
  label: {
    minWidth: '80px'
  }
}));

const BoxHistoryItem = ({ box }) => {
  const classes = useStyles();

  return (
    <div className={classes.boxItem}>
      <div className={classes.itemHeader}>
        <div className={classes.itemHeaderTitle}>{box._id}</div>
        <div>{new Date(box.createdAt).toLocaleString()}</div>
      </div>
      <div className={classes.itemBody}>
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Amount:</div>
          <span>${box.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Payout:</div>
          <span>${box.payout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Outcome:</div>
          <span>{box.outcome}</span>
        </div>
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Fairness:</div>
          <span>{box.fair.seed.seedClient} - {box.fair.seed.hash} - {box.fair.nonce}</span>
        </div>
      </div>
    </div>
  );
};

export default BoxHistoryItem; 