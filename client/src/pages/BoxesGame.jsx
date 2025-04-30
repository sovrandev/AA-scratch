import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";

import { useUnbox } from "../contexts/unbox";
import { useNotification } from "../contexts/notification";
import useLocalStorage from "../hooks/useLocalStorage";
import { useUser } from "../contexts/user";
import { useRewards } from "../contexts/rewards";
import { generalSocketService } from "../services/sockets/general.socket.service";

import Loader from "../components/common/Loader";
import TopSection from "../components/cases/game/TopSection";
import CaseDisplay from "../components/cases/overview/CaseDisplay";
import SpinnerSection from "../components/cases/game/SpinnerSection";
import BottomSection from "../components/cases/game/BottomSection";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    color: "#fff",
    overflowY: "scroll",
    scrollbarWidth: "none",
    fontWeight: 500,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "15rem",
  },
}));

const BoxesGame = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const notify = useNotification();

  const { boxes, getBoxData, openBox } = useUnbox();
  const { boxSlug } = useParams();
  const { setUser } = useUser();
  const { levelBoxes } = useRewards();

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [numOfSpinners, setNumOfSpinners] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [spinData, setSpinData] = useState([]);
  const [fastSpin, setFastSpin] = useLocalStorage('fastSpin', false);
  
  const fetchData = async () => {
    try {
      const box = boxes.find(box => box.slug === boxSlug);
      if (!box) {
        notify.error("Box not found");
        navigate('/boxes');
        return;
      }
      const data = await getBoxData(box._id);
      setCaseData(data.box);
      setLoading(false);
    } catch (error) {
      notify.error(error.message);
      navigate('/boxes');
    }
  };

  const calculateEstimatedCaseValue = (items) => {
    if (!items || items.length === 0) return 0;
    
    const totalTickets = items.reduce((sum, item) => sum + (item.tickets || 1), 0);
    
    const expectedValue = items.reduce((sum, item) => {
      const probability = (item.tickets || 1) / totalTickets;
      return sum + (item.item.amountFixed * probability);
    }, 0);
    
    return expectedValue;
  };

  const getItemColor = (multiplier, isFreeBox = false) => {
    if (isFreeBox) {
      const estimatedValue = calculateEstimatedCaseValue(caseData?.items || []);
      if (estimatedValue <= 0) return 'white';
      multiplier = multiplier / estimatedValue;
    }

    if (multiplier >= 9) return 'gold';
    if (multiplier >= 5) return 'red';
    if (multiplier >= 1.8) return 'purple';
    if (multiplier >= 0.8) return 'blue';
    return 'white';
  };

  const handleOpenCase = async () => {
    if (spinning) return;
    
    const selectedBox = boxes.find(box => box.slug === boxSlug);
    if (!selectedBox) {
      notify.error("Box not found");
      return;
    }

    try {
      setSpinning(true);
      
      // Call the appropriate unbox function based on box type
      const result = selectedBox.type === 'free' 
        ? await generalSocketService.sendRakebackBoxClaim(selectedBox._id, selectedBox.levelMin)
        : await openBox(selectedBox._id, numOfSpinners);
      
      if (!result.games || result.games.length === 0) {
        throw new Error('No items received from unbox');
      }

      setUser(prevUser => ({ ...prevUser, ...result.user }));

      // Format the unbox results for the spinner
      const formattedSpinData = result.games.map(game => {
        // Find the item based on the outcome ticket
        const outcome = game.outcome;
        let ticketSum = 0;
        let wonItem = null;

        // Find the item that matches the outcome ticket
        for (const item of caseData.items) {
          ticketSum += item.tickets;
          if (outcome <= ticketSum) {
            wonItem = item;
            break;
          }
        }

        const multiplier = wonItem.item.amountFixed / (caseData.amount || calculateEstimatedCaseValue(caseData.items));

        return {
          item: wonItem.item,
          payout: game.payout,
          multiplier: multiplier,
          color: getItemColor(multiplier, selectedBox.type === 'free'),
          outcome: game.outcome
        };
      });
      
      setSpinData(formattedSpinData);

      // Update user balance after spin
      setTimeout(() => {
        setUser(prevUser => ({ ...prevUser, balance: (prevUser.balance + result.games.reduce((sum, game) => sum + game.payout, 0)) }));
      }, fastSpin ? 1750 : 5750);
    } catch (error) {
      notify.error(error.message || 'Failed to open case');
      setSpinning(false);
    }
  };

  // Get cooldown for free boxes
  const getCooldown = () => {
    if (!caseData || caseData.type !== 'free' || !levelBoxes) return null;
    const box = levelBoxes[`level${caseData.levelMin}`];
    return box?.lastClaim ? calculateTimeLeft(box.lastClaim, 24) : null;
  };

  // Helper function to calculate cooldown time
  const calculateTimeLeft = (lastClaim, cooldownHours) => {
    if (!lastClaim) return null;
    const now = Date.now();
    const timeLeft = (lastClaim + (cooldownHours * 60 * 60 * 1000)) - now;
    return timeLeft > 0 ? timeLeft : null;
  };

  const handleDemoSpin = () => {
    if (spinning) return;
    
    try {
      setSpinning(true);
      
      // Create demo spins with weighted probabilities
      const demoSpins = Array(numOfSpinners).fill(null).map(() => {
        // Calculate total tickets for probability weighting
        const totalTickets = caseData.items.reduce((sum, item) => sum + (item.tickets || 1), 0);
        
        // Generate random ticket number
        const randomTicket = Math.floor(Math.random() * totalTickets);
        
        // Find the item that matches the random ticket
        let ticketSum = 0;
        let selectedItem = null;
        
        for (const item of caseData.items) {
          ticketSum += (item.tickets || 1);
          if (randomTicket <= ticketSum) {
            selectedItem = item;
            break;
          }
        }
        
        // Fallback to a random item if something went wrong
        if (!selectedItem) {
          selectedItem = caseData.items[Math.floor(Math.random() * caseData.items.length)];
        }

        // Calculate payout and multiplier like the real system
        const payout = selectedItem.item.amountFixed;
        const multiplier = payout / (caseData.amount || calculateEstimatedCaseValue(caseData.items));
        
        return {
          item: selectedItem.item,
          payout,
          multiplier,
          color: getItemColor(payout, caseData.type === 'free')
        };
      });
      
      setSpinData(demoSpins);
    } catch (error) {
      notify.error("Failed to start demo spin");
      setSpinning(false);
    }
  };

  const handleSpinnerCountChange = (count) => {
    if (spinning) return;
    setNumOfSpinners(count);
    setSpinData([]);
  };

  const handleSpinComplete = () => {
    setSpinning(false);
  };

  useEffect(() => {
    fetchData();
  }, [boxSlug]);

  if (loading) {
    return <Loader />;
  }

  const isFreeBox = caseData?.type === 'free';
  const cooldown = isFreeBox ? getCooldown() : null;

  return (
    <div className={classes.root}> 
      <TopSection 
        fastSpin={fastSpin}
        setFastSpin={setFastSpin}
        isFreeBox={isFreeBox}
      />

      <SpinnerSection 
        numOfSpinners={isFreeBox ? 1 : numOfSpinners}
        caseData={caseData}
        spinData={spinData}
        isSpinning={spinning}
        onSpinComplete={handleSpinComplete}
        fastSpin={fastSpin}
      />

      <CaseDisplay 
        caseData={caseData}
        onOpen={handleOpenCase}
        onDemoSpin={handleDemoSpin}
        selectedCount={isFreeBox ? 1 : numOfSpinners}
        onCountChange={handleSpinnerCountChange}
        disabled={spinning}
        cooldown={cooldown}
        isFreeBox={isFreeBox}
      />

      <BottomSection 
        box={caseData}
        items={caseData.items}
      />
    </div>
  );
};

export default BoxesGame;