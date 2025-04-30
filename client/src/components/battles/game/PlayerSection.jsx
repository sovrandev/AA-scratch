import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { motion, AnimatePresence } from "framer-motion";
import LevelBox from "../../common/LevelBox";
import solIcon from "../../../assets/img/general/sol.svg";
import botPfp from "../../../assets/img/general/bot.png";
import ItemDrop from "./ItemDrop";
import confetti from 'canvas-confetti';
import { useSound } from '../../../contexts/sound';
import { 
  MenuItem, 
  Menu, 
  Button, 
  IconButton, 
  Divider,
  Paper
} from "@material-ui/core";
import NumberFlow from '@number-flow/react';

// Import the same colors used in JackpotSpinner
const PLAYER_COLORS = {
  colors: [
    { main: '#FF4D4D', bg: 'rgba(255, 77, 77, 0.25)' },   // Red
    { main: '#4D79FF', bg: 'rgba(77, 121, 255, 0.25)' },  // Blue
    { main: '#FFD700', bg: 'rgba(255, 215, 0, 0.25)' },   // Gold
    { main: '#50C878', bg: 'rgba(80, 200, 120, 0.25)' },  // Green
    { main: '#9370DB', bg: 'rgba(147, 112, 219, 0.25)' }, // Purple
    { main: '#FF8C00', bg: 'rgba(255, 140, 0, 0.25)' },   // Orange
  ]
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: "0 auto",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    paddingBottom: "10rem",
    [theme.breakpoints.down('lg')]: {
      paddingBottom: "6rem",
    }
  },
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: props => props.playerCount === 6 ? 1600 : 1200,
    padding: props => props.playerCount === 6 ? "0 2rem" : 0,
    [theme.breakpoints.down('lg')]: {
      padding: 0,
    }
  },
  playerContainer: {
    display: "flex",
    width: "100%",
    flex: 1,
    gap: 16,
    [theme.breakpoints.down('lg')]: {
      gap: 8,
    }
  },
  playerBox: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    [theme.breakpoints.down('lg')]: {
      gap: 8,
      marginTop: theme.spacing(1),
    }
  },
  divider: {
    width: "100%",
    height: 1,
    background: `linear-gradient(90deg, 
      ${theme.bg.border}00 0%, 
      ${theme.bg.border}66 50%, 
      ${theme.bg.border}00 100%
    )`,
    marginBottom: theme.spacing(2),
  },
  // Player dropdown styles
  playerDropdown: {
    width: "100%",
    position: "relative",
    zIndex: 10,
  },
  dropdownButton: {
    width: "100%",
    padding: theme.spacing(1.5, 2),
    backgroundColor: theme.bg.box,
    color: theme.text.primary,
    borderRadius: 6,
    boxShadow: "none",
    textTransform: "none",
    justifyContent: "space-between",
    fontWeight: 500,
    fontSize: 16,
    position: "relative",
    "&:hover": {
      backgroundColor: theme.bg.inner,
      boxShadow: "none",
    },
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(1, 1.5),
      fontSize: 14,
      borderRadius: 4,
    }
  },
  playerSelectText: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    [theme.breakpoints.down('lg')]: {
      gap: theme.spacing(0.5),
    }
  },
  chevronIcon: {
    transition: "transform 0.3s",
    "&.open": {
      transform: "rotate(180deg)",
    }
  },
  dropdownMenu: {
    backgroundColor: theme.bg.box,
    maxWidth: "100%",
    borderRadius: 6,
    marginTop: theme.spacing(1),
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
    padding: 0,
    [theme.breakpoints.down('lg')]: {
      borderRadius: 4,
    }
  },
  menuItem: {
    padding: theme.spacing(1.5, 2),
    "&:hover": {
      backgroundColor: theme.bg.inner,
    },
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(1, 1.5),
    }
  },
  expandButton: {
    margin: theme.spacing(2, "auto"),
    padding: theme.spacing(0.75, 2),
    fontSize: 14,
    textTransform: "none",
    backgroundColor: theme.bg.inner,
    color: theme.text.primary,
    fontWeight: 500,
    "&:hover": {
      backgroundColor: theme.bg.border,
    },
    [theme.breakpoints.down('lg')]: {
      margin: theme.spacing(1, "auto"),
      padding: theme.spacing(0.5, 1.5),
      fontSize: 12,
    }
  },
  // Player content styles
  playerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(0, 2),
    backgroundColor: theme.bg.box,
    borderRadius: 6,
    height: 56,
    width: '100%',
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(0, 1),
      height: 48,
      borderRadius: 4,
    }
  },
  playerInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1),
    width: "100%",
    [theme.breakpoints.down('lg')]: {
      gap: theme.spacing(0.5),
    }
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    objectFit: "cover",
    [theme.breakpoints.down('lg')]: {
      width: 24,
      height: 24,
    }
  },
  userDetails: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    [theme.breakpoints.down('lg')]: {
      gap: theme.spacing(0.5),
    }
  },
  username: {
    color: theme.text.primary,
    fontWeight: 600,
    fontSize: 14,
    [theme.breakpoints.down('lg')]: {
      fontSize: 12,
    }
  },
  totalValue: {
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: theme.text.primary,
    '& img': {
      width: 14,
      height: 14
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 12,
      gap: 2,
      '& img': {
        width: 12,
        height: 12
      }
    }
  },
  jackpotPercentage: {
    padding: '4px 12px',
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 600,
    border: '1px solid',
    marginLeft: 'auto',
    [theme.breakpoints.down('lg')]: {
      padding: '2px 8px',
      fontSize: 12,
      borderRadius: 3,
    }
  },
  itemsGrid: {
    position: 'relative',
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: 4,
    overflow: 'auto',
    maxHeight: '500px',
    '&::-webkit-scrollbar': {
      width: '0px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'transparent',
    },
    scrollbarWidth: 'none',
    '-ms-overflow-style': 'none',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
      gap: 2,
      maxHeight: '400px',
    }
  },
  allPlayersContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
    width: "100%",
    [theme.breakpoints.down('lg')]: {
      gap: theme.spacing(2),
    }
  },
  playerHeaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    position: 'relative',
    width: '100%',
    '&.winner': {
      animation: '$floatAnimation 5s ease-in-out infinite',
      animationDelay: props => `${4 + (props.index * 0.5)}s`,
    },
    [theme.breakpoints.down('lg')]: {
      gap: 4,
    }
  },
  '@keyframes floatAnimation': {
    '0%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
    '100%': { transform: 'translateY(0px)' },
  },
  payoutAmount: {
    color: theme.green,
    background: "#223B31",
    width: 'fit-content',
    whiteSpace: 'nowrap',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    position: 'absolute',
    top: -20,
    left: "50%",
    transform: 'translate(-50%, 0)',
    opacity: 0,
    animation: '$fadeIn 0.3s forwards',
    animationDelay: '4s',
    '& img': {
      width: '14px',
      height: '14px'
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: '14px',
      padding: '3px 6px',
      top: -16,
      '& img': {
        width: '12px',
        height: '12px'
      }
    }
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
}));

