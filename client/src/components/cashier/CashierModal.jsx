import React, { useState, useEffect } from 'react';
import { useCashier } from '../../contexts/cashier';
import { useSettings } from '../../contexts/settings';
import { useUser } from '../../contexts/user';
import { useNotification } from '../../contexts/notification';
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { Tabs, Tab } from '@mui/material';
import DepositSection from './sections/DepositSection';
import WithdrawSection from './sections/WithdrawSection';
import CryptoDepositView from './sections/CryptoDepositView';
import CryptoWithdrawView from './sections/CryptoWithdrawView';
import CardDepositView from './sections/CardDepositView';
import KinguinDepositView from './sections/KinguinDepositView';
import PromoCodeSection from './sections/PromoCodeSection';
import theme from '../../styles/theme';

const useStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperWidthSm": {
      background: theme.bg.nav,
      borderRadius: 12,
      width: props => props.isCryptoView ? 750 : 600,
      height: "fit-content",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      maxWidth: props => props.isCryptoView ? 1200 : 1000,
      gap: '24px',
      transition: 'width 0.2s ease',
    },
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 1,
  },
  topContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: "6px 20px 0px 20px",
    background: theme.bg.box,
    alignItems: "flex-start",
    borderBottom: `1px solid ${theme.bg.border}`,
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      gap: 12,
    },
  },
  methodViewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    position: "absolute",
    top: 12,
    right: 0,
  },
  methodTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  authButton: {
    padding: "10px 12px",
    cursor: "pointer",
    transition: "all 0.2s",
    userSelect: "none",
    fontSize: 14,
    fontWeight: 600,
    "@media (max-width: 1200px)": {
      width: "100%",
      textAlign: "center",
    },
  },
  activeButton: {
    background: theme.bg.inner,
    color: theme.text.primary,
  },
  inactiveButton: {
    background: theme.bg.box,
    color: theme.text.secondary,
  },
  leftButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  rightButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    cursor: "pointer",
    zIndex: 10,
    color: theme.text.secondary,
    "&:hover": {
      color: theme.text.primary
    }
  },
  divider: {
    borderTop: `1px solid #fff`,
    opacity: 0.05
  },
  content: {
    padding: "24px",
    paddingBottom: 0
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
  affiliateContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.75),
    padding: "16px 24px 24px",
    paddingTop: 0,
    "@media (max-width: 1200px)": {
      width: "100%",
    },
  },
  affiliateDivider: {
    borderTop: `1px solid ${theme.bg.border}66`,
    marginLeft: 24,
    marginRight: 24,
  },
  affiliateTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.text.primary,
    lineHeight: 1.2,
  },
  affiliateDesc: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.secondary,
    lineHeight: 1.2,
    marginBottom: 8,
  },
  successBox: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: '8px 12px',
    background: `${theme.palette.success.main}26`,
    borderRadius: 8,
    color: theme.palette.success.main,
    fontSize: 14,
    fontWeight: 600,
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    flexDirection: "row",
    width: "100%",
  },
  input: {
    width: '100%',
    height: 40,
    background: theme.bg.box,
    border: "none",
    borderRadius: 8,
    padding: '0 12px',
    fontSize: 14,
    color: theme.text.primary,
    '&:focus': {
      outline: 'none',
    },
    '&:disabled': {
      cursor: 'not-allowed',
    }
  },
  claimButton: {
    background: theme.accent.primaryGradient,
    color: theme.text.primary,
    border: 'none',
    width: '100%',
    flexShrink: 6,
    borderRadius: 6,
    padding: '0 16px',
    height: 40,
    fontSize: 13,
    fontWeight: 600,
    "&::placeholder": {
      color: `${theme.text.secondary}99`,
      fontWeight: 600
    },
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      opacity: 0.9,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
      '&:hover': {
        opacity: 0.5,
      }
    }
  },
  infoIcon: {
    position: 'relative',
    color: theme.text.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'help',
    '&:hover > div': {
      opacity: 1,
      visibility: 'visible'
    }
  },
  infoTooltip: {
    position: 'absolute',
    top: '175%',
    left: '50%',
    width: 250,
    transform: 'translateX(-50%)',
    backgroundColor: theme.bg.box,
    color: theme.text.secondary,
    padding: '12px',
    borderRadius: '6px',
    fontSize: 10,
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.2s ease',
    zIndex: 1000,
    lineHeight: 1.4,
    whiteSpace: 'normal',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderWidth: '6px',
      borderStyle: 'solid',
      borderColor: `transparent transparent ${theme.bg.box} transparent`
    }
  },
  navTabs: {
    '& .MuiTabs-indicator': {
      height: '1px',
      backgroundColor: theme.text.primary,
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    },
    '& .MuiTab-root': {
      transition: theme.transitions.normal,
      color: theme.text.secondary,
      fontSize: '14px',
      fontWeight: 400,
      letterSpacing: '0.02em',
      textTransform: 'none',
      minWidth: 'unset',
      padding: '0 16px',
      textWrap: 'nowrap',
      '&.Mui-selected': {
        color: theme.text.primary,
      },
      '&:hover': {
        color: theme.text.primary,
        backgroundColor: 'transparent',
      },
      '& .MuiTouchRipple-root': {
        display: 'none',
      },
      '&:focus': {
        backgroundColor: 'transparent',
      }
    }
  },
}));

