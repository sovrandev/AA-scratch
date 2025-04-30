import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../../../styles/theme';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  battleItem: {
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
    textDecoration: "underline",
    cursor: "pointer"
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

const BattleHistoryItem = ({ battle }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.battleItem}>
      <div className={classes.itemHeader}>
        <div className={classes.itemHeaderTitle} onClick={() => navigate(`/box-battles/${battle._id}`)}>{battle._id}</div>
        <div className={classes.itemHeaderTime}>{new Date(battle.createdAt).toLocaleString()}</div>
      </div>
      <div className={classes.itemBody}>
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Amount:</div>
          <span>${battle?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Payout:</div>
          <span>${battle?.payout?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Multiplier:</div>
          <span>{(battle?.multiplier / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x</span>
        </div>
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Tickets:</div>
          <span>{battle?.outcomes?.join(", ")}</span>
        </div>
      </div>  
    </div>
  );
};

export default BattleHistoryItem; 