import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { motion, useAnimation } from "framer-motion";
import config from "../../../services/config";

export const calculateRisk = (items) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return { level: "Unknown", color: "#8D9BAC", score: 0 };
  }
  
  // Total tickets for weighting probabilities
  const totalTickets = items.reduce((acc, item) => acc + (item?.tickets || 0), 0);
  if (totalTickets === 0) {
    return { level: "Unknown", color: "#8D9BAC", score: 0 };
  }
  
  // Calculate Expected Value (EV)
  const EV = items.reduce((acc, item) => {
    const probability = (item?.tickets || 0) / totalTickets;
    const value = item?.item?.amountFixed || 0;
    return acc + probability * value;
  }, 0);
  
  // Determine the maximum possible value
  const maxValue = items.reduce(
    (acc, item) => Math.max(acc, item?.item?.amountFixed || 0),
    0
  );
  
  // Calculate Variance and Standard Deviation (SD)
  const variance = items.reduce((acc, item) => {
    const probability = (item?.tickets || 0) / totalTickets;
    const value = item?.item?.amountFixed || 0;
    return acc + probability * Math.pow(value - EV, 2);
  }, 0);
  const SD = Math.sqrt(variance);
  
  // Compute risk using a normalized measure between 0 and 1:
  // riskScore = 1 - (EV + SD) / (maxValue + SD)
  // Avoid division by zero if maxValue + SD is 0
  let riskScore = 0;
  if (maxValue + SD > 0) {
    riskScore = 1 - (EV + SD) / (maxValue + SD);
  }

  riskScore = Math.pow(riskScore, 1.5) * 1.2;

  // Ensure riskScore stays within 0-1
  riskScore = Math.min(1, Math.max(0, riskScore));
  
  // Map risk score to categories
  if (riskScore < 0.25) return { level: "Low Risk", color: "#4CAF50", score: riskScore };
  if (riskScore < 0.5)  return { level: "Medium Risk", color: "#2196F3", score: riskScore };
  if (riskScore < 0.75) return { level: "High Risk", color: "#FFC107", score: riskScore };
  return { level: "Extreme Risk", color: "#F44336", score: riskScore };
};



const useStyles = makeStyles(theme => ({
  caseBox: {
    height: "248px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.bg.box,
    borderRadius: "0.5rem",
    padding: "8px 16px 16px 16px",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    "& > *": {
      position: "relative",
      zIndex: 3
    }
  },
  gradientBackground: {
    position: "absolute",
    top: "-50%",
    left: "50%",
    width: "150%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1
  },
  caseImage: {
    width: "7rem",
    height: "7rem",
    objectFit: "contain"
  },
  priceContainer: {
    display: "flex",
    gap: "0.25rem",
    fontSize: "14px",
    cursor: "pointer",
    color: theme.text.primary,
    fontWeight: 500,
    background: theme.bg.inner,
    padding: "8px",
    borderRadius: "6px",
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  caseName: {
    color: theme.text.primary, 
    fontSize: "14px", 
    fontWeight: 500
  },
  riskMeter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
    position: "relative",
    width: "100%"
  },
  riskLabel: {
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.2px"
  },
  riskBarsContainer: {
    display: "flex",
    gap: "3px",
    width: "100%",
    height: "4px",
    position: "relative",
    margin: "0 auto"
  },
  riskBar: {
    flex: 1,
    height: "100%",
    backgroundColor: `${theme.bg.inner}BF`,
    transition: "background-color 0.2s ease"
  },
  riskSelector: {
    position: "absolute",
    transform: "translateY(-25%)",
    width: "2px",
    height: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 0 4px rgba(255, 255, 255, 0.5)",
    transition: "left 0.2s ease"
  },
  searchIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fff',
    opacity: 0.5,
    fontSize: '20px'
  }
}));

const CaseItem = ({ item, onClick }) => {
  const classes = useStyles({ riskColor: calculateRisk(item.items).color });
  const risk = calculateRisk(item.items);
  const isFreeBox = item.type === 'free';

  const getBoxImageUrl = (boxName) => {
    return `${config.site.backend.url}/public/img/${boxName
      .toLowerCase()
      .replace(/%/g, 'percent')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}.png`;
  };

  const getRiskBarStyles = (barIndex) => {
    const riskLevels = ["Low Risk", "Medium Risk", "High Risk", "Extreme Risk"];
    const riskColors = ["#4CAF50", "#2196F3", "#FFC107", "#F44336"];
    const currentRiskIndex = riskLevels.indexOf(risk.level);
    
    return {
      backgroundColor: barIndex === currentRiskIndex ? riskColors[barIndex] : "#3F4347BF"
    };
  };

  const getRiskSelectorPosition = () => {
    const containerWidth = 100; // Container width is 100%
    const numBars = 4;
    const barGap = 3; // Gap between bars in pixels
    const totalGaps = numBars - 1;
    const totalGapWidth = totalGaps * barGap;
    const availableWidth = containerWidth - totalGapWidth;
    const barWidth = availableWidth / numBars;
    
    // Calculate which bar segment we're in (0-3)
    const segment = Math.floor(risk.score * numBars);
    
    // Calculate position within that segment (0-1)
    const segmentPosition = (risk.score * numBars) % 1;
    
    // Calculate final position
    const basePosition = segment * (barWidth + barGap);
    const offsetInSegment = segmentPosition * barWidth;
    
    // Return percentage-based position
    return `calc(${basePosition + offsetInSegment}%)`; 
  };

  return (
    <motion.div
      className={classes.caseBox}
      onClick={onClick}
      whileHover="hover"
      initial="initial"
      animate="initial"
    >
      
      <div style={{ position: "relative", zIndex: 3, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <motion.img
          className={classes.caseImage}
          src={getBoxImageUrl(item.name) || '/default-case.png'}
          alt={item.name}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <div className={classes.caseName}>{item.name}</div>
          <div className={classes.riskLabel} style={{ color: risk.color }}>{risk.level}</div>
        </div>
        <div className={classes.riskBarsContainer}>
          <div className={classes.riskSelector} style={{ left: getRiskSelectorPosition() }} />
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={classes.riskBar}
              style={getRiskBarStyles(index)}
            />
          ))}
        </div>
        <div className={classes.priceContainer}>
          {isFreeBox ? (
            <>
              FREE <span style={{ marginLeft: '4px', fontSize: '12px', opacity: 0.7 }}>(Level {item.levelMin}+)</span>
            </>
          ) : (
            `$${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CaseItem;