const CashierModal = () => {
  const { isOpen, setIsOpen, activeTab, setActiveTab } = useCashier();
  const { settings } = useSettings();
  const { user, claimAffiliateCode } = useUser();
  const notify = useNotification();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [affiliateCode, setAffiliateCode] = useState('');
  const [loading, setLoading] = useState(false);
    console.log(user)
  const isCryptoView = selectedMethod && selectedMethod.type === 'crypto';
  
  const hasRedeemedCode = user?.affiliates?.referrer !== undefined;
  
  const classes = useStyles({ isCryptoView, hasRedeemedCode });

  useEffect(() => {
    if (hasRedeemedCode && user?.affiliates?.redeemedCode) {
      setAffiliateCode(user.affiliates.redeemedCode);
    }
  }, [hasRedeemedCode, user?.affiliates?.redeemedCode]);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedMethod(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedMethod(null); // Reset selected method when changing tabs
  };

  const handleClaimCode = async () => {
    if (!affiliateCode.trim()) {
      notify.error('Please enter an affiliate code');
      return;
    }

    setLoading(true);
    try {
      const success = await claimAffiliateCode(affiliateCode);
      if (success) {
        notify.success('Affiliate code claimed successfully!');
        setAffiliateCode('');
      }
    } catch (error) {
      notify.error(error.message || 'Failed to claim affiliate code');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      className={classes.modal}
    >
      <div className={classes.closeButton} onClick={handleClose}>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      
      <div className={classes.modalContent}>
        <div className={classes.topContainer}>
          <Tabs 
            value={activeTab === 'deposit' ? 0 : activeTab === 'withdraw' ? 1 : 2}
            className={classes.navTabs}
            onChange={handleTabChange}
          >
            <Tab
              label="Deposit"
              onClick={() => setActiveTab('deposit')}
              style={{ padding: 0, marginRight: 18 }}
            />
            <Tab
              label="Withdraw"
              onClick={() => setActiveTab('withdraw')}
              style={{ padding: 0, marginRight: 18 }}
            />
            <Tab
              label="Promo Code"
              onClick={() => setActiveTab('promo')}
              style={{ padding: 0 }}
            />
          </Tabs>
        </div>
        
        <div className={classes.content}>
          {!selectedMethod ? (
            <>
              {activeTab === 'deposit' && <DepositSection onSelectMethod={setSelectedMethod} settings={settings} />}
              {activeTab === 'withdraw' && <WithdrawSection onSelectMethod={setSelectedMethod} settings={settings} />}
              {activeTab === 'promo' && <PromoCodeSection settings={settings} />}
            </>
          ) : (
            <>
              {activeTab === 'deposit' && selectedMethod.type === 'crypto' && (
                <CryptoDepositView crypto={selectedMethod} settings={settings} handleBack={() => setSelectedMethod(null)} />
              )}
              {activeTab === 'withdraw' && selectedMethod.type === 'crypto' && (
                <CryptoWithdrawView crypto={selectedMethod} settings={settings} handleBack={() => setSelectedMethod(null)} />
              )}
              {activeTab === 'deposit' && selectedMethod.type === 'card' && (
                <CardDepositView settings={settings} />
              )}
              {activeTab === 'deposit' && selectedMethod.type === 'kinguin' && (
                <KinguinDepositView settings={settings} />
              )}
            </>
          )}
        </div>
      </div>
      
      {(activeTab === 'deposit' && !selectedMethod) && (
        <>
          <div className={classes.affiliateDivider} />
          <div className={classes.affiliateContainer}>
            {hasRedeemedCode ? (
              <div className={classes.successBox}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM7 11.4L3.6 8L4.7 6.9L7 9.2L11.3 4.9L12.4 6L7 11.4Z" fill="currentColor"/>
                </svg>
                5% deposit bonus active
              </div>
            ) : (
              <>
                <div className={classes.affiliateTitle}>Affiliate code</div>
                <div className={classes.affiliateDesc}>Get 5% bonus on any deposit amount by using someone's code.</div>
                <div className={classes.inputGroup}>
                  <input
                    type="text"
                    className={classes.input}
                    placeholder="Enter code"
                    value={affiliateCode}
                    onChange={(e) => setAffiliateCode(e.target.value)}
                  />
                  <button 
                    className={classes.claimButton}
                    onClick={handleClaimCode}
                    disabled={loading}
                  >
                    Apply
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Dialog>
  );
};

export default CashierModal; 