import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core";
import { useNotification } from '../../../contexts/notification';
import { useCashier } from '../../../contexts/cashier';
import { useUser } from '../../../contexts/user';
import theme from "../../../styles/theme";

// Define minimum withdrawal amounts (in USD) for frontend validation
const MIN_WITHDRAWAL_AMOUNTS = {
  BTC: 15,
  ETH: 20,
  LTC: 10,
  SOL: 5,
  USDT: 20,
  USDC: 20,
  XRP: 10,
  TRX: 10
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    paddingBottom: 24,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: theme.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  cryptoIcon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    objectFit: 'contain',
    padding: 4,
    background: props => `${props.accentColor}20`,
  },
  priceDisplay: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.secondary,
    marginTop: 2,
  },
  addressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.secondary,
  },
  addressInput: {
    width: '100%',
    height: 40,
    background: theme.bg.box,
    border: 'none',
    borderRadius: 8,
    padding: '4px 12px',
    fontSize: 14,
    color: theme.text.primary,
    '&:focus': {
      outline: 'none',
    }
  },
  converterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  converterTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.secondary,
  },
  conversionInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  inputContainer: {
    position: 'relative',
    flex: 1,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    zIndex: 1,
  },
  currencyIcon: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 8,
    fontWeight: 400,
    color: theme.text.primary,
  },
  input: {
    width: '100%',
    height: 40,
    background: theme.bg.box,
    border: 'none',
    borderRadius: 8,
    padding: '0 12px 0 35px',
    fontSize: 14,
    color: theme.text.primary,
    '&:focus': {
      outline: 'none',
    }
  },
  equalsSign: {
    fontSize: 24,
    fontWeight: 400,
    color: theme.text.secondary,
  },
  withdrawButton: {
    width: '100%',
    height: 40,
    background: theme.accent.primary,
    border: 'none',
    borderRadius: 8,
    color: theme.text.primary,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: theme.transitions.normal,
    '&:hover': {
      opacity: 0.9,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    }
  },
  maxButton: {
    position: 'absolute',
    right: 4,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: theme.text.secondary,
    background: theme.bg.inner,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 500,
    height: 32,
    width: 52,
    cursor: 'pointer',
    padding: '2px 6px',
    transition: theme.transitions.normal,
    '&:hover': {
      color: theme.text.primary,
    }
  },
  errorText: {
    color: theme.palette.error.main,
    fontSize: 12,
    marginTop: 4,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    color: theme.text.secondary,
    fontSize: 14,
    fontWeight: 500,
    "&:hover": {
      color: theme.text.primary,
    }
  }
}));

const CryptoWithdrawView = ({ crypto, settings, handleBack }) => {
  const classes = useStyles({ accentColor: crypto.accentColor });
  const notify = useNotification();
  const { user } = useUser();
  const { cryptoData, handleWithdraw } = useCashier();
  const [address, setAddress] = useState('');
  const [usdAmount, setUsdAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const price = cryptoData?.prices?.[crypto.code.toLowerCase()]?.price || 
                cryptoData?.prices?.[crypto.code]?.price || 0;

  const minWithdrawAmount = MIN_WITHDRAWAL_AMOUNTS[crypto.code] || 10;
  const maxWithdrawAmount = user?.balance || 0 + 0.00000001;

  useEffect(() => {
    if (price > 0) {
      if (usdAmount) {
        const crypto = (parseFloat(usdAmount) / price).toFixed(8);
        setCryptoAmount(crypto);
      } else if (cryptoAmount) {
        const usd = (parseFloat(cryptoAmount) * price).toFixed(2);
        setUsdAmount(usd);
      }
    }
  }, [usdAmount, cryptoAmount, price]);

  const handleUsdChange = (e) => {
    const value = e.target.value;
    if(!isNaN(value)) {
      setUsdAmount(value);
      if (price > 0) {
        const crypto = (parseFloat(value || 0) / price).toFixed(8);
        setCryptoAmount(crypto);
      }
    }
    validateAmount(value);
  };

  const handleCryptoChange = (e) => {
    const value = e.target.value;
    setCryptoAmount(value);
    let usd = 0;
    if (price > 0) {
      usd = (parseFloat(value || 0) * price).toFixed(2);
      setUsdAmount(usd);
    }
    validateAmount(usd);
  };

  const handleMaxClick = () => {
    setUsdAmount(maxWithdrawAmount.toFixed(2));
    if (price > 0) {
      const crypto = (maxWithdrawAmount / price).toFixed(8);
      setCryptoAmount(crypto);
    }
    validateAmount(maxWithdrawAmount);
  };

  const validateAmount = (amount) => {
    const value = parseFloat(amount);
    if (value < minWithdrawAmount) {
      setError(`Minimum withdrawal amount is $${minWithdrawAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      return false;
    }
    if (value > maxWithdrawAmount) {
      setError(`Maximum withdrawal amount is $${maxWithdrawAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!address.trim()) {
      notify.error('Please enter a valid address');
      return;
    }

    if (!validateAmount(usdAmount)) {
      return;
    }

    setLoading(true);
    try {
      const response = await handleWithdraw('crypto', parseFloat(usdAmount), {
        currency: crypto.code.toLowerCase(),
        address: address.trim()
      });
      
      if (response.success) {
        notify.success(`Withdrawal of ${cryptoAmount} ${crypto.code} initiated`);
        setAddress('');
        setUsdAmount('');
        setCryptoAmount('');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      {handleBack && (
        <div className={classes.backButton} onClick={handleBack}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.5 9.16667H5.69167L8.67917 6.17917L7.5 5L2.5 10L7.5 15L8.67917 13.8208L5.69167 10.8333H17.5V9.16667Z" fill="currentColor"/>
          </svg>
          <span>Back</span>
        </div>
      )}

      <div className={classes.header}>
        <div className={classes.title}>
          <img src={crypto.icon} alt={crypto.name} className={classes.cryptoIcon} />
          <div>
            Withdraw {crypto.name}
            <div className={classes.priceDisplay}>
              ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      <div className={classes.addressSection}>
        <div className={classes.addressLabel}>Your {crypto.name} address</div>
        <input
          type="text"
          className={classes.addressInput}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={`Enter your ${crypto.name} address`}
        />
      </div>

      <div className={classes.converterSection}>
        <div className={classes.converterTitle}>Withdraw amount</div>
        <div className={classes.conversionInputs}>
          <div className={classes.inputContainer}>
            <div className={classes.inputIcon}>
              <div className={classes.currencyIcon} style={{ background: '#26a17b' }}>$</div>
            </div>
            <input
              type="text"
              className={classes.input}
              value={usdAmount}
              onChange={handleUsdChange}
              min={minWithdrawAmount}
              max={maxWithdrawAmount}
              placeholder="0.00"
            />
            <button className={classes.maxButton} onClick={handleMaxClick}>
              Max
            </button>
          </div>
          <div className={classes.equalsSign}>=</div>
          <div className={classes.inputContainer}>
            <div className={classes.inputIcon}>
              <img src={crypto.icon} alt={crypto.code} style={{ width: 16, height: 16 }} />
            </div>
            <input
              type="number"
              className={classes.input}
              value={cryptoAmount}
              onChange={handleCryptoChange}
              placeholder="0.00000000"
            />
          </div>
        </div>
        {error && <div className={classes.errorText}>{error}</div>}
      </div>

      <button 
        className={classes.withdrawButton}
        onClick={handleSubmit}
        disabled={loading || !address.trim() || !usdAmount || error}
      >
        {loading ? 'Processing...' : 'Withdraw'}
      </button>
    </div>
  );
};

export default CryptoWithdrawView; 