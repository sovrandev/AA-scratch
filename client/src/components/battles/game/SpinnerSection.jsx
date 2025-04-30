import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import CrossSwordIcon from '../../icons/CrossSwordIcon';
import PrimaryButton from '../../common/buttons/PrimaryButton';
import CircularProgress from '@mui/material/CircularProgress';
import bigSpinIcon from '../../../assets/img/big-spin.png';
import bigSpinSpritesheet from '../../../assets/img/spritesheet.png';
import Spritesheet from "react-responsive-spritesheet";
import seedrandom from 'seedrandom';
import botPfp from '../../../assets/img/general/bot.png';
import theme from "../../../styles/theme.js";
import PixelCanvas from './PixelCanvas';

import { useUser } from '../../../contexts/user';
import { useNotification } from '../../../contexts/notification';
import { useSound } from '../../../contexts/sound';
import { useBattles } from '../../../contexts/battles';
import JackpotSpinner from './JackpotSpinner';
import { useNavigate } from 'react-router-dom';
import NumberFlow, { continuous } from '@number-flow/react';

const BigSpinSprite = React.memo(({ shouldPlayBigSpin, playingBigSpin, onAnimationComplete, isMobile }) => {
  const spritesheetRef = useRef(null);

  useEffect(() => {
    if (playingBigSpin && spritesheetRef.current && shouldPlayBigSpin) {
      const spritesheet = spritesheetRef.current;
      spritesheet.goToAndPlay(0);
      spritesheet.setEndAt(151);
      spritesheet.setStartAt(0);
      // Force play to ensure animation starts
      setTimeout(() => {
        if (spritesheet && spritesheet.play) {
          spritesheet.play();
        }
      }, 50);
    }
  }, [playingBigSpin]);

  const handleAnimationComplete = () => {
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  return (
    <div style={{ 
      width: isMobile ? '100px' : '120px', 
      height: isMobile ? '100px' : '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      transition: 'all 0.25s ease-in-out',
      marginTop: '-10px',
      overflow: 'hidden'
    }}>
      <Spritesheet
        image={bigSpinSpritesheet}
        widthFrame={360}
        heightFrame={360}
        steps={151}
        fps={70}
        autoplay={false}
        loop={false}
        getInstance={spritesheet => {
          spritesheetRef.current = spritesheet;
          if (playingBigSpin && spritesheet) {
            spritesheet.play();
          }
        }}
        onLoopComplete={handleAnimationComplete}
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
          position: 'absolute',
          top: -10,
          left: 0,
          zIndex: 2,
        }}
      />
    </div>
  );
});

