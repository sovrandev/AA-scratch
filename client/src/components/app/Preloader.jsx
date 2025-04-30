import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, LinearProgress } from '@material-ui/core';
import { useUser } from '../../contexts/user';
import { useSettings } from '../../contexts/settings';
import { useSound } from '../../contexts/sound';
import { useBattles } from '../../contexts/battles';
import { useUnbox } from '../../contexts/unbox';
import { useLeaderboard } from '../../contexts/leaderboard';
import { useRewards } from '../../contexts/rewards';

// Images
import logo from '../../assets/img/logo.png';
import preloader from '../../assets/img/preloader.png';
import background from '../../assets/img/background.png';
import pattern from '../../assets/img/pattern.png';
import pattern2 from '../../assets/img/pattern-2.png';
import bigSpin from '../../assets/img/big-spin.png';
import spritesheet from '../../assets/img/spritesheet.png';
import nft1 from '../../assets/img/home/nft1.png';
import nft2 from '../../assets/img/home/nft2.png';
import nft3 from '../../assets/img/home/nft3.png';
import nft4 from '../../assets/img/home/nft4.png';
import box from '../../assets/img/boxes/box.png';
import btc from '../../assets/img/cashier/btc.png';
import eth from '../../assets/img/cashier/eth.png';
import usdt from '../../assets/img/cashier/usdt.png';
import usdc from '../../assets/img/cashier/usdc.png';
import xrp from '../../assets/img/cashier/xrp.png';
import sol from '../../assets/img/cashier/sol.png';
import trx from '../../assets/img/cashier/trx.png';
import bot from '../../assets/img/general/bot.png';
import crown from '../../assets/img/vip/crown.png';
import gift from '../../assets/img/vip/gift.png';
import manager from '../../assets/img/vip/manager.png';
import money from '../../assets/img/vip/money.png';
import plane from '../../assets/img/vip/plane.png';
import positive from '../../assets/img/vip/positive.png';

// Sounds
import big_spin from '../../assets/sounds/big_spin.wav';
import celebration from '../../assets/sounds/celebration.wav';
import number_adding_up from '../../assets/sounds/number_adding_up.wav';
import mines_bomb from '../../assets/sounds/mines_bomb.wav';
import mines_gem from '../../assets/sounds/mines_gem.wav';
import mines_reveal from '../../assets/sounds/mines_reveal.wav';
import success from '../../assets/sounds/success.mp3';
import tick from '../../assets/sounds/tick.mp3';
import unbox from '../../assets/sounds/unbox.mp3';
import error from '../../assets/sounds/error.mp3';
import cash from '../../assets/sounds/cash.mp3';

// Create an object that maps image names to their imports
const CRITICAL_IMAGES = {
  logo,
  preloader,
  background,
  pattern,
  pattern2,
  bigSpin,
  spritesheet,
  nft1,
  nft2,
  nft3,
  nft4,
  box,
  btc,
  eth,
  usdt,
  usdc,
  xrp,
  sol,
  trx,
  bot,
  crown,
  gift,
  manager,
  money,
  plane,
  positive,
};

/*
  big_spin,
  celebration,
  number_adding_up,
  mines_bomb,
  mines_gem,
  mines_reveal,
  success,
  tick,
  unbox,
  error,
  cash,
*/

const useStyles = makeStyles(theme => ({
  preloaderContainer: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: theme.bg.main,
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 9999,
  },

  logo: {
    width: 350,
    marginBottom: theme.spacing(4),
    "@media (max-width: 1200px)": {
      width: 250,
    },
  },

  progressContainer: {
    width: 350,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(2),
    "@media (max-width: 1200px)": {
      width: 250,
    },
  },

  progress: {
    width: "100%",
    height: 6,
    borderRadius: 4,
    backgroundColor: theme.bg.box,
    "& .MuiLinearProgress-bar": {
      background: theme.accent.primaryGradient,
      borderRadius: 4,
    },
  },

  statusText: {
    color: theme.text.secondary,
    fontSize: 14,
    fontWeight: 600,
    "@media (max-width: 1200px)": {
      fontSize: 12,
    },
  },
}));

