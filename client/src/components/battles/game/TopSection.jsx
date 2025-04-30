import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BackIcon, 
  BoxIcon, 
  ShareIcon, 
  ShieldIcon, 
  SoundOnIcon, 
  SoundOffIcon 
} from '../../icons';
import config from "../../../services/config";
import FairnessModel from './FairnessModel';

import { useSound } from "../../../contexts/sound";
import { useNotification } from '../../../contexts/notification';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: "0 auto",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    position: "relative",
    maxWidth: props => props.playerCount === 6 ? 1600 : 1200,
    padding: props => props.playerCount === 6 ? "0 2rem" : 0,
    width: "100%",
  },
  divider: {
    width: "100%",
    height: 1,
    background: `linear-gradient(90deg, 
      ${theme.bg.border}00 0%, 
      ${theme.bg.border}66 50%, 
      ${theme.bg.border}00 100%
    )`,
    marginTop: theme.spacing(2)
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2, 0),
    height: 64,
    justifyContent: "space-between",
    "@media (max-width:1200px)": {
      flexDirection: 'column',
      padding: 0,
      height: "auto",
      gap: 8,
    },
  },
  left: {
    display: "flex",
    alignItems: "center",
    "@media (max-width:1200px)": {
      justifyContent: "space-between",
      width: "100%",
    },
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    "@media (max-width:1200px)": {
      justifyContent: 'space-between',
      width: "100%",
    }
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1)
  },
  iconButton: {
    color: theme.text.secondary,
    cursor: "pointer",
    "&:hover": {
      color: theme.text.primary
    }
  },
  casesCarousel: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(0, 2),
    height: 64,
    width: 582,
    overflow: "hidden",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      width: "25%", 
      height: "100%",
      background: `linear-gradient(to right, ${theme.bg.nav}, transparent)`,
      zIndex: 100
    },
    "&::after": {
      content: '""',
      position: "absolute",
      right: 0,
      width: "25%", 
      height: "100%",
      background: `linear-gradient(to left, ${theme.bg.nav}, transparent)`,
      zIndex: 100
    },
    "@media (max-width:1200px)": {
      width: '100%',
      height: 56,
      padding: theme.spacing(0, 1),
    }
  },
  caseWrapper: {
    display: "flex",
    transition: "transform 0.5s ease",
    position: "relative",
    left: `calc(50% - 80px)`,
    gap: theme.spacing(1),
  },
  soundButton: {
    color: theme.text.secondary,
    cursor: "pointer",
    "&:hover": {
      color: theme.text.primary
    }
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    color: theme.text.secondary,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    marginRight: theme.spacing(2.5),
    "&:hover": {
      color: theme.text.primary
    },
    "@media (max-width:1200px)": {
      marginRight: theme.spacing(1),
      fontSize: 12,
    }
  },
  backIcon: {
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  cost: {
    backgroundColor: theme.bg.box,
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(0.5),
    color: theme.text.primary,
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    "& span": {
      color: theme.text.secondary
    },
    "@media (max-width:1200px)": {
      padding: theme.spacing(0.5, 1),
      fontSize: 12,
    }
  },
  playerMode: {
    backgroundColor: theme.bg.box,
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(0.5),
    color: theme.text.primary,
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    "& span": {
      color: theme.text.secondary
    },
    "@media (max-width:1200px)": {
      padding: theme.spacing(0.5, 1),
      fontSize: 12,
    }
  },
  boxCount: {
    backgroundColor: theme.bg.box,
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(0.5),
    color: `${theme.text.secondary}80`,
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    "& span": {
      color: theme.text.secondary
    },
    "& svg": {
      marginRight: 8
    },
    "@media (max-width:1200px)": {
      padding: theme.spacing(0.5, 1),
      fontSize: 12,
      "& svg": {
        marginRight: 4,
        transform: 'scale(0.85)',
      }
    }
  },
  caseImage: {
    width: 64,
    height: 64,
    objectFit: "contain",
    borderRadius: theme.spacing(0.5),
    transition: "transform 0.2s",
    opacity: 0.5,
    "@media (max-width:1200px)": {
      width: 48,
      height: 48,
    }
  },
  highlightedCase: {
    transform: "scale(1.2)",
    opacity: 1,
    "@media (max-width:1200px)": {
      transform: "scale(1.1)",
    }
  },
  caseInfo: {
    textAlign: "left", 
    fontSize: 12,
    color: theme.text.primary,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    "@media (max-width:1200px)": {
      fontSize: 10,
    }
  },
  caseName: {
    fontWeight: 500,
    color: theme.text.secondary,
    fontSize: 12,
    "@media (max-width:1200px)": {
      fontSize: 10,
    }
  },
  casePrice: {
    color: theme.text.primary,
    fontSize: 14,
    width: 88,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 4,
    "@media (max-width:1200px)": {
      fontSize: 12,
      width: 70,
    }
  },
  gamemodeCrazy: {
    height: 36,
    width: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.spacing(0.5),
    background: "#E337FF20",
    marginLeft: theme.spacing(1),
    "@media (max-width:1200px)": {
      height: 30,
      width: 30,
      marginLeft: theme.spacing(0.5),
      "& svg": {
        transform: 'scale(0.8)',
      }
    }
  },
  gamemodeJackpot: {
    height: 36,
    width: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.spacing(0.5),
    background: "#FF589E20",
    marginLeft: theme.spacing(1),
    "@media (max-width:1200px)": {
      height: 30,
      width: 30,
      marginLeft: theme.spacing(0.5),
      "& svg": {
        transform: 'scale(0.8)',
      }
    }
  },
  gamemodeTerminal: {
    height: 36,
    width: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.spacing(0.5),
    background: "#FFD04D20",
    marginLeft: theme.spacing(1),
    "@media (max-width:1200px)": {
      height: 30,
      width: 30,
      marginLeft: theme.spacing(0.5),
      "& svg": {
        transform: 'scale(0.8)',
      }
    }
  },
  gamemodeGroup: {
    height: 36,
    width: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.spacing(0.5),
    background: "#41FF6A20",
    marginLeft: theme.spacing(1),
    "@media (max-width:1200px)": {
      height: 30,
      width: 30,
      marginLeft: theme.spacing(0.5),
      "& svg": {
        transform: 'scale(0.8)',
      }
    }
  }
}));

