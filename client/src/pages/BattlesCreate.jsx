import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { battlesSocketService } from "../services/sockets/battles.socket.service";
import theme from "../styles/theme.js";

import { useUnbox } from '../contexts/unbox';
import { useNotification } from "../contexts/notification";

import AddCasesModel from "../components/battles/create/AddCasesModel";
import SelectedCase from "../components/battles/create/SelectedCase";
import useLocalStorage from '../hooks/useLocalStorage';

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    color: "#fff",
    justifyContent: "center",
    minHeight: "100vh",
    marginBottom: "10rem"
  },
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    gap: "32px",
    display: "flex",
    flexDirection: "column",
    "@media (max-width: 1200px)": {
      gap: "24px"
    }
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    cursor: "pointer",
    color: theme.text.secondary,
    userSelect: "none",
    width: "fit-content",
    fontSize: 14,
    "&:hover": {
        color: theme.text.primary,
    },
    "@media (max-width: 1200px)": {
      fontSize: 12
    }
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    "@media (max-width: 1200px)": {
      gap: theme.spacing(0.5)
    }
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.text.primary,
    "@media (max-width: 1200px)": {
      fontSize: 20
    }
  },
  createButton: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.text.primary,
    background: theme.accent.primaryGradient,
    padding: "12px 24px",
    height: 40,
    borderRadius: theme.spacing(0.75),
    cursor: "pointer",
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1),
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", 
    transition: "all 0.2s ease",
    "&:hover": {
      opacity: 0.8
    },
    "& span": {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(0.5),
      "& img": {
        width: 14,
        height: 14,
        position: "relative",
        top: -1
      }
    },
    "@media (max-width: 1200px)": {
      fontSize: 12,
      padding: "8px 16px",
      height: 36
    }
  },
  subtitle: {
    fontSize: 16,
    color: theme.text.secondary,
    fontWeight: 500,
    "@media (max-width: 1200px)": {
      fontSize: 14
    }
  },
  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: theme.bg.border + "66",
  },
  navContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      gap: theme.spacing(2),
      alignItems: "flex-start"
    }
  },
  modeContainer: {
    display: "flex",
    gap: theme.spacing(1.5),
    "@media (max-width: 1200px)": {
      width: "100%",
      justifyContent: "space-between"
    }
  },
  addCasesContainer: {
    display: "flex",
    gap: "24px",
    flexDirection: "column",
    "@media (max-width: 1200px)": {
      gap: "16px"
    }
  },
  topContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      gap: theme.spacing(2),
      alignItems: "flex-start"
    }
  },
  addCasesTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.text.primary,
    "@media (max-width: 1200px)": {
      fontSize: 14
    }
  },
  addCasesSubtitle: {
    fontSize: 14,
    color: theme.text.secondary,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    fontWeight: 600,
    "@media (max-width: 1200px)": {
      fontSize: 12
    }
  },
  switchContainer: {
    width: 40,
    height: 20,
    backgroundColor: (props) => props.active ? 'rgba(27, 150, 237, 0.2)' : theme.bg.box,
    borderRadius: 10,
    padding: "2px",
    cursor: "pointer",
    position: "relative"
  },
  addBoxesContent: {
    display: "flex",
    gap: 10,
    overflow: "visible",
    paddingBottom: 0,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    "@media (max-width: 1200px)": {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "10px"
    }
  },  
  addBoxBox: {
    height: 262,
    minWidth: 190,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    gap: "12px",
    cursor: "pointer",
    color: theme.text.primary,
    background: theme.bg.box,
    fontWeight: 600,
    "& div": {
      background: theme.bg.inner,
      color: theme.text.primary,
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 48,
      width: 48,
    },
    "@media (max-width: 1200px)": {
      height: 200,
      minWidth: "calc(50% - 5px)",
      flexDirection: "column",
      justifyContent: "center",
      padding: theme.spacing(2),
      "& div": {
        height: 40,
        width: 40
      }
    }
  },
  reorderGroup: {
    display: "flex",
    gap: 10,
    width: "100%",
    listStyle: "none",
    padding: 0,
    margin: 0,
    overflow: "visible",
    alignItems: "flex-start",
    overflowX: "auto",
    '&::-webkit-scrollbar': {
      height: 5,
      width: 5,
      background: theme.bg.box,
      borderRadius: 10,
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.bg.border,
      borderRadius: 10,
    },
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      gap: theme.spacing(1)
    }
  },
  reorderItem: {
    flex: "0 0 192px",
    height: "243px",
    listStyle: "none",
    padding: 0,
    margin: 0,
    position: "relative",
    "@media (max-width: 1200px)": {
      flex: "0 0 auto",
      width: "100%",
      height: "auto"
    }
  },
  extraOptionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    "@media (max-width: 1200px)": {
      gap: theme.spacing(1)
    }
  },
  extraOptionsTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.text.primary,
    marginBottom: theme.spacing(1),
    "@media (max-width: 1200px)": {
      fontSize: 14
    }
  },
  extraOptionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: theme.spacing(2),
    "@media (max-width: 1200px)": {
      gridTemplateColumns: "1fr",
      gap: theme.spacing(1)
    }
  },
  optionsGroup: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1)
  },
  toggleLabel: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    "& svg": {
      width: 20,
      height: 20
    }
  },
  toggleText: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.text.primary
  },
  switchNob: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    backgroundColor: (props) => props.active ? '#1B96ED' : '#FFFFFF',
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    position: "absolute",
    top: 0,
    left: -18,
    right: 0,
    bottom: 0,
    margin: "auto",
  },
  selectedCase: {
    backgroundColor: "rgba(31, 36, 51, 0.5)",
    borderRadius: theme.spacing(0.75),
    padding: theme.spacing(2),
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(31, 36, 51, 0.8)",
    }
  },
  caseImage: {
    width: "100%",
    height: "auto",
    objectFit: "contain"
  },
  caseInfo: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.5)
  },
  caseName: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.text.primary
  },
  casePrice: {
    fontSize: 12,
    color: theme.text.secondary,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5)
  },
  playerModeContainer: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(2),
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      width: "100%"
    }
  },
  modeSection: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    "@media (max-width: 1200px)": {
      width: "100%"
    }
  },
  modeLabel: {
    fontSize: 14,
    color: theme.text.secondary,
    fontWeight: 500,
    "@media (max-width: 1200px)": {
      fontSize: 12
    }
  },
  modeButtons: {
    display: "flex",
    gap: theme.spacing(1),
    "@media (max-width: 1200px)": {
      flexWrap: "wrap"
    }
  },
  playerButton: {
    padding: "8px 16px",
    borderRadius: "6px",
    backgroundColor: `${theme.bg.box}`,
    color: theme.text.secondary,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    height: 40,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid transparent`,
    "&:hover": {
      border: `1px solid ${theme.bg.border}`,
      color: theme.text.primary
    },
    "&.active": {
      border: `1px solid ${theme.bg.border}`,
      backgroundColor: theme.bg.inner,
      color: theme.text.primary,
    },
    "@media (max-width: 1200px)": {
      fontSize: 12,
      height: 36,
      padding: "6px 12px",
      flex: "1 1 calc(50% - 8px)"
    }
  },
  bottomContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(2),
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      gap: theme.spacing(2),
      alignItems: "flex-start"
    }
  },
  totalInfo: {
    display: "flex",
    gap: theme.spacing(3),
    alignItems: "center",
    fontSize: 14,
    color: theme.text.primary,
    "@media (max-width: 1200px)": {
      fontSize: 12,
      gap: theme.spacing(2)
    }
  },
  totalInfoItem: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.5),
    fontWeight: 600,
    "& div:first-child": {
    color: theme.text.secondary,
    fontWeight: 500
    },
    "@media (max-width: 1200px)": {
      fontSize: 12
    }
  },
  createButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    "@media (max-width: 1200px)": {
      width: "100%",
      justifyContent: "space-between",
      gap: "4px"
    }
  },
  gameModeButtons: {
    position: 'relative',
    display: 'flex',
    backgroundColor: theme.bg.box,
    borderRadius: '6px',
    padding: '4px',
    height: '40px',
    alignItems: 'center',
    "@media (max-width: 1200px)": {
      width: "100%",
      height: "36px"
    }
  },
  gameModeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    position: 'relative',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    color: theme.text.secondary,
    transition: 'all 0.2s ease',
    zIndex: 1,
    height: '32px',
    '&.active': {
      color: theme.text.primary
    },
    "@media (max-width: 1200px)": {
      fontSize: "12px",
      padding: "6px 12px",
      flex: 1,
      height: '28px'
    }
  },
  highlight: {
    position: 'absolute',
    height: '32px',
    top: '4px',
    borderRadius: '6px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: ({ selectedMode }) => {
      switch(selectedMode) {
        case 'normal': return '#1B96ED';
        case 'group': return '#41FF6A';
        case 'showdown': return '#FFD04D';
        case 'jackpot': return '#FF589E';
        default: return '#1B96ED';
      }
    },
    "@media (max-width: 1200px)": {
      height: '28px',
      top: '4px'
    }
  },
  switchGroup: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  switchItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: 14,
    backgroundColor: theme.bg.box,
    padding: "8px 16px",
    borderRadius: theme.spacing(1),
    cursor: "pointer",
    transition: "all 0.2s ease",
    height: 40,
    position: 'relative',
    fontWeight: 600,
    color: (props) => props.active ? theme.text.primary : theme.text.secondary,
    '& span': {
      color: (props) => props.active ? theme.text.primary : theme.text.secondary,
      opacity: (props) => props.active ? 1 : 0.7,
    },
    "@media (max-width: 1200px)": {
      fontSize: 12,
      padding: "6px 12px",
      height: 36,
      minWidth: "auto",
      flex: 1
    }
  },  
  infoIcon: {
    position: 'relative',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover > div': {
      opacity: 1,
      visibility: 'visible'
    }
  },
  infoTooltip: {
    position: 'absolute',
    bottom: '175%',
    left: '50%',
    width: 250,
    transform: 'translateX(-50%)',
    backgroundColor: theme.bg.box,
    color: theme.text.secondary,
    padding: '12px',
    borderRadius: '6px',
    fontSize: 10,
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.2s ease',
    zIndex: 2000,
    lineHeight: 1.4,
    whiteSpace: 'normal',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderWidth: '6px',
      borderStyle: 'solid',
      borderColor: `${theme.bg.box} transparent transparent transparent`
    }
  },
}));

const BattlesCreate = () => {
  const [selectedMode, setSelectedMode] = useLocalStorage('battle_selectedMode', "normal");
  const classes = useStyles({ selectedMode });
  const navigate = useNavigate();
  const notify = useNotification();
  const { boxes: cases } = useUnbox();

  const [players, setPlayers] = useLocalStorage('battle_players', [2, false]);
  const [bigSpin, setBigSpin] = useLocalStorage('battle_bigSpin', false);
  const [crazyMode, setCrazyMode] = useLocalStorage('battle_crazyMode', false);
  const [selectedCases, setSelectedCases] = useState([]);
  const [showcasePopup, setShowcasePopup] = useState(false);
  const [customSorting, setCustomSorting] = useLocalStorage('battle_customSorting', false);
  const location = useLocation();

  useEffect(() => {
    if (selectedMode === "group") {
      setPlayers(prev => [prev[0], true]);
    } else {
      setPlayers(prev => [prev[0], false]);
    }
  }, [selectedMode]);

  useEffect(() => {
    if (["jackpot", "group"].includes(selectedMode)) {
      setCrazyMode(false);
    }
  }, [selectedMode]);

  useEffect(() => {
    if (location.state?.previousSettings) {
      const ps = location.state.previousSettings;
      
      // Properly map all options
      setSelectedCases(ps.boxes.map(b => ({
        ...b.box,
        quantity: b.count,
        _id: b.box._id
      })));
      
      // Map battle mode correctly
      let mode = 'normal';
      if (ps.options.jackpot) mode = 'jackpot';
      else if (ps.options.terminal) mode = 'showdown';
      else if (ps.mode === 'group') mode = 'group';
      setSelectedMode(mode);

      // Set player count and team status
      const isTeam = ps.mode === 'team';
      setPlayers([
        isTeam ? ps.playerCount === 4 ? 7 : ps.playerCount === 6 ? 8 : ps.playerCount : ps.playerCount,
        isTeam,
      ]);


      setBigSpin(ps.options.bigSpin);
      setCrazyMode(ps.options.crazyMode);
      setCustomSorting(true);
    }
  }, [location.state]);

  const calculateTotalAmount = () => {
    return selectedCases.reduce((total, caseItem) => {
      const price = caseItem.amount || 0;
      const quantity = caseItem.quantity || 1;
        return total + (price * quantity);
    }, 0);
  };

  const handleCreateBattle = async () => {
    try {
      let formattedCases = selectedCases.map(c => ({ 
        _id: c._id, 
        count: c.quantity || 1 
      }));

      if (!customSorting) {
        formattedCases = [...formattedCases].sort((a, b) => a.amount - b.amount);
      }

      let gameMode = "standard";
      if (players[1]) {
        gameMode = "team";
      } 
      if (selectedMode === "group") {
        gameMode = "group";
      }

      const battleData = {
        playerCount: players[0] === 7 ? 4 : players[0] === 8 ? 6 : players[0],
        mode: players[0] === 7 || players[0] === 8 ? "team" : gameMode,
        boxes: formattedCases,
        levelMin: 0,
        funding: 0,
        private: false,
        affiliateOnly: false,
        cursed: crazyMode,
        terminal: selectedMode === "showdown",
        jackpot: selectedMode === "jackpot",
        bigSpin: bigSpin,
      };

      const response = await battlesSocketService.sendCreate(battleData);
      notify.success('Battle created successfully!');
      navigate(`/box-battles/${response.game._id}`);
    } catch (err) {
      notify.error(err?.message || 'Failed to create battle');
    }
  };

  const addCase = (caseItem) => {
    setSelectedCases(prevCases => {
      const existingCase = prevCases.find(c => c._id === caseItem._id);
      if (existingCase) {
        return prevCases.map(c => 
          c._id === caseItem._id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        return [...prevCases, { ...caseItem, quantity: 1 }];
      }
    });
  };

  const subtractCase = (caseItem) => {
    setSelectedCases(prevCases => {
      const existingCase = prevCases.find(c => c._id === caseItem._id);
      if (!existingCase) return prevCases;

      if (existingCase.quantity > 1) {
        return prevCases.map(c => 
          c._id === caseItem._id ? { ...c, quantity: c.quantity - 1 } : c
        );
      } else {
        return prevCases.filter(c => c._id !== caseItem._id);
      }
    });
  };

  const renderPlayerSelection = () => {
    const isGroupMode = selectedMode === "group";
    const playerCounts = isGroupMode ? [2, 3, 4, 6] : [2, 3, 4, 6, 7, 8];

    return (
      <motion.div className={classes.modeButtons}>
        {playerCounts.map(count => {
          const label = isGroupMode 
            ? `${count} Players` 
            : count === 2 ? '1v1' :
                count === 3 ? '1v1v1' :
                count === 4 ? '1v1v1v1' :
                count === 6 ? '1v1v1v1v1v1' :
                count === 7 ? '2v2' : '3v3'
          
          return (
            <motion.div
              key={count}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <div 
                className={`${classes.playerButton} ${players[0] === count ? 'active' : ''}`}
                onClick={() => setPlayers([count, count === 7 || count === 8])}
              >
                {label}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  const buttonRefs = {
    normal: useRef(null),
    group: useRef(null),
    showdown: useRef(null),
    jackpot: useRef(null)
  };
  const highlightRef = useRef(null);

  useEffect(() => {
    const activeButton = buttonRefs[selectedMode]?.current;
    const highlight = highlightRef.current;
    
    if (activeButton && highlight) {
      const { offsetLeft, offsetWidth } = activeButton;
      highlight.style.width = `${offsetWidth}px`;
      highlight.style.left = `${offsetLeft}px`;
    }
  }, [selectedMode]);

  useEffect(() => {
    if (!customSorting) {
      setSelectedCases(prev => [...prev].sort((a, b) => a.amount - b.amount));
    }
  }, [customSorting]);

  return (
    <div className={classes.root}>
      <AddCasesModel 
        open={showcasePopup}  
        handleClose={() => setShowcasePopup(false)} 
        add={(caseItem) => addCase(caseItem)}
        subtract={(caseItem) => subtractCase(caseItem)}
        cases={cases}
        selectedCases={selectedCases}
      />
      <div className={classes.container}>
        <div className={classes.backButton} onClick={() => navigate("/box-battles")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><g clipPath="url(#clip0_132_11242)"><path d="M17.5 9.16667H5.69167L8.67917 6.17917L7.5 5L2.5 10L7.5 15L8.67917 13.8208L5.69167 10.8333H17.5V9.16667Z" fill="currentColor"/></g><defs><clipPath id="clip0_132_11242"><rect width="20" height="20" fill="currentColor"/></clipPath></defs></svg>
          Back to Battles
        </div>
        <div className={classes.topContainer}>
          <div className={classes.titleContainer}>
            <div className={classes.title}>Create Battle</div>
            <div className={classes.subtitle}>Select game mode and how many players you want</div>
          </div>
          
        </div>
        <div className={classes.navContainer}>
          <div className={classes.playerModeContainer}>
            {renderPlayerSelection()}
          </div>
          <div className={classes.gameModeButtons}>
            <div 
              ref={highlightRef}
              className={classes.highlight}
            />
            <div 
              ref={buttonRefs.normal}
              className={`${classes.gameModeButton} ${selectedMode === 'normal' ? 'active' : ''}`}
              onClick={() => setSelectedMode('normal')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="m7.05 13.406 3.534 3.536-1.413 1.414 1.415 1.415-1.414 1.414-2.475-2.475-2.829 2.829-1.414-1.414 2.83-2.83-2.476-2.474 1.414-1.414 1.414 1.413 1.413-1.414zM3 3l3.546.003 11.817 11.818 1.415-1.414 1.414 1.414-2.474 2.475 2.828 2.829-1.414 1.414-2.829-2.829-2.475 2.475-1.414-1.414 1.414-1.415L3.003 6.531zm14.457 0L21 3.003l.002 3.523-4.053 4.052-3.536-3.535z"/>
              </svg>
              Normal
            </div>
            <div 
              ref={buttonRefs.group}
              className={`${classes.gameModeButton} ${selectedMode === 'group' ? 'active' : ''}`}
              onClick={() => setSelectedMode('group')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M11 9.75004V11.25H0.5V9.75004C0.5 9.75004 0.5 6.75004 5.75 6.75004C11 6.75004 11 9.75004 11 9.75004ZM8.375 2.62504C8.375 2.10586 8.22105 1.59835 7.93261 1.16667C7.64417 0.734989 7.2342 0.398536 6.75454 0.199856C6.27489 0.00117575 5.74709 -0.050808 5.23789 0.0504782C4.72869 0.151764 4.26096 0.401771 3.89384 0.768884C3.52673 1.136 3.27673 1.60373 3.17544 2.11293C3.07415 2.62213 3.12614 3.14993 3.32482 3.62958C3.5235 4.10924 3.85995 4.51921 4.29163 4.80765C4.72331 5.09609 5.23082 5.25004 5.75 5.25004C6.44619 5.25004 7.11387 4.97348 7.60616 4.48119C8.09844 3.98891 8.375 3.32123 8.375 2.62504ZM10.955 6.75004C11.4161 7.10685 11.7933 7.56036 12.0603 8.07867C12.3272 8.59698 12.4773 9.16748 12.5 9.75004V11.25H15.5V9.75004C15.5 9.75004 15.5 7.02754 10.955 6.75004ZM10.25 3.94343e-05C9.73377 -0.0028351 9.22889 0.151506 8.8025 0.44254C9.25808 1.07909 9.50304 1.84225 9.50304 2.62504C9.50304 3.40782 9.25808 4.17099 8.8025 4.80754C9.22889 5.09857 9.73377 5.25291 10.25 5.25004C10.9462 5.25004 11.6139 4.97348 12.1062 4.48119C12.5984 3.98891 12.875 3.32123 12.875 2.62504C12.875 1.92885 12.5984 1.26117 12.1062 0.768884C11.6139 0.276601 10.9462 3.94343e-05 10.25 3.94343e-05Z" fill="currentColor"/>
              </svg>                
              Group
            </div>
            <div 
              ref={buttonRefs.showdown}
              className={`${classes.gameModeButton} ${selectedMode === 'showdown' ? 'active' : ''}`}
              onClick={() => setSelectedMode('showdown')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.3482 2.63793C14.0912 1.37873 12.4894 0.521029 10.7454 0.173328C9.00143 -0.174372 7.19364 0.00354495 5.55069 0.684576C3.90774 1.36561 2.50343 2.51916 1.5154 3.99931C0.527368 5.47947 0 7.21974 0 9C0 10.7803 0.527368 12.5205 1.5154 14.0007C2.50343 15.4808 3.90774 16.6344 5.55069 17.3154C7.19364 17.9965 9.00143 18.1744 10.7454 17.8267C12.4894 17.479 14.0912 16.6213 15.3482 15.3621C16.1883 14.5298 16.8553 13.5389 17.3105 12.4469C17.7656 11.3549 18 10.1833 18 9C18 7.8167 17.7656 6.64514 17.3105 5.55311C16.8553 4.46107 16.1883 3.47024 15.3482 2.63793ZM8.91592 11.6379L7.84647 15.6197C7.82597 15.6956 7.77744 15.7609 7.71069 15.8024C7.64394 15.8439 7.56394 15.8584 7.48688 15.8431C6.18621 15.5831 4.99159 14.9433 4.05372 14.0044C3.11586 13.0654 2.47677 11.8694 2.21709 10.5672C2.2018 10.4901 2.21634 10.41 2.25777 10.3432C2.2992 10.2763 2.36444 10.2278 2.44028 10.2072L6.42672 9.13655C6.47061 9.12506 6.51648 9.12335 6.5611 9.13155C6.60572 9.13975 6.64799 9.15765 6.68495 9.18399C6.7219 9.21033 6.75263 9.24447 6.77496 9.284C6.7973 9.32353 6.81069 9.36748 6.81421 9.41276C6.85495 9.88146 7.05905 10.3209 7.39078 10.6541C7.72239 10.9876 8.16221 11.1912 8.63074 11.2283C8.67815 11.23 8.72454 11.2427 8.76632 11.2652C8.80809 11.2877 8.84415 11.3195 8.8717 11.3582C8.89925 11.3969 8.91757 11.4414 8.92524 11.4883C8.9329 11.5351 8.92972 11.5832 8.91592 11.6286V11.6379ZM9.82109 6.73759C9.39581 6.53645 8.91299 6.49313 8.45876 6.61534C8.00454 6.73756 7.60846 7.01736 7.34119 7.40483C7.3154 7.44229 7.2817 7.47361 7.24247 7.49658C7.20325 7.51955 7.15946 7.5336 7.11421 7.53775C7.06896 7.54189 7.02335 7.53603 6.98061 7.52056C6.93788 7.5051 6.89906 7.48043 6.86691 7.44828L3.93752 4.52793C3.88347 4.47038 3.85337 4.39435 3.85337 4.31535C3.85337 4.23635 3.88347 4.16032 3.93752 4.10276C4.81216 3.10826 5.96087 2.39474 7.23932 2.05184C8.51777 1.70894 9.86894 1.75197 11.123 2.17552C11.1969 2.20111 11.2584 2.2537 11.2952 2.32276C11.332 2.39182 11.3414 2.47225 11.3214 2.54793L10.2551 6.53586C10.2436 6.58017 10.2224 6.62139 10.1931 6.65654C10.1638 6.6917 10.1271 6.71993 10.0856 6.73921C10.0441 6.75849 9.9989 6.76835 9.95317 6.76807C9.90743 6.76779 9.86233 6.75738 9.82109 6.73759ZM13.9315 14.0897C13.874 14.1438 13.7981 14.1739 13.7192 14.1739C13.6403 14.1739 13.5643 14.1438 13.5068 14.0897L10.5868 11.1693C10.5548 11.1369 10.5304 11.0979 10.5152 11.055C10.5 11.012 10.4944 10.9663 10.4988 10.921C10.5033 10.8757 10.5176 10.8319 10.5408 10.7927C10.5641 10.7536 10.5956 10.7201 10.6333 10.6945C11.0188 10.4257 11.2971 10.0291 11.4191 9.57487C11.541 9.12061 11.4987 8.63783 11.2997 8.21173C11.2799 8.17064 11.2694 8.1257 11.2689 8.08008C11.2685 8.03447 11.278 7.98932 11.297 7.94783C11.3159 7.90635 11.3438 7.86955 11.3785 7.84007C11.4133 7.81058 11.4541 7.78913 11.4981 7.77724L15.5001 6.68173C15.5761 6.66088 15.6572 6.66982 15.7269 6.70672C15.7965 6.74361 15.8496 6.8057 15.8751 6.88035C16.2995 8.13847 16.3429 9.49412 15.9998 10.7769C15.6568 12.0596 14.9426 13.2122 13.947 14.0897H13.9315Z" fill="currentColor"/>
              </svg>
              Showdown
            </div>
            <div 
              ref={buttonRefs.jackpot}
              className={`${classes.gameModeButton} ${selectedMode === 'jackpot' ? 'active' : ''}`}
              onClick={() => setSelectedMode('jackpot')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                <path d="M13.8725 4.625L12.17 2.9225C12.2225 2.6075 12.305 2.315 12.41 2.06C12.47 1.925 12.5 1.7825 12.5 1.625C12.5 1.0025 11.9975 0.5 11.375 0.5C10.145 0.5 9.0575 1.0925 8.375 2H4.625C2.345 2 0.5 3.845 0.5 6.125C0.5 8.405 2.375 14.75 2.375 14.75H6.5V13.25H8V14.75H12.125L13.385 10.5575L15.5 9.8525V4.625H13.8725ZM8.75 5.75H5V4.25H8.75V5.75ZM11 7.25C10.5875 7.25 10.25 6.9125 10.25 6.5C10.25 6.0875 10.5875 5.75 11 5.75C11.4125 5.75 11.75 6.0875 11.75 6.5C11.75 6.9125 11.4125 7.25 11 7.25Z" fill="currentColor"/>
              </svg>
              Jackpot
            </div>
          </div>
        </div>

        <div className={classes.divider} />
        <div className={classes.addCasesContainer}>
          <div className={classes.topContainer}>
            <div className={classes.addCasesTitle}>Add Boxes</div>
            <div className={classes.addCasesSubtitle}>
              Custom Sorting
              <motion.div 
                className={classes.switchContainer} 
                onClick={() => setCustomSorting(!customSorting)}
                style={{ backgroundColor: customSorting ? "#3F4347" : "#232527", padding: "11px"}}
                >
                <motion.div 
                  className={classes.switchNob}
                  animate={{
                    x: customSorting ? 18 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              </motion.div>
            </div>
          </div>
          <div className={classes.addBoxesContent}>
            <div className={classes.addBoxBox} onClick={() => setShowcasePopup(true)}>
              <div><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="currentColor"/></svg></div>
              Add Box
            </div>
            <Reorder.Group 
              as="ul"
              axis="x" 
              values={selectedCases} 
              onReorder={setSelectedCases}
              className={classes.reorderGroup}
              layoutScroll
            >
              <AnimatePresence>
                {selectedCases.map((Case) => (
                  <motion.div
                    key={Case._id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SelectedCase 
                      item={Case}
                      add={() => addCase(Case)}
                      subtract={() => subtractCase(Case)}
                      customSorting={customSorting}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          </div>
        </div>

        <div className={classes.divider} />

        <div className={classes.bottomContainer}>
          <div className={classes.totalInfo}>
            <div className={classes.totalInfoItem}>
              <div>Total Cost</div>
              <div>${calculateTotalAmount().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className={classes.totalInfoItem}>
              <div>Box Amount</div>
              <div>{selectedCases.length}</div>
            </div>
          </div>
          <div className={classes.createButtonContainer}>
            <div 
              className={classes.switchItem} 
              style={{ 
                opacity: ['group', 'jackpot'].includes(selectedMode) ? 0.4 : 1,
                pointerEvents: ['group', 'jackpot'].includes(selectedMode) ? 'none' : 'auto'
              }}
              onClick={() => !['group', 'jackpot'].includes(selectedMode) && setCrazyMode(!crazyMode)}
              active={crazyMode}
            >
                <motion.div 
                  className={classes.switchContainer}
                  style={{ 
                    background: crazyMode ? theme.accent.primaryGradientLowOpacity : '#232527' 
                  }}
                >
                  <motion.div 
                    className={classes.switchNob}
                    animate={{ x: crazyMode ? 18 : 0 }}
                    style={{ background: crazyMode ? theme.accent.primaryGradient : '#FFFFFF' }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
              </motion.div>
              <span>Crazy Mode</span>
            </div>
            <div 
              className={classes.switchItem} 
              active={bigSpin}
              onClick={() => setBigSpin(!bigSpin)}
            >
              <motion.div 
                className={classes.switchContainer}
                style={{ 
                  background: bigSpin ? theme.accent.primaryGradientLowOpacity : '#232527' 
                }}
              >
                <motion.div 
                  className={classes.switchNob}
                  animate={{ x: bigSpin ? 18 : 0 }}
                  style={{ background: bigSpin ? theme.accent.primaryGradient : '#FFFFFF' }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.div>
              <span>Loot Spin</span>
              <div className={classes.infoIcon}>
                <motion.svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 512 512" 
                  fill="currentColor"
                  stroke="currentColor"
                >
                  <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path>
                </motion.svg>
                <div className={classes.infoTooltip}>
                  Loot Spin transforms all rare items into the iconic CSGOLoot logo, followed by an exclusive second spin featuring only rare items.
                </div>
              </div>
            </div>

            <div style={{ borderRight: `1px solid ${theme.bg.border}`, margin: theme.spacing(0, 1) }} />

            <div 
              className={classes.createButton}
              onClick={handleCreateBattle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M11.8334 6.83329H6.83335V11.8333H5.16669V6.83329H0.166687V5.16663H5.16669V0.166626H6.83335V5.16663H11.8334V6.83329Z" fill="currentColor"/>
              </svg>
              Create Battle
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattlesCreate;