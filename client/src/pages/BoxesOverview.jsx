import React, { useEffect, useState, useRef } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { motion, AnimatePresence } from "framer-motion";
import theme from "../styles/theme";

import { useUnbox } from "../contexts/unbox";
import { calculateRisk } from "../components/cases/overview/CaseItem";

import CaseItem from "../components/cases/overview/CaseItem";
import SortDropdown from "../components/cases/overview/SortDropdown";
import RiskRangeSlider from "../components/cases/overview/RiskRangeSlider";

const Input = withStyles(theme => ({
  root: {
    background: theme.bg.box,
    borderRadius: "6px",
    height: "40px",
    flex: 1,
    minWidth: "300px",
    opacity: 1,
    "& :before": {
      display: "none",
    },
    "& :after": {
      display: "none",
    },
    "& label": {
      color: theme.text.secondary,
      fontSize: 14,
      display: "none"
    },
    "& .MuiInputBase-root": {
      height: "100%",
      opacity: 1,
      background: "transparent !important",
      "&:hover": {
        background: "transparent !important"
      },
      "&.Mui-focused": {
        background: "transparent !important"
      },
    },
    "& .MuiFilledInput-root": {
      backgroundColor: "transparent !important",
      "&:hover": {
        backgroundColor: "transparent !important"
      },
      "&.Mui-focused": {
        backgroundColor: "transparent !important"
      }
    },
    "& div input": {
      color: theme.text.secondary,
      opacity: 1,
      fontFamily: "Onest",
      fontSize: 14,
      fontWeight: 500,
      height: "100%",
      padding: "0 0.5rem",
      paddingLeft: "2rem",
      textAlign: "left",
      "&:hover": {
        background: "transparent"
      },
      "&:focus": {
        background: "transparent"
      }
    },
    "& .MuiInputAdornment-root": {
      borderRadius: "6px",
      position: "absolute",
      left: "0.75rem",
      height: "100%",
      maxHeight: "none",
      display: "flex",
      alignItems: "center",
      margin: 0
    }
  }
}))(TextField);
 
const useStyles = makeStyles(theme => ({
  root: {
    color: "#fff",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
    overflowY: "auto",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none"
    },
    "-ms-overflow-style": "none",
    position: "relative"
  },
  navigation: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    alignItems: "center",
    flexWrap: "wrap",
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: theme.palette.darkgrey
  },
  casesContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "12px",
    paddingBottom: "24px",
    flex: 1,
    position: "relative"
  },
}));

const BoxesOverview = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { boxes } = useUnbox();
  const isMounted = useRef(true);

  const [searchInputState, setSearchInputState] = useState("");
  const [riskRange, setRiskRange] = useState([0, 1]);
  const [sortOrder, setSortOrder] = useState("highToLow");

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getRiskScore = (risk) => {
    const levels = ["Low Risk", "Medium Risk", "High Risk", "Extreme Risk"];
    return (levels.indexOf(risk.level) / (levels.length - 1));
  };

  const getFilteredCases = () => {
    return boxes
      .filter(caseItem => caseItem.type === 'site')
      .filter(caseItem => {
        const caseName = caseItem.name.toLowerCase();
        const searchText = searchInputState.toLowerCase();
        return caseName.includes(searchText);
      })
      .filter(caseItem => {
        const riskScore = getRiskScore(calculateRisk(caseItem.items));
        return riskScore >= riskRange[0] && riskScore <= riskRange[1];
      })
      .sort((a, b) => {
        const priceA = parseFloat(a.amount || 0);
        const priceB = parseFloat(b.amount || 0);
        
        if (sortOrder === "highToLow") {
          return priceB - priceA;
        } else {
          return priceA - priceB;
        }
      });
  };

  const caseItemVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.15
      }
    }
  };
  
  return (
      <div className={classes.root}>        
        <div className={classes.navigation}>
          <Input
            variant="filled"
            value={searchInputState}
            onChange={(e) => setSearchInputState(e.target.value)}
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ margin: 0 }}>
                  <SearchIcon style={{ color: theme.text.secondary }} />
                </InputAdornment>
              ),
            }}
          />
          <RiskRangeSlider 
            value={riskRange}
            onChange={setRiskRange}
          />
          <SortDropdown 
            value={sortOrder}
            onChange={setSortOrder}
          />
        </div>

        <div className={classes.casesContainer}>          
          <AnimatePresence initial={false} mode="popLayout">
            {getFilteredCases().map((item) => (
              <motion.div
                key={item.id}
                variants={caseItemVariants}
                initial="initial"
                animate={isMounted.current ? "animate" : "initial"}
                exit="exit"
                layout
              >
                <CaseItem 
                  item={item}
                  onClick={() => navigate(`/boxes/${item.slug}`)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
  );
};

export default BoxesOverview;