import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import LevelBox from '../common/LevelBox';

const useStyles = makeStyles((theme) => ({
  modal: {
    "& .MuiDialog-paperWidthSm": {
      background: theme.bg.nav,
      borderRadius: 12,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      padding: "24px 32px",
      overflow: "auto",
      gap: 0,
      width: "100%",
      maxWidth: 600,
      maxHeight: 750,
      position: "relative",
      "&::-webkit-scrollbar": {
        display: "none"
      },
    },
    fontWeight: 600,
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: theme.text.secondary,
    cursor: 'pointer',
    padding: '8px',
    '&:hover': {
      color: theme.text.primary,
    },
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: theme.text.primary,
    marginBottom: '24px',
  },
  levelContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  levelBox: {
    background: theme.bg.box,
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  levelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  levelBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 600,
  },
  levelTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: theme.text.primary,
  },
  benefitsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  benefitItem: {
    fontSize: '14px',
    color: theme.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&::before': {
      content: '"•"',
      color: theme.text.secondary,
    },
  },
}));

const levelData = [
  {
    level: '0 - 10',
    badge: '10',
    badgeColor: '#666666',
    benefits: [
      'Bonus from Support in currency of your choice',
      'Rakeback enabled',
      'Weekly bonuses',
      'Monthly bonuses',
      'VIP Telegram channel access'
    ]
  },
  {
    level: '11 - 20',
    badge: '20',
    badgeColor: '#8847ff',
    benefits: [
      'All previous benefits',
      'Bonus from Support in currency of your choice',
      'Monthly bonus increased',
      'Rakeback increased to 0.50%'
    ]
  },
  {
    level: '21 - 30',
    badge: '30',
    badgeColor: '#3772ff',
    benefits: [
      'All previous benefits',
      'Bonus from Support in currency of your choice',
      'Monthly bonus increased',
      'Rakeback increased to 0.75%'
    ]
  },
  {
    level: '31 - 40',
    badge: '40',
    badgeColor: '#ff4747',
    benefits: [
      'All previous benefits',
      'Bonus from Support in currency of your choice',
      'Monthly bonus increased',
      '14 - 42 daily bonus (Reload)',
      'Rakeback increased to 1.00%'
    ]
  },
  {
    level: '41 - 50',
    badge: '50',
    badgeColor: '#47ff9c',
    benefits: [
      'All previous benefits',
      'Dedicated VIP host',
      'Unlimited Reloads while maintaining a VIP host',
      'Bonus from VIP host in currency of your choice',
      'Weekly & monthly bonuses increased',
      'Rakeback increased to 1.25%'
    ]
  },
  {
    level: '51 - 60',
    badge: '60',
    badgeColor: '#47ff9c',
    benefits: [
      'All previous benefits',
      'Custom deposit bonuses',
      'Priority withdrawal processing',
      'Rakeback increased to 1.50%'
    ]
  },
  {
    level: '61 - 70',
    badge: '70',
    badgeColor: '#ffd700',
    benefits: [
      'All previous benefits',
      'Exclusive VIP events access',
      'Higher withdrawal limits',
      'Rakeback increased to 1.75%'
    ]
  },
  {
    level: '71 - 80',
    badge: '80',
    badgeColor: '#ffd700',
    benefits: [
      'All previous benefits',
      'Personal account manager',
      'Custom bonus structures',
      'Rakeback increased to 2.00%'
    ]
  },
  {
    level: '81 - 90',
    badge: '90',
    badgeColor: '#ffd700',
    benefits: [
      'All previous benefits',
      'VIP-exclusive promotions',
      'Premium support service',
      'Rakeback increased to 2.25%'
    ]
  },
  {
    level: '91+',
    badge: '100',
    badgeColor: '#b9f2ff',
    benefits: [
      'All previous benefits',
      'Maximum rewards and benefits',
      'Exclusive customized benefits',
      'Weekly & monthly bonuses increased',
      'Rakeback increased to 2.50%'
    ]
  }
];

const LevelBreakdownModel = ({ open, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} className={classes.modal}>
      <button className={classes.closeButton} onClick={onClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className={classes.title}>Level Rewards</div>
      <div className={classes.levelContainer}>
        {levelData.map((level, index) => (
          <div key={index} className={classes.levelBox}>
            <div className={classes.levelHeader}>
              <div 
                className={classes.levelBadge} 
              >
                <LevelBox level={level.badge} />
              </div>
              <div className={classes.levelTitle}>Level {level.level}</div>
            </div>
            <ul className={classes.benefitsList}>
              {level.benefits.map((benefit, benefitIndex) => (
                <li key={benefitIndex} className={classes.benefitItem}>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        ))} 
      </div>
    </Dialog>
  );
};

export default LevelBreakdownModel; 