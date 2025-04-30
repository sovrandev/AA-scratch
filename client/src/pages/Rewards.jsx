import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRewards } from "../contexts/rewards";
import { useUser } from "../contexts/user";
import { useNotification } from "../contexts/notification";
import BoxItem from "../components/rewards/BoxItem";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import theme from "../styles/theme";
import LevelBreakdownModel from "../components/rewards/LevelBreakdownModel";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    color: theme.text.primary,
    gap: "24px",
    marginBottom: "15rem"
  },
  divider: {
    width: "100%",
    borderTop: `1px solid ${theme.bg.border}`,
    opacity: 0.5
  },
  top: {
    width: "100%",
    height: "220px",
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      height: "fit-content",
    }
  },
  rankCarousel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "364px",
    height: "100%",
    background: `radial-gradient(129.61% 100% at 50% 0%, ${theme.blue}40 0%, rgba(12, 14, 20, 0) 100%), ${theme.bg.box}`,
    borderRadius: "8px",
    padding: "24px",
    gap: "12px",
    "& .carousel": {
      background: theme.bg.main,
      padding: "12px",
      borderRadius: "8px",
      width: "276px",
      height: "175px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "visible",
      "& .slider-wrapper": {
        width: "100%",
        height: "100%",
      },
      "& .slider": {
        height: "100%",
      },
      "& .slide": {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent"
      },
      "& .control-dots": {
        margin: "8px 0 0 0",
        padding: 0,
        position: "absolute",
        bottom: -20,
        "& .dot": {
          width: "6px",
          height: "6px",
          margin: "0 4px",
          background: theme.text.secondary,
          opacity: 0.5,
          "&.selected": {
            opacity: 1,
            background: theme.text.primary
          }
        }
      }
    },
  },
  rankCard: {
    width: "200px",
    height: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    padding: "12px",
    color: "#fff",
    textAlign: "center",
    transition: "all 0.3s ease",
    margin: "0 auto",
  },
  rankName: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "4px"
  },
  rankPercentage: {
    fontSize: "14px",
    fontWeight: 500,
    opacity: 0.9
  },
  currentRank: {
    fontSize: "14px",
    fontWeight: 500,
    color: theme.text.secondary,
    marginTop: "8px",
    textAlign: "center"
  },
  currentRankHighlight: {
    color: theme.text.primary,
    fontWeight: 600
  },
  affiliateCodeBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    background: `radial-gradient(129.61% 100% at 50% 0%, ${theme.blue}40 0%, rgba(12, 14, 20, 0) 100%), ${theme.bg.box}`,
    borderRadius: "8px",
    padding: "24px",
    gap: "12px"
  },
  rakebackBox: {
    width: "364px",
    height: "100%",
    background: theme.bg.secondary,
    borderRadius: "8px",
    padding: "24px",
    gap: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "@media (max-width: 1200px)": {
      height: "fit-content",
      width: "100%",
    }
  },
  dailyGradient: {
    background: `radial-gradient(129.61% 100% at 50% 0%, ${theme.green}33 0%, rgba(12, 14, 20, 0) 100%), ${theme.bg.box}`,
  },
  weeklyGradient: {
    background: `radial-gradient(129.61% 100% at 50% 0%, ${theme.yellow}33 0%, rgba(12, 14, 20, 0) 100%), ${theme.bg.box}`,
  },
  monthlyGradient: {
    background: `radial-gradient(129.61% 100% at 50% 0%, ${theme.red}33 0%, rgba(12, 14, 20, 0) 100%), ${theme.bg.box}`,
  },
  topOfAffiliateCodeBox: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.accent.primary,
  },
  description: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.text.primary,
    textAlign: "center",
    width: "80%",
  },
  middle: {
    display: "flex", 
    flexDirection: "column",
    gap: theme.spacing(1),
    width: "100%",
  },
  inputContainer: {
    position: "relative",
    width: "100%",  
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.75),
    alignItems: "flex-start",
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.text.secondary,
    "& span": {
      color: theme.text.primary,
    }
  },
  addressValue: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    background: theme.bg.main,
    padding: "4px 4px 4px 12px",
    borderRadius: 6,
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.primary,
    background: "transparent",
    border: "none",
    padding: "8px 0",
    '&::placeholder': {
      color: theme.text.secondary
    },
    '&:focus': {
      outline: 'none',
    }
  },
  redeemButton: {
    background: theme.accent.primary,
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    padding: '8px 12px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      opacity: 0.9,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    }
  },
  bottomHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomHeaderTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.text.primary,
  },
  levelBreakdownText: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.text.secondary,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    transition: theme.transitions.normal,
    "&:hover": {
      color: theme.text.primary
    }
  },
  progressSvg: {
    color: theme.bg.main
  },
  rakeBackText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  rakeBackTextTitle: {
    fontSize: 13,
    fontWeight: 600,
  },
  dailyTitle: {
    color: theme.green,
  },
  weeklyTitle: {
    color: theme.yellow,
  },
  monthlyTitle: {
    color: theme.red,
  },
  rakeBackTextDescription: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.text.primary,
  },
  actionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    width: "130px"
  },
  actionText: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.text.primary,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    width: "100%",
    height: 30,
    "& span": {
      color: theme.text.primary
    }
  },
  actionTextDaily: {
    color: theme.green,
    padding: "4px 8px",
    borderRadius: "4px",
    background: theme.green + "33",
  },
  actionTextWeekly: {
    color: theme.yellow,
    padding: "4px 8px",
    borderRadius: "4px",
    background: theme.yellow + "33",
  },
  actionTextMonthly: {
    color: theme.red,
    padding: "4px 8px",
    borderRadius: "4px",
    background: theme.red + "33",
  },
  actionButton: {
    fontSize: 12,
    fontWeight: 600,
    color: "#000000",
    padding: "6px 6px",
    width: "100%",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: theme.transitions.normal,
    "&:hover": {
      opacity: 0.8,
    }
  },
  actionButtonDaily: {
    background: theme.green,
  },
  actionButtonWeekly: {
    background: theme.yellow,
  },
  actionButtonMonthly: {
    background: theme.red,
  },
  cooldownText: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.text.secondary,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    transition: theme.transitions.normal,
    "&:hover": {
      color: theme.text.primary
    }
  },
  bottom: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "12px",
    paddingBottom: "24px",
  }
}));

