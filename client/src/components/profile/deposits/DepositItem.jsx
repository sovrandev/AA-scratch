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
  depositItem: {
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
    color: theme.text.secondary
  },
  value: {
    color: theme.text.primary,
    fontWeight: 500
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
  headerAmount: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  cryptoIcon: {
    width: '20px',
    height: '20px',
    objectFit: 'contain'
  },
  cryptoAmount: {
    color: theme.text.primary
  },
  usdAmount: {
    color: theme.text.secondary,
    fontSize: '0.85rem'
  }
}));

const DepositItem = ({ deposit }) => {
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

  const formatUsdAmount = (amount) => {
    return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  };

  const formatCryptoAmount = (amount) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 });
  };

  const getCryptoIcon = (currency) => {
    return CRYPTO_ICONS[currency.toLowerCase()];
  };

  return (
    <div className={classes.depositItem}>
      <div className={classes.itemHeader}>
        <div className={classes.headerAmount}>
          {deposit.method === 'crypto' && deposit.data?.currency && (
            <>
              <img 
                src={getCryptoIcon(deposit.data.currency)} 
                alt={deposit.data.currency} 
                className={classes.cryptoIcon} 
              />
              <span className={classes.cryptoAmount}>
                {formatCryptoAmount(deposit.cryptoAmount || deposit.amount)} {deposit.data.currency.toUpperCase()}
              </span>
              <span className={classes.usdAmount}>
                ({formatUsdAmount(deposit.amount)})
              </span>
            </>
          )}
          {deposit.method !== 'crypto' && (
            <span className={classes.cryptoAmount}>{formatUsdAmount(deposit.amount)}</span>
          )}
        </div>
        <div>{new Date(deposit.createdAt).toLocaleString()}</div>
      </div>
      <div className={classes.itemBody}>
        {deposit.method === 'crypto' && deposit.data && (
          <>
            <div className={classes.itemBodyRow}>
              <div className={classes.label}>Transaction ID:</div>
              <div className={classes.value}>{deposit.data.transactionId || 'Pending...'}</div>
            </div>
            <div className={classes.itemBodyRow}>
              <div className={classes.label}>Network:</div>
              <div className={classes.value}>
                {deposit.data.blockchain || deposit.data.currency?.toUpperCase()}
              </div>
            </div>
            <div className={classes.itemBodyRow}>
              <div className={classes.label}>Address:</div>
              <div className={classes.value}>{deposit.data.address}</div>
            </div>
            {deposit.state === 'pending' && (
              <div className={classes.itemBodyRow}>
                <div className={classes.label}>Confirmations:</div>
                <div className={classes.value}>
                  {deposit.data.confirmations}/{deposit.data.requiredConfirmations}
                </div>
              </div>
            )}
          </>
        )}
        <div className={classes.itemBodyRow}>
          <div className={classes.label}>Status:</div>
          <div className={clsx(classes.status, getStatusClass(deposit.state))}>
            {deposit.state}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositItem; 