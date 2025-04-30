import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BattleCard from "../components/battles/overview/BattleCard";
import { useBattles } from '../contexts/battles';
import PrimaryButton from "../components/common/buttons/PrimaryButton";
import theme from "../styles/theme"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    color: "#fff",
    justifyContent: "center",
    marginBottom: "15rem"
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(4)
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.text.primary,
    display: "flex",
    gap: theme.spacing(1.5),
    alignItems: "center"
  },
  buttonContainer: {
    display: "flex",
    gap: theme.spacing(1)
  },
  createButton: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    backgroundColor: theme.blue,
    color: theme.text.primary,
    padding: "10px 20px",
    borderRadius: 6,
    cursor: "pointer",
    userSelect: "none",
    fontSize: 14,
    fontWeight: 600
  },
  subHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2)
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.text.primary
  },
  sortContainer: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    color: theme.text.secondary,
    fontWeight: 600
  },
  switchContainer: {
    width: 40,
    height: 20,
    backgroundColor: theme.bg.box,
    borderRadius: 10,
    padding: "2px",
    cursor: "pointer"
  },
  switchNob: {
    width: 16,
    height: 16,
    backgroundColor: "#FFFFFF",
    opacity: 0.8,
    borderRadius: "50%"
  },
  battlesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2)
  }
}));

const BattlesOverview = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { battles } = useBattles();
    
  const [sortByValue, setSortByValue] = useState(false);

  const sortedGames = React.useMemo(() => {
    const waitingGames = battles.games.filter(g => g.state === 'created');
    const activeGames = battles.games.filter(g => ['countdown', 'pending', 'rolling'].includes(g.state));
    const historyGames = battles.history;

    const sortFunction = (a, b) => {
      if (sortByValue) {
        return b.amount - a.amount;
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    };

    return [
      ...waitingGames.sort(sortFunction),
      ...activeGames.sort(sortFunction),
      ...historyGames.sort(sortFunction)
    ];
  }, [battles.games, battles.history, sortByValue]);

  return (  
    <div className={classes.root}>
      <div className={classes.container}>
        {/*<div className={classes.header}>
          <div className={classes.title}>
            Case Battles
          </div>
          
        </div>*/}

        <div className={classes.subHeader}>
          <div className={classes.sortContainer}>
            Highest value
            <motion.div 
              className={classes.switchContainer} 
              onClick={() => setSortByValue(!sortByValue)}
              style={{ backgroundColor: sortByValue ? theme.bg.border : theme.bg.box}}
            >
              <motion.div 
                className={classes.switchNob}
                animate={{
                  x: sortByValue ? 20 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            </motion.div>
          </div>
          <div className={classes.buttonContainer}>
            <PrimaryButton onClick={() => navigate("/box-battles/create")} label={'Create Battle'} style={{ padding: "10px 28px" }} />
          </div>
        </div>

        <div className={classes.battlesContainer}>
          <AnimatePresence initial={false} mode="popLayout">
            {sortedGames.map((game) => (
              <motion.div 
                key={game._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <BattleCard game={game} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BattlesOverview;
