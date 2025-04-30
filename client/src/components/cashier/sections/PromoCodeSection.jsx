import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core";
import { useUser } from '../../../contexts/user';
import { useNotification } from '../../../contexts/notification';
import { generalSocketService } from '../../../services/sockets/general.socket.service';

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    paddingBottom: "24px"
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.text.primary,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.secondary,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
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
    borderRadius: 6,
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
  redeemButton: {
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
  promoInfo: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: '12px',
    background: `${theme.bg.inner}80`,
    borderRadius: 8,
    fontSize: 14,
    color: theme.text.secondary,
  },
  infoIcon: {
    color: theme.text.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyContainer: {
    marginTop: theme.spacing(2),
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.text.primary,
    marginBottom: theme.spacing(1),
  },
  emptyHistory: {
    color: theme.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    padding: theme.spacing(3),
    background: theme.bg.box,
    borderRadius: 8,
  },
  successBox: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: '12px',
    background: `${theme.palette.success.main}26`,
    borderRadius: 8,
    color: theme.palette.success.main,
    fontSize: 14,
    fontWeight: 600,
    marginTop: theme.spacing(2),
  }
}));

const PromoCodeSection = ({ settings }) => {
  const classes = useStyles();
  const { user, setUser } = useUser();
  const notify = useNotification();
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRedeemCode = async () => {
    if (!promoCode.trim()) {
      notify.error('Please enter a promo code');
      return;
    }

    setLoading(true);
    try {
      // Call the generalSocketService directly
      const response = await generalSocketService.sendPromoCodeRedeem(promoCode);
      
      if (response && response.success) {
        setSuccess(true);
        notify.success(`Successfully redeemed code for $${response.amount}`);
        
        // Update user data if response contains updated user
        if (response.user) {
          setUser(prevUser => ({
            ...prevUser,
            ...response.user
          }));
        }
        
        setPromoCode('');
      }
    } catch (error) {
      notify.error(error.message || 'Failed to redeem promo code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.title}>Redeem Promo Code</div>
        <div className={classes.subtitle}>Enter a promo code to receive bonus funds</div>
      </div>
      
      <div className={classes.inputContainer}>
        <div className={classes.inputGroup}>
          <input
            type="text"
            className={classes.input}
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          />
          <button 
            className={classes.redeemButton}
            onClick={handleRedeemCode}
            disabled={loading || !promoCode.trim()}
          >
            {loading ? 'Redeeming...' : 'Redeem'}
          </button>
        </div>
        
        {success && (
          <div className={classes.successBox}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM7 11.4L3.6 8L4.7 6.9L7 9.2L11.3 4.9L12.4 6L7 11.4Z" fill="currentColor"/>
            </svg>
            {successMessage}
          </div>
        )}

      </div>
    </div>
  );
};

export default PromoCodeSection; 