const getPlayerModeText = (game) => {
  if (!game.mode || !game.playerCount) return '';
  
  if (game.mode === 'group') return 'Group';
  if (game.mode === 'team') {
    const teamSize = game.playerCount / 2;
    return `${teamSize}v${teamSize}`;
  }

  return Array(game.playerCount).fill('1').join('v');
};

const TopSection = ({ game, gameOptions, boxes, isMobile }) => {
  const classes = useStyles({ playerCount: game.playerCount });
  const navigate = useNavigate();
  const notify = useNotification()
  const { battlesMuted, setBattlesMuted } = useSound();
  const [fairnessOpen, setFairnessOpen] = useState(false);

  const handleSound = () => {
    try {
      notify.info(`Toggled battles audio ${battlesMuted ? 'on' : 'off'}.`)
      setBattlesMuted(!battlesMuted);
    } catch (err) {
      notify.error('Unable to toggle battles audio.')
    };
    
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      notify.info('Battle link copied to clipboard.')
    } catch (err) {
      notify.error('Unable to copy battle link to clipboard.')
    };
  };

  const getBoxImageUrl = (boxName) => {
    return `${config.site.backend.url}/public/img/${boxName
      .toLowerCase()
      .replace(/%/g, 'percent')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}.png`;
  };

  const currentIndex = game.bets[0]?.outcomes.length - 1 || 0;

  return (
  <div className={classes.wrapper}>
    <FairnessModel 
      open={fairnessOpen}
      handleClose={() => setFairnessOpen(false)}
      EOSBlockNumber={game.fair.blockId || "N/A"}
      EOSHash={game.fair.seedPublic || "N/A"}
      ServerSeedHash={game.fair.hash || "N/A"}  
      ServerSeed={game.fair.seedServer || "N/A"}
    />
    <div className={classes.root}>
      <div className={classes.topBar}>
        <div className={classes.left}>
          <div className={classes.backButton} onClick={() => navigate('/box-battles')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><g clipPath="url(#clip0_132_11242)"><path d="M17.5 9.16667H5.69167L8.67917 6.17917L7.5 5L2.5 10L7.5 15L8.67917 13.8208L5.69167 10.8333H17.5V9.16667Z" fill="currentColor"/></g><defs><clipPath id="clip0_132_11242"><rect width="20" height="20" fill="currentColor"/></clipPath></defs></svg>
            Back
          </div>
          <div style={{ display: "flex", gap: 8}}>
            <div className={classes.cost}>
              <span>Cost: </span>
              ${game.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          {gameOptions.cursed && (
            <div className={classes.gamemodeCrazy}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 8L3 19L8.5 14L12 20L15.5 14L21 19L19 8H5ZM19 5C19 4.4 18.6 4 18 4H6C5.4 4 5 4.4 5 5V6H19V5Z" fill="#E337FF"/></svg>
            </div>
          )}
          {gameOptions.terminal && (
            <div className={classes.gamemodeTerminal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M15.3482 2.63793C14.0912 1.37873 12.4894 0.521029 10.7454 0.173328C9.00143 -0.174372 7.19364 0.00354495 5.55069 0.684576C3.90774 1.36561 2.50343 2.51916 1.5154 3.99931C0.527368 5.47947 0 7.21974 0 9C0 10.7803 0.527368 12.5205 1.5154 14.0007C2.50343 15.4808 3.90774 16.6344 5.55069 17.3154C7.19364 17.9965 9.00143 18.1744 10.7454 17.8267C12.4894 17.479 14.0912 16.6213 15.3482 15.3621C16.1883 14.5298 16.8553 13.5389 17.3105 12.4469C17.7656 11.3549 18 10.1833 18 9C18 7.8167 17.7656 6.64514 17.3105 5.55311C16.8553 4.46107 16.1883 3.47024 15.3482 2.63793ZM8.91592 11.6379L7.84647 15.6197C7.82597 15.6956 7.77744 15.7609 7.71069 15.8024C7.64394 15.8439 7.56394 15.8584 7.48688 15.8431C6.18621 15.5831 4.99159 14.9433 4.05372 14.0044C3.11586 13.0654 2.47677 11.8694 2.21709 10.5672C2.2018 10.4901 2.21634 10.41 2.25777 10.3432C2.2992 10.2763 2.36444 10.2278 2.44028 10.2072L6.42672 9.13655C6.47061 9.12506 6.51648 9.12335 6.5611 9.13155C6.60572 9.13975 6.64799 9.15765 6.68495 9.18399C6.7219 9.21033 6.75263 9.24447 6.77496 9.284C6.7973 9.32353 6.81069 9.36748 6.81421 9.41276C6.85495 9.88146 7.05905 10.3209 7.39078 10.6541C7.72239 10.9876 8.16221 11.1912 8.63074 11.2283C8.67815 11.23 8.72454 11.2427 8.76632 11.2652C8.80809 11.2877 8.84415 11.3195 8.8717 11.3582C8.89925 11.3969 8.91757 11.4414 8.92524 11.4883C8.9329 11.5351 8.92972 11.5832 8.91592 11.6286V11.6379ZM9.82109 6.73759C9.39581 6.53645 8.91299 6.49313 8.45876 6.61534C8.00454 6.73756 7.60846 7.01736 7.34119 7.40483C7.3154 7.44229 7.2817 7.47361 7.24247 7.49658C7.20325 7.51955 7.15946 7.5336 7.11421 7.53775C7.06896 7.54189 7.02335 7.53603 6.98061 7.52056C6.93788 7.5051 6.89906 7.48043 6.86691 7.44828L3.93752 4.52793C3.88347 4.47038 3.85337 4.39435 3.85337 4.31535C3.85337 4.23635 3.88347 4.16032 3.93752 4.10276C4.81216 3.10826 5.96087 2.39474 7.23932 2.05184C8.51777 1.70894 9.86894 1.75197 11.123 2.17552C11.1969 2.20111 11.2584 2.2537 11.2952 2.32276C11.332 2.39182 11.3414 2.47225 11.3214 2.54793L10.2551 6.53586C10.2436 6.58017 10.2224 6.62139 10.1931 6.65654C10.1638 6.6917 10.1271 6.71993 10.0856 6.73921C10.0441 6.75849 9.9989 6.76835 9.95317 6.76807C9.90743 6.76779 9.86233 6.75738 9.82109 6.73759ZM13.9315 14.0897C13.874 14.1438 13.7981 14.1739 13.7192 14.1739C13.6403 14.1739 13.5643 14.1438 13.5068 14.0897L10.5868 11.1693C10.5548 11.1369 10.5304 11.0979 10.5152 11.055C10.5 11.012 10.4944 10.9663 10.4988 10.921C10.5033 10.8757 10.5176 10.8319 10.5408 10.7927C10.5641 10.7536 10.5956 10.7201 10.6333 10.6945C11.0188 10.4257 11.2971 10.0291 11.4191 9.57487C11.541 9.12061 11.4987 8.63783 11.2997 8.21173C11.2799 8.17064 11.2694 8.1257 11.2689 8.08008C11.2685 8.03447 11.278 7.98932 11.297 7.94783C11.3159 7.90635 11.3438 7.86955 11.3785 7.84007C11.4133 7.81058 11.4541 7.78913 11.4981 7.77724L15.5001 6.68173C15.5761 6.66088 15.6572 6.66982 15.7269 6.70672C15.7965 6.74361 15.8496 6.8057 15.8751 6.88035C16.2995 8.13847 16.3429 9.49412 15.9998 10.7769C15.6568 12.0596 14.9426 13.2122 13.947 14.0897H13.9315Z" fill="#FFD04D"/></svg>
            </div>
          )}
          {gameOptions.jackpot && (
            <div className={classes.gamemodeJackpot}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M14.8725 5.625L13.17 3.9225C13.2225 3.6075 13.305 3.315 13.41 3.06C13.47 2.925 13.5 2.7825 13.5 2.625C13.5 2.0025 12.9975 1.5 12.375 1.5C11.145 1.5 10.0575 2.0925 9.375 3H5.625C3.345 3 1.5 4.845 1.5 7.125C1.5 9.405 3.375 15.75 3.375 15.75H7.5V14.25H9V15.75H13.125L14.385 11.5575L16.5 10.8525V5.625H14.8725ZM9.75 6.75H6V5.25H9.75V6.75ZM12 8.25C11.5875 8.25 11.25 7.9125 11.25 7.5C11.25 7.0875 11.5875 6.75 12 6.75C12.4125 6.75 12.75 7.0875 12.75 7.5C12.75 7.9125 12.4125 8.25 12 8.25Z" fill="#FF589E"/></svg>              
            </div>
          )}
          {game.mode === 'group' && (
            <div className={classes.gamemodeGroup}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M11 9.75004V11.25H0.5V9.75004C0.5 9.75004 0.5 6.75004 5.75 6.75004C11 6.75004 11 9.75004 11 9.75004ZM8.375 2.62504C8.375 2.10586 8.22105 1.59835 7.93261 1.16667C7.64417 0.734989 7.2342 0.398536 6.75454 0.199856C6.27489 0.00117575 5.74709 -0.050808 5.23789 0.0504782C4.72869 0.151764 4.26096 0.401771 3.89384 0.768884C3.52673 1.136 3.27673 1.60373 3.17544 2.11293C3.07415 2.62213 3.12614 3.14993 3.32482 3.62958C3.5235 4.10924 3.85995 4.51921 4.29163 4.80765C4.72331 5.09609 5.23082 5.25004 5.75 5.25004C6.44619 5.25004 7.11387 4.97348 7.60616 4.48119C8.09844 3.98891 8.375 3.32123 8.375 2.62504ZM10.955 6.75004C11.4161 7.10685 11.7933 7.56036 12.0603 8.07867C12.3272 8.59698 12.4773 9.16748 12.5 9.75004V11.25H15.5V9.75004C15.5 9.75004 15.5 7.02754 10.955 6.75004ZM10.25 3.94343e-05C9.73377 -0.0028351 9.22889 0.151506 8.8025 0.44254C9.25808 1.07909 9.50304 1.84225 9.50304 2.62504C9.50304 3.40782 9.25808 4.17099 8.8025 4.80754C9.22889 5.09857 9.73377 5.25291 10.25 5.25004C10.9462 5.25004 11.6139 4.97348 12.1062 4.48119C12.5984 3.98891 12.875 3.32123 12.875 2.62504C12.875 1.92885 12.5984 1.26117 12.1062 0.768884C11.6139 0.276601 10.9462 3.94343e-05 10.25 3.94343e-05Z" fill="#41FF6A"/></svg>  
            </div>
          )}
        </div>

        <div className={classes.center}>
          <div className={classes.casesCarousel}>
            <motion.div 
              className={classes.caseWrapper} 
              style={{ transform: `translateX(-${currentIndex * 72}px)` }}
            >
              {boxes.map((box, index) => {
                const isHighlighted = index === currentIndex;
                return (
                  <div key={box._id} style={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                    <img
                      src={getBoxImageUrl(box.name)}
                      alt={box.name}
                      className={`${classes.caseImage} ${isHighlighted ? classes.highlightedCase : ''}`}
                    />
                    {isHighlighted && (
                      <div className={classes.caseInfo}>
                        <div className={classes.caseName}>{box.name}</div>
                        <div className={classes.casePrice}>
                          ${box.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        <div className={classes.right}>
          <div className={classes.boxCount}>
            <BoxIcon />
            <span>{game.bets[0].outcomes.length}</span>/{game.boxes.reduce((total, box) => total + box.count, 0)}
          </div>
          <div className={classes.playerMode}>
            {getPlayerModeText(game)}
          </div>
          <div className={classes.actionButtons}>
            <div className={classes.iconButton} onClick={handleShare}>
              <ShareIcon style={{ fontSize: isMobile ? 16 : 20 }} />
            </div>
            <div className={classes.iconButton} onClick={() => setFairnessOpen(true)}>
              <ShieldIcon style={{ fontSize: isMobile ? 16 : 20 }} />
            </div>
            <div className={classes.soundButton} onClick={() => handleSound()}>
              {!battlesMuted ? <SoundOnIcon style={{ fontSize: isMobile ? 16 : 20 }} /> : <SoundOffIcon style={{ fontSize: isMobile ? 16 : 20 }} />}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.divider} />
    </div>
  </div>
    
  );
};

export default TopSection; 