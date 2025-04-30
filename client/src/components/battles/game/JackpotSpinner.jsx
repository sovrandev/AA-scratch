import React, { useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import PrimaryButton from '../../common/buttons/PrimaryButton';
import botPfp from '../../../assets/img/general/bot.png';
import theme from '../../../styles/theme';


const PLAYER_COLORS = {
  colors: [
    { main: '#FF4D4D', bg: 'rgba(255, 77, 77, 1)' },   // Red
    { main: '#4D79FF', bg: 'rgba(77, 121, 255, 1)' },  // Blue
    { main: '#FFD700', bg: 'rgba(255, 215, 0, 1)' },   // Gold
    { main: '#50C878', bg: 'rgba(80, 200, 120, 1)' },  // Green
    { main: '#9370DB', bg: 'rgba(147, 112, 219, 1)' }, // Purple
    { main: '#FF8C00', bg: 'rgba(255, 140, 0, 1)' },   // Orange
  ]
};

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
    padding: '0 20px'
  },
  spinnerSection: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  spinnerContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
    zIndex: 1,
  },
  spinnerWrapper: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    borderRadius: "8px",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectorTop: {
    height: 15,
    width: 20,
    position: 'absolute',
    left: '50%',
    top: -10,
    transform: 'translateX(-50%)',
    zIndex: 2,
  },
  selectorBottom: {
    height: 15,
    width: 20,
    position: 'absolute',
    left: '50%',
    bottom: -10,
    transform: 'translateX(-50%) rotate(180deg)',
    zIndex: 2,
  },
  spinnerStrip: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    willChange: 'transform',
  },
  playerSection: {
    height: '100%',
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `repeating-linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.1) 10px,
        rgba(0, 0, 0, 0.2) 10px,
        rgba(0, 0, 0, 0.2) 20px
      )`,
      mixBlendMode: 'multiply',
    }
  },
  winnerText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: theme.text.primary,
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
    padding: '10px 20px',
    borderRadius: '4px',
    background: `${theme.bg.inner}66`,
    zIndex: 3,
    whiteSpace: 'nowrap',
    textShadow: '0 0 10px rgba(0,0,0,0.5)',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  winnerAvatars: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '4px',
    '& img': {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: '2px solid white',
      '&:not(:first-child)': {
        marginLeft: '-12px'
      }
    }
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    maxWidth: '300px',
    marginTop: '32px'
  },
  buttonRow: {
    display: 'flex',
    gap: '8px',
    width: '100%',
  },
}));

