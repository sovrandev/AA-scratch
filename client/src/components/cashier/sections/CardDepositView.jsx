import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core";
import { useNotification } from '../../../contexts/notification';
import visa from "../../../assets/img/cashier/visa.png";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 400,
    color: theme.text.secondary,
  },
  methodIcon: {
    width: 32,
    height: 32,
    objectFit: 'contain',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    padding: 20,
    background: theme.bg.inner,
    borderRadius: 8,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.primary,
    display: 'flex',
    alignItems: 'center',
    '& span': {
      color: theme.red,
      marginLeft: 4,
    }
  },
  input: {
    width: '100%',
    height: 48,
    background: theme.bg.main,
    border: 'none',
    borderRadius: 8,
    padding: '0 16px',
    fontSize: 14,
    color: theme.text.primary,
    '&::placeholder': {
      color: theme.text.secondary,
    },
    '&:focus': {
      outline: 'none',
      border: `1px solid ${theme.blue}`,
    }
  },
  amountInput: {
    position: 'relative',
    '&::before': {
      content: '"$"',
      position: 'absolute',
      left: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      color: theme.text.secondary,
      fontSize: 14,
    }
  },
  inputWithPrefix: {
    paddingLeft: 30,
  },
  submitButton: {
    width: '100%',
    height: 48,
    background: theme.gradient,
    border: 'none',
    borderRadius: 8,
    color: theme.text.primary,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: 16,
    '&:hover': {
      opacity: 0.9,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    }
  },
  infoText: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.text.secondary,
    marginTop: 8,
  },
}));

const CardDepositView = () => {
  const classes = useStyles();
  const notify = useNotification();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) {
      notify.error('Please enter an amount');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      notify.success(`Redirecting to payment processor for $${amount}`);
      setLoading(false);
      // Reset form
      setAmount('');
    }, 1500);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.title}>
          <img src={visa} alt="Card" className={classes.methodIcon} />
          Card Deposit
        </div>
        <div className={classes.subtitle}>
          Deposit using your credit or debit card.
        </div>
      </div>

      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.inputGroup}>
          <label className={classes.inputLabel}>
            Deposit amount <span>*</span>
          </label>
          <div className={classes.amountInput}>
            <input
              type="number"
              className={`${classes.input} ${classes.inputWithPrefix}`}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
              step="0.01"
              required
            />
          </div>
          <div className={classes.infoText}>
            Minimum deposit amount is $10.00
          </div>
        </div>

        <button 
          type="submit" 
          className={classes.submitButton}
          disabled={loading || !amount || parseFloat(amount) < 10}
        >
          {loading ? 'Processing...' : `Deposit $${amount ? parseFloat(amount).toFixed(2) : '0.00'}`}
        </button>
      </form>
    </div>
  );
};

export default CardDepositView; 