const formatTimeLeft = (ms) => {
  if (!ms) return null;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  
  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
  }
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
};

const calculateTimeLeft = (lastClaim, cooldownHours) => {
  if (!lastClaim) return null;
  const now = Date.now();
  const timeLeft = (lastClaim + (cooldownHours * 60 * 60 * 1000)) - now;
  return timeLeft > 0 ? timeLeft : null;
};

const rankColors = {
  'bronze I': '#CD7F32',
  'bronze II': '#CD7F32',
  'bronze III': '#CD7F32',
  'silver I': '#C0C0C0',
  'silver II': '#C0C0C0',
  'silver III': '#C0C0C0',
  'gold I': '#FFD700',
  'gold II': '#FFD700',
  'gold III': '#FFD700',
  'diamond': '#B9F2FF'
};

const rankData = [
  { name: 'Bronze I', percentage: '0.25%', level: '10-19' },
  { name: 'Bronze II', percentage: '0.50%', level: '20-29' },
  { name: 'Bronze III', percentage: '0.75%', level: '30-39' },
  { name: 'Silver I', percentage: '1.00%', level: '40-49' },
  { name: 'Silver II', percentage: '1.25%', level: '50-59' },
  { name: 'Silver III', percentage: '1.50%', level: '60-69' },
  { name: 'Gold I', percentage: '1.75%', level: '70-79' },
  { name: 'Gold II', percentage: '2.00%', level: '80-89' },
  { name: 'Gold III', percentage: '2.25%', level: '90-99' },
  { name: 'Diamond', percentage: '2.50%', level: '100' }
];

