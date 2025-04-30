import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { motion, AnimatePresence } from "framer-motion";
import pattern from "../assets/img/pattern-2.png";
import crown from "../assets/img/vip/crown.png";
import gift from "../assets/img/vip/gift.png";
import money from "../assets/img/vip/money.png";
import manager from "../assets/img/vip/manager.png";
import positive from "../assets/img/vip/positive.png";
import plane from "../assets/img/vip/plane.png";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "36px",
    marginBottom: "15rem"
  },
  banner: {
    width: "100%",
    maxWidth: "1200px",
    height: "250px",
    background: `linear-gradient(to right, ${theme.bg.box}F5, ${theme.bg.box}F5), url(${pattern}), ${theme.bg.box}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "36px",
    borderRadius: "8px",
    "&::before": {
      content: '""',
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
      height: "400px",
      background: "linear-gradient(45deg, #FFC646, #FFA500)",
      borderRadius: "50%",
      opacity: 0.05,
      filter: "blur(80px)",
      zIndex: 0
    }
  },
  bannerContent: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexDirection: "column",
    gap: "16px",
    zIndex: 1
  },
  crownLeft: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%) rotate(-15deg)",
    width: "170px",
    height: "auto",
    opacity: 1,
    filter: "drop-shadow(0 0 16 px rgba(255, 198, 70, 0.2))"
  },
  crownRight: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%) rotate(15deg)",
    width: "170px",
    height: "auto",
    opacity: 1,
    filter: "drop-shadow(0 0 16px rgba(255, 198, 70, 0.2))"
  },
  bannerTitle: {
    fontSize: "36px",
    fontWeight: 600,
    color: "#fff",
    textAlign: "center",
    lineHeight: 1.2,
    "& span": {
      background: "linear-gradient(45deg, #FFC646, #FFA500)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    }
  },
  bannerDescription: {
    fontSize: "12px",
    color: theme.text.secondary,
    textAlign: "center",
    fontWeight: 500,
    maxWidth: "600px",
    lineHeight: 1.5
  },
  joinButton: {
    padding: "10px 24px",
    borderRadius: "6px",
    background: "linear-gradient(45deg, #FFC646, #FFA500)",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.2s ease",
    "&:hover": {
      opacity: 0.9
    }
  },
  perksSection: {
    width: "100%",
    maxWidth: "1200px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  perkCard: {
    background: theme.bg.box,
    borderRadius: "8px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(90deg, var(--accent-color) 0%, transparent 100%)",
      opacity: 0.05,
      pointerEvents: "none"
    }
  },
  perkIcon: {
    width: "64px",
    height: "64px",
    objectFit: "contain",
    filter: "drop-shadow(0 0 12px rgba(var(--accent-color-rgb), 0.3))"
  },
  perkContent: {
    display: "flex",
    flexDirection: "column",
    gap: "2px"
  },
  perkTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#fff"
  },
  perkDescription: {
    fontSize: "12px",
    color: theme.text.secondary,
    lineHeight: 1.5
  },
  faqSection: {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  faqTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#fff",
    textAlign: "center",
    marginBottom: "8px"
  },
  faqDescription: {
    fontSize: "16px",
    color: theme.text.secondary,
    textAlign: "center",
    maxWidth: "800px",
    lineHeight: 1.5,
    marginBottom: "50px",
    fontWeight: 600,
  },
  faqGrid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    alignItems: "start"
  },
  faqItem: {
    background: theme.bg.box,
    borderRadius: "8px",
    overflow: "hidden",
    width: "100%"
  },
  faqHeader: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.2s ease",
    color: theme.text.secondary,
    borderBottom: `1px solid transparent`,
    "&:hover": {
      background: `${theme.bg.inner}40`
    }
  },
  faqHeaderActive: {
    color: theme.text.primary,
    borderBottom: `1px solid ${theme.bg.border}`,
    background: `${theme.bg.inner}40`
  },
  faqQuestion: {
    fontSize: "16px",
    fontWeight: 500,
    flex: 1
  },
  faqArrow: {
    width: "24px",
    height: "24px",
    transition: "transform 0.2s ease",
    "& path": {
      fill: "currentColor"
    }
  },
  faqAnswer: {
    background: theme.palette.darkgrey,
    color: theme.text.secondary,
    fontSize: "14px",
    lineHeight: 1.6,
    overflow: "hidden"
  },
  joinSection: {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  joinTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#fff",
    textAlign: "center",
    marginBottom: "8px"
  },
  joinDescription: {
    fontSize: "16px",
    color: theme.text.secondary,
    textAlign: "center",
    maxWidth: "800px",
    lineHeight: 1.5,
    fontWeight: 600,
    marginBottom: "50px"
  },
  cardsGrid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "24px"
  },
  joinCard: {
    background: theme.bg.box,
    borderRadius: "8px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    position: "relative",
    overflow: "hidden",
    background: `linear-gradient(to right, ${theme.bg.box}F2, ${theme.bg.box}F2), url(${pattern}), ${theme.bg.box}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(90deg, var(--accent-color) 0%, transparent 100%)",
      opacity: 0.05,
      pointerEvents: "none"
    }
  },
  cardLabel: {
    fontSize: "14px",
    color: theme.text.primary,
    fontWeight: 600
  },
  cardTitle: {
    fontSize: "32px",
    fontWeight: 600,
    color: "#fff",
    "& span.purple": {
      color: "#9D5CFF"
    },
    "& span.green": {
      color: "#00E7B6"
    }
  },
  cardButton: {
    width: "fit-content",
    padding: "10px 24px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s ease",
    "&:hover": {
      opacity: 0.9
    }
  },
  purpleButton: {
    background: "linear-gradient(45deg, #9D5CFF, #6E3AAF)",
    color: "#fff",
  },
  greenButton: {
    background: "linear-gradient(45deg, #00E7B6, #009B79)",
    color: "#fff",
  },
  cardImage: {
    position: "absolute",
    right: "32px",
    bottom: "32px",
    width: "200px",
    height: "auto",
    filter: "drop-shadow(0 0 12px rgba(var(--accent-color-rgb), 0.3))"
  }
}));

