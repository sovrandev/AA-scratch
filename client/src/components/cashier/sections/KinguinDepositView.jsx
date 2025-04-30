import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core";
import { useNotification } from '../../../contexts/notification';
import kinguin from "../../../assets/img/cashier/kinguin.png";

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
  infoBox: {
    padding: 20,
    background: theme.bg.inner,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.text.primary,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 1.5,
    color: theme.text.secondary,
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  step: {
    display: 'flex',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: theme.blue,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.text.primary,
    fontSize: 12,
    fontWeight: 600,
  },
  stepText: {
    fontSize: 14,
    color: theme.text.primary,
    flex: 1,
  },
  button: {
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
    }
  },
}));

const KinguinDepositView = () => {
  const classes = useStyles();
  const notify = useNotification();

  const handleOpenKinguin = () => {
    notify.success('Redirecting to Kinguin...');
    window.open('https://www.kinguin.net', '_blank');
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.title}>
          <img src={kinguin} alt="Kinguin" className={classes.methodIcon} />
          Kinguin Deposit
        </div>
        <div className={classes.subtitle}>
          Deposit using Kinguin gift cards.
        </div>
      </div>

      <div className={classes.infoBox}>
        <div className={classes.infoTitle}>How to deposit with Kinguin</div>
        
        <div className={classes.steps}>
          <div className={classes.step}>
            <div className={classes.stepNumber}>1</div>
            <div className={classes.stepText}>
              Purchase a Kinguin gift card from the Kinguin website.
            </div>
          </div>
          <div className={classes.step}>
            <div className={classes.stepNumber}>2</div>
            <div className={classes.stepText}>
              Return to our site and enter the gift card code in your account.
            </div>
          </div>
          <div className={classes.step}>
            <div className={classes.stepNumber}>3</div>
            <div className={classes.stepText}>
              Your balance will be credited instantly after verification.
            </div>
          </div>
        </div>

        <div className={classes.infoText}>
          Kinguin gift cards are available in various denominations. The minimum deposit amount is $10.00.
        </div>

        <button 
          className={classes.button}
          onClick={handleOpenKinguin}
        >
          Go to Kinguin
        </button>
      </div>
    </div>
  );
};

export default KinguinDepositView; 