const PlayerHeader = ({ player, index, solIcon, triggerWinConfetti, renderPlayerInfo }) => {
  const classes = useStyles({ index });
  const shouldFloat = player.payout > 0;
  const payoutRef = React.useRef(null);

  React.useEffect(() => {
    if (shouldFloat && payoutRef.current) {
      setTimeout(() => {
        triggerWinConfetti(payoutRef.current);
      }, 4000);
    }
  }, [shouldFloat, triggerWinConfetti]);

  return (
    <div 
      className={`${classes.playerHeaderContainer} ${shouldFloat ? 'winner' : ''}`}
    >
      {player.payout > 0 && (
        <div 
          ref={payoutRef}
          className={classes.payoutAmount}
        >
          +
          ${player.payout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      )}
      <div className={classes.playerHeader}>
        {renderPlayerInfo(player, index)}
      </div>
    </div>
  );
};

const PlayerSection = ({ players, playerCount, game, isMobile, gameState, boxes }) => {
  const classes = useStyles({ playerCount });
  const { playConfetti } = useSound();
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAllPlayers, setShowAllPlayers] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showUpdatedValues, setShowUpdatedValues] = useState(false);
  const [previousContributions, setPreviousContributions] = useState({});
  const [cachedJackpotTotal, setCachedJackpotTotal] = useState(0);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Updated useEffect to immediately set showUpdatedValues to true when game state is completed
  useEffect(() => {
    // When game is spinning/rolling, cache contributions based on previous round only
    if (game.state === "spinning" || game.state === "rolling") {
      setShowUpdatedValues(false);
      
      // Only proceed if we have at least one round completed
      if (game.bets[0]?.outcomes.length > 0) {
        // Calculate jackpot total using only previous round items
        const previousRoundTotal = players.reduce((total, player) => {
          if (!player.items) return total;
          const previousItems = player.items.slice(0, game.bets[0].outcomes.length - 1);
          return total + calculateTotalValue(previousItems);
        }, 0);
        
        setCachedJackpotTotal(previousRoundTotal);
        
        // Calculate each player's contribution percentage using the same previous round logic
        const contributions = {};
        players.forEach(player => {
          if (!player._id || !player.items) return;
          
          const previousItems = player.items.slice(0, game.bets[0].outcomes.length - 1);
          const playerTotal = calculateTotalValue(previousItems);
          
          contributions[player._id] = previousRoundTotal > 0 
            ? (playerTotal / previousRoundTotal * 100) 
            : 0;
        });
        
        setPreviousContributions(contributions);
      }
    }
    
    // Immediately update values when game is completed (no delay)
    if (game.state === "completed") {
      setShowUpdatedValues(true);
    }
  }, [game.state, game.bets, players]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePlayerSelect = (index) => {
    setSelectedPlayer(index);
    handleMenuClose();
  };

  const handleToggleAllPlayers = () => {
    setShowAllPlayers(!showAllPlayers);
  };

  const calculateTotalValue = (items = []) => {
    return items.reduce((total, item) => total + (item?.item?.amountFixed || 0), 0);
  };

  // Calculate total pot value for jackpot mode
  const calculateActualJackpotTotal = () => {
    return players.reduce((total, player) => total + calculateTotalValue(player.items), 0);
  };

  // Updated contribution percentage function to be consistent with caching
  const calculateContributionPercentage = (playerItems, playerSlot) => {
    // Use cached values during spinning/rolling
    if (!showUpdatedValues && previousContributions[playerSlot] !== undefined) {
      return previousContributions[playerSlot];
    }
    
    // If we're in game states where we should use previous rounds only
    let itemsToUse = playerItems;
    let totalToUse = calculateActualJackpotTotal();
    
    if ((game.state === "spinning" || game.state === "rolling") && game.bets[0]?.outcomes.length > 0) {
      // Use only previous rounds for both player items and total calculation
      itemsToUse = playerItems.slice(0, game.bets[0].outcomes.length - 1);
      
      // Calculate total from all players using the same slice logic
      totalToUse = players.reduce((sum, player) => {
        if (!player.items) return sum;
        const previousItems = player.items.slice(0, game.bets[0].outcomes.length - 1);
        return sum + calculateTotalValue(previousItems);
      }, 0);
    }
    
    const playerTotal = calculateTotalValue(itemsToUse);
    return totalToUse > 0 ? (playerTotal / totalToUse * 100) : 0;
  };

  const triggerWinConfetti = (element) => {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Create multiple bursts for more volume
    const createBurst = (angle, offset) => {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { 
          x: x + (offset * Math.cos(angle * Math.PI / 180)),
          y: y + (offset * Math.sin(angle * Math.PI / 180))
        },
        gravity: 3,
        ticks: 100,
        startVelocity: 25,
        scalar: 0.7,
        disableForReducedMotion: true,
        zIndex: 20,
      });
    };

    // Create bursts in a circle around the number
    for (let angle = 0; angle < 360; angle += 60) {
      createBurst(angle, 0.05);
    }
    createBurst(0, 0); // Center burst

    playConfetti();
  };

  const renderPlayerInfo = (player, index) => {
    if (!player._id) {
      return (
        <div className={classes.totalValue} style={{ color: "#959597" }}>
          Waiting for player...
        </div>
      );
    }

    return (
      <div className={classes.playerInfo}>
        <img 
          src={player.bot ? botPfp : player.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} 
          alt={player.bot ? `Bot #${player.slot}` : player.username}
          className={classes.avatar}
        />
        <div className={classes.userDetails}>
          <LevelBox level={player.bot ? "bot" : player.level} />
          <div className={classes.username}>{player.bot ? `Bot #${player.slot}` : player.username}</div>
        </div>
        {game.options.jackpot && (
          <div 
            className={classes.jackpotPercentage}
            style={{
              color: PLAYER_COLORS.colors[index % PLAYER_COLORS.colors.length].main,
              background: PLAYER_COLORS.colors[index % PLAYER_COLORS.colors.length].bg,
              borderColor: PLAYER_COLORS.colors[index % PLAYER_COLORS.colors.length].main
            }}
          >
            <NumberFlow
              value={calculateContributionPercentage(player.items, player.slot)}
              format={{ maximumFractionDigits: 2, minimumFractionDigits: 2 }}
              duration={300}
              suffix="%"
            />
          </div>
        )}
      </div>
    );
  };

  const renderSelectedPlayerContent = () => {
    const player = players[selectedPlayer];
    if (!player) return null;

    return (
      <div className={classes.playerBox}>
        <PlayerHeader 
          player={player}
          index={selectedPlayer}
          solIcon={solIcon}
          triggerWinConfetti={triggerWinConfetti}
          renderPlayerInfo={renderPlayerInfo}
        />
        <div className={classes.itemsGrid}>
          {player.items.map((drop, itemIndex) => (
            <ItemDrop 
              key={`item-${selectedPlayer}-${itemIndex}`} 
              item={drop} 
              itemIndex={itemIndex}
              game={game}
              roundNumber={game.bets[0]?.outcomes.length}
              boxes={boxes}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderAllPlayersContent = () => {
    return (
      <div className={classes.allPlayersContainer}>
        {players.map((player, index) => (
          <div key={`player-all-${index}`} className={classes.playerBox}>
            <PlayerHeader 
              player={player}
              index={index}
              solIcon={solIcon}
              triggerWinConfetti={triggerWinConfetti}
              renderPlayerInfo={renderPlayerInfo}
            />
            <div className={classes.itemsGrid}>
              {player.items.map((drop, itemIndex) => (
                <ItemDrop 
                  key={`item-all-${index}-${itemIndex}`} 
                  item={drop} 
                  itemIndex={itemIndex}
                  game={game}
                  roundNumber={game.bets[0]?.outcomes.length}
                  boxes={boxes}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOriginalLayout = () => {
    return (
      <div className={classes.playerContainer}>
        {players.map((player, index) => (
          <div key={`player-${index}`} className={classes.playerBox}>
            <PlayerHeader 
              player={player}
              index={index}
              solIcon={solIcon}
              triggerWinConfetti={triggerWinConfetti}
              renderPlayerInfo={renderPlayerInfo}
            />
            <div className={classes.itemsGrid}>
              {player.items.map((drop, itemIndex) => (
                <ItemDrop 
                  key={`item-${index}-${itemIndex}`} 
                  item={drop} 
                  itemIndex={itemIndex}
                  game={game}
                  roundNumber={game.bets[0]?.outcomes.length}
                  boxes={boxes}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const currentPlayer = players[selectedPlayer] || {};
  const playerName = currentPlayer._id 
    ? (currentPlayer.bot ? `Bot #${currentPlayer.slot}` : currentPlayer.username) 
    : "Select a player";

  return (
    <div className={classes.wrapper}>
      <div className={classes.root}>
        <div className={classes.divider} />
        
        {isSmallScreen ? (
          <>
            {/* Mobile Dropdown Layout */}
            <div className={classes.playerDropdown}>
              <Button 
                className={classes.dropdownButton}
                onClick={handleMenuOpen}
                fullWidth
                disableRipple
              >
                <div className={classes.playerSelectText}>
                  <img 
                    src={currentPlayer.bot ? botPfp : currentPlayer.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} 
                    alt={playerName}
                    className={classes.avatar}
                  />
                  {playerName}
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className={`${classes.chevronIcon} ${anchorEl ? 'open' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Button>
              
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ className: classes.dropdownMenu }}
                elevation={3}
                getContentAnchorEl={null}
                anchorOrigin={{ 
                  vertical: 'bottom', 
                  horizontal: 'left' 
                }}
                transformOrigin={{ 
                  vertical: 'top', 
                  horizontal: 'left' 
                }}
              >
                {players.map((player, index) => (
                  <MenuItem 
                    key={`dropdown-${index}`} 
                    onClick={() => handlePlayerSelect(index)}
                    className={classes.menuItem}
                  >
                    <div className={classes.playerInfo}>
                      <img 
                        src={player.bot ? botPfp : player.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} 
                        alt={player.bot ? `Bot #${player.slot}` : player.username}
                        className={classes.avatar}
                      />
                      <div className={classes.username}>
                        {player._id ? (player.bot ? `Bot #${player.slot}` : player.username) : `Waiting for player...`}
                      </div>
                    </div>
                  </MenuItem>
                ))}
              </Menu>
            </div>
            
            {/* Player Content for Mobile */}
            {!showAllPlayers ? (
              <>
                {renderSelectedPlayerContent()}
                <Button 
                  className={classes.expandButton}
                  onClick={handleToggleAllPlayers}
                  disableRipple
                >
                  Show All Players
                </Button>
              </>
            ) : (
              <>
                {renderAllPlayersContent()}
                <Button 
                  className={classes.expandButton}
                  onClick={handleToggleAllPlayers}
                  disableRipple
                >
                  Show Only Selected Player
                </Button>
              </>
            )}
          </>
        ) : (
          // Desktop Layout - Original Side by Side Players
          renderOriginalLayout()
        )}
      </div>
    </div>
  );
};

export default PlayerSection;
