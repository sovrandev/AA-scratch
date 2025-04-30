import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import config from '../../../services/config';
import PrimaryButton from '../../common/buttons/PrimaryButton';
import { useUser } from '../../../contexts/user';

const useStyles = makeStyles((theme) => ({
  caseDisplayContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '24px',
    width: '100%',
    background: theme.palette.darkgrey,
    borderRadius: '8px',
    gap: '24px',
  },
  caseName: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#fff',
    lineHeight: '24px',
  },
  caseContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '16px',
    height: '148px'
  },
  caseImageSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  caseImage: {
    width: '148px',
    height: '148px',
    position: 'relative',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    }
  },
  caseNumber: {
    display: 'flex',
    gap: '4px',
  },
  caseNumberItem: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    border: `1px solid ${theme.bg.inner}`,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: theme.text.secondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    "&.active": {
      background: theme.bg.inner,
      color: theme.text.primary,
    },
    "&:hover": {
      opacity: 1,
      color: theme.text.primary,
      background: theme.bg.inner,
    },
    "&.disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
      pointerEvents: "none"
    }
  },
  caseControls: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  demoButton: {
    background: theme.bg.inner,
    color: theme.text.secondary,
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      opacity: 0.8,
    },
    '&.disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none'
    }
  }
}));

const CaseDisplay = ({ 
  caseData, 
  onOpen, 
  onDemoSpin, 
  selectedCount = 1, 
  onCountChange, 
  disabled,
  cooldown = null,
  isFreeBox = false,
  locked = false
}) => {
  const classes = useStyles();
  const { getLevel } = useUser();

  // Format price with fallback
  const formattedPrice = caseData?.amount ? (caseData.amount * selectedCount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';

  const getBoxImageUrl = (boxName) => {
    return `${config.site.backend.url}/public/img/${boxName
      .toLowerCase()
      .replace(/%/g, 'percent')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}.png`;
  };

  // Function to format cooldown time
  const formatTimeLeft = (ms) => {
    if (!ms) return null;
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  // Get button text based on box type and state
  const getButtonText = () => {
    if (isFreeBox) {
      if (cooldown) {
        return formatTimeLeft(cooldown);
      }
      if(getLevel() < caseData.levelMin) {
        locked = true;
        return `Locked`;
      }
      return "Open Box";
    }
    return `Open ${selectedCount} box${selectedCount > 1 ? 'es' : ''} for $${formattedPrice}`;
  };

  return (
    <div className={classes.caseDisplayContainer}>
      <div className={classes.caseImage}>
        <img src={getBoxImageUrl(caseData?.name)} alt={caseData?.name || 'Case'} />
      </div>
      <div className={classes.caseContent}>
        <div className={classes.caseName}>{caseData?.name || 'Case'}</div>

        {!isFreeBox && (
          <div className={classes.caseNumber}>
            {[1, 2, 3, 4].map((number) => (
              <div 
                key={number}
                className={`${classes.caseNumberItem} ${selectedCount === number ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && onCountChange(number)}
              >
                {number}
              </div>
            ))}
          </div>
        )}

        <div className={classes.caseControls}>
          <PrimaryButton 
            label={getButtonText()}
            onClick={onOpen}
            style={{ 
              padding: "10px 16px",
              opacity: disabled || cooldown || locked ? 0.5 : 1,
              cursor: (disabled || cooldown || locked) ? 'not-allowed' : 'pointer',
              pointerEvents: (disabled || cooldown || locked) ? 'none' : 'auto',
              minWidth: '148px'
            }}
            disabled={disabled || cooldown}
          />
          <div 
            className={`${classes.demoButton} ${disabled ? 'disabled' : ''}`}
            onClick={!disabled ? onDemoSpin : undefined}
          >
            Demo Spin
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDisplay; 