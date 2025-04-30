import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { motion, AnimatePresence } from "framer-motion";
import TextField from "@material-ui/core/TextField";
import NumberFlow from '@number-flow/react'
import PrimaryButton from "../components/common/buttons/PrimaryButton";
import Mine from "../components/mines/Mine";
import { useMines } from "../contexts/mines";
import { useSound } from "../contexts/sound";
import { useUser } from "../contexts/user";
import theme from "../styles/theme";

const Input = withStyles(theme => ({
  root: {
    width: "100%",
    borderRadius: "6px",
    background: theme.bg.main,
    height: "40px",
    width: "100%",
    display: "flex",
    alignItems: "start",
    overflow: "hidden",
    "& :before": {
      display: "none",
    },
    "& :after": {
      display: "none",
    },
    "& label": {
      color: theme.text.secondary,
      fontSize: 14,
      display: "none",
    },
    "& .MuiInputLabel-root": {
      background: theme.bg.main,
    },
    "& .MuiInputBase-root": {
      textAlign: "center",
      background: theme.bg.main,
    },
    "& div input": {
      color: "#FFFFFF",
      fontFamily: "Onest",
      fontSize: 14,
      fontWeight: 500,
      height: "40px",
      padding: "0 0.5rem",
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      width: "100%",
      background: theme.bg.main,
      '&::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
      '&::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
    },
    "& .MuiInputBase-root.Mui-focused": {
      background: theme.bg.main,
    },
    "& .MuiInputBase-root:hover": {
      background: theme.bg.main,
    },
    "& .MuiInputAdornment-root": {
      background: theme.bg.main,
      "&.Mui-focused": {
        background: theme.bg.main,
      },
      "&:hover": {
        background: theme.bg.main,
      }
    },
    "& div": {
      background: theme.bg.main,
      padding: "0 0 0 0.25rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
  }
}))(TextField);

const useStyles = makeStyles(theme => ({
  root: {
    color: "#fff",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    overflowY: "scroll",
    scrollbarWidth: "none",
    fontWeight: 500,
    marginBottom: "10rem",
  },
  navigation: {
    height: "720px",
    width: "fit-content",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.bg.box,
    borderRadius: "0.5rem",
    padding: "1rem",
    "@media (max-width: 1200px)": {
      order: 2,
      width: "100%",
      height: "fit-content",
    },
  },
  minesBox: {
    display: "flex",
    flex: "1 1",
    width: "100%",
    padding: "1rem",
    borderRadius: "0.5rem",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.bg.box,
    height: "720px",
  },
  minesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "12px",
    "@media (max-width: 1200px)": {
      gap: "6px",
    },
  },
  container: {
    display: "flex",
    gap: "1.5rem",
    width: "100%",
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      gap: "0.5rem",
    },
  },
  top: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "6px"
  },
  title: {
    color: theme.text.secondary,
    fontSize: 14,
    alignSelf: "start",
  },
  options: {
    display: "flex",
    gap: "4px",
    width: "100%"
  },
  optionButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.bg.inner,
    color: theme.text.secondary,
    borderRadius: "6px",
    cursor: "pointer",
    gap: "8px",
    padding: "6px 0",
    alignSelf: "start",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "#2E2E32"
    }
  },
  gameInfo: {
    background: theme.palette.darkgrey,
    borderRadius: "12px",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      padding: "1px",
      borderRadius: "12px",
      background: theme.accent.primaryGradient,
      WebkitMask: 
        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "12px",
      background: theme.accent.primaryGradient,
      opacity: 0.1,
    }
  },
  multiplierSection: {
    borderRadius: "8px",
    padding: "1rem",
    position: "relative",
    overflow: "hidden",
  },
  payoutSection: {
    borderRadius: "8px",
    padding: "1rem",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: theme.accent.primaryGradient,
      opacity: 0.1,
    }
  },
  multiplier: {
    fontSize: "34px",
    fontWeight: "600",
    textAlign: "center",
  },
  multiplierLabel: {
    fontSize: "14px",
    color: theme.text.secondary,
    textAlign: "center",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    "& > span:first-child": {
      color: theme.text.secondary,
    },
    "& > span:last-child": {
      background: theme.accent.primaryGradient,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: 600,
    }
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  pickRandom: {
    width: "100%",
    padding: "0.75rem",
    fontWeight: 600,
    borderRadius: "6px",
    backgroundColor: theme.bg.inner,
    color: theme.text.secondary,
    textAlign: "center",
    cursor: "pointer",
    transition: "opacity 0.2s",
    position: "relative",
    userSelect: "none",
    "&:hover": {
      opacity: 0.8,
    },
    "@media (max-width: 1200px)": {
      display: "none"
    }
  },
  betButton: {
    order: 0,
    width: "100%",
    "@media (max-width: 1200px)": {
      order: -1, // Move to top
      marginBottom: "1rem",
    }
  },
  betInputsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
    "@media (max-width: 1200px)": {
      display: (props) => props.game && props.game.state !== "completed" ? "none" : "flex"
    }
  },
  mobileGameInfo: {
    display: "none",
    "@media (max-width: 1200px)": {
      display: (props) => props.game && props.game.state !== "completed" ? "block" : "none",
      width: "100%"
    }
  },
  desktopGameInfo: {
    display: "block",
    "@media (max-width: 1200px)": {
      display: "none"
    }
  },
  cashoutButton: {
    width: "100%",
    "@media (max-width: 1200px)": {
      marginTop: "1rem"
    }
  }
}));