const useStyles = makeStyles((theme) => ({
  selectorIconLeft: {
    position: "absolute",
    top: "50%",
    left: -20,
    transform: "translateY(-50%) translateX(-50%)",
    zIndex: 20,
    color: theme.text.primary,
    filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.5))',
    pointerEvents: 'none',
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  selectorIconRight: {
    position: "absolute",
    top: "50%",
    right: -20,
    transform: "translateY(-50%) translateX(50%)",
    zIndex: 20,
    color: theme.text.primary,
    filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.5))',
    pointerEvents: 'none',
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  wrapper: {
    margin: "0 auto",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    // background: theme.bg.box,
    // borderTop: `1px solid ${theme.bg.border}`,
    // borderBottom: `1px solid ${theme.bg.border}`,
    position: 'relative',
    overflow: 'visible',
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundImage: `url(${Background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    opacity: 0.05,
    mixBlendMode: "luminosity",
    pointerEvents: "none",
    zIndex: 0,
    width: "100%",
    height: "100%",
  },
  root: {
    width: "100%",
    position: "relative",
    marginBottom: 1,
    overflow: 'visible',
    clipPath: 'none',
    maxWidth: props => props.playerCount === 6 ? 1600 : 1200,
    padding: props => props.playerCount === 6 ? "0 2rem" : 0,
    zIndex: 1,
    "@media (max-width:1200px)": {
      padding: "0",
    }
  },
  spinnersContainer: {
    display: props => props.gameState === "completed" ? "flex" : "grid",
    gridTemplateColumns: props => `repeat(${props.playerCount}, 1fr)`,
    gridRow: 1,
    position: "relative",
    width: "100%",
    height: 496,
    overflow: 'visible',
  },
  spinner: {
    flex: 1,
    height: 496,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease-in-out",
  },
  spinnerBigSpin: {
    background: 'transparent',
    position: "relative",
    zIndex: 1,
  },
  countdown: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 700,
    top: 0,
    left: 0,
    color: theme.text.primary,
    fontSize: 120,
    gap: "8px",
    height: "100%",
    width: "100%",
    display: "flex",
    zIndex: 998,
    pointerEvents: "none",
  },
  countdownOverlay: {
    display: "none",
  },
  itemsTrack: {
    display: "flex",
    flexDirection: "column",
  },
  item: {
    width: "100%",
    height: 132,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
    position: "relative",
    zIndex: 2,
    "@media (max-width:1200px)": {
      height: 100,
    }
  },
  itemImage: {
    width: 90,
    height: 90,
    objectFit: "contain",
    borderRadius: 8,
    position: 'relative',
    zIndex: 2,
    "@media (max-width:1200px)": {
      width: 70,
      height: 70,
    }
  },
  itemName: {
    fontSize: 12,
    color: theme.text.secondary,
    textAlign: "center",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
    fontWeight: 500,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '80%',
    padding: '0 8px',
    "@media (max-width:1200px)": {
      fontSize: 10,
      padding: '0 4px',
    }
  },
  itemPrice: {
    fontSize: 12,
    color: theme.text.primary,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontWeight: 500,
    "@media (max-width:1200px)": {
      fontSize: 10,
      gap: 2,
    }
  },
  emptySlot: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.text.secondary,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: 14
  },
  spinnerWrapper: {
    padding: 0,
    margin: 0,
    display: props => props.gameState === "completed" ? "flex" : "grid",
    width: "100%",
    height: "100%",
    gridRow: 1,
    maxWidth: "100%",
  },
  swordIcon: {
    position: "absolute",
    color: theme.text.secondary,
    top: "50%",
    right: -20,
    transform: "translateY(-50%)",
    zIndex: 3,
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  statusText: {
    color: theme.text.primary,
    fontSize: '16px',
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 8,
    "@media (max-width:1200px)": {
      fontSize: '12px',
    }
  },
  actionButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.text.primary,
    border: 'none',
    padding: theme.spacing(1.5, 3),
    borderRadius: theme.spacing(0.5),
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    },
    "@media (max-width:1200px)": {
      padding: theme.spacing(1, 2),
      fontSize: '0.875rem',
    }
  },
  profileContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    transform: "none !important"
  },
  profileImageContainer: {
    width: "90px",
    height: "90px",
    position: "relative",
    marginBottom: 8,
    "&::before": {
      content: '""',
      position: "absolute",
      top: -4 ,
      left: -4,
      right: -4,
      bottom: -4,
      border: "2px solid #4CAF50",
      borderRadius: "50%"
    },
    "& img": {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      objectFit: "cover"
    }
  },
  completedText: {
    fontSize: 16,
    fontWeight: 500,
    color: theme.text.primary,
    alignItems: "center",
    display: "flex",
    gap: 4
  },
  crownSvg: {
    position: "absolute",
    top: "10px",
    zIndex: 3,
    '& path': {
      fill: theme.blue
    }
  },
  jackpotContainer: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 18px",
    borderRadius: "8px",
    background: theme.accent.primaryGradientLowOpacity,
    width: "fit-content",
    minWidth: "200px",
    zIndex: 10,
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      padding: "1px",
      borderRadius: "8px",
      background: theme.accent.primaryGradient,
      WebkitMask:  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
    },
  },
  jackpotLabel: {
    fontSize: '16px',
    fontWeight: 600,
    color: theme.text.primary,
    whiteSpace: 'nowrap',
    color: theme.accent.primary,
  },
  jackpotValue: {
    fontSize: '16px',
    fontWeight: 600,
    color: theme.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    '& img': {
      width: '16px',
      height: '16px',
    }
  },
  winnersContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    borderRadius: 12,
    height: "100%",
    width: "100%",
  },
  winnerProfile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  winningNumber: {
    fontSize: '26px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    zIndex: 10,
    color: theme.text.primary,
    "@media (max-width:1200px)": {
      fontSize: '18px',
    }
  },
  winningNumberContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  winnersDisplay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
  },
  winnersGrid: {
    display: 'flex',
    gap: '32px',
    justifyContent: 'center',
  },
  winnerCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    "& $winnerAvatar": {
      border: "none",
      overflow: "hidden"
    },
    "@media (max-width:1200px)": {
      gap: '8px',
    }
  },
  winnerCrown: {
    position: 'absolute',
    top: -32,
    left: "50%",
    transform: "translateX(-50%)",
    width: 25,
    height: 23,
    color: theme.accent.primary,
  },
  winnerAvatarWrapper: {
    width: '100px',
    height: '100px',
    position: 'relative',
    "@media (max-width:1200px)": {
      width: "80px",
      height: "80px",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      top: -4,
      left: -4,
      right: -4,
      bottom: -4,
      border: "2px solid transparent",
      borderRadius: "50%",
      background: `linear-gradient(to bottom, ${theme.accent.primary}, transparent) border-box`,
      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
      zIndex: 2
    }
  },
  winnerAvatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    position: 'relative',
    zIndex: 2,
    "&::before": {
      content: '""',
      position: "absolute",
      top: -4,
      left: -4,
      right: -4,
      bottom: -4,
      border: `2px solid ${theme.accent.primary}`,
      borderRadius: "50%",
      zIndex: 1,
      background: `radial-gradient(ellipse at top, transparent 60%, rgba(0, 0, 0, 0.2) 100%)`,
    },
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: `linear-gradient(to bottom, transparent 65%, rgba(0, 0, 0, 0.3) 100%)`,
      pointerEvents: "none",
      zIndex: 3,
    },
    "@media (max-width:1200px)": {
      width: '80px',
      height: '80px',
    }
  },
  winnerName: {
    color: theme.text.primary,
    fontSize: '20px',
    fontWeight: '600',
    "@media (max-width:1200px)": {
      fontSize: '16px',
    }
  },
  winnerAmount: {
    color: theme.green,
    fontSize: '18px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    '& img': {
      width: '16px',
      height: '16px',
    },
    "@media (max-width:1200px)": {
      fontSize: '14px',
      '& img': {
        width: '14px',
        height: '14px',
      }
    }
  },
  finalTotal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) !important',
    padding: '48px 64px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
    zIndex: 20,
    minWidth: '480px',
    overflow: 'visible',
    "@media (max-width:1200px)": {
      padding: '32px 16px',
      gap: '16px',
      minWidth: 'auto',
      width: '90%',
    }

  },
  finalTotalBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: '600px', // Ensure the canvas has enough width for the effect
    minHeight: '500px', // Ensure the canvas has enough height for the effect
    borderRadius: '12px',
    zIndex: -1,
    "@media (max-width:1200px)": {
      minWidth: '300px',
      maxWidth: '300px',
      minHeight: '300px',
      maxHeight: '300px',
    }
  },
  finalAmountContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.text.secondary,
    "@media (max-width:1200px)": {
      fontSize: '14px',
    }
  },
  totalAmount: {
    fontSize: '34px',
    fontWeight: '600',
    color: theme.text.primary,
    display: 'flex',  
    alignItems: 'center',
    gap: '8px',
    "@media (max-width:1200px)": {
      fontSize: '24px',
      gap: '4px',
    }
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    maxWidth: '300px',
    "@media (max-width:1200px)": {
      gap: '8px',
      maxWidth: '100%',
    }
  },
  buttonRow: {
    display: 'flex',
    gap: '8px',
    width: '100%',
  },
}));

const getRadialGradient = (color) => {
  switch (color) {
    case 'gold':
      return 'radial-gradient(circle, rgba(196, 167, 7, 0.25), transparent 75%)';
    case 'red':
      return 'radial-gradient(circle, rgba(237, 27, 91, 0.25), transparent 75%)';
    case 'purple':
      return 'radial-gradient(circle, rgba(147, 51, 234, 0.25), transparent 75%)';
    case 'blue':
      return 'radial-gradient(circle, rgba(27, 149, 237, 0.25), transparent 75%)';
    case 'white':
      return 'radial-gradient(circle, rgba(141, 155, 172, 0.25), transparent 75%)';
    default:
      return 'none';
  }
};

const SpinnerItem = React.memo(({ item, isActive, isSpinning, playerIndex, playingBigSpin, onBigSpinComplete, isMobile }) => {
  const classes = useStyles();

  useEffect(() => {
    // No effect logging needed
  }, [item, isActive, isSpinning, playingBigSpin]);

  if (!item || !item.item) {
    return null;
  }

  // Only render big spin animation for active items
  const shouldPlayBigSpin = item.isBigSpin && isActive && playingBigSpin;

  return (
    <motion.div 
      className={`${classes.item} ${isActive ? classes.activeItem : ""}`}
      animate={{
        transform: isActive ? 'scale(1.30)' : 'scale(1)',
        opacity: isActive ? 1 : 0.5,
        transition: 'transform 0.25s ease-in-out'
      }}
    >
      {item.isBigSpin ? (
        <BigSpinSprite 
          shouldPlayBigSpin={shouldPlayBigSpin}
          playingBigSpin={playingBigSpin}
          onAnimationComplete={onBigSpinComplete}
          isMobile={isMobile}
        />
      ) : (
        <>
          <motion.img 
            src={item?.item?.image} 
            alt={item?.item?.name}
            className={classes.itemImage}
            style={{ 
              background: getRadialGradient(item.color),
            }}
            animate={isActive && !isSpinning ? { y: [0, -10, 0] } : {}}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          />
          {isActive && !isSpinning && (
            <>
              <motion.div 
                className={classes.itemName}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {item?.item?.name}
              </motion.div>
              <motion.div 
                className={classes.itemPrice}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                ${item?.item?.amountFixed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
});

const battlesGetItemsFormated = (box, items) => {
  if (!box || !items) return [];
  
  return items.map(item => {
    if (!item) return null;
    
    const casePrice = box.amount;
    const itemPrice = item.item?.amountFixed || 0;
    const ratio = itemPrice / casePrice;

    // Determine color based on ratio
    let color;
    if(ratio >= 9) {
      color = 'gold';
    } else if(ratio >= 5) {
      color = 'red';
    } else if(ratio >= 1.8) {
      color = 'purple';
    } else if(ratio >= 0.8) {
      color = 'blue';
    } else {
      color = 'white';
    }

    // Return new object with color property
    return { ...item, color };
  }).filter(Boolean);
};

const SpinnerContent = React.memo(({ 
  player, 
  index, 
  gameState, 
  isCreator, 
  handleCallBots, 
  handleJoinBattle, 
  spinnerItems, 
  playingBigSpin,
  isMobile
}) => {
  const classes = useStyles();

  if (gameState === "completed") {
    return null;
  }

  if (player._id) {
    return (
      <div 
        className={`${classes.spinner} ${playingBigSpin[index] ? classes.spinnerBigSpin : ''} spinner-${index}`}
        style={gameState === "created" ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
      >
        {gameState === "created" && 
          <div className={classes.statusContainer}>
            <div className={classes.statusText}>Ready</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none"><path d="M7.87503 18.367L2.44128 12.9333L4.91753 10.457L7.87503 13.4233L16.52 4.76953L18.9963 7.24578L7.87503 18.367Z" fill="#337fde" /></svg>
          </div>
        }
        <div className={classes.itemsTrack}>
          {spinnerItems[index]}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${classes.spinner} ${playingBigSpin[index] ? classes.spinnerBigSpin : ''} spinner-${index}`} 
      style={gameState === "created" ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
    >
      {gameState === "created" && 
        <div className={classes.statusContainer}>
          <div className={classes.statusText}>Awaiting Player</div>
          <CircularProgress size={22} sx={{ color: "#337fde" }} />
          {isCreator ? (
            <PrimaryButton
              label="Call Bots"
              onClick={handleCallBots}
              style={{ padding: isMobile ? "4px 12px" : "6px 16px", fontSize: isMobile ? 12 : 14, marginTop: 16 }}
            />
          ) : (
            <PrimaryButton
              label="Join Battle"
              onClick={() => handleJoinBattle(index)}
              style={{ padding: isMobile ? "4px 12px" : "6px 16px", fontSize: isMobile ? 12 : 14, marginTop: 16 }}
            />
          )}
        </div>
      }
      <div className={classes.itemsTrack}>
        {spinnerItems[index]}
      </div>
    </div>
  );
});

