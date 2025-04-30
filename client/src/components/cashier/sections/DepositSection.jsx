import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core";
import { useCashier } from '../../../contexts/cashier';
import btc from "../../../assets/img/cashier/btc.png";
import eth from "../../../assets/img/cashier/eth.png";
import usdt from "../../../assets/img/cashier/usdt.png";
import ltc from "../../../assets/img/cashier/ltc.png";
import visa from "../../../assets/img/cashier/visa.png";
import kinguin from "../../../assets/img/cashier/kinguin.png";
import trx from "../../../assets/img/cashier/trx.png";
import sol from "../../../assets/img/cashier/sol.png";
import usdc from "../../../assets/img/cashier/usdc.png";
import xrp from "../../../assets/img/cashier/xrp.png";

// Define payment methods with types and accent colors
const PAYMENT_METHODS = {
  fiat: [
    {
      icon: visa,
      name: 'Card',
      code: 'CARD',
      type: 'card',
      gradientColor: 'rgba(181, 202, 255, 0.2)'
    },
    {
      icon: kinguin,
      name: 'Kinguin',
      code: 'KG',
      type: 'kinguin',
      gradientColor: 'rgba(255, 194, 13, 0.2)'
    }
  ],
  crypto: [
    {
      icon: btc,
      name: 'Bitcoin',
      code: 'BTC',
      type: 'crypto',
      gradientColor: 'rgba(247, 147, 26, 0.2)',
      accentColor: '#f7931a'
    },
    {
      icon: eth,
      name: 'Ethereum',
      code: 'ETH',
      type: 'crypto',
      gradientColor: 'rgba(98, 126, 234, 0.2)',
      accentColor: '#627eea'
    },
    {
      icon: ltc,
      name: 'Litecoin',
      code: 'LTC',
      type: 'crypto',
      gradientColor: 'rgba(52, 93, 157, 0.2)',
      accentColor: '#345d9d'
    },
    {
      icon: usdt,
      name: 'USDT',
      code: 'USDT',
      type: 'crypto',
      gradientColor: 'rgba(38, 161, 123, 0.2)',
      accentColor: '#26a17b'
    },
    {
      icon: sol,
      name: 'Solana',
      code: 'SOL',
      type: 'crypto',
      gradientColor: 'rgba(123, 96, 232, 0.2)',
      accentColor: '#7B60E8'
    },
    {
      icon: usdc,
      name: 'USDC',
      code: 'USDC',
      type: 'crypto',
      gradientColor: 'rgba(39, 117, 202, 0.2)',
      accentColor: '#2775CA'
    },
    {
      icon: trx,
      name: 'Tron',
      code: 'TRX',
      type: 'crypto',
      gradientColor: 'rgba(238, 43, 43, 0.2)',
      accentColor: '#EE2B2B'
    },
    {
      icon: xrp,
      name: 'Ripple',
      code: 'XRP',
      type: 'crypto',
      gradientColor: 'rgba(255, 255, 255, 0.1)',
      accentColor: '#ffffff'
    }
  ]
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
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
  cryptoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    "@media (max-width: 1200px)": {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  methodButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 12px',
    borderRadius: 8,
    background: theme.bg.box,
    cursor: props => props.disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    opacity: props => props.disabled ? 0.5 : 1,
    '&:hover': {
      transform: props => props.disabled ? 'none' : 'translateY(-2px)',
    }
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
  methodPrice: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.text.secondary,
    position: 'relative',
    zIndex: 1,
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
  }
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
          <div className={classes.disabledText}>Maintenance</div>
        </div>
      )}
    </div>
  );
};

const DepositSection = ({ onSelectMethod, settings }) => {
  const classes = useStyles({ disabled: false });
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

  const isMethodEnabled = (method) => {
    if (!settings) return true; 
    
    const paymentSettings = settings.payment || {};
    
    if (method.type === 'crypto') {
      if (paymentSettings.crypto_deposit === false) return false;
      
      const cryptoCode = method.code.toLowerCase();
      return paymentSettings[`${cryptoCode}_deposit`] !== false;
    }
    
    if (method.type === 'card') {
      return paymentSettings.card_deposit !== false;
    }
    
    if (method.type === 'kinguin') {
      return paymentSettings.kinguin_deposit !== false;
    }
    
    return true;
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
        case 'USDC':
          bgColor = 'rgba(39, 117, 202, 0.2)';
          textColor = '#2775CA';
          break;
        case 'TRX':
          bgColor = 'rgba(238, 43, 43, 0.2)';
          textColor = '#EE2B2B';
          break;
        case 'XRP':
          bgColor = 'rgba(35, 41, 47, 0.2)';
          textColor = '#23292F';
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
      {/*<div className={classes.section}>
        <div className={classes.sectionTitle}>Fiat</div>
        <div className={classes.methodsGrid}>
          {PAYMENT_METHODS.fiat.map((method) => {
            const isEnabled = isMethodEnabled(method);
            return (
              <div 
                key={method.code}
                className={classes.methodButton}
                onClick={() => handleSelectMethod(method)}
                style={{ opacity: isEnabled ? 1 : 0.5, cursor: isEnabled ? 'pointer' : 'not-allowed' }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at 50% 50%, ${method.gradientColor} 0%, rgba(15, 17, 23, 0) 100%)`,
                    opacity: 0.8,
                    zIndex: 0,
                  }}
                />
                <img src={method.icon} alt={method.name} className={classes.methodIcon} />
                <div className={classes.methodName}>{method.name}</div>
                
                {!isEnabled && (
                  <div className={classes.disabledOverlay}>
                    <div className={classes.disabledText}>Maintenance</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>*/}

      <div className={classes.section}>
        <div className={classes.sectionTitle}>Crypto</div>
        <div className={classes.cryptoGrid}>
          {PAYMENT_METHODS.crypto.map((method) => {
            const isEnabled = isMethodEnabled(method);
            const price = cryptoData?.prices?.[method.code.toLowerCase()]?.price || 
                         cryptoData?.prices?.[method.code]?.price;
            
            return (
              <CryptoButton
                key={method.code}
                method={method}
                isEnabled={isEnabled}
                price={price}
                loading={loading}
                onClick={() => handleSelectMethod(method)}
                renderIcon={renderCryptoIcon}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DepositSection; 