const getGameFactorial = (number) => {
  let value = number;
  for (let i = number; i > 1; i--) {
    value = value * (i - 1);
  }
  return value;
};

const getGamePayout = (game, revealedCount = null) => {
  if (!game) return 0;
  
  const revealed = revealedCount !== null ? revealedCount : game.revealed.length;
  let multiplier = 0;

  if (revealed >= 1) {
    const first = 25 === revealed ? 1 : getGameFactorial(25) / (getGameFactorial(revealed) * getGameFactorial(25 - revealed));
    const second = (25 - game.minesCount) === revealed ? 1 : getGameFactorial(25 - game.minesCount) / (getGameFactorial(revealed) * getGameFactorial((25 - game.minesCount) - revealed));

    multiplier = 0.95 * (first / second);
    multiplier = multiplier < 1 ? 1.01 : multiplier;
    multiplier = Math.round(multiplier * 100) / 100;
  }

  return {
    payout: Math.floor(game.amount * multiplier * 100) / 100,
    multiplier
  };
};

const gameInfoVariants = {
  initial: { 
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
};

const Mines = () => {
  const { game, loading, placeBet, revealTile, cashout } = useMines();
  const { playGem, playBomb, playReveal } = useSound();
  const { user, setUser } = useUser();
  const [betAmount, setBetAmount] = useState("");
  const [mineAmount, setMineAmount] = useState(1);
  const [grid, setGrid] = useState(Array(25).fill(0));
  const classes = useStyles({ game });

  useEffect(() => {
    if (!game || game.state === "completed") {
      setBetAmount(game?.amount?.toString() || "");
      setMineAmount(game?.minesCount || 1);
    }
  }, [game?.state]);

  useEffect(() => {
    if (game) {
      const newGrid = Array(25).fill(0);
      if (game.state === "completed") {
        game.deck.forEach((type, index) => {
          newGrid[index] = type === "mine" ? 1 : 2;
        });
      } else {
        game.revealed.forEach(({ tile, value }) => {
          newGrid[tile] = value === "mine" ? 1 : 2;
        });
      }
      setGrid(newGrid);
    } else {
      setGrid(Array(25).fill(0));
    }
  }, [game]);

  useEffect(() => {
    if (game?.state === "completed") {
      const lastReveal = game.revealed[game.revealed.length - 1];
      if (lastReveal?.value === "mine") {
        playBomb();
      } else {
        playReveal();
      }
    }
  }, [game?.state, playBomb, playReveal]);

  const handlePlaceBet = async () => {
    if (!loading && betAmount) {
      try {
        const response = await placeBet(Math.floor(betAmount * 100) / 100, mineAmount);
        setUser(prevUser => ({ ...prevUser, ...response.user }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleTileClick = async (index) => {
    if (game && !loading && !game.revealed.some(r => r.tile === index)) {
      try {
        const response = await revealTile(index);
        if (response.game.revealed[response.game.revealed.length - 1].value === "mine") {
          playBomb();
        } else {
          playGem();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCashout = async () => {
    if (game && !loading && game.state !== "completed") {
      try {
        const response = await cashout();
        setUser(prevUser => ({ ...prevUser, ...response.user }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleBetAmountChange = (value) => {
    if (!user) return;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setBetAmount("");
      return;
    }
    const maxBet = user.balance;
    setBetAmount(Math.floor(Math.min(maxBet, Math.max(0, numValue)) * 100) / 100);
  };

  const handleHalfBet = () => {
    if (!user) return;
    const currentBet = parseFloat(betAmount || 0);
    const newBet = currentBet / 2;
    setBetAmount(Math.floor(newBet * 100) / 100);
  };

  const handleDoubleBet = () => {
    if (!user) return;
    const currentBet = parseFloat(betAmount || 0);
    const newBet = Math.min(user.balance, currentBet * 2);
    setBetAmount(Math.floor(newBet * 100) / 100);
  };

  const handleMaxBet = () => {
    if (!user) return;
    setBetAmount(Math.floor(user.balance * 100) / 100);
  };

  const getCurrentPayout = () => {
    if (!game || game.revealed.length === 0) return { payout: 0, multiplier: 1 };
    const { payout, multiplier } = getGamePayout(game);
    return { payout, multiplier };
  };

  const getNextPayout = () => {
    if (!game) return { payout: 0, multiplier: 1 };
    const { payout, multiplier } = getGamePayout(game, game.revealed.length + 1);
    return { payout, multiplier };
  };

  const renderGrid = () => {
    return grid.map((cell, index) => (
      <Mine 
        key={index}
        bomb={cell === 1}
        gem={cell === 2}
        disabled={!game || loading || game?.state === "completed"}
        onClick={() => handleTileClick(index)}
        revealed={game?.revealed.some(r => r.tile === index)}
        completed={game?.state === "completed"}
      />
    ));
  };

  return (
      <div className={classes.root}>        
        <div className={classes.container}>
          <div className={classes.navigation}>
            <div className={classes.top}>
              <div className={classes.betInputsContainer}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1.5rem" }}>
                  <div className={classes.title}>Bet Amount</div>
                  <Input
                    variant="filled"
                    type="number"
                    value={game?.state === "running" ? game.amount : betAmount}
                    onChange={(e) => handleBetAmountChange(e.target.value)}
                    placeholder="0.00"
                    disabled={game?.state === "running" || loading}
                  />
                  <div className={classes.options}>
                    <div 
                      className={classes.optionButton}
                      onClick={handleHalfBet}
                      style={{ opacity: game?.state === "running" || loading ? 0.5 : 1 }}
                    >
                      1/2
                    </div>
                    <div 
                      className={classes.optionButton}
                      onClick={handleDoubleBet}
                      style={{ opacity: game?.state === "running" || loading ? 0.5 : 1 }}
                    >
                      2x
                    </div>
                    <div 
                      className={classes.optionButton}
                      onClick={handleMaxBet}
                      style={{ opacity: game?.state === "running" || loading ? 0.5 : 1 }}
                    >
                      Max
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div className={classes.title}>Number of Mines</div>
                  <Input
                    variant="filled"
                    type="number"
                    value={game?.state === "running" ? game.minesCount : mineAmount}
                    onChange={(e) => setMineAmount(Math.min(24, Math.max(1, parseInt(e.target.value) || 1)))}
                    placeholder="1"
                    disabled={game?.state === "running" || loading}
                  />
                  <div className={classes.options}>
                    {[1, 3, 5, 10, 24].map((amount) => (
                      <div 
                        key={amount}
                        className={classes.optionButton}
                        onClick={() => setMineAmount(amount)}
                        style={{ opacity: game?.state === "running" || loading ? 0.5 : 1 }}
                      >
                        {amount}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className={classes.mobileGameInfo}>
                {game && game.state !== "completed" && (
                  <div className={classes.gameInfo}>
                    <div className={classes.multiplierSection}>
                      <div className={classes.multiplier}>
                        <NumberFlow
                          value={getCurrentPayout().multiplier.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          duration={300}
                          decimals={2}
                          style={{ minimumFractionDigits: 2, maximumFractionDigits: 2, }}
                          prefix="x"
                        />
                      </div>
                      <div className={classes.multiplierLabel}>Current multiplier</div>
                    </div>
                    <div className={classes.payoutSection}>
                      <div className={classes.infoRow}>
                        <span>Current Cashout</span>
                        <span>${getCurrentPayout().payout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className={classes.infoRow}>
                        <span>Next Tile</span>
                        <span>${getNextPayout().payout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({getNextPayout().multiplier.toFixed(2)}x)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {game && game.state !== "completed" ? (
                <motion.div
                  key="game-info"
                  variants={gameInfoVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={classes.betButton}
                >
                  <div className={`${classes.gameInfo} ${classes.desktopGameInfo}`}>
                    <div className={classes.multiplierSection}>
                      <div className={classes.multiplier}>
                        <NumberFlow
                          value={getCurrentPayout().multiplier.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          duration={300}
                          decimals={2}
                          style={{ minimumFractionDigits: 2, maximumFractionDigits: 2, }}
                          prefix="x"
                        />
                      </div>
                      <div className={classes.multiplierLabel}>Current multiplier</div>
                    </div>
                    <div className={classes.payoutSection}>
                      <div className={classes.infoRow}>
                        <span>Current Cashout</span>
                        <span>${getCurrentPayout().payout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className={classes.infoRow}>
                        <span>Next Tile</span>
                        <span>${getNextPayout().payout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({getNextPayout().multiplier.toFixed(2)}x)</span>
                      </div>
                    </div>
                  </div>
                  <div className={classes.buttonsContainer}>
                    <PrimaryButton 
                      label={`Cashout $${getCurrentPayout().payout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      style={{ width: "100%", minWidth: "268px", background: theme.accent.primaryGradient }}
                      onClick={handleCashout}
                      disabled={loading}
                      className={classes.desktopGameInfo}
                    />
                    <motion.div 
                      className={classes.pickRandom}
                      onClick={() => {
                        const availableTiles = Array.from({ length: 25 }, (_, i) => i)
                          .filter(i => !game.revealed.some(r => r.tile === i));
                        if (availableTiles.length > 0) {
                          const randomTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
                          handleTileClick(randomTile);
                        }
                      }}
                    >
                      Pick Random
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="place-bet"
                  variants={gameInfoVariants}
                  animate="animate"
                  initial="initial"
                  exit="exit"
                  className={classes.betButton}
                >
                  <PrimaryButton 
                    label="Place Bet"
                    style={{ width: "100%", minWidth: "268px" }}
                    onClick={handlePlaceBet}
                    disabled={loading}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={classes.minesBox}>
            <div className={classes.minesGrid}>
              {renderGrid()}
            </div>     
          </div>
        </div>
      </div>
  );
};

export default Mines;