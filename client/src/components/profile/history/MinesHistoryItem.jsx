import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  minesItem: {
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
    fontSize: 14,
  },
  label: {
    minWidth: '80px'
  }
}));

const MinesHistoryItem = ({ mine }) => {
  const classes = useStyles();

  return (
    <div className={classes.minesItem}>
      <div className={classes.itemHeader}>
        <div className={classes.itemHeaderTitle}>{mine._id}</div>
        <div className={classes.itemHeaderTime}>{new Date(mine.createdAt).toLocaleString()}</div>
      </div>
      <div className={classes.itemBody}>
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Amount:</div>
          <span>${mine.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Payout:</div>
          <span>${mine.payout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Deck:</div>
          <span>
            {mine.deck.map((value, index) => (
              <>
                <span key={index} style={{
                  textDecoration: mine.revealed.some(r => r.tile === index) ? 'underline' : 'none'
                }}>
                  {value}
                </span>
                {index < mine.deck.length - 1 ? ', ' : ''}
              </>
            ))}
          </span>
        </div>
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Fairness:</div>
          <span>{mine.fair.seed.seedClient} - {mine.fair.seed.hash} - {mine.fair.nonce}</span>
        </div>
      </div>
    </div>
  );
};

export default MinesHistoryItem; 