const WinningNumber = React.memo(({ totalAmount, isWinner }) => {
  const classes = useStyles();
  const [currentValue, setCurrentValue] = useState(0);
  const { playCountup } = useSound();

  useEffect(() => {
    let startTime = null;
    let animationFrame;
    playCountup();

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / 2300;

      if (progress < 1) {
        const nextValue = Math.min(totalAmount * progress, totalAmount);
        setCurrentValue(nextValue);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCurrentValue(totalAmount);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [totalAmount, playCountup]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div className={classes.winningNumberContainer}>
        <motion.div 
          className={classes.winningNumber}
          initial={{ scale: 1, opacity: 1 }}
          animate={{ 
            scale: [1, isWinner ? 1.2 : 0.8],
            opacity: [1, isWinner ? 1 : 0.5],
          }}
          transition={{ 
            duration: 0.3,
            delay: 3.25,
          }}
        >
          ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </motion.div>
      </div>
    </div>
  );
});

const animateWithRequestAnimationFrame = (element, targetY, duration, easing = 'easeInOut', startTime = performance.now(), startY = 0) => {
  const start = startTime;
  const currentStartY = startY || parseFloat(element.style.transform.replace('translateY(', '').replace('px)', '')) || 0;
  
  // Easing functions
  const easings = {
    easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    linear: (t) => t
  };

  const animate = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easings[easing](progress);
    
    const currentY = currentStartY + (targetY - currentStartY) * easedProgress;
    element.style.transform = `translateY(${currentY}px)`;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

const resetSpinWithRequestAnimationFrame = (element, targetY, duration) => {
  const startY = parseFloat(element.style.transform.replace('translateY(', '').replace('px)', '')) || 0;
  const startTime = performance.now();
  
  const animate = (timestamp) => {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const newY = startY + (targetY - startY) * progress;
    element.style.transform = `translateY(${newY}px)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Force reflow to ensure final position
      void element.offsetHeight;
    }
  };
  
  requestAnimationFrame(animate);
};

const calculateCurrentPosition = (startY, targetY, elapsed, duration, easing = 'easeInOut') => {
  const progress = Math.min(elapsed / duration, 1);
  
  const easings = {
    easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    linear: (t) => t
  };
  
  const easedProgress = easings[easing](progress);
  return startY + (targetY - startY) * easedProgress;
};

/**
 * Resumes animation from where it would have been based on elapsed time since start
 * @param {Object} element - DOM element to animate
 * @param {number} targetY - Final Y position of animation
 * @param {number} totalDuration - Total animation duration in ms
 * @param {string} animationId - Unique ID to identify this animation in storage
 * @param {string} easing - Easing function to use
 * @param {number} startY - Starting Y position
 * @returns {Object} - Control object with cancel method
 */
const resumeAnimationFromTimestamp = (element, targetY, totalDuration, animationId, easing = 'easeInOut', startY = 0) => {
  // Get stored animation data from localStorage
  let animationData;
  try {
    animationData = JSON.parse(localStorage.getItem(`animation_${animationId}`));
  } catch (e) {
    animationData = null;
  }
  
  // Current timestamp
  const now = performance.now();
  
  // If we have stored data and it's for the same animation
  if (animationData && animationData.id === animationId) {
    // Calculate elapsed time since original start
    const elapsedSinceStart = now - animationData.startTime;
    
    // If animation should be complete already
    if (elapsedSinceStart >= totalDuration) {
      // Just set to final position immediately
      element.style.transform = `translateY(${targetY}px)`;
      // Clean up storage
      localStorage.removeItem(`animation_${animationId}`);
      return { 
        cancel: () => {},
        isComplete: true
      };
    }
    
    // Calculate where we should be in the animation
    const currentPosition = calculateCurrentPosition(startY, targetY, elapsedSinceStart, totalDuration, easing);
    
    // Set initial position to calculated point
    element.style.transform = `translateY(${currentPosition}px)`;
    
    // Continue animation from this point for remaining duration
    const remainingDuration = totalDuration - elapsedSinceStart;
    
    // Animate the rest of the way
    let animationFrame;
    const startTimestamp = now;
    
    const animate = (timestamp) => {
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / remainingDuration, 1);
      
      // Apply easing to remaining animation
      const easings = {
        easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        linear: (t) => t
      };
      
      const easedProgress = easings[easing](progress);
      const currentY = currentPosition + (targetY - currentPosition) * easedProgress;
      
      element.style.transform = `translateY(${currentY}px)`;
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Clean up storage when complete
        localStorage.removeItem(`animation_${animationId}`);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return {
      cancel: () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          localStorage.removeItem(`animation_${animationId}`);
        }
      },
      isComplete: false
    };
  } else {
    // No valid stored data, start fresh animation and store start time
    const animationStartData = {
      id: animationId,
      startTime: now,
      totalDuration,
      startY,
      targetY
    };
    
    // Store animation data
    localStorage.setItem(`animation_${animationId}`, JSON.stringify(animationStartData));
    
    // Start normal animation
    let animationFrame;
    const startTimestamp = now;
    
    const animate = (timestamp) => {
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      const easings = {
        easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        linear: (t) => t
      };
      
      const easedProgress = easings[easing](progress);
      const currentY = startY + (targetY - startY) * easedProgress;
      
      element.style.transform = `translateY(${currentY}px)`;
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Clean up storage when complete
        localStorage.removeItem(`animation_${animationId}`);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return {
      cancel: () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          localStorage.removeItem(`animation_${animationId}`);
        }
      },
      isComplete: false
    };
  }
};

// Replace the bezier implementations with this one from WebKit
const cubicBezier = (p1x, p1y, p2x, p2y) => {
  // Constants for solving
  const NEWTON_ITERATIONS = 8;
  const NEWTON_MIN_SLOPE = 0.001;
  const SUBDIVISION_PRECISION = 0.0000001;
  const SUBDIVISION_MAX_ITERATIONS = 10;
  const kSplineTableSize = 11;
  const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  // Pre-calculate the polynomial coefficients
  // First and last control points are implied to be (0,0) and (1.0, 1.0)
  const ax = 3.0 * p1x - 3.0 * p2x + 1.0;
  const bx = 3.0 * p2x - 6.0 * p1x;
  const cx = 3.0 * p1x;

  const ay = 3.0 * p1y - 3.0 * p2y + 1.0;
  const by = 3.0 * p2y - 6.0 * p1y;
  const cy = 3.0 * p1y;

  // Bezier curve sample function for X axis
  const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
  
  // Bezier curve sample function for Y axis
  const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;
  
  // Bezier curve derivative sample function
  const sampleCurveDerivativeX = (t) => (3.0 * ax * t + 2.0 * bx) * t + cx;
  
  // Find the bezier curve parameter value using Newton's method
  const solveCurveX = (x) => {
    let t2 = x;
    let x2;
    let d2;
    let i;

    // First try a few iterations of Newton's method
    for (i = 0; i < NEWTON_ITERATIONS; i++) {
      x2 = sampleCurveX(t2) - x;
      if (Math.abs(x2) < SUBDIVISION_PRECISION) {
        return t2;
      }
      
      d2 = sampleCurveDerivativeX(t2);
      if (Math.abs(d2) < NEWTON_MIN_SLOPE) {
        break;
      }
      
      t2 = t2 - x2 / d2;
    }

    // If Newton's method fails, use binary subdivision
    let t0 = 0.0;
    let t1 = 1.0;
    t2 = x;

    if (t2 < t0) return t0;
    if (t2 > t1) return t1;

    while (t0 < t1) {
      x2 = sampleCurveX(t2);
      if (Math.abs(x2 - x) < SUBDIVISION_PRECISION) {
        return t2;
      }
      
      if (x > x2) {
        t0 = t2;
      } else {
        t1 = t2;
      }
      
      t2 = (t1 - t0) * 0.5 + t0;
    }

    // Failure
    return t2;
  };

  // The cubic bezier function
  return (x) => {
    // Handle special cases
    if (x === 0 || x === 1) {
      return x;
    }
    
    // Find t value for given x
    const t = solveCurveX(x);
    
    // Return y value for that t
    return sampleCurveY(t);
  };
};

// Create a specialized instance for [0.15, 0.86, 0, 1]
const specialEasing = cubicBezier(0.15, 0.86, 0, 1);

const SpinnerSection = ({ players, boxes, gameMode, playerCount, gameState, game, handleRecreate, isMobile }) => {
  const classes = useStyles({ playerCount });
  const { user } = useUser();
  const isCreator = user?._id === game.bets[0]?.user._id;
  const { playTick, playUnbox, playBigSpin } = useSound();
  const { callBots, joinBattle } = useBattles();
  const notify = useNotification();
  const navigate = useNavigate();

  // Debug mode to force selectors visible (set to false in production)
  const debugSelectors = false;

  const [spinnerItems, setSpinnerItems] = useState([]);
  const [centerIndices, setCenterIndices] = useState(Array(6).fill(NaN));
  const [rawSpinnerItems, setRawSpinnerItems] = useState([]);
  const [aniStates, setAniStates] = useState(Array(6).fill("spinning"));
  
  const [showJackpotSpinner, setShowJackpotSpinner] = useState(false);
  const [jackpotTicket, setJackpotTicket] = useState(game.fair.jackpotTicket);
  const [jackpotComplete, setJackpotComplete] = useState(false);
  const [playingBigSpin, setPlayingBigSpin] = useState(Array(6).fill(false));
  const [bigSpinTimeouts, setBigSpinTimeouts] = useState({});

  useEffect(() => {
    setJackpotTicket(game.fair.jackpotTicket);
  }, [game.fair.jackpotTicket]);
  
  const animationFrames = useRef(Array(6).fill(null));
  const mountedRef = useRef(true);
  const lastJackpotTotalRef = useRef(0);
  const startTimeRef = useRef(0);
  
  // Calculate total value of player items
  const calculateTotalValue = (items = []) => {
    return items.reduce((sum, item) => sum + (item?.item?.amountFixed || 0), 0);
  };

  // Calculate jackpot total with delayed updates
  const calculateJackpotTotal = () => {
    // For jackpot mode, only delay values during spinning/rolling
    if (gameState === 'spinning' || gameState === 'rolling') {
      // Use cached value during spin
      return lastJackpotTotalRef.current;
    }
    
    // Calculate current value immediately for completed state
    const total = players.reduce((total, player) => {
      return total + player.items.reduce((sum, item) => sum + (item?.item?.amountFixed || 0), 0);
    }, 0);
    
    lastJackpotTotalRef.current = total; // Update cache
    return total;
  };

  // Call bots
  const handleCallBots = async () => {
    try {
      const res = await callBots(game._id);
    } catch (error) {
    }
  };

  // Join battle
  const handleJoinBattle = async (index) => {
    try {
      const res = await joinBattle(game._id, index);
    } catch (error) {
    }
  };

  // Some insane math I cooked up
  const calculateCenterIndex = (yPosition, slotIndex) => {
    const totalItems = 30;
    const visibleItemHeight = isMobile ? 100 : 132;
    const containerHeight = isMobile ? 400 : 496;
    
    const passedItemCount = Math.abs(Math.floor(yPosition / visibleItemHeight));
    const centerIndex = passedItemCount + Math.floor(containerHeight / (2 * visibleItemHeight));
    const newIndex = Math.min(Math.max(centerIndex, 0), totalItems - 1);
    
    // Only update if the index has actually changed
    setCenterIndices(prev => {
      if (prev[slotIndex] === newIndex) return prev;
      
      // Play tick sound only when index actually changes and game is rolling
      if (gameState === "rolling") {
        playTick();
      }
      
      const newIndices = [...prev];
      newIndices[slotIndex] = newIndex;
      return newIndices;
    });
  };

  // Calculate remaining animation duration based on game.updatedAt
  const calculateRemainingDuration = () => {
    if (!game?.updatedAt) return 5.5; // Default duration if no timestamp
    
    const currentTime = Date.now();
    const timeSinceUpdate = (currentTime - game.updatedAt) / 1000; // Convert to seconds
    const totalAnimationDuration = 5.5; // Base animation duration
    
    // Calculate remaining duration
    const remainingDuration = Math.max(0, totalAnimationDuration - timeSinceUpdate);
    
    // If more than total duration has passed, return 0
    if (remainingDuration <= 0) return 0;
    
    return remainingDuration;
  };

  // Helper to check if item is a bigspin
  const isBigSpinItem = (item, boxAmount) => {
    if (!item?.item?.amountFixed || !boxAmount) return false;
    const ratio = item.item.amountFixed / boxAmount;
    return ratio >= 2.4; // Typically items with ratio >= 2.4 are considered big spins
  };

  // STEP 2: After spritesheet animation completes, start the spinner animation
  const handleBigSpinComplete = (slotIndex, bigSpinSlots) => {
    // Turn off the big spin spritesheet animation
    setPlayingBigSpin(prev => {
      const newStates = [...prev];
      newStates[slotIndex] = false;
      return newStates;
    });

    // Set animation state to spinning immediately
    setAniStates(prev => {
      const newStates = [...prev];
      newStates[slotIndex] = "spinning";
      return newStates;
    });

    // Prepare high-value items for this slot
    const slotData = bigSpinSlots.find(s => s.slotIndex === slotIndex);
    if (!slotData) return;

    const { item } = slotData;
    const roundIndex = game.bets[0].outcomes.length - 1;
    const slotSeed = `${game._id}-bigspin-${roundIndex}-${slotIndex}`;
    const slotRNG = seedrandom(slotSeed);
    
    // Generate array of 30 high-value items for the slot
    const bigSpinItems = Array(30).fill(null).map((_, pos) => {
      // Position 24 is reserved for the actual outcome item
      if (pos === 24) {
        return item.item.originalItem;
      }
      
      // Generate high-value items for the big spin
      const highValueItems = boxes[roundIndex].items.filter(boxItem => {
        if (!boxItem || !boxItem.item) return false;
        const ratio = boxItem.item.amountFixed / boxes[roundIndex].amount;
        return ratio >= 2.4;
      });

      if (highValueItems.length === 0) {
        // Fallback to any items if no high value items found
        const allItems = boxes[roundIndex].items;
        const randomIndex = Math.floor(slotRNG() * allItems.length);
        return battlesGetItemsFormated(boxes[roundIndex], [allItems[randomIndex]])[0] || null;
      }

      const randomIndex = Math.floor(slotRNG() * highValueItems.length);
      const randomItem = highValueItems[randomIndex];
      return battlesGetItemsFormated(boxes[roundIndex], [randomItem])[0] || null;
    }).filter(Boolean);

    // Update raw spinner items for this slot
    setRawSpinnerItems(prev => {
      const newItems = [...prev];
      newItems[slotIndex] = bigSpinItems;
      return newItems;
    });

    // Start the spinner animation immediately
    const spinnerTrackElement = document.querySelector(`.spinner-${slotIndex} .${classes.itemsTrack}`);
    if (!spinnerTrackElement) {
      return;
    }

    // Reset transform to 0 to prevent glitches
    spinnerTrackElement.style.transform = 'translateY(0px)';
    
    // Generate random pixel offset just like normal spin
    const randomPixelValue = Math.floor(slotRNG() * 110) - 50;
    
    // Store animation start data
    const animationId = `game_${game._id}_bigspin_${slotIndex}`;
    const animationStartData = {
      id: animationId,
      startTime: performance.now(),
      totalDuration: 5500, // 5.5 seconds in ms
      startY: 0,
      targetY: isMobile ? -2250 : -2980 + randomPixelValue
    };
    localStorage.setItem(`animation_${animationId}`, JSON.stringify(animationStartData));
    
    // Start the animation immediately
    const startTime = performance.now();
    
    const animate = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / 5500, 1);
      const easedProgress = specialEasing(progress);
      
      const currentY = easedProgress * (isMobile ? -2250 : -2980 + randomPixelValue);
      spinnerTrackElement.style.transform = `translateY(${currentY}px)`;
      
      // Update center index
      calculateCenterIndex(currentY, slotIndex);
      
      if (progress < 1) {
        animationFrames.current[slotIndex] = requestAnimationFrame(animate);
      } else {
        // Animation complete, set up bounce reset
        // Second animation - slight bounce adjustment to align exactly with outcome
        const secondAnimationId = `${animationId}_second`;
        const secondAnimationData = {
          id: secondAnimationId,
          startTime: performance.now(),
          totalDuration: 250,
          startY: isMobile ? -2250 + randomPixelValue : -2980 + randomPixelValue,
          targetY: isMobile ? -2250 : -2980
        };
        localStorage.setItem(`animation_${secondAnimationId}`, JSON.stringify(secondAnimationData));
        
        // Start second animation immediately without delay
        const secondStartTime = performance.now();
        
        const animateSecond = (timestamp) => {
          const secondElapsed = timestamp - secondStartTime;
          const secondProgress = Math.min(secondElapsed / 250, 1);
          
          const startPos = isMobile ? -2250 + randomPixelValue : -2980 + randomPixelValue;
          const endPos = isMobile ? -2250 : -2980;
          const currentY = startPos + secondProgress * (endPos - startPos);
          
          spinnerTrackElement.style.transform = `translateY(${currentY}px)`;
          
          // Update center index
          calculateCenterIndex(currentY, slotIndex);
          
          if (secondProgress < 1) {
            animationFrames.current[slotIndex] = requestAnimationFrame(animateSecond);
          } else {
            // Clean up storage when complete
            localStorage.removeItem(`animation_${animationId}`);
            localStorage.removeItem(`animation_${secondAnimationId}`);
            
            // Mark animation as finished
            setAniStates(prev => {
              const newStates = [...prev];
              newStates[slotIndex] = "finished";
              return newStates;
            });

            // Play a sound for completing the big spin
            playUnbox();
          }
        };
        
        animationFrames.current[slotIndex] = requestAnimationFrame(animateSecond);
      }
    };
    
    // Start the animation with RAF immediately
    animationFrames.current[slotIndex] = requestAnimationFrame(animate);
  };

  // Centralized function to handle big spin animations for multiple slots
  const handleBigSpinAnimation = (bigSpinSlots) => {
    playBigSpin();
    
    // Clear any existing timeouts for all slots
    bigSpinSlots.forEach(({ slotIndex }) => {
      if (bigSpinTimeouts[slotIndex]) {
        clearTimeout(bigSpinTimeouts[slotIndex]);
      }
      
      // Cancel any running animations
      if (animationFrames.current[slotIndex]) {
        cancelAnimationFrame(animationFrames.current[slotIndex]);
        animationFrames.current[slotIndex] = null;
      }
    });

    // STEP 1: Mark slots as playing big spin to show the sprite animation first
    setPlayingBigSpin(prev => {
      const newStates = [...prev];
      bigSpinSlots.forEach(({ slotIndex }) => {
        newStates[slotIndex] = true;
      });
      return newStates;
    });

    // Update spinner items to include the onBigSpinComplete callback with bigSpinSlots
    setSpinnerItems(prev => {
      return prev.map((itemList, index) => {
        // Only update callbacks for slots that have big spins
        const hasBigSpin = bigSpinSlots.some(slot => slot.slotIndex === index);
        
        return itemList.map((item, itemIndex) => {
          const isActive = itemIndex === centerIndices[index];
          return (
            <SpinnerItem
              key={`${item?._id || `item-${index}-${itemIndex}`}-${index}-${itemIndex}`}
              item={item}
              isActive={isActive}
              isSpinning={aniStates[index] !== "finished"}
              playerIndex={index}
              playingBigSpin={playingBigSpin[index]}
              onBigSpinComplete={() => {
                // Use the more specific callback with bigSpinSlots for slots with big spins
                if (hasBigSpin) {
                  handleBigSpinComplete(index, bigSpinSlots);
                } else {
                  handleBigSpinComplete(index);
                }
              }}
            />
          );
        });
      });
    });
  };

  // Main round handler for new rounds
  useEffect(() => {
    if(["waiting", "countdown", "pending", "completed"].includes(gameState)) return;
    const roundIndex = game.bets[0].outcomes.length - 1;

    if(roundIndex < 0) return;
    
    // Reset ALL animation states to spinning at start of round
    setAniStates(Array(6).fill("spinning"));
    
    const playerOutcomeItems = players.map((player, slotIndex) => {
      const slotSeed = `${game._id}-${roundIndex}-${slotIndex}`;
      const slotRNG = seedrandom(slotSeed);
      
      const itemsList = Array(30).fill(null).map((_, index) => {
        // Check if this is the outcome position (24)
        if (index === 24) {
          const outcomeItem = player.items[game.bets[0].outcomes.length - 1];
          // If the outcome is a bigspin item, replace its display with bigspin icon
          if (game.options.bigSpin && isBigSpinItem(outcomeItem, boxes[roundIndex].amount)) {
            return {
              item: {
                name: "Big Spin",
                image: bigSpinIcon,
                amountFixed: outcomeItem.item.amountFixed,
                originalItem: outcomeItem // Store original item for later
              },
              color: 'gold',
              isBigSpin: true
            };
          }
          return outcomeItem;
        }

        // Regular item generation logic...
        let availableItems = boxes[roundIndex].items;
        if (game.options.bigSpin) {
          availableItems = availableItems.filter(item => {
            const ratio = item.item.amountFixed / boxes[roundIndex].amount;
            return ratio < 2.4;
          });

          // Only show big spin icons in non-outcome positions at 5% rate
          if (slotRNG() < 0.05) {
            return {
              item: {
                name: "Big Spin",
                image: bigSpinIcon,
                amountFixed: boxes[roundIndex].amount * 2.5 // Approximate value
              },
              color: 'gold',
              isBigSpin: true
            };
          }
        }

        const weightedItems = availableItems.flatMap(item => 
          Array(Math.floor((item.tickets / 100000) * 30)).fill(item)
        );
        
        const randomIndex = Math.floor(slotRNG() * weightedItems.length);
        const randomItem = weightedItems[randomIndex];
        const formattedItem = battlesGetItemsFormated(
          boxes[roundIndex], 
          [randomItem]
        )?.[0] || null;
        return formattedItem;
      }).filter(Boolean);

      return itemsList;
    });

    setRawSpinnerItems(playerOutcomeItems);
    setSpinnerItems(playerOutcomeItems.map((itemList, index) => {
      return itemList.map((item, itemIndex) => {
        const isActive = itemIndex === centerIndices[index]; 
        return ( 
          <SpinnerItem
            key={`${item?._id || `item-${index}-${itemIndex}`}-${index}-${itemIndex}`}
            item={item}
            isActive={isActive}
            isSpinning={aniStates[index] !== "finished"}
            playerIndex={index}
            playingBigSpin={playingBigSpin[index]}
            onBigSpinComplete={() => handleBigSpinComplete(index)}
            isMobile={isMobile}
          />
        );
      });
    }));

    // Cancel any existing animations
    animationFrames.current.forEach((frame, index) => {
      if (frame) {
        cancelAnimationFrame(frame);
        animationFrames.current[index] = null;
      }
    });
    
    // Reset all spinner tracks
    players.forEach((_, index) => {
      const spinnerTrackElement = document.querySelector(`.spinner-${index} .${classes.itemsTrack}`);
      if (spinnerTrackElement) {
        spinnerTrackElement.style.transform = 'translateY(0px)';
      }
    });
    
    const roundSeed = `${game._id}-${roundIndex}`;
    const roundRNG = seedrandom(roundSeed);
    const randomPixelValue = Math.floor(roundRNG() * 110) - 50;
    const duration = calculateRemainingDuration();
    
    if (duration === 0) {
      // Instantly set all spinners to final position if duration is 0
      players.forEach((_, index) => {
        const spinnerTrackElement = document.querySelector(`.spinner-${index} .${classes.itemsTrack}`);
        if (spinnerTrackElement) {
          spinnerTrackElement.style.transform = isMobile ? 'translateY(-2250px)' : 'translateY(-2980px)';
        }
        
        setAniStates(prev => {
          const newStates = [...prev];
          newStates[index] = "finished";
          return newStates;
        });
      });
      
      const hasBigSpin = playerOutcomeItems.some(itemList => {
        const outcomeItem = itemList[24];
        return outcomeItem?.isBigSpin;
      });
    
      return;
    }

    // Start all spinners together using requestAnimationFrame
    players.forEach((_, index) => {
      const spinnerTrackElement = document.querySelector(`.spinner-${index} .${classes.itemsTrack}`);
      if (!spinnerTrackElement) return;
      
      // Store animation data
      const animationId = `game_${game._id}_round_${roundIndex}_player_${index}`;
      const animationStartData = {
        id: animationId,
        startTime: performance.now(),
        totalDuration: duration * 1000, // Convert to ms
        startY: 0,
        targetY: isMobile ? -2250 + randomPixelValue : -2980 + randomPixelValue
      };
      localStorage.setItem(`animation_${animationId}`, JSON.stringify(animationStartData));
      
      // Use the specialized bezier function 
      const startTime = performance.now();
      
      const animate = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        // Use the specialized bezier function 
        const easedProgress = specialEasing(progress);
        
        const currentY = easedProgress * (isMobile ? -2250 + randomPixelValue : -2980 + randomPixelValue);
        spinnerTrackElement.style.transform = `translateY(${currentY}px)`;
        
        // Update center index
        calculateCenterIndex(currentY, index);
        
        if (progress < 1) {
          animationFrames.current[index] = requestAnimationFrame(animate);
        } else {
          // First animation complete
          setTimeout(() => {
            setAniStates(prev => {
              const newStates = [...prev];
              newStates[index] = "finished";
              
              // Check if any outcome is a big spin before playing unbox sound
              const hasBigSpin = playerOutcomeItems.some(itemList => {
                const outcomeItem = itemList[24]; // The outcome position
                return outcomeItem?.isBigSpin;
              });

              // Only play unbox sound when all spinners are finished and there's no big spin
              if (["rolling"].includes(gameState) && newStates.every(state => state === "finished") && !hasBigSpin) {
                playUnbox();
              }
              return newStates;
            });
            
            // Second animation - slight bounce adjustment
            const secondAnimationId = `${animationId}_second`;
            const secondAnimationData = {
              id: secondAnimationId,
              startTime: performance.now(),
              totalDuration: 250,
              startY: isMobile ? -2250 + randomPixelValue : -2980 + randomPixelValue,
              targetY: isMobile ? -2250 : -2980
            };
            localStorage.setItem(`animation_${secondAnimationId}`, JSON.stringify(secondAnimationData));
            
            // Start second animation
            const secondStartTime = performance.now();
            
            const animateSecond = (timestamp) => {
              const secondElapsed = timestamp - secondStartTime;
              const secondProgress = Math.min(secondElapsed / 250, 1);
              
              const startPos = isMobile ? -2250 + randomPixelValue : -2980 + randomPixelValue;
              const endPos = isMobile ? -2250 : -2980;
              const currentY = startPos + secondProgress * (endPos - startPos);
              
              spinnerTrackElement.style.transform = `translateY(${currentY}px)`;
              
              // Update center index
              calculateCenterIndex(currentY, index);
              
              if (secondProgress < 1) {
                animationFrames.current[index] = requestAnimationFrame(animateSecond);
              } else {
                // Clean up storage when complete
                localStorage.removeItem(`animation_${animationId}`);
                localStorage.removeItem(`animation_${secondAnimationId}`);
              }
            };
            
            animationFrames.current[index] = requestAnimationFrame(animateSecond);
          }, 250);
        }
      };
      
      animationFrames.current[index] = requestAnimationFrame(animate);
    });
  }, [game, boxes, gameState, classes.itemsTrack]);

  // Update the center index effect to play tick only on actual changes
  useEffect(() => {
    const updatedSpinnerItems = rawSpinnerItems.map((itemList, playerIndex) => {
      return itemList.map((item, itemIndex) => {
        const isActive = itemIndex === centerIndices[playerIndex];
        const isSpinning = aniStates[playerIndex] !== "finished";
        
        return (
          <SpinnerItem
            key={`${item?._id || `item-${playerIndex}-${itemIndex}`}-${playerIndex}-${itemIndex}`}
            item={item}
            isActive={isActive}
            isSpinning={isSpinning}
            playerIndex={playerIndex}
            playingBigSpin={playingBigSpin[playerIndex]}
            onBigSpinComplete={() => handleBigSpinComplete(playerIndex)}
            isMobile={isMobile}
          />
        );
      });
    });
    setSpinnerItems(updatedSpinnerItems);
  }, [centerIndices, aniStates, playingBigSpin]);

  useEffect(() => {
    if (gameState === "completed" && !game.options.jackpot) {
      // Only show final amount for non-jackpot games
      setTimeout(() => setShowFinalAmount(true), 4000);
    }
  }, [gameState]);

  const renderSpinnerContent = (player, index) => {
    const isCreator = user?._id === game.bets[0]?.user._id;
    
    if (gameState === "completed" && !game.options.jackpot && !showFinalAmount) {
      const teamPlayers = getTeamPlayers(gameMode === 'team' ? Math.floor(index / (playerCount / 2)) : index);
      const isTeam = gameMode === 'team';
      
      if (isTeam && index % (playerCount / 2) !== 0) return null;

      const isWinner = isTeam ? isTeamWinner(teamPlayers) : player.payout > 0;
      const totalAmount = isTeam ? calculateTeamTotal(teamPlayers) : player.items.reduce((sum, item) => sum + (item?.item?.amountFixed || 0), 0);

      return (
        <WinningNumber
          totalAmount={totalAmount}
          isWinner={isWinner}
        />
      );
    }

    if (player._id) {
      return (
        <div 
          className={`${classes.spinner} ${playingBigSpin[index] ? classes.spinnerBigSpin : ''} spinner-${index}`}
          style={gameState === "created" ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
        >
          {gameState === "created" && 
            <div className={classes.statusContainer}>
              <div className={classes.statusText}>Ready</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none"><path d="M7.87503 18.367L2.44128 12.9333L4.91753 10.457L7.87503 13.4233L16.52 4.76953L18.9963 7.24578L7.87503 18.367Z" fill="#337fde" /></svg>
            </div>
          }
          <div className={classes.itemsTrack}>
            {spinnerItems[index]}
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`${classes.spinner} ${playingBigSpin[index] ? classes.spinnerBigSpin : ''} spinner-${index}`} 
        style={gameState === "created" ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
      >
        {gameState === "created" && 
          <div className={classes.statusContainer}>
            <div className={classes.statusText}>Awaiting Player</div>
            <CircularProgress size={22} sx={{ color: "#337fde" }} />
            {isCreator ? (
              <PrimaryButton
                label="Call Bots"
                onClick={handleCallBots}
                style={{ padding: "6px 16px", fontSize: 14, marginTop: 16 }}
              />
            ) : (
              <PrimaryButton
                label="Join Battle"
                onClick={() => handleJoinBattle(index)}
                style={{ padding: "6px 16px", fontSize: 14, marginTop: 16 }}
              />
            )}
          </div>
        }
        <div className={classes.itemsTrack}>
          {spinnerItems[index]}
        </div>
      </div>
    );
  };

  const shouldShowSwordIcon = (index, gameMode, playerCount) => {
    if (gameState !== "rolling") return false;

    if (gameMode === 'team') {
      return (playerCount === 4 && index === 1) || (playerCount === 6 && index === 2);
    }
    return index < playerCount - 1;
  };

  const calculateTeamTotal = (teamPlayers) => {
    return teamPlayers.reduce((total, player) => {
      const playerTotal = player.items.reduce((sum, item) => sum + (item?.item?.amountFixed || 0), 0);
      return total + (playerTotal || 0);
    }, 0);
  };

  const isTeamWinner = (teamPlayers) => {
    return teamPlayers.some(player => player.payout > 0);
  };

  const [showFinalAmount, setShowFinalAmount] = useState(false);

  const handleEditBattle = () => {
    navigate('/box-battles/create', { 
      state: {
        previousSettings: {
          playerCount: game.playerCount,
          mode: game.mode,
          boxes: game.boxes.map(b => ({
            box: b.box,
            count: b.count
          })),
          options: game.options
        }
      }
    });
  };

  // Check for big spins and trigger animations
  useEffect(() => {    
    // Only proceed if all spinners are finished
    if (!aniStates.every(state => state === "finished")) return;
    
    // Only check once per round
    const roundIndex = game.bets[0].outcomes.length - 1;
    if (roundIndex < 0) return;

    const bigSpinSlots = [];
    
    players.forEach((_, slotIndex) => {      
      // Only check slots that aren't already playing big spin
      if (centerIndices[slotIndex] === 24 && !playingBigSpin[slotIndex]) {
        const items = rawSpinnerItems[slotIndex];
        if (!items) {
          console.error(`No items found for slot ${slotIndex}`);
          return;
        }
        
        const item = items[centerIndices[slotIndex]];
        console.log(`Checking item at center index for slot ${slotIndex}:`, item);
        
        if (item?.isBigSpin && item?.item?.originalItem) {
          console.log(`Found big spin item at slot ${slotIndex}:`, item);
          bigSpinSlots.push({ slotIndex, item });
        }
      }
    });

    // If we found any big spins, handle them all at once
    if (bigSpinSlots.length > 0) {
      console.log('Found big spin slots to animate:', bigSpinSlots);
      handleBigSpinAnimation(bigSpinSlots);
    }

    return () => {
      // Clean up timeouts
      Object.values(bigSpinTimeouts).forEach(timeoutId => {
        if (timeoutId) clearTimeout(timeoutId);
      });
    };
  }, [aniStates, centerIndices, rawSpinnerItems, playingBigSpin]);

  // Add specific effect to detect big spins after spinner animations complete
  useEffect(() => {
    // Skip if game is completed or we don't have players
    if (gameState === "completed" || !players.length) return;
    
    // For each player slot, check if animation is finished and we need to trigger big spin
    players.forEach((_, slotIndex) => {
      // Only check slots that aren't already playing big spin and have finished animation
      if (aniStates[slotIndex] === "finished" && !playingBigSpin[slotIndex]) {
        // Check what item is at the center position (should be 24 for outcome position)
        const centerItem = rawSpinnerItems[slotIndex]?.[centerIndices[slotIndex]];
        
        if (centerItem?.isBigSpin) {
          // Mark this slot as playing big spin to start the animation
          setPlayingBigSpin(prev => {
            const newStates = [...prev];
            newStates[slotIndex] = true;
            return newStates;
          });
          
          // Play big spin sound
          playBigSpin();
        }
      }
    });
  }, [aniStates, rawSpinnerItems, centerIndices, playingBigSpin, gameState, players.length]);

  // Add extra timeout in case onLoopComplete doesn't fire properly
  useEffect(() => {
    // Look for slots that are playing big spin but haven't started normal spinning yet
    players.forEach((_, slotIndex) => {
      if (playingBigSpin[slotIndex] && aniStates[slotIndex] !== "spinning") {
        // Set a backup timeout to force transition to spinning state if spritesheet animation doesn't complete
        const timeoutId = setTimeout(() => {
          // Find any big spin slots data
          const bigSpinSlotsData = players.map((_, i) => {
            const items = rawSpinnerItems[i];
            if (!items) return null;
            
            const item = items[centerIndices[i]];
            if (item?.isBigSpin && item?.item?.originalItem) {
              return { slotIndex: i, item };
            }
            return null;
          }).filter(Boolean);
          
          // Force the handleBigSpinComplete to run
          if (aniStates[slotIndex] !== "spinning" && playingBigSpin[slotIndex]) {
            handleBigSpinComplete(slotIndex, bigSpinSlotsData);
          }
        }, 2250); // 3 seconds should be enough for the spritesheet animation
        
        // Store the timeout ID for cleanup
        setBigSpinTimeouts(prev => ({
          ...prev,
          [slotIndex]: timeoutId
        }));
      }
    });
    
    // Cleanup on unmount
    return () => {
      Object.values(bigSpinTimeouts).forEach(timeoutId => {
        if (timeoutId) clearTimeout(timeoutId);
      });
    };
  }, [playingBigSpin, aniStates]);

  // Set up game state tracking and update start time for delay calculations
  useEffect(() => {
    if (gameState === 'spinning' || gameState === 'rolling') {
      startTimeRef.current = Date.now();
      
      // Cache the previous round total when starting a new spin
      if (game.bets[0]?.outcomes.length > 1) {
        // Calculate based on previous rounds only (length - 1)
        const previousTotal = players.reduce((total, player) => {
          const previousItems = player.items.slice(0, game.bets[0].outcomes.length - 1);
          return total + previousItems.reduce((sum, item) => sum + (item?.item?.amountFixed || 0), 0);
        }, 0);
        
        lastJackpotTotalRef.current = previousTotal;
      }
    }
  }, [gameState, game.bets, players]);

  // Add a state variable for countdown
  const [countdownNumber, setCountdownNumber] = useState(3);
  
  // Add missing functions
  const getTeamPlayers = (teamIndex) => {
    if (gameMode === 'team') {
      const playersPerTeam = playerCount / 2;
      return players.slice(teamIndex * playersPerTeam, (teamIndex + 1) * playersPerTeam);
    }
    return [players[teamIndex]];
  };
  
  const handleJackpotComplete = () => {
    setShowJackpotSpinner(false);
    setJackpotComplete(true);
  };
  
  // Add countdown effect
  useEffect(() => {
    if (gameState === "countdown") {
      setCountdownNumber(3);
      const interval = setInterval(() => {
        setCountdownNumber(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.backgroundImage} />
      <div className={classes.root}>
        <AnimatePresence> 
          {game.options.jackpot && (gameState === "rolling" || (gameState === "completed" && !jackpotComplete)) && (
            <motion.div 
              className={classes.jackpotContainer}
              style={{ top: '10px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className={classes.jackpotLabel}>Jackpot:</span>
              <span className={classes.jackpotValue}>
                <NumberFlow
                  plugins={[continuous]}
                  value={calculateJackpotTotal()}
                  format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                  duration={750}
                />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div 
          className={classes.selectorIconLeft} 
          initial={{ x: -30, opacity: 0 }} 
          animate={debugSelectors || gameState === "rolling" ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 19 26" fill="currentColor">
            <path d="M17.0717 15.3426L4.87409 25.1007C2.9098 26.6722 -1.62884e-07 25.2736 -2.72841e-07 22.7581L-1.12592e-06 3.24187C-1.23588e-06 0.726357 2.9098 -0.672161 4.87409 0.899269L17.0717 10.6574C18.573 11.8584 18.573 14.1416 17.0717 15.3426Z" fill="currentColor"/>
          </svg>
        </motion.div>
        <motion.div 
          className={classes.selectorIconRight} 
          initial={{ x: 30, opacity: 0 }} 
          animate={debugSelectors || gameState === "rolling" ? { x: 0, opacity: 1 } : { x: 30, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 19 26" fill="currentColor">
            <path d="M1.92826 15.3426L14.1259 25.1007C16.0902 26.6722 19 25.2736 19 22.7581L19 3.24187C19 0.726355 16.0902 -0.672161 14.1259 0.899269L1.92826 10.6574C0.427037 11.8584 0.427037 14.1416 1.92826 15.3426Z" fill="currentColor"/>
          </svg>
        </motion.div>
        <div className={classes.spinnersContainer} style={{ display: gameState === "completed" ? "flex" : "grid" }}>
          {showFinalAmount && !game.options.jackpot ? (
            <motion.div 
              className={classes.finalTotal}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className={classes.finalTotalBackground}>
                <PixelCanvas />
              </div>
              <div className={classes.winnersDisplay}>
                <div className={classes.winnersGrid}>
                  {players.filter(player => player.payout > 0).map((winner, index) => (
                    <div key={index} className={classes.winnerCard}>
                      <svg className={classes.winnerCrown} xmlns="http://www.w3.org/2000/svg" width="25" height="23" viewBox="0 0 25 23" fill="none"><path d="M2.875 17L0.125 1.875L7.6875 8.75L12.5 0.5L17.3125 8.75L24.875 1.875L22.125 17H2.875ZM22.125 21.125C22.125 21.95 21.575 22.5 20.75 22.5H4.25C3.425 22.5 2.875 21.95 2.875 21.125V19.75H22.125V21.125Z" fill="currentColor"/></svg>
                      <div className={classes.winnerAvatarWrapper}>
                        <img 
                          src={winner.bot ? botPfp : winner.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} 
                          alt={winner.username}
                          className={classes.winnerAvatar}
                        />
                      </div>
                      <div className={classes.winnerName}>
                        {winner.bot ? `Bot #${winner.slot}` : winner.username}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={classes.buttonsContainer}>
                  <div className={classes.buttonRow} style={{ justifyContent: 'center' }}>
                    <PrimaryButton
                      label={`Recreate This Battle For $${game.bets[0]?.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      onClick={handleRecreate}
                      style={{ 
                        padding: isMobile ? "12px 12px" : "10px 20px", 
                        fontSize: isMobile ? 12 : 13,
                        border: 'none',
                        height: isMobile ? '34px' : '40px',
                        flex: 1,
                        maxWidth: '360px'
                      }}
                    />
                  </div>
                  <div className={classes.buttonRow}>
                    <PrimaryButton
                      label={`Create a New Battle`}
                      onClick={() => navigate('/box-battles/create')}
                      style={{ 
                        padding: isMobile ? "12px 12px" : "10px 20px", 
                        fontSize: isMobile ? 12 : 13,
                        border: 'none',
                        boxShadow: 'none',
                        background: theme.bg.inner,
                        height: isMobile ? '34px' : '40px',
                        flex: 1
                      }}
                    />
                    <PrimaryButton
                      icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>}
                      onClick={handleEditBattle}
                      style={{ 
                        padding: "8px", 
                        fontSize: isMobile ? 12 : 13,
                        gap: 0,
                        border: 'none',
                        boxShadow: 'none',
                        background: theme.bg.inner,
                        height: isMobile ? '34px' : '40px',
                        width: isMobile ? '34px' : '40px',
                        minWidth: '40px'
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {gameState === "completed" && !game.options.jackpot ? (
                <div className={classes.winnersContainer}>
                  {players.map((player, index) => renderSpinnerContent(player, index))}
                </div>
              ) : (
                <>
                  {gameState === "countdown" && countdownNumber > 0 && 
                    <motion.div 
                      className={classes.countdown}
                      initial={{ scale: 0.5, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      exit={{ scale: 0.5, opacity: 0 }} 
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20,
                      }}
                    >
                      <motion.div
                        key={countdownNumber}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          duration: 0.25,
                          ease: "easeOut"
                        }}
                      >
                        {countdownNumber}
                      </motion.div>
                    </motion.div>
                  }
                  {gameState === "pending" &&
                    <motion.div 
                      className={classes.countdown}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexDirection: 'column', zIndex: 1000 }}
                      initial={{ scale: 0.5, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      exit={{ scale: 0.5, opacity: 0 }} 
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20,
                      }}
                    >
                      <div className={classes.statusText}>
                        Waiting for block{' '}
                        <a 
                          href={`https://coffe.bloks.io/block/${game.fair.blockId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: theme.accent.primary, textDecoration: 'none' }}
                        >
                          #{game.fair.blockId}
                        </a>
                      </div>
                      <CircularProgress size={22} sx={{ color: theme.accent.primary }} />
                    </motion.div>
                  }
                  {players.map((player, index) => (
                    <div key={index} className={classes.spinnerWrapper} style={{ gridColumn: gameState === "completed" ? index + 1 : '' }}>
                      <SpinnerContent
                        player={player}
                        index={index}
                        gameState={gameState}
                        isCreator={isCreator}
                        handleCallBots={handleCallBots}
                        handleJoinBattle={handleJoinBattle}
                        spinnerItems={spinnerItems}
                        playingBigSpin={playingBigSpin}
                        boxes={boxes}
                        isMobile={isMobile}
                      />
                      
                      {/*shouldShowSwordIcon(index, gameMode, playerCount) && (
                        <div className={classes.swordIcon}>
                          <CrossSwordIcon />
                        </div>
                      )*/}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
        <AnimatePresence>
          {(showJackpotSpinner || (game.options.jackpot && gameState === "completed")) && (
            <JackpotSpinner
              players={players}
              ticket={jackpotTicket}
              totalValue={calculateJackpotTotal()}
              onComplete={handleJackpotComplete}
              showText={gameState === "completed" && jackpotComplete}
              game={game}
              handleRecreate={handleRecreate}
              handleEdit={handleEditBattle}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SpinnerSection;