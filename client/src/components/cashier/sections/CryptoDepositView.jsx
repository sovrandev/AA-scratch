import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core";
import { useNotification } from '../../../contexts/notification';
import { useCashier } from '../../../contexts/cashier';
import { QRCodeSVG } from 'qrcode.react';
import theme from "../../../styles/theme";

// Define accent colors for each crypto
const CRYPTO_ACCENT_COLORS = {
  BTC: '#f7931a',
  ETH: '#627eea',
  LTC: '#345d9d',
  USDT: '#26a17b',
  SOL: '#7B60E8',
  USDC: '#2775CA',
  TRX: '#EE2B2B',
  XRP: '#23292F'
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
  priceDisplay: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.secondary,
    marginTop: 2,
  },
  cryptoIcon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    objectFit: 'contain',
    padding: 4,
    background: props => `${props.accentColor}20`,
  },
  addressSection: {
    display: 'flex',
    gap: 16,
    padding: "8px 16px 8px 8px",
    background: theme.bg.box,
    borderRadius: 8,
    marginTop: 8,
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
    },
  },
  qrCodeContainer: {
    background: '#fff',
    padding: 16,
    borderRadius: 8,
    width: 140,
    height: 140,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    background: theme.bg.main,  
    position: 'relative',
  },
  qrCodeBackground: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 'calc(100% - 16px)',
    height: 'calc(100% - 16px)',
    borderRadius: 8,
    background: "#fff",
    zIndex: 1
  },
  addressInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    "@media (max-width: 1200px)": {
      maxWidth: "100%",
      width: "100%",
    },
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.text.primary,
  },
  addressValue: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    background: theme.bg.main,
    padding: '10px 12px',
    borderRadius: 6,
    width: '100%',
  },
  address: {
    fontSize: 14,
    fontWeight: 400,
    color: theme.text.secondary,
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  copyButton: {
    background: "transparent",
    color: theme.text.secondary,
    border: 'none',
    borderRadius: 4,
    height: 20,
    width: 20,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      opacity: 0.9,
    }
  },
  instructions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 8,
  },
  instruction: {
    fontSize: 14,
    fontWeight: 400,
    color: theme.text.secondary,
    display: 'flex',
    alignItems: 'center',
  },
  converterSection: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  converterGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    background: props => `radial-gradient(ellipse at bottom, ${props.gradientColor} 0%, rgba(0, 0, 0, 0) 80%)`,
    opacity: 0.8,
    zIndex: 0,
  },
  converterContent: {
    position: 'relative',
    zIndex: 1,
  },
  converterTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.text.primary,  
    "@media (max-width: 1200px)": {
      textAlign: "center",
      fontSize: 14,
    },
  },
  converterDescription: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.secondary,
    "@media (max-width: 1200px)": {
      textAlign: "center",
      fontSize: 12,
    },
  },
  conversionInputs: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
    "@media (max-width: 1200px)": {
      gap: 6,
    },
  },
  conversionInput: {
    flex: 1,
    position: 'relative',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.secondary,
    marginBottom: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
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
  cryptoIconSmall: {
    width: 16,
    height: 16,
    objectFit: 'contain',
  },
  usdIcon: {
    background: '#26a17b',
    color: '#fff',
  },
  eurIcon: {
    background: '#2775CA',
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 40,
    background: theme.bg.main,
    border: 'none',
    borderRadius: 8,
    padding: '0 12px',
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
  inputContainer: {
    position: 'relative',
    width: '100%',
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
  inputCurrency: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.text.secondary,
  },
  paddedInput: {
    paddingLeft: 35,
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: theme.text.secondary,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    "&:hover": {
      color: theme.text.primary
    }
  },
  backButtonText: {
    "@media (max-width: 1200px)": {
      display: "none",
    },
  },
  backIcon: {
    transform: 'rotate(180deg)',
  },
}));