const JackpotSpinner = ({ players, ticket, totalValue, onComplete, showText, game, handleRecreate, handleEdit }) => {
  const classes = useStyles();
  const controls = useAnimation();
  const [sections, setSections] = useState([]);
  const [showWinnerText, setShowWinnerText] = useState(showText);

  useEffect(() => {
    setShowWinnerText(showText);
  }, [showText]);

  useEffect(() => {
    // Calculate total value for each player from their items
    const newSections = players.map((player, index) => {
      const playerTotal = player.items.reduce((sum, item) => sum + (item?.item?.amountFixed || 0), 0);
      return {
        player: player,
        width: (playerTotal / totalValue) * 100,
        color: PLAYER_COLORS.colors[index % PLAYER_COLORS.colors.length]
      };
    });
    
    setSections(newSections);
  }, [players, totalValue]);

  useEffect(() => {
    if (ticket !== undefined) {
      const stripWidth = document.querySelector(`.${classes.spinnerContainer}`).offsetWidth;
      const ticketPercentage = (ticket / 100000) * 100;
      const fullRotations = 8 * stripWidth;
      let targetPosition = 0;
      let accumulatedPercentage = 0;
      
      for (const section of sections) {
        if (accumulatedPercentage + section.width > ticketPercentage) {
          const sectionOffset = ((ticketPercentage - accumulatedPercentage) / section.width) * section.width;
          targetPosition = (accumulatedPercentage + sectionOffset) * (stripWidth / 100);
          break;
        }
        accumulatedPercentage += section.width;
      }
      
      const finalPosition = -(fullRotations + targetPosition - (stripWidth / 2));
      
      controls.start({
        x: finalPosition,
        transition: {
          duration: 4,
          ease: [0.15, 0.86, 0, 1],
        }
      }).then(() => {
        onComplete();
      });
    }
  }, [ticket, sections]);

  const renderSections = () => {
    return [...Array(10)].map((_, repeatIndex) => (
      sections.map((section, index) => (
        <div
          key={`${repeatIndex}-${index}`}
          className={classes.playerSection}
          style={{
            width: `${section.width}%`,
            background: `linear-gradient(
              135deg, 
              ${section.color.main} 0%,
              ${section.color.main} 50%,
              ${section.color.main} 100%
            )`,
          }}
        />
      ))
    ));
  };

  const getWinnerText = () => {
    const winners = players.filter(p => p.payout > 0);
    const totalPayout = winners.reduce((sum, w) => sum + w.payout, 0);
    
    // Calculate combined chance by adding individual chances
    const combinedChance = winners.reduce((sum, winner) => {
      const playerTotal = winner.items.reduce((itemSum, item) => itemSum + (item?.item?.amountFixed || 0), 0);
      const playerChance = (playerTotal / totalValue) * 100;
      return sum + playerChance;
    }, 0);
    
    return (
      <>
        <div className={classes.winnerAvatars}>
          {winners.map((winner, index) => (
            <img 
              key={index}
              src={winner.bot ? botPfp : winner.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} 
              alt={winner.bot ? `Bot #${winner.slot}` : winner.username}
            />
          ))}
        </div>
        <span>
          {winners.map(w => w.bot ? `Bot #${w.slot}` : w.username).join(' & ')} won $
          {totalPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          {' '}with {combinedChance.toFixed(2)}% chance
        </span>
      </>
    );
  };

  return (
    <div className={classes.root}>
      <AnimatePresence>
        <motion.div className={classes.spinnerSection} animate={{ }}>
          <motion.div 
            className={classes.spinnerContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          >
            <svg className={classes.selectorTop} width="26" height="19" viewBox="0 0 26 19" fill="none">
              <path d="M10.6574 17.0717L0.899268 4.87409C-0.672164 2.9098 0.726356 0 3.24187 0L22.7581 0C25.2736 0 26.6722 2.9098 25.1007 4.87409L15.3426 17.0717C14.1416 18.573 11.8584 18.573 10.6574 17.0717Z" fill="white"/>
            </svg>
            <div className={classes.spinnerWrapper}>
              <motion.div 
                className={classes.spinnerStrip}
                animate={controls}
                initial={{ x: 0 }}
              >
                {renderSections()}
              </motion.div>
              {showWinnerText && (
                <div className={classes.winnerText}>
                  {getWinnerText()}
                </div>
              )}
            </div>
            <svg className={classes.selectorBottom} width="26" height="19" viewBox="0 0 26 19" fill="none">
              <path d="M10.6574 17.0717L0.899268 4.87409C-0.672164 2.9098 0.726356 0 3.24187 0L22.7581 0C25.2736 0 26.6722 2.9098 25.1007 4.87409L15.3426 17.0717C14.1416 18.573 11.8584 18.573 10.6574 17.0717Z" fill="white"/>
            </svg>
          </motion.div>
        </motion.div>

        {showWinnerText && (
          <motion.div 
            className={classes.buttonsContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className={classes.buttonRow} style={{ justifyContent: 'center' }}>
              <PrimaryButton
                label={`Recreate This Battle For $${game.bets[0]?.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                onClick={handleRecreate}
                style={{ 
                  padding: "10px 20px", 
                  fontSize: 13,
                  border: 'none',
                  height: '40px',
                  flex: 1,
                  maxWidth: '360px'
                }}
              />
            </div>
            <div className={classes.buttonRow}>
              <PrimaryButton
                label={`Create a New Battle`}
                onClick={handleRecreate}
                style={{ 
                  padding: "10px 20px", 
                  fontSize: 13,
                  border: 'none',
                  boxShadow: 'none',
                  background: theme.bg.inner,
                  height: '40px',
                  flex: 1
                }}
              />
              <PrimaryButton
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>}
                onClick={handleEdit}
                style={{ 
                  padding: "8px", 
                  fontSize: 13,
                  gap: 0,
                  border: 'none',
                  boxShadow: 'none',
                  background: theme.bg.inner,
                  height: '40px',
                  width: '40px',
                  minWidth: '40px'
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JackpotSpinner; 