import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useBattles } from '../contexts/battles';
import { useNotification } from '../contexts/notification';
import { battlesSocketService } from '../services/sockets/battles.socket.service';

// Components
import TopSection from '../components/battles/game/TopSection';
import SpinnerSection from '../components/battles/game/SpinnerSection';
import PlayerSection from '../components/battles/game/PlayerSection';

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
  },
  mobileBreakpoint: {
    [theme.breakpoints.down('lg')]: {
      maxWidth: '100%',
    }
  }
}));

const BattlesGame = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  const { games, gameData } = useBattles();
  const notify = useNotification();
  const [game, setGame] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1200);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Current round number (0 index)
  const roundNumber = React.useMemo(() => {
    return game ? (game.bets[0]?.outcomes.length - 1 || 0) : 0;
  }, [game]);

  // Format boxes from game.boxes, expanding based on the count attribute
  const boxes = React.useMemo(() => {
    return game ? game.boxes.flatMap(box => 
      Array.from({ length: box.count }, (_, index) => ({
        ...box.box,
      }))
    ) : [];
  }, [game]);

  // Format outcome tickets into items for ease of use
  const items = React.useMemo(() => {
    if (!game) return [];
    
    const battlesGetItemsFormated = (box, items) => {
      for(let item of items) {
        const casePrice = box.amount;
        const itemPrice = item.item.amountFixed;
        const ratio = itemPrice / casePrice;
  
        if(ratio >= 9) { 
          item.color = 'gold'; // 9x or more (insane)
        } else if(ratio >= 5) { 
          item.color = 'red'; // 5x-9x (high)
        } else if(ratio >= 1.8) { 
          item.color = 'purple'; // 1.8x-5x (profit)
        } else if(ratio >= 0.8) { 
          item.color = 'blue'; // 0.8x-1.8x (break even ish)
        } else {
          item.color = 'white'; // < 0.8x (loss)
        }
      }
      return items;
    };

    const battlesGetOutcomeItem = (outcome, items, box) => {
      let outcomeItem = null;
      let pos = 0;

      for(const item of battlesGetItemsFormated(box,items)) {
          pos = pos + item.tickets;
          if(outcome <= pos) { outcomeItem = item; break; }
      }

      return outcomeItem;
    };
    
    return Array.from({ length: game.playerCount }, (_, index) => {
      const fakeItems = Array.from({ length: boxes.length - roundNumber - 1 }, (_, index) => {
        return {
  
        }
      });

      const realItems = game.bets[index]?.outcomes.map((outcome, index) => ({
        ...battlesGetOutcomeItem(outcome, boxes[index]?.items || [], boxes[index])
      })) || [];

      return [...realItems, ...fakeItems]
    });
  }, [game, boxes, roundNumber]);

  // Format players from bets
  const players = React.useMemo(() => {
    if (!game || !game.bets) return [];
    
    // Create an array of empty slots first
    const allPlayers = Array(game.playerCount).fill(null).map((_, index) => ({ 
      _id: null,
      username: null,
      avatar: null,
      rank: null,
      level: null,
      slot: index,
      items: items[index],
      bot: false,
      payout: 0
    }));

    // Fill in the real players at their correct slot positions
    game.bets.forEach((bet) => {
      allPlayers[bet.slot] = {
        _id: bet.bot ? 'bot' : bet.user._id,
        username: bet.user.username,
        avatar: bet.user.avatar,
        rank: bet.user.rank,
        level: bet.user.level,
        slot: bet.slot,
        items: items[bet.slot],
        bot: bet.bot,
        payout: bet.payout
      };
    });
    
    return allPlayers;
  }, [game, items]);

  // Find the current game from the games array
  useEffect(() => {
    const fetchGameData = async () => {
      const response = await gameData(id);
      if (response && response.game) {
        setGame(response.game);
      } else {
        notify.error('Battle not found.');
        navigate('/box-battles');
      }
    };

    const foundGame = games.find(g => g._id === id);
    if (foundGame) {
      setGame(foundGame);
    } else {
      fetchGameData();
    }
  }, [games, id, gameData, notify, navigate]);

  const handleRecreateBattle = async () => {
    try {
      const response = await battlesSocketService.sendCreate({
        playerCount: game.playerCount,
        mode: game.mode,
        boxes: game.boxes.map(b => ({ _id: b.box._id, count: b.count })),
        cursed: game.options.cursed,
        terminal: game.options.terminal,
        jackpot: game.options.jackpot,
        bigSpin: game.options.bigSpin,
        crazyMode: game.options.crazyMode
      });

      setGame(null);
      navigate(`/box-battles/${response.game._id}`);
      notify.success('Battle recreated successfully!');
    } catch (err) {
      notify.error(err?.message || 'Failed to recreate battle');
    }
  };

  if (!game) return null; // Wait until game is set

  return (
      <div className={`${classes.container} ${classes.mobileBreakpoint}`}>
        <TopSection 
          game={game}
          boxes={boxes}
          gameOptions={game.options}
          isMobile={isMobile}
        />
        
        <SpinnerSection 
          players={players}
          gameMode={game.mode}
          playerCount={game.playerCount}
          gameState={game.state}
          boxes={boxes}
          game={game}
          handleRecreate={handleRecreateBattle}
          isMobile={isMobile}
        />
        
        <PlayerSection 
          players={players}
          playerCount={game.playerCount}
          game={game}
          isMobile={isMobile}
          boxes={boxes}
        />
      </div>
  );
};

export default BattlesGame; 