const CryptoDepositView = ({ crypto, settings, handleBack }) => {
  // Get the accent color for this crypto
  const accentColor = CRYPTO_ACCENT_COLORS[crypto.code] || theme.accent;
  const gradientColor = crypto.gradientColor || 'rgba(20, 241, 149, 0.12)';
  
  const classes = useStyles({ accentColor, gradientColor });
  const notify = useNotification();
  const { cryptoData, fetchCryptoData } = useCashier();
  
  // Get address for this crypto from context
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [cryptoAmount, setCryptoAmount] = useState('0.0005');
  const [usdAmount, setUsdAmount] = useState('25.00');
  const [eurAmount, setEurAmount] = useState('22.50');
  const [exchangeRateUSD, setExchangeRateUSD] = useState(0);
  const [exchangeRateEUR, setExchangeRateEUR] = useState(0);
  
  // Track which field was last updated to avoid infinite loops
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Check if deposit is enabled based on settings
  const isDepositEnabled = () => {
    if (!settings) return true;
    
    const paymentSettings = settings.payment || {};
    
    // Check if crypto deposits are enabled generally
    if (paymentSettings.crypto_deposit === false) return false;
    
    // Check if this specific crypto is enabled
    const cryptoCode = crypto.code.toLowerCase();
    return paymentSettings[`${cryptoCode}_deposit`] !== false;
  };
  
  // Get exchange rate from crypto data if available
  useEffect(() => {
    setLoading(true);
    
    if (cryptoData && cryptoData.addresses && cryptoData.prices) {
      const cryptoCode = crypto.code.toLowerCase();
      if (cryptoData.addresses[cryptoCode]) {
        setAddress(cryptoData.addresses[cryptoCode]);
      } else {
        // If address is not available, we might need to reload crypto data
        console.log(`Address for ${cryptoCode} not found, reloading crypto data...`);
        fetchCryptoData();
      }
      
      // Set initial values based on actual price data if available
      if (cryptoData.prices[cryptoCode]) {
        const price = cryptoData.prices[cryptoCode].price ; // Convert from milli-USD to USD
        const initialCryptoAmount = 0.001;
        setCryptoAmount(initialCryptoAmount.toFixed(6));
        setUsdAmount((initialCryptoAmount * price).toFixed(2));
        setEurAmount((initialCryptoAmount * price * 0.9).toFixed(2)); // Approximate EUR conversion
        
        // Set exchange rates
        setExchangeRateUSD(price);
        setExchangeRateEUR(price * 0.9); // Approximate EUR rate
      }
      
      setLoading(false);
    }
  }, [cryptoData, crypto.code, fetchCryptoData]);
  
  // Format a value to fixed precision without trailing zeros
  const formatValue = (value, maxDecimals) => {
    if (!value) return '0';
    
    // Make sure we have a string
    let valueStr = value.toString();
    
    // Check if it's in scientific notation
    if (valueStr.includes('e')) {
      return parseFloat(value).toFixed(maxDecimals);
    }
    
    // Split by decimal point
    const parts = valueStr.split('.');
    
    // If no decimal part or the value is 0, return as is
    if (parts.length === 1 || parts[1] === '0') {
      return parts[0];
    }
    
    // Otherwise, return with the decimal part, limiting to maxDecimals
    return parseFloat(value).toFixed(Math.min(parts[1].length, maxDecimals));
  };
  
  useEffect(() => {
    // Only update if cryptoAmount was directly changed
    if (lastUpdated === 'crypto' && exchangeRateUSD > 0) {
      const crypto = parseFloat(cryptoAmount || '0');
      const usd = (crypto * exchangeRateUSD).toFixed(2);
      const eur = (crypto * exchangeRateEUR).toFixed(2);
      
      // We need to check if the values actually changed to avoid infinite loops
      if (usd !== usdAmount) setUsdAmount(usd);
      if (eur !== eurAmount) setEurAmount(eur);
    }
  }, [cryptoAmount, exchangeRateUSD, exchangeRateEUR, lastUpdated, usdAmount, eurAmount]);
  
  useEffect(() => {
    // Only update if usdAmount was directly changed
    if (lastUpdated === 'usd' && exchangeRateUSD > 0) {
      const usd = parseFloat(usdAmount || '0');
      const crypto = usd / exchangeRateUSD;
      const eur = (usd * 0.9).toFixed(2); // Approximate conversion
      
      // Format crypto amount to appropriate precision
      const formattedCrypto = formatValue(crypto, 6);
      
      if (formattedCrypto !== cryptoAmount) setCryptoAmount(formattedCrypto);
      if (eur !== eurAmount) setEurAmount(eur);
    }
  }, [usdAmount, exchangeRateUSD, lastUpdated, cryptoAmount, eurAmount]);
  
  useEffect(() => {
    // Only update if eurAmount was directly changed
    if (lastUpdated === 'eur' && exchangeRateEUR > 0) {
      const eur = parseFloat(eurAmount || '0');
      const crypto = eur / exchangeRateEUR;
      const usd = (eur / 0.9).toFixed(2); // Approximate conversion
      
      // Format crypto amount to appropriate precision
      const formattedCrypto = formatValue(crypto, 6);
      
      if (formattedCrypto !== cryptoAmount) setCryptoAmount(formattedCrypto);
      if (usd !== usdAmount) setUsdAmount(usd);
    }
  }, [eurAmount, exchangeRateEUR, lastUpdated, cryptoAmount, usdAmount]);

  const handleCryptoChange = (e) => {
    setCryptoAmount(e.target.value);
    setLastUpdated('crypto');
  };

  const handleUsdChange = (e) => {
    setUsdAmount(e.target.value);
    setLastUpdated('usd');
  };
  
  const handleEurChange = (e) => {
    setEurAmount(e.target.value);
    setLastUpdated('eur');
  };

  const handleCopy = () => {
    if (address) {
      const textToCopy = address.address || address;
      navigator.clipboard.writeText(textToCopy);
      notify.success('Address copied to clipboard!');
    }
  };

  // For QR code, include tag if available
  const getFullAddressForQR = () => {
    if (!address) return '';
    
    // Handle both string and object formats
    if (typeof address === 'string') return address;
    
    // If we have a tag/memo and it's required for this currency
    if (address.tag && ['xrp', 'xlm'].includes(crypto.code.toLowerCase())) {
      return `${address.address}?dt=${address.tag}`;
    }
    
    return address.address;
  };

  // Use address object to display
  const fullAddress = getFullAddressForQR();

  return (
    <div className={classes.root}>
      <div className={classes.backButton} onClick={handleBack}>
        <svg className={classes.backIcon} style={{ transform: 'rotate(0deg)' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><g clipPath="url(#clip0_132_11242)"><path d="M17.5 9.16667H5.69167L8.67917 6.17917L7.5 5L2.5 10L7.5 15L8.67917 13.8208L5.69167 10.8333H17.5V9.16667Z" fill="currentColor"/></g><defs><clipPath id="clip0_132_11242"><rect width="20" height="20" fill="currentColor"/></clipPath></defs></svg>
        <span className={classes.backButtonText}>Back</span>
      </div>

      <div className={classes.header}>
        <div className={classes.title}>
          <img src={crypto.icon} alt={crypto.name} className={classes.cryptoIcon} />
          <div>
            Deposit {crypto.name}
            {exchangeRateUSD > 0 && (
              <div className={classes.priceDisplay}>
                ${exchangeRateUSD.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px', width: '100%', minHeight: '170px' }}>
          Loading your deposit address...
        </div>
      ) : address ? (
        <div className={classes.addressSection}>
          <div className={classes.qrCodeContainer}>
            <div className={classes.qrCodeBackground} />
            <QRCodeSVG value={fullAddress} size={118} style={{ zIndex: 2 }} />
          </div>
          <div className={classes.addressInfo}>
            <div className={classes.instruction} style={{ marginBottom: 16 }}>
              Send the amount of {crypto.name} of your choice to the following address to recieve the equivalent in Coins.
            </div>
            <div className={classes.addressLabel} style={{ marginBottom: 8 }}>Your personal {crypto.name} deposit address</div>
            <div className={classes.addressValue}>
              <div className={classes.address}>{address.address}</div>
              <button className={classes.copyButton} onClick={handleCopy}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="currentColor"/>
                  <path d="M17.1 2H12.9C9.45001 2 8.05001 3.37 8.01001 6.75H11.1C15.3 6.75 17.25 8.7 17.25 12.9V15.99C20.63 15.95 22 14.55 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            
            {address.tag && (
              <>
                <div className={classes.addressLabel}>{crypto.code} Deposit Tag/Memo</div>
                <div className={classes.addressValue}>
                  <div className={classes.address}>{address.tag}</div>
                  <button className={classes.copyButton} onClick={() => {
                    navigator.clipboard.writeText(address.tag);
                    notify.success('Tag/Memo copied to clipboard!');
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="currentColor"/>
                      <path d="M17.1 2H12.9C9.45001 2 8.05001 3.37 8.01001 6.75H11.1C15.3 6.75 17.25 8.7 17.25 12.9V15.99C20.63 15.95 22 14.55 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', width: '100%' }}>
          Unable to generate a deposit address at this time. Please try again later.
        </div>
      )}

      <div className={classes.converterSection}>
        <div className={classes.converterContent}>
          <div className={classes.converterTitle}>Exchange</div>
          <div className={classes.conversionInputs}>
            <div className={classes.conversionInput}>
              <div className={classes.inputContainer}>
                <div className={classes.inputIcon}>
                  <img src={crypto.icon} alt={crypto.code} className={classes.cryptoIconSmall} />
                </div>
                <input
                  type="number"
                  className={`${classes.input} ${classes.paddedInput}`}
                  style={{ background: theme.bg.box }}
                  value={cryptoAmount}
                  onChange={handleCryptoChange}
                  step="0.0001"
                  min="0"
                />
              </div>
            </div>
            <div className={classes.equalsSign}>=</div>
            <div className={classes.conversionInput}>
              <div className={classes.inputContainer}>
                <div className={classes.inputIcon}>
                  <div className={classes.currencyIcon} style={{ background: '#26a17b' }}>$</div>
                </div>
                <input
                  type="number"
                  className={`${classes.input} ${classes.paddedInput}`}
                  style={{ background: theme.bg.box }}
                  value={usdAmount}
                  onChange={handleUsdChange}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div className={classes.equalsSign}>=</div>
            <div className={classes.conversionInput}>
              <div className={classes.inputContainer}>
                <div className={classes.inputIcon}>
                  <div className={classes.currencyIcon} style={{ background: '#2775CA' }}>€</div>
                </div>
                <input
                  type="number"
                  className={`${classes.input} ${classes.paddedInput}`}
                  style={{ background: theme.bg.box }}
                  value={eurAmount}
                  onChange={handleEurChange}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDepositView; 