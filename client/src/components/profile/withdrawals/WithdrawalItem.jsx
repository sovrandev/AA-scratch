import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
// Import crypto icons
import btc from '../../../assets/img/cashier/btc.png';
import eth from '../../../assets/img/cashier/eth.png';
import ltc from '../../../assets/img/cashier/ltc.png';
import usdt from '../../../assets/img/cashier/usdt.png';
import trx from '../../../assets/img/cashier/trx.png';
import sol from '../../../assets/img/cashier/sol.png';
import usdc from '../../../assets/img/cashier/usdc.png';
import xrp from '../../../assets/img/cashier/xrp.png';

const CRYPTO_ICONS = {
  btc,
  eth,
  ltc,
  usdt,
  trx,
  sol,
  usdc,
  xrp
};

const useStyles = makeStyles((theme) => ({
  withdrawalItem: {
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
    padding: theme.spacing(1, 2),
    borderBottom: "1px solid " + theme.bg.border,
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
  itemBodyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: 14
  },
  label: {
    minWidth: '120px',
  },
  value: {
    fontWeight: 500,
    color: theme.text.secondary
  },
  status: {
    display: 'inline-flex',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: 500,
    textTransform: 'capitalize'
  },
  statusPending: {
    background: 'rgba(255, 193, 7, 0.1)',
    color: '#ffc107'
  },
  statusCompleted: {
    background: 'rgba(76, 175, 80, 0.1)',
    color: '#4caf50'
  },
  statusCanceled: {
    background: 'rgba(244, 67, 54, 0.1)',
    color: '#f44336'
  },
  amount: {
    fontSize: '1rem',
    fontWeight: 600,
  },
  headerAmount: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: theme.text.primary
  },
  cryptoIcon: {
    width: '20px',
    height: '20px',
    objectFit: 'contain'
  }
}));

const WithdrawalItem = ({ withdrawal }) => {
  const classes = useStyles();

  const getStatusClass = (state) => {
    switch (state) {
      case 'pending':
        return classes.statusPending;
      case 'completed':
        return classes.statusCompleted;
      case 'canceled':
        return classes.statusCanceled;
      default:
        return classes.statusPending;
    }
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  };

  const getCryptoIcon = (currency) => {
    return CRYPTO_ICONS[currency.toLowerCase()];
  };

  return (
    <div className={classes.withdrawalItem}>
      <div className={classes.itemHeader}>
        <div className={classes.headerAmount}>
          {withdrawal.method === 'crypto' && withdrawal.data?.currency && (
            <img 
              src={getCryptoIcon(withdrawal.data.currency)} 
              alt={withdrawal.data.currency} 
              className={classes.cryptoIcon} 
            />
          )}
          <span>{formatAmount(withdrawal.amount)}</span>
          <span>{withdrawal.data?.currency?.toUpperCase()}</span>
        </div>
        <div>{new Date(withdrawal.createdAt).toLocaleString()}</div>
      </div>
      <div className={classes.itemBody}>
        {withdrawal.method === 'crypto' && withdrawal.data && (
          <>
            <div className={classes.itemBodyRow}>
              <div className={classes.label}>Transaction ID:</div>
              <div className={classes.value}>{withdrawal.data.transactionId || 'Pending...'}</div>
            </div>
            <div className={classes.itemBodyRow}>
              <div className={classes.label}>Network:</div>
              <div className={classes.value}>
                {withdrawal.data.blockchain || withdrawal.data.currency?.toUpperCase()}
              </div>
            </div>
            <div className={classes.itemBodyRow}>
              <div className={classes.label}>Address:</div>
              <div className={classes.value}>{withdrawal.data.address}</div>
            </div>
          </>
        )}
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Status:</div>
          <div className={clsx(classes.status, getStatusClass(withdrawal.state))}>
            {withdrawal.state}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalItem; 