const Rewards = () => {
  const classes = useStyles();
  const { getLevel } = useUser();
  const { loading, rakebackData = { daily: { available: 0 }, weekly: { available: 0 }, monthly: { available: 0 }, level: 0 }, levelBoxes = {}, claimRake, cooldowns } = useRewards();
  const notify = useNotification();
  const [currentRankIndex, setCurrentRankIndex] = useState(0);
  const [showLevelBreakdown, setShowLevelBreakdown] = useState(false);

  const handleClaimRake = async (type) => {
    if (cooldowns[type]) return;
    try {
      await claimRake(type);
    } catch (err) {
      notify.error(err.message);
    }
  };

  const levelBoxesList = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const userLevel = rakebackData?.level || 0;
  const currentRank = rankData.findIndex(rank => {
    const [min, max] = rank.level.split('-').map(Number);
    return userLevel >= min && (!max || userLevel <= max);
  });

  return (  
    <div className={classes.root}>
      <LevelBreakdownModel open={showLevelBreakdown}e onClose={() => setShowLevelBreakdown(false)} />
      <div className={classes.top}>
        {/*<div className={classes.rankCarousel}>
          <div className={classes.topOfAffiliateCodeBox}>
            <div className={classes.title}>Rakeback Ranks</div>
            <div className={classes.description}>Earn more rakeback as you level up your account</div>
          </div>
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            selectedItem={currentRank !== -1 ? currentRank : 0}
            onChange={(index) => setCurrentRankIndex(index)}
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  style={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: theme.bg.inner,
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#fff',
                    cursor: 'pointer',
                    zIndex: 1
                  }}
                >
                  ←
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: theme.bg.inner,
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#fff',
                    cursor: 'pointer',
                    zIndex: 1
                  }}
                >
                  →
                </button>
              )
            }
          >
            {rankData.map((rank, index) => (
              <div 
                key={index} 
                className={classes.rankCard} 
                style={{ 
                  background: `linear-gradient(135deg, ${rankColors[rank.name.toLowerCase()]}CC, ${rankColors[rank.name.toLowerCase()]}66)`
                }}
              >
                <div className={classes.rankName}>{rank.name}</div>
                <div className={classes.rankPercentage}>{rank.percentage} Rakeback</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Level {rank.level}</div>
              </div>
            ))}
          </Carousel>
          <div className={classes.currentRank}>
            Your Current Rank: <span className={classes.currentRankHighlight}>
              {currentRank !== -1 ? rankData[currentRank].name : 'None'}
            </span>
          </div>
        </div>*/}
        <div className={`${classes.rakebackBox} ${classes.dailyGradient}`}>
          <div className={classes.progressSvg} style={{ color: theme.green }}>
            <svg viewBox="0 0 18 18" height="40" width="40" ><path d="M1.3 10.487H8.25V17.674C8.25 17.7534 8.21839 17.8296 8.16213 17.8857C8.10587 17.9419 8.02956 17.9735 7.95 17.9735H4C3.5925 18.0315 3.17705 17.994 2.78655 17.8641C2.39606 17.7341 2.04123 17.5152 1.75016 17.2247C1.4591 16.9341 1.23978 16.5799 1.10958 16.1901C0.979374 15.8004 0.941858 15.3857 1 14.9789V10.7865C1 10.7472 1.00776 10.7082 1.02284 10.6719C1.03791 10.6356 1.06001 10.6026 1.08787 10.5747C1.11573 10.5469 1.1488 10.5249 1.18519 10.5098C1.22159 10.4948 1.2606 10.487 1.3 10.487ZM16.7 10.487H9.75V17.674C9.75 17.7133 9.75776 17.7523 9.77284 17.7886C9.78791 17.8249 9.81001 17.8579 9.83787 17.8857C9.86572 17.9136 9.8988 17.9356 9.93519 17.9507C9.97159 17.9657 10.0106 17.9735 10.05 17.9735H14C14.4075 18.0315 14.8229 17.994 15.2134 17.8641C15.6039 17.7341 15.9588 17.5152 16.2498 17.2247C16.5409 16.9341 16.7602 16.5799 16.8904 16.1901C17.0206 15.8004 17.0581 15.3857 17 14.9789V10.7865C17 10.7472 16.9922 10.7082 16.9772 10.6719C16.9621 10.6356 16.94 10.6026 16.9121 10.5747C16.8843 10.5469 16.8512 10.5249 16.8148 10.5098C16.7784 10.4948 16.7394 10.487 16.7 10.487ZM18 5.49609V8.6903C18 8.76972 17.9684 8.84589 17.9121 8.90204C17.8559 8.9582 17.7796 8.98975 17.7 8.98975H9.75V5.49609H8.25V8.98975H0.3C0.220435 8.98975 0.144129 8.9582 0.087868 8.90204C0.0316071 8.84589 0 8.76972 0 8.6903V5.49609C0 5.09899 0.158035 4.71814 0.43934 4.43735C0.720644 4.15655 1.10218 3.99881 1.5 3.99881H2.565C2.38874 3.67123 2.28382 3.31017 2.25711 2.93929C2.2304 2.56841 2.2825 2.19609 2.41 1.84671C2.56818 1.38599 2.84687 0.975845 3.2172 0.658757C3.58753 0.341669 4.03605 0.129161 4.51631 0.0432397C4.99657 -0.0426817 5.49111 0.00110656 5.94872 0.17007C6.40632 0.339034 6.81036 0.62703 7.119 1.00424C7.151 1.04416 8.276 2.53746 9 3.49971L10.874 1.01322C11.1757 0.641055 11.57 0.354579 12.0176 0.18251C12.4651 0.0104414 12.9501 -0.0411754 13.424 0.032834C13.8978 0.106843 14.3438 0.303879 14.7173 0.604189C15.0908 0.9045 15.3786 1.29753 15.552 1.7439C15.7005 2.10507 15.767 2.49457 15.7467 2.88444C15.7265 3.27431 15.6201 3.65488 15.435 3.99881H16.5C16.8978 3.99881 17.2794 4.15655 17.5607 4.43735C17.842 4.71814 18 5.09899 18 5.49609ZM7.5 3.99881C6.821 3.10044 6 2.01441 5.948 1.94353C5.83287 1.80424 5.68799 1.69241 5.52395 1.61624C5.35992 1.54008 5.1809 1.5015 5 1.50333C4.66848 1.50333 4.35054 1.63479 4.11612 1.86879C3.8817 2.10278 3.75 2.42015 3.75 2.75107C3.75 3.08199 3.8817 3.39936 4.11612 3.63335C4.35054 3.86735 4.66848 3.99881 5 3.99881H7.5ZM14.25 2.75107C14.2495 2.42031 14.1176 2.10325 13.8833 1.86937C13.649 1.63549 13.3314 1.50386 13 1.50333C12.8157 1.50219 12.6336 1.54263 12.4672 1.62162C12.3008 1.70061 12.1544 1.81612 12.039 1.9595C11.992 2.02039 11.177 3.10044 10.5 3.99881H13C13.3314 3.99828 13.649 3.86665 13.8833 3.63277C14.1176 3.39889 14.2495 3.08183 14.25 2.75107Z" fill="currentColor"></path></svg>
          </div>
          <div className={classes.rakeBackText}>
            <div className={`${classes.rakeBackTextTitle} ${classes.dailyTitle}`}>Daily</div>
            <div className={classes.rakeBackTextDescription}>Rakeback</div>
          </div>
          <div className={classes.actionContainer}>
            <div className={`${classes.actionText} ${classes.actionTextDaily}`}>
              Available <span>${rakebackData?.daily?.available?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
            </div>
            <div 
              className={`${classes.actionButton} ${classes.actionButtonDaily}`}
              onClick={() => handleClaimRake('daily')}
              style={{ 
                cursor: loading.daily || cooldowns.daily ? 'not-allowed' : 'pointer', 
                opacity: loading.daily || cooldowns.daily ? 0.5 : 1 
              }}
            >
              {loading.daily ? 'Processing...' : cooldowns.daily ? formatTimeLeft(cooldowns.daily) : 'Claim'}
            </div>
          </div>
        </div>
        <div className={`${classes.rakebackBox} ${classes.weeklyGradient}`}>
          <div className={classes.progressSvg} style={{ color: theme.yellow }}>
            <svg viewBox="0 0 18 18" height="40" width="40" ><path d="M1.3 10.487H8.25V17.674C8.25 17.7534 8.21839 17.8296 8.16213 17.8857C8.10587 17.9419 8.02956 17.9735 7.95 17.9735H4C3.5925 18.0315 3.17705 17.994 2.78655 17.8641C2.39606 17.7341 2.04123 17.5152 1.75016 17.2247C1.4591 16.9341 1.23978 16.5799 1.10958 16.1901C0.979374 15.8004 0.941858 15.3857 1 14.9789V10.7865C1 10.7472 1.00776 10.7082 1.02284 10.6719C1.03791 10.6356 1.06001 10.6026 1.08787 10.5747C1.11573 10.5469 1.1488 10.5249 1.18519 10.5098C1.22159 10.4948 1.2606 10.487 1.3 10.487ZM16.7 10.487H9.75V17.674C9.75 17.7133 9.75776 17.7523 9.77284 17.7886C9.78791 17.8249 9.81001 17.8579 9.83787 17.8857C9.86572 17.9136 9.8988 17.9356 9.93519 17.9507C9.97159 17.9657 10.0106 17.9735 10.05 17.9735H14C14.4075 18.0315 14.8229 17.994 15.2134 17.8641C15.6039 17.7341 15.9588 17.5152 16.2498 17.2247C16.5409 16.9341 16.7602 16.5799 16.8904 16.1901C17.0206 15.8004 17.0581 15.3857 17 14.9789V10.7865C17 10.7472 16.9922 10.7082 16.9772 10.6719C16.9621 10.6356 16.94 10.6026 16.9121 10.5747C16.8843 10.5469 16.8512 10.5249 16.8148 10.5098C16.7784 10.4948 16.7394 10.487 16.7 10.487ZM18 5.49609V8.6903C18 8.76972 17.9684 8.84589 17.9121 8.90204C17.8559 8.9582 17.7796 8.98975 17.7 8.98975H9.75V5.49609H8.25V8.98975H0.3C0.220435 8.98975 0.144129 8.9582 0.087868 8.90204C0.0316071 8.84589 0 8.76972 0 8.6903V5.49609C0 5.09899 0.158035 4.71814 0.43934 4.43735C0.720644 4.15655 1.10218 3.99881 1.5 3.99881H2.565C2.38874 3.67123 2.28382 3.31017 2.25711 2.93929C2.2304 2.56841 2.2825 2.19609 2.41 1.84671C2.56818 1.38599 2.84687 0.975845 3.2172 0.658757C3.58753 0.341669 4.03605 0.129161 4.51631 0.0432397C4.99657 -0.0426817 5.49111 0.00110656 5.94872 0.17007C6.40632 0.339034 6.81036 0.62703 7.119 1.00424C7.151 1.04416 8.276 2.53746 9 3.49971L10.874 1.01322C11.1757 0.641055 11.57 0.354579 12.0176 0.18251C12.4651 0.0104414 12.9501 -0.0411754 13.424 0.032834C13.8978 0.106843 14.3438 0.303879 14.7173 0.604189C15.0908 0.9045 15.3786 1.29753 15.552 1.7439C15.7005 2.10507 15.767 2.49457 15.7467 2.88444C15.7265 3.27431 15.6201 3.65488 15.435 3.99881H16.5C16.8978 3.99881 17.2794 4.15655 17.5607 4.43735C17.842 4.71814 18 5.09899 18 5.49609ZM7.5 3.99881C6.821 3.10044 6 2.01441 5.948 1.94353C5.83287 1.80424 5.68799 1.69241 5.52395 1.61624C5.35992 1.54008 5.1809 1.5015 5 1.50333C4.66848 1.50333 4.35054 1.63479 4.11612 1.86879C3.8817 2.10278 3.75 2.42015 3.75 2.75107C3.75 3.08199 3.8817 3.39936 4.11612 3.63335C4.35054 3.86735 4.66848 3.99881 5 3.99881H7.5ZM14.25 2.75107C14.2495 2.42031 14.1176 2.10325 13.8833 1.86937C13.649 1.63549 13.3314 1.50386 13 1.50333C12.8157 1.50219 12.6336 1.54263 12.4672 1.62162C12.3008 1.70061 12.1544 1.81612 12.039 1.9595C11.992 2.02039 11.177 3.10044 10.5 3.99881H13C13.3314 3.99828 13.649 3.86665 13.8833 3.63277C14.1176 3.39889 14.2495 3.08183 14.25 2.75107Z" fill="currentColor"></path></svg>
          </div>
          <div className={classes.rakeBackText}>
            <div className={`${classes.rakeBackTextTitle} ${classes.weeklyTitle}`}>Weekly</div>
            <div className={classes.rakeBackTextDescription}>Rakeback</div>
          </div>
          <div className={classes.actionContainer}>
            <div className={`${classes.actionText} ${classes.actionTextWeekly}`}>
              Available <span>${rakebackData?.weekly?.available?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
            </div>
            <div 
              className={`${classes.actionButton} ${classes.actionButtonWeekly}`}
              onClick={() => handleClaimRake('weekly')}
              style={{ 
                cursor: loading.weekly || cooldowns.weekly ? 'not-allowed' : 'pointer', 
                opacity: loading.weekly || cooldowns.weekly ? 0.5 : 1 
              }}
            >
              {loading.weekly ? 'Processing...' : cooldowns.weekly ? formatTimeLeft(cooldowns.weekly) : 'Claim'}
            </div>
          </div>
        </div>
        <div className={`${classes.rakebackBox} ${classes.monthlyGradient}`}>
          <div className={classes.progressSvg} style={{ color: theme.red }}>
            <svg viewBox="0 0 18 18" height="40" width="40" ><path d="M1.3 10.487H8.25V17.674C8.25 17.7534 8.21839 17.8296 8.16213 17.8857C8.10587 17.9419 8.02956 17.9735 7.95 17.9735H4C3.5925 18.0315 3.17705 17.994 2.78655 17.8641C2.39606 17.7341 2.04123 17.5152 1.75016 17.2247C1.4591 16.9341 1.23978 16.5799 1.10958 16.1901C0.979374 15.8004 0.941858 15.3857 1 14.9789V10.7865C1 10.7472 1.00776 10.7082 1.02284 10.6719C1.03791 10.6356 1.06001 10.6026 1.08787 10.5747C1.11573 10.5469 1.1488 10.5249 1.18519 10.5098C1.22159 10.4948 1.2606 10.487 1.3 10.487ZM16.7 10.487H9.75V17.674C9.75 17.7133 9.75776 17.7523 9.77284 17.7886C9.78791 17.8249 9.81001 17.8579 9.83787 17.8857C9.86572 17.9136 9.8988 17.9356 9.93519 17.9507C9.97159 17.9657 10.0106 17.9735 10.05 17.9735H14C14.4075 18.0315 14.8229 17.994 15.2134 17.8641C15.6039 17.7341 15.9588 17.5152 16.2498 17.2247C16.5409 16.9341 16.7602 16.5799 16.8904 16.1901C17.0206 15.8004 17.0581 15.3857 17 14.9789V10.7865C17 10.7472 16.9922 10.7082 16.9772 10.6719C16.9621 10.6356 16.94 10.6026 16.9121 10.5747C16.8843 10.5469 16.8512 10.5249 16.8148 10.5098C16.7784 10.4948 16.7394 10.487 16.7 10.487ZM18 5.49609V8.6903C18 8.76972 17.9684 8.84589 17.9121 8.90204C17.8559 8.9582 17.7796 8.98975 17.7 8.98975H9.75V5.49609H8.25V8.98975H0.3C0.220435 8.98975 0.144129 8.9582 0.087868 8.90204C0.0316071 8.84589 0 8.76972 0 8.6903V5.49609C0 5.09899 0.158035 4.71814 0.43934 4.43735C0.720644 4.15655 1.10218 3.99881 1.5 3.99881H2.565C2.38874 3.67123 2.28382 3.31017 2.25711 2.93929C2.2304 2.56841 2.2825 2.19609 2.41 1.84671C2.56818 1.38599 2.84687 0.975845 3.2172 0.658757C3.58753 0.341669 4.03605 0.129161 4.51631 0.0432397C4.99657 -0.0426817 5.49111 0.00110656 5.94872 0.17007C6.40632 0.339034 6.81036 0.62703 7.119 1.00424C7.151 1.04416 8.276 2.53746 9 3.49971L10.874 1.01322C11.1757 0.641055 11.57 0.354579 12.0176 0.18251C12.4651 0.0104414 12.9501 -0.0411754 13.424 0.032834C13.8978 0.106843 14.3438 0.303879 14.7173 0.604189C15.0908 0.9045 15.3786 1.29753 15.552 1.7439C15.7005 2.10507 15.767 2.49457 15.7467 2.88444C15.7265 3.27431 15.6201 3.65488 15.435 3.99881H16.5C16.8978 3.99881 17.2794 4.15655 17.5607 4.43735C17.842 4.71814 18 5.09899 18 5.49609ZM7.5 3.99881C6.821 3.10044 6 2.01441 5.948 1.94353C5.83287 1.80424 5.68799 1.69241 5.52395 1.61624C5.35992 1.54008 5.1809 1.5015 5 1.50333C4.66848 1.50333 4.35054 1.63479 4.11612 1.86879C3.8817 2.10278 3.75 2.42015 3.75 2.75107C3.75 3.08199 3.8817 3.39936 4.11612 3.63335C4.35054 3.86735 4.66848 3.99881 5 3.99881H7.5ZM14.25 2.75107C14.2495 2.42031 14.1176 2.10325 13.8833 1.86937C13.649 1.63549 13.3314 1.50386 13 1.50333C12.8157 1.50219 12.6336 1.54263 12.4672 1.62162C12.3008 1.70061 12.1544 1.81612 12.039 1.9595C11.992 2.02039 11.177 3.10044 10.5 3.99881H13C13.3314 3.99828 13.649 3.86665 13.8833 3.63277C14.1176 3.39889 14.2495 3.08183 14.25 2.75107Z" fill="currentColor"></path></svg>
          </div>
          <div className={classes.rakeBackText}>
            <div className={`${classes.rakeBackTextTitle} ${classes.monthlyTitle}`}>Monthly</div>
            <div className={classes.rakeBackTextDescription}>Rakeback</div>
          </div>
          <div className={classes.actionContainer}>
            <div className={`${classes.actionText} ${classes.actionTextMonthly}`}>
              Available <span>${rakebackData?.monthly?.available?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
            </div>
            <div 
              className={`${classes.actionButton} ${classes.actionButtonMonthly}`}
              onClick={() => handleClaimRake('monthly')}
              style={{ 
                cursor: loading.monthly || cooldowns.monthly ? 'not-allowed' : 'pointer', 
                opacity: loading.monthly || cooldowns.monthly ? 0.5 : 1 
              }}
            >
              {loading.monthly ? 'Processing...' : cooldowns.monthly ? formatTimeLeft(cooldowns.monthly) : 'Claim'}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.divider} />

      <div className={classes.bottomHeader}>
        <div className={classes.bottomHeaderTitle}>Free Boxes</div>
        <div 
          className={classes.levelBreakdownText}
          onClick={() => setShowLevelBreakdown(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><g clip-path="url(#clip0_2454_20405)"><path d="M8 0C3.57841 0 0 3.578 0 8C0 12.4215 3.578 16 8 16C12.4216 16 16 12.422 16 8C16 3.57841 12.422 0 8 0ZM8 14.8837C4.20431 14.8837 1.11628 11.7957 1.11628 8C1.11628 4.20428 4.20431 1.11628 8 1.11628C11.7957 1.11628 14.8837 4.20428 14.8837 8C14.8837 11.7957 11.7957 14.8837 8 14.8837Z" fill="currentColor"/><path d="M7.76326 10.1226C7.32098 10.1226 6.96295 10.4911 6.96295 10.9334C6.96295 11.3652 7.31045 11.7442 7.76326 11.7442C8.21608 11.7442 8.57408 11.3652 8.57408 10.9334C8.57408 10.4911 8.20551 10.1226 7.76326 10.1226Z" fill="currentColor"/><path d="M7.90018 3.9834C6.47856 3.9834 5.82568 4.82587 5.82568 5.39449C5.82568 5.80518 6.17318 5.99474 6.4575 5.99474C7.02615 5.99474 6.7945 5.18387 7.86859 5.18387C8.39509 5.18387 8.81634 5.41555 8.81634 5.89996C8.81634 6.46859 8.22662 6.79502 7.87912 7.08987C7.57371 7.35309 7.17359 7.78487 7.17359 8.69049C7.17359 9.23806 7.32103 9.39602 7.75275 9.39602C8.26871 9.39602 8.37403 9.16437 8.37403 8.96424C8.37403 8.41668 8.38456 8.10077 8.96375 7.64796C9.24806 7.42684 10.1431 6.71074 10.1431 5.7209C10.1431 4.73105 9.24806 3.9834 7.90018 3.9834Z" fill="currentColor"/></g><defs><clipPath id="clip0_2454_20405"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>
          Level Breakdown
        </div>
      </div>

      <div className={classes.bottom}>
        {levelBoxesList.map(level => {
          const box = levelBoxes[`level${level}`];
          const cooldown = box?.lastClaim ? calculateTimeLeft(box.lastClaim, 24) : null;
          
          return (
            <BoxItem
              key={level}
              item={{
                name: `Level ${level} Box`,
                level: level
              }}
              userLevel={getLevel()}
              cooldown={cooldown}
              loading={loading.box}
            />
          );
        })}
      </div>      
    </div>
  );
};

export default Rewards;
