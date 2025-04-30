import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useLocalStorage from '../../../hooks/useLocalStorage';
import { 
  ShareIcon, 
  ShieldIcon, 
  SoundOnIcon, 
  SoundOffIcon 
} from '../../icons';

import { useSound } from "../../../contexts/sound";
import { useNotification } from '../../../contexts/notification';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    position: "relative",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  center: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1)
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2)
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
      background: `linear-gradient(to right, theme.bg.main, transparent)`,
      zIndex: 100
    },
    "&::after": {
      content: '""',
      position: "absolute",
      right: 0,
      width: "25%", 
      height: "100%",
      background: `linear-gradient(to left, theme.bg.main, transparent)`,
      zIndex: 100
    }
  },
  caseWrapper: {
    display: "flex",
    transition: "transform 0.5s ease",
    position: "relative",
    left: `calc(50% - 80px)`,
    gap: theme.spacing(1)
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
    }
  },
  backIcon: {
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  fastSpinButton: {
    color: props => props.fastSpin ? theme.accent.primary : theme.text.secondary,
    cursor: "pointer",
    "&:hover": {
      color: theme.accent.primary
    }
  }
}));

const TopSection = ({ fastSpin, setFastSpin, isFreeBox = false }) => {
  const navigate = useNavigate();
  const notify = useNotification();
  const { battlesMuted, setBattlesMuted } = useSound();

  const classes = useStyles({ fastSpin });

  const handleSound = () => {
    try {
      notify.info(`Toggled boxes audio ${battlesMuted ? 'on' : 'off'}.`)
      setBattlesMuted(!battlesMuted);
    } catch (err) {
      notify.error('Unable to toggle boxes audio.')
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


  return (
    <div className={classes.root}>
      <div className={classes.topBar}>
        <div className={classes.left}>
          <div className={classes.backButton} onClick={() => navigate(`/${isFreeBox ? 'rewards' : 'boxes'}`)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><g clipPath="url(#clip0_132_11242)"><path d="M17.5 9.16667H5.69167L8.67917 6.17917L7.5 5L2.5 10L7.5 15L8.67917 13.8208L5.69167 10.8333H17.5V9.16667Z" fill="currentColor"/></g><defs><clipPath id="clip0_132_11242"><rect width="20" height="20" fill="currentColor"/></clipPath></defs></svg>
            Back
          </div>
        </div>
        <div className={classes.right}>
          <div className={classes.actionButtons}>
            <div className={classes.iconButton} onClick={handleShare}>
              <ShareIcon />
            </div>
            <div className={classes.fastSpinButton} onClick={() => setFastSpin(!fastSpin)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.8335 1.66663L3.41142 10.5732C3.12075 10.922 2.97541 11.0964 2.97319 11.2437C2.97126 11.3717 3.02832 11.4935 3.12792 11.574C3.2425 11.6666 3.46952 11.6666 3.92357 11.6666H10.0002L9.16688 18.3333L16.589 9.42675C16.8797 9.07794 17.025 8.90354 17.0272 8.75624C17.0292 8.62819 16.9721 8.50637 16.8725 8.42588C16.7579 8.33329 16.5309 8.33329 16.0768 8.33329H10.0002L10.8335 1.66663Z" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={classes.soundButton} onClick={handleSound}>
              {!battlesMuted ? <SoundOnIcon /> : <SoundOffIcon />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSection; 