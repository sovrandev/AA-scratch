import React, { useEffect } from 'react';
import { makeStyles } from "@material-ui/core";
import { useCashier } from '../../../contexts/cashier';
import sol from "../../../assets/img/cashier/sol.png";

// Only include SOL for withdrawals
const CRYPTO_OPTIONS = [
  {
    icon: sol,
    name: 'Solana',
    code: 'SOL',
    type: 'crypto',
    gradientColor: 'rgba(123, 96, 232, 0.2)',
    accentColor: '#7B60E8'
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    paddingBottom: "24px"
  },
  section: {
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.text.primary,
    marginBottom: 12,
  },
  methodsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    "@media (max-width: 1200px)": {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  cryptoButton: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    background: theme.bg.box,
    borderRadius: 8,
    cursor: 'pointer',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    transition: theme.transitions.normal,
    '&:hover': {
      background: theme.bg.hover,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 8,
      padding: 1,
      background: props => `linear-gradient(135deg, ${props.accentColor}80 0%, ${theme.bg.border} 20%, ${theme.bg.border} 80%, ${props.accentColor}80 100%)`,
      WebkitMask: 
        'linear-gradient(#fff 0 0) content-box, ' +
        'linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      pointerEvents: 'none',
      transition: "all 0.4s ease",
    },
    '&:hover::before': {
      background: props => `${props.accentColor}80`,
    }
  },
  methodIcon: {
    width: 32,
    height: 32,
    objectFit: 'contain',
    marginBottom: 8,
    position: 'relative',
    zIndex: 1,
  },
  methodName: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.primary,
    position: 'relative',
    zIndex: 1,
    marginBottom: 4,
  },
  placeholderIcon: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    position: 'relative',
    zIndex: 1,
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  disabledText: {
    color: theme.text.primary,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '4px 8px',
    borderRadius: 4,
  },
  methodPrice: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.text.secondary,
    position: 'relative',
    zIndex: 1,
  },
}));

// Create separate style instances for each crypto method
const CryptoButton = ({ method, isEnabled, price, loading, onClick, renderIcon }) => {
  const classes = useStyles({ accentColor: method.accentColor });
  
  return (
    <div 
      className={classes.cryptoButton}
      onClick={onClick}
      style={{ opacity: isEnabled ? 1 : 0.5, cursor: isEnabled ? 'pointer' : 'not-allowed' }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 0%, ${method.gradientColor} 0%, rgba(15, 17, 23, 0) 60%)`,
          opacity: 0.8,
          zIndex: 0,
        }}
      />
      {renderIcon(method)}
      <div className={classes.methodName}>{method.name}</div>
      <div className={classes.methodPrice}>
        {loading ? '#0.00' : 
         price ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
         ''}
      </div>
      
      {!isEnabled && (
        <div className={classes.disabledOverlay}>
          <div className={classes.disabledText}>Coming soon</div>
        </div>
      )}
    </div>
  );
};

const WithdrawSection = ({ onSelectMethod, settings }) => {
  const classes = useStyles();
  const { cryptoData, fetchCryptoData, loading } = useCashier();
  
  // Fetch crypto prices from the backend
  useEffect(() => {
    const updatePrices = () => {
      if (!cryptoData || !cryptoData.prices) {
        fetchCryptoData();
      }
    };
    
    updatePrices();
    
    const interval = setInterval(() => {
      fetchCryptoData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [cryptoData, fetchCryptoData]);

  const isMethodEnabled = (crypto) => {
    if (!settings) return true; 
    
    const paymentSettings = settings.payment || {};
    
    if (paymentSettings.crypto_withdraw === false) return false;
    
    const cryptoCode = crypto.code.toLowerCase();
    return paymentSettings[`${cryptoCode}_withdraw`] !== false;
  };

  const handleSelectMethod = (method) => {
    if (isMethodEnabled(method)) {
      onSelectMethod(method);
    }
  };

  const renderCryptoIcon = (crypto) => {
    if (crypto.icon) {
      return <img src={crypto.icon} alt={crypto.name} className={classes.methodIcon} />;
    } else {
      let bgColor, textColor;
      
      switch(crypto.code) {
        case 'SOL':
          bgColor = 'rgba(20, 241, 149, 0.2)';
          textColor = '#14F195';
          break;
        default:
          bgColor = 'rgba(150, 150, 150, 0.2)';
          textColor = '#969696';
      }
      
      return (
        <div 
          className={classes.placeholderIcon} 
          style={{ background: bgColor, color: textColor }}
        >
          {crypto.code}
        </div>
      );
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.section}>
        <div className={classes.sectionTitle}>Crypto</div>
        <div className={classes.methodsGrid}>
          {CRYPTO_OPTIONS.map((crypto) => {
            const isEnabled = isMethodEnabled(crypto);
            const price = cryptoData?.prices?.[crypto.code.toLowerCase()]?.price || 
                         cryptoData?.prices?.[crypto.code]?.price;
            
            return (
              <CryptoButton
                key={crypto.code}
                method={crypto}
                isEnabled={isEnabled}
                price={price}
                loading={loading}
                onClick={() => handleSelectMethod(crypto)}
                renderIcon={renderCryptoIcon}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WithdrawSection; 