const VIPClub = () => {
  const classes = useStyles();
  const [openItems, setOpenItems] = useState(new Set());

  const faqItems = [
    {
      question: "How can I join the VIP Club?",
      answer: "Complete the Google Form, answer a few questions, and meet the requirements to unlock access to our exclusive VIP Club with premium rewards and perks."
    },
    {
      question: "What are the benefits of being a VIP Club?",
      answer: "As a VIP member, you'll enjoy exclusive benefits including a 10% daily deposit bonus up to 1,000€, 15% weekly cashback on losses, and dedicated 24/7 support from your personal VIP manager."
    },
    {
      question: "Is there a minimum requirement to join the VIP Club?",
      answer: "Yes, you need to be at least a Diamond 1 player and maintain active gameplay on Solclash to be eligible for VIP membership."
    },
    {
      question: "How does Daily Deposit Bonus work?",
      answer: "VIP members receive a 10% bonus on their daily deposits, up to a maximum of 1,000€. This bonus is automatically credited to your account and can be used immediately."
    },
    {
      question: "What is the 15% Weekly Lossback?",
      answer: "VIP members enjoy a rakeback feature, which gives them a percentage of their wagered amount back, regardless of whether they win or lose. This effectively reduces the house edge and provides extra value for frequent players."
    },
    {
      question: "How can I contact my VIP Personal Manager?",
      answer: "Once you become a VIP member, you'll be assigned a dedicated personal manager who is available 24/7 through our secure messaging system. They will assist you with deposits, withdrawals, bonuses, and any other inquiries."
    }
  ];

  const toggleFaq = (index) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (  
    <div className={classes.root}>
      <div className={classes.banner}>
        <img src={crown} alt="Crown" className={classes.crownLeft} />
        <div className={classes.bannerContent}>
          <div className={classes.bannerTitle}>
            The Amazing <span>Solclash</span><br />VIP Club
          </div>
          <div className={classes.bannerDescription}>
            The most rewarding VIP club in the industry, offering unparalleled perks and exclusive privileges for an extraordinary gaming experience.
          </div>
          <div className={classes.joinButton}>
            Join VIP Club
          </div>
        </div>
        <img src={crown} alt="Crown" className={classes.crownRight} />
      </div>
      
      <div className={classes.perksSection}>
        <div className={classes.perkCard} style={{ "--accent-color": "#FA7D85", "--accent-color-rgb": "250, 125, 133" }}>
          <img src={gift} alt="Daily Bonus" className={classes.perkIcon} />
          <div className={classes.perkContent}>
            <div className={classes.perkTitle}>10% Daily Bonus</div>
            <div className={classes.perkDescription}>Enjoy a daily deposit bonus up to 1,000€.</div>
          </div>
        </div>
        
        <div className={classes.perkCard} style={{ "--accent-color": "#88C9A9", "--accent-color-rgb": "136, 201, 169" }}>
          <img src={money} alt="Weekly Lossback" className={classes.perkIcon} />
          <div className={classes.perkContent}>
            <div className={classes.perkTitle}>15% Weekly Lossback</div>
            <div className={classes.perkDescription}>Receive 15% cashback on weekly losses.</div>
          </div>
        </div>
        
        <div className={classes.perkCard} style={{ "--accent-color": "#DA6839", "--accent-color-rgb": "218, 104, 57" }}>
          <img src={manager} alt="VIP Manager" className={classes.perkIcon} />
          <div className={classes.perkContent}>
            <div className={classes.perkTitle}>VIP Personal Manager</div>
            <div className={classes.perkDescription}>Enjoy 24/7 personalized support from your dedicated VIP manager.</div>
          </div>
        </div>
      </div>
      
      <div className={classes.joinSection}>
        <div className={classes.joinTitle}>How can I join the VIP club?</div>
        <div className={classes.joinDescription}>
          Complete the Google Form, answer a few questions, and meet the requirements to unlock access to our exclusive VIP Club with premium rewards and perks.          
        </div>
        
        <div className={classes.cardsGrid}>
          <div className={classes.joinCard} style={{ "--accent-color": "#9D5CFF", "--accent-color-rgb": "157, 92, 255" }}>
            <div className={classes.cardLabel}>Minimum Diamond 1 Players</div>
            <div className={classes.cardTitle}>
              Loyal & <span className="purple">Active</span><br />on Solclash?
            </div>
            <div className={`${classes.cardButton} ${classes.purpleButton}`}>
              Join VIP Club
            </div>
            <img src={positive} alt="VIP Player" className={classes.cardImage} />
          </div>
          
          <div className={classes.joinCard} style={{ "--accent-color": "#00E7B6", "--accent-color-rgb": "0, 231, 182" }}>
            <div className={classes.cardLabel}>VIP elsewhere? Get Transferred now</div>
            <div className={classes.cardTitle}>
              VIP Transfers<br />or <span className="green">High</span> Roller?
            </div>
            <div className={`${classes.cardButton} ${classes.greenButton}`}>
              Join VIP Club
            </div>
            <img src={plane} alt="VIP Transfer" className={classes.cardImage} />
          </div>
        </div>
      </div>
      
      <div className={classes.faqSection}>
        <div className={classes.faqTitle}>Frequently Asked Questions</div>
        <div className={classes.faqDescription}>
          Complete the Google Form, answer a few questions, and meet the requirements to unlock access to our exclusive VIP Club with premium rewards and perks.
        </div>
        
        <div className={classes.faqGrid}>
          {faqItems.map((item, index) => (
            <motion.div key={index} className={classes.faqItem}>
              <motion.div 
                className={`${classes.faqHeader} ${openItems.has(index) ? classes.faqHeaderActive : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className={classes.faqQuestion}>{item.question}</div>
                <motion.svg 
                  className={classes.faqArrow}
                  animate={{ rotate: openItems.has(index) ? 180 : 0 }}
                  transition={{ duration: 0.1 }}
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5z" fill="currentColor" />
                </motion.svg>
              </motion.div>
              <AnimatePresence>
                {openItems.has(index) && (
                  <motion.div 
                    className={classes.faqAnswer}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <motion.div
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ padding: "20px" }}
                    >
                      {item.answer}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VIPClub;