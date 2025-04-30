import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { motion } from "framer-motion";
import config from "../../services/config";
import box from "../../assets/img/boxes/box.png";
import theme from "../../styles/theme";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles(theme => ({
  caseBox: {
    height: "230px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
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
  caseImage: {
    width: "7rem",
    height: "7rem",
    objectFit: "contain"
  },
  priceContainer: {
    display: "flex",
    gap: "6px",
    fontSize: "14px",
    cursor: "pointer",
    color: theme.text.primary,
    fontWeight: 500,
    background: theme.bg.inner,
    padding: "8px",
    borderRadius: "8px",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    "&:hover": {
      background: theme.bg.border
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  caseName: {
    color: theme.text.primary, 
    fontSize: "14px", 
    fontWeight: 500
  },
  levelText: {
    color: theme.text.secondary,
    fontSize: "12px",
    fontWeight: 500
  }
}));

const formatTimeLeft = (ms) => {
  if (!ms) return null;
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  if(hours > 0) return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;   
  if(minutes > 0) return `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  return `${seconds.toString().padStart(2, '0')}s`;
};

const BoxItem = ({ item, userLevel, cooldown, loading }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const isAvailable = userLevel >= item.level;
  const isOnCooldown = cooldown > 0;

  const getBoxImageUrl = (boxName) => {
    return `${config.site.backend.url}/public/img/${boxName
      .toLowerCase()
      .replace(/%/g, 'percent')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}.png`;
  };

  const getButtonText = () => {
    if (loading) return "Processing...";
    if (!isAvailable) return <>
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="15" viewBox="0 0 12 15" fill="none">
      <path d="M10.8153 5.61322H9.91444V4.41206C9.91444 2.09392 8.02855 0.208008 5.71039 0.208008C3.39223 0.208008 1.50634 2.09392 1.50634 4.41206V5.61322H0.605475C0.43949 5.61322 0.305176 5.74754 0.305176 5.91352V13.4208C0.305176 14.0832 0.843868 14.6219 1.50634 14.6219H9.91447C10.5769 14.6219 11.1156 14.0832 11.1156 13.4208V5.91352C11.1156 5.74754 10.9813 5.61322 10.8153 5.61322ZM6.60952 11.8862C6.61889 11.9709 6.59164 12.056 6.53474 12.1196C6.47785 12.1832 6.39632 12.2196 6.31099 12.2196H5.10982C5.02449 12.2196 4.94296 12.1832 4.88607 12.1196C4.82917 12.056 4.80189 11.9709 4.8113 11.8862L5.00073 10.1827C4.69311 9.95893 4.50925 9.60498 4.50925 9.2167C4.50925 8.55425 5.04794 8.01553 5.71042 8.01553C6.3729 8.01553 6.91159 8.55422 6.91159 9.2167C6.91159 9.60498 6.72773 9.95893 6.42011 10.1827L6.60952 11.8862ZM8.1127 5.61322H3.30808V4.41206C3.30808 3.08744 4.38578 2.00975 5.71039 2.00975C7.03501 2.00975 8.1127 3.08744 8.1127 4.41206V5.61322Z" fill="currentColor"/>
      </svg> Reach Level {item.level} </>;
    if (isOnCooldown) return <> 
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.13486 3.87701V7.17085L8.73106 8.76706C8.83848 8.87827 8.89791 9.02722 8.89657 9.18182C8.89522 9.33643 8.83321 9.48433 8.72388 9.59365C8.61455 9.70298 8.46666 9.76499 8.31205 9.76634C8.15745 9.76768 8.0085 9.70825 7.89729 9.60084L6.12831 7.83186C6.01772 7.7213 5.95557 7.57134 5.95554 7.41497V3.87701C5.95554 3.72062 6.01766 3.57064 6.12824 3.46005C6.23883 3.34947 6.38881 3.28735 6.5452 3.28735C6.70158 3.28735 6.85157 3.34947 6.96215 3.46005C7.07273 3.57064 7.13486 3.72062 7.13486 3.87701Z" fill="currentColor"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M2.94162 2.02184C4.00828 1.30912 5.26233 0.928711 6.54519 0.928711C8.26483 0.93074 9.91346 1.61476 11.1294 2.83073C12.3454 4.0467 13.0294 5.69533 13.0315 7.41497C13.0315 8.69783 12.651 9.95188 11.9383 11.0185C11.2256 12.0852 10.2126 12.9166 9.02738 13.4075C7.84217 13.8984 6.538 14.0269 5.27978 13.7766C4.02157 13.5263 2.86583 12.9086 1.95871 12.0014C1.05159 11.0943 0.433838 9.93859 0.183564 8.68038C-0.0667097 7.42217 0.0617399 6.11799 0.552669 4.93279C1.0436 3.74758 1.87496 2.73456 2.94162 2.02184ZM3.59681 11.8275C4.46954 12.4107 5.49558 12.7219 6.54519 12.7219C7.95215 12.7202 9.301 12.1605 10.2959 11.1656C11.2907 10.1708 11.8504 8.82193 11.8521 7.41497C11.8521 6.36536 11.5409 5.33931 10.9578 4.46659C10.3746 3.59387 9.54578 2.91367 8.57607 2.512C7.60635 2.11033 6.5393 2.00523 5.50986 2.21C4.48041 2.41477 3.53481 2.92021 2.79262 3.6624C2.05043 4.40459 1.54499 5.35019 1.34022 6.37964C1.13545 7.40908 1.24055 8.47613 1.64222 9.44585C2.04389 10.4156 2.72409 11.2444 3.59681 11.8275Z" fill="currentColor"/>
      </svg>
      {formatTimeLeft(cooldown)}
    </>;
    return "Open Box";
  };

  return (
    <motion.div
      className={classes.caseBox}
      whileHover={isAvailable && !isOnCooldown ? "hover" : undefined}
      initial="initial"
      animate="initial"
    >
      <div style={{ position: "relative", zIndex: 3, height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "end", alignItems: "center", gap: "20px" }}>
        <motion.img
          className={classes.caseImage}
          src={getBoxImageUrl(item.name)} //  || '/default-case.png'
          alt={item.name}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "6px"}}>
          <div className={classes.caseName}>{item.name}</div>
          <div 
            className={classes.priceContainer}
            onClick={() => navigate(`/boxes/${item.name.toLowerCase().replace(/%/g, 'percent').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`)}
            style={{ 
              opacity: isAvailable && !isOnCooldown ? 1 : 0.5,
              cursor: isAvailable && !isOnCooldown ? "pointer" : "not-allowed"
            }}
          >
            {getButtonText()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BoxItem;