const Preloader = ({ children }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Loading assets...');
  
  // Get contexts with their loading states
  const { isInitialized: userInitialized } = useUser();
  const { isInitialized: settingsInitialized } = useSettings();
  const { isInitialized: soundInitialized } = useSound();
  const { isInitialized: battlesInitialized } = useBattles();
  const { isInitialized: unboxInitialized } = useUnbox();
  const { isInitialized: leaderboardInitialized } = useLeaderboard();
  const { isInitialized: rewardsInitialized } = useRewards();

  // Define the contexts in the order we want to check them
  const orderedContexts = [
    { name: 'User', isInitialized: userInitialized },
    { name: 'Settings', isInitialized: settingsInitialized },
    { name: 'Sound', isInitialized: soundInitialized },
    { name: 'Battles', isInitialized: battlesInitialized },
    { name: 'Unbox', isInitialized: unboxInitialized },
    { name: 'Leaderboard', isInitialized: leaderboardInitialized },
    { name: 'Rewards', isInitialized: rewardsInitialized },
  ];

  useEffect(() => {
    let mounted = true;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const loadAssets = async () => {
      let loadedImages = 0;
      const totalAssets = Object.keys(CRITICAL_IMAGES).length;

      // Pre-cache all images
      for (const [name, src] of Object.entries(CRITICAL_IMAGES)) {
        if (!mounted) return;
        
        await new Promise(resolve => {
          // Create a link element for preloading
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          link.onload = resolve;
          link.onerror = resolve;
          document.head.appendChild(link);

          // Create an img element to ensure it's in browser cache
          const img = new Image();
          img.src = src;
          img.onload = () => {
            // For the background image, also set it as a background to ensure it's fully cached
            if (name === 'background') {
              const tempDiv = document.createElement('div');
              tempDiv.style.backgroundImage = `url(${src})`;
              tempDiv.style.position = 'absolute';
              tempDiv.style.width = '1px';
              tempDiv.style.height = '1px';
              tempDiv.style.opacity = '0';
              document.body.appendChild(tempDiv);
              setTimeout(() => tempDiv.remove(), 100);
            }
            resolve();
          };
          img.onerror = resolve;
        });

        loadedImages++;
        setLoadingStatus(`Loading assets... (${loadedImages}/${totalAssets})`);
        setProgress((loadedImages / (totalAssets + orderedContexts.length)) * 100);
        
        await sleep(25);
      }
    };

    const loadContexts = async () => {
      const totalContexts = orderedContexts.length;
      const checkContext = async (context) => {
        while (!context.isInitialized && mounted) {
          await sleep(500);
        }
        // Add mandatory delay even if context was already initialized
        await sleep(100);
      };

      for (let i = 0; i < totalContexts; i++) {
        if (!mounted) return;

        const context = orderedContexts[i];
        setLoadingStatus(`Loading ${context.name}...`);
        
        await checkContext(context);
        // Fix progress calculation to ensure we don't get NaN
        const totalSteps = Object.keys(CRITICAL_IMAGES).length + totalContexts;
        const currentStep = Object.keys(CRITICAL_IMAGES).length + i;
        const progressPercentage = (currentStep / totalSteps) * 100;
        setProgress(progressPercentage);
      }
    };

    const initialize = async () => {
      await loadAssets();
      await loadContexts();
      
      if (mounted) {
        setLoadingStatus('Ready!');
        setProgress(100);
        await sleep(100);
        setIsLoading(false);
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [
    userInitialized, settingsInitialized, soundInitialized,
    battlesInitialized, unboxInitialized,
    leaderboardInitialized, rewardsInitialized
  ]);

  if (!isLoading) {
    return children;
  }

  return (
    <Box className={classes.preloaderContainer}>
      <img src={logo} alt="Logo" className={classes.logo} />
      <Box className={classes.progressContainer}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          className={classes.progress}
        />
        <Typography className={classes.statusText}>
          {loadingStatus}
        </Typography>
      </Box>
    </Box>
  );
};

export default Preloader; 