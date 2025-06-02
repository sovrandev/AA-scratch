import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PrimaryButton from "../components/common/buttons/PrimaryButton";
import BattleCard from "../components/battles/overview/BattleCard";
import CaseItem from "../components/cases/overview/CaseItem";
import { useUnbox } from "../contexts/unbox";
import { useBattles } from "../contexts/battles";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/user";
import { useState } from "react";
import LoginModel from "../components/login/LoginModel";
import pattern from "../assets/img/pattern-2.png";
import StaticBattleCard from "../components/battles/overview/StaticBattleCard";
import theme from "../styles/theme";

// nft's
import nft1 from "../assets/img/home/nft1.png";
import nft2 from "../assets/img/home/nft2.png";
import nft3 from "../assets/img/home/nft3.png";
import nft4 from "../assets/img/home/nft4.png";

// Payment method imports
import btc from "../assets/img/cashier/btc.png";
import eth from "../assets/img/cashier/eth.png";
import usdt from "../assets/img/cashier/usdt.png";
import ltc from "../assets/img/cashier/ltc.png";
import sol from "../assets/img/cashier/sol.png";
import visa from "../assets/img/cashier/visa.png";
import kinguin from "../assets/img/cashier/kinguin.png";
import paypal from "../assets/img/cashier/paypal.png";
import gpay from "../assets/img/cashier/gpay.png";
import mastercard from "../assets/img/cashier/mastercard.png";

const PAYMENT_METHODS = [
  {
    icon: btc,
    name: 'Bitcoin',
    gradientColor: 'rgba(247, 147, 26, 0.12)'
  },
  {
    icon: eth,
    name: 'Ethereum',
    gradientColor: 'rgba(98, 126, 234, 0.12)'
  },
  {
    icon: ltc,
    name: 'Litecoin',
    gradientColor: 'rgba(52, 93, 157, 0.12)'
  },
  {
    icon: sol,
    name: 'Solana',
    gradientColor: 'rgba(161, 33, 247, 0.12)'
  },
  {
    icon: usdt,
    name: 'USDT',
    gradientColor: 'rgba(38, 161, 123, 0.12)'
  },
  {
    icon: visa,
    name: 'Visa',
    gradientColor: 'rgba(181, 202, 255, 0.12)'
  },
  {
    icon: mastercard,
    name: 'Mastercard',
    gradientColor: 'rgba(254, 60, 0, 0.12)'
  },
  {
    icon: gpay,
    name: 'Google Pay',
    gradientColor: 'rgba(49, 170, 82, 0.12)'
  },
  {
    icon: paypal,
    name: 'PayPal',
    gradientColor: 'rgba(0, 48, 133, 0.12)'
  },
  {
    icon: kinguin,
    name: 'Kinguin',
    gradientColor: 'rgba(255, 194, 13, 0.12)'
  }
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(6),
    marginBottom: "15rem",
    "@media (max-width: 1200px)": {
      gap: theme.spacing(4),
    },
  },
  banner: {
    width: "100%",
    height: "250px",
    background: `linear-gradient(to right, ${theme.bg.box}FA, ${theme.bg.box}FA), url(${pattern}), ${theme.bg.box}`,
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
      width: "600px",
      height: "600px",
      background: theme.accent.primaryGradient,
      borderRadius: "50%",
      opacity: 0.25,
      filter: "blur(80px)",
      zIndex: 0
    },
    "@media (max-width: 1200px)": {
      padding: "24px",
    },
  },
  bannerContent: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bannerLeft: {
    position: "absolute",
    left: "-25px",
    bottom: "90px",
    display: "flex",
    alignItems: "flex-end",
    "& img": {
      position: "absolute",
      height: "100px",
      width: "auto",
      transition: "transform 0.3s ease",
      transform: "translateY(-50%)",
      borderRadius: "10px",
      "&:first-child": {
        transform: "rotate(-15deg)",
        zIndex: 2
      },
      "&:last-child": {
        transform: "rotate(15deg) translateX(40px)",
        zIndex: 1
      }
    },
    "@media (max-width: 1200px)": {
      left: "-80px",
      bottom: "0px",
    },
  },
  bannerRight: {
    position: "absolute",
    right: "80px",
    bottom: "90px",
    display: "flex",
    alignItems: "flex-end",
    "& img": {
      position: "absolute",
      height: "100px",
      width: "auto",
      transition: "transform 0.3s ease",
      borderRadius: "10px",
      "&:first-child": {
        transform: "rotate(15deg)",
        zIndex: 2
      },
      "&:last-child": {
        transform: "rotate(-15deg) translateX(-40px)",
        zIndex: 1
      }
    },
    "@media (max-width: 1200px)": {
      right: "20px",
      bottom: "0px",
    },
  },
  bannerText: {
    textAlign: "center",
    maxWidth: "600px",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    position: "relative",
    flexDirection: "column",
    "& h1": {
      fontSize: "36px",
      fontWeight: 600,
      color: "#fff",
      lineHeight: 1.2,
      margin: 0,
      "@media (max-width: 1200px)": {
        fontSize: "24px",
      },
      "& span": {
        background: theme.accent.primaryGradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }
    },
    "& p": {
      fontSize: "12px",
      color: theme.text.secondary,
      fontWeight: 500,
      "@media (max-width: 1200px)": {
        fontSize: "10px",
      },
      "& span": {
        fontWeight: 600,
        background: theme.accent.primaryGradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }
    },

  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px"
  },
  userAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  buttonsContainer: {
    display: "flex",
    gap: "12px",
    marginTop: "8px"
  },
  paymentSection: {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  paymentTitle: {
    color: theme.text.secondary,
    fontSize: "16px",
    fontWeight: 600,
    textAlign: "center"
  },
  paymentMethodsContainer: {
    position: "relative",
    overflow: "hidden",
    padding: theme.spacing(2, 0),
    width: "100%",
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      width: "100px",
      zIndex: 2,
      pointerEvents: "none"
    },
    "&::before": {
      left: 0,
      background: `linear-gradient(90deg, ${theme.bg.nav} 0%, rgba(15, 17, 23, 0) 100%)`
    },

    "&::after": {
      right: 0,
      background: `linear-gradient(-90deg, ${theme.bg.nav} 0%, rgba(15, 17, 23, 0) 100%)`
    }

  },
  paymentRow: {
    display: "flex",
    gap: theme.spacing(2),
    "& > div": {
      flex: "0 0 120px"
    },
    "&:nth-child(2)": {
      marginTop: theme.spacing(2)
    }
  },
  methodBox: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(0.75),
    background: theme.bg.box,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "120px",
    height: "60px",
    flex: "0 0 120px",
    position: "relative",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)"
    },
    "& img": {
      position: "relative",
      zIndex: 1,
      maxWidth: "65%",
      height: "auto"
    }
  },
  popularSection: {
    width: "100%",
    maxWidth: "1200px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(3)
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    gap: theme.spacing(1),
    "& svg": {
      background: theme.accent.primaryGradient,
      borderRadius: "6px",
      padding: "4px",
      "& path": {
        fill: "#fff"
      }
    },
    "& h2": {
      fontSize: "20px",
      fontWeight: 600,
      color: theme.text.primary,
      margin: 0,
      "@media (max-width: 1200px)": {
        fontSize: "16px",
      },
    },
  },
  viewAll: {
    color: theme.text.secondary,
    fontSize: "14px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.1s ease",
    "&:hover": {
      color: theme.text.primary,
      "& svg": {
        color: theme.text.primary,
      }
    },
    "@media (max-width: 1200px)": {
        
    },  
  },
  casesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: theme.spacing(2)
  },
  battlesSection: {
    width: "100%",
    maxWidth: "1200px",
  },
  battlesGrid: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2)
  },
  userStats: {
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    marginBottom: "24px"
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px"
  },
  statLabel: {
    color: theme.text.secondary,
    fontSize: "12px",
    fontWeight: 500
  },
  statValue: {
    color: theme.text.primary,
    fontSize: "16px",
    fontWeight: 600,
  },
  faqSection: {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(6)
  },
  faqTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#fff",
    textAlign: "center",
    marginBottom: "8px",
    "@media (max-width: 1200px)": {
      fontSize: "16px",
    },
  },
  faqDescription: {
    fontSize: "16px",
    color: theme.text.secondary,
    textAlign: "center",
    maxWidth: "800px",
    lineHeight: 1.5,
    marginBottom: "50px",
    fontWeight: 600,
    "@media (max-width: 1200px)": {
      fontSize: "12px",
      marginBottom: "20px",
    },  
  },
  faqGrid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    alignItems: "start",
    "@media (max-width: 1200px)": {
      gridTemplateColumns: "repeat(1, 1fr)",
      gap: "10px",
    },
  },
  faqItem: {
    background: theme.bg.box,
    borderRadius: "8px",
    overflow: "hidden",
    width: "100%",
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
    },
    "@media (max-width: 1200px)": {
      padding: "10px",
      fontSize: "12px",
    },
  },
  faqHeaderActive: {
    color: theme.text.primary,
    borderBottom: `1px solid ${theme.bg.border}`,
    background: `${theme.bg.inner}40`
  },
  faqQuestion: {
    fontSize: "16px",
    fontWeight: 500,
    flex: 1,
    "@media (max-width: 1200px)": {
      fontSize: "12px",
    },
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
    overflow: "hidden",
    "@media (max-width: 1200px)": {
      fontSize: "12px",
    },
  }
}));

const Home = () => {
  const classes = useStyles();
  const { boxes } = useUnbox();
  const { history: battleHistory } = useBattles();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [openItems, setOpenItems] = useState(new Set());

  const faqItems = [
    {
      question: "What is Solclash?",
      answer: "Solclash is an innovative crypto gaming platform where users can open virtual boxes and participate in battles to win NFTs and real money. Our platform combines the excitement of unboxing with the thrill of competitive gameplay, all secured by blockchain technology."
    },
    {
      question: "How do I deposit?",
      answer: "Depositing on Solclash is simple. Navigate to the Cashier section, select your preferred payment method (cryptocurrency or traditional payment), enter the amount you wish to deposit, and follow the on-screen instructions. We support multiple cryptocurrencies including Bitcoin, Ethereum, Solana, and more, as well as traditional payment methods like credit cards and PayPal."
    },
    {
      question: "Is Solclash safe and fair to use?",
      answer: "Absolutely. Solclash employs state-of-the-art security measures to protect user data and funds. Our platform uses provably fair algorithms to ensure complete transparency and fairness in all games. Every outcome is verifiable, and we maintain strict compliance with gaming regulations to provide a secure environment for all users."
    },
    {
      question: "Missing crypto deposit?",
      answer: "If your crypto deposit hasn't appeared in your account, don't worry. Blockchain transactions can sometimes take time to confirm. Please wait for at least 30 minutes for the transaction to be processed. If your deposit still hasn't appeared after this time, contact our support team with your transaction ID and wallet address, and we'll investigate immediately."
    },
    {
      question: "Is Solclash trustworthy?",
      answer: "Yes, Solclash has built a reputation for reliability and trustworthiness in the crypto gaming community. We operate with full transparency, have a dedicated support team, and maintain active communication with our user base. Our platform is regularly audited by independent third parties to ensure compliance with industry standards and best practices."
    },
    {
      question: "What are battles?",
      answer: "Battles are exciting competitive events where users can go head-to-head or participate in group competitions. Players join a battle by contributing to the prize pool, and the system randomly selects boxes for each participant. The player who unboxes the item with the highest value wins the entire prize pool. Battles offer a thrilling way to compete and potentially win big rewards."
    },
    {
      question: "How do I open a box?",
      answer: "Opening a box on Solclash is straightforward. Browse our selection of boxes in the Boxes section, select the one you want to open, click on it to view details, and then click the 'Open Box' button. Confirm your purchase, and watch as the animation reveals your prize. If you win an NFT, it will be automatically added to your inventory and can be withdrawn to your wallet."
    },
    {
      question: "How do I get support?",
      answer: "Our dedicated support team is available 24/7 to assist with any questions or issues. You can reach us through the live chat feature on our website, by sending an email to support@solclash.com, or by joining our Discord community. For VIP members, a personal manager is assigned to provide priority assistance and personalized support."
    }
  ];

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

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
          <div className={classes.bannerLeft}>
            <img src={nft1} alt="NFT Artwork 1" />
            <img src={nft2} alt="NFT Artwork 2" />
          </div>
          <div className={classes.bannerContent}>
            {/* {isAuthenticated ? (
              <div className={classes.bannerText}>
                <div className={classes.userProfile}>
                  <img 
                    src={user.avatar} 
                    alt={user.username} 
                    className={classes.userAvatar}
                  />
                  <h1>Welcome back, <span>{user.username}</span></h1>
                </div>
                <div className={classes.userStats}>
                  <div className={classes.statItem}>
                    <span className={classes.statLabel}>Level</span>
                    <span className={classes.statValue}>{user.stats.level}</span>
                  </div>
                  <div className={classes.statItem}>
                    <span className={classes.statLabel}>Balance</span>
                    <span className={classes.statValue}>${user.balance.toFixed(2)}</span>
                  </div>
                  <div className={classes.statItem}>
                    <span className={classes.statLabel}>Total Bets</span>
                    <span className={classes.statValue}>{user.stats?.total}</span>
                  </div>
                </div>
                <div className={classes.buttonsContainer}>
                  <PrimaryButton 
                    label="Open Cases"
                    onClick={() => navigate('/boxes')}
                    style={{
                      padding: "10px 24px",
                      fontSize: "14px",
                      background: "linear-gradient(45deg, #9546FD 2%, #4E89C7 50%, #0FC397 98%)"
                    }}
                  />
                  <PrimaryButton 
                    label="Battle Now"
                    onClick={() => navigate('/box-battles')}
                    style={{
                      padding: "10px 24px",
                      fontSize: "14px",
                      background: "linear-gradient(45deg, #9546FD 2%, #4E89C7 50%, #0FC397 98%)"
                    }}
                  />
                </div>
              </div>
            ) : ( */}
              <div className={classes.bannerText}>
                <h1>Open <span>Glorious Boxes</span> and<br />win real money</h1>
                <p>Experience the thrill of <span>Solclash.com</span>, where every box opened is a chance win NFT's sent directly to you. Jump into battles, earn rewards, and engage with a community of players</p>
                <PrimaryButton 
                  label={isAuthenticated ? "Play Now" : "Sign up now"}
                  onClick={isAuthenticated ? () => navigate('/boxes') : handleLoginClick}
                  style={{
                    padding: "8px 24px",
                    fontSize: "13px",
                  }}
                />
              </div>
            {/* )} */}
          </div>
          <div className={classes.bannerRight}>
            <img src={nft3} alt="NFT Artwork 3" />
            <img src={nft4} alt="NFT Artwork 4" />
          </div>
        </div>

        <div className={classes.popularSection}>
          <div className={classes.sectionHeader}>
            <div className={classes.sectionTitle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 16">
                <path d="m3.346 12.916 7.513 2.514 7.513-2.514V9.005l-5.983 1.955-1.53-2.234-1.53 2.234-5.983-1.955z"></path>
                <path fillRule="evenodd" d="M.856 7.07 3.472 3.2 10.86.57l7.54 2.632 2.462 3.87-8.002 2.631-2-3.096-2 3.096zm5.078-3.56 4.925-1.703 4.924 1.703-4.924 1.703z" clipRule="evenodd"></path>
              </svg>
              <h2>Popular Solclash Boxes</h2>
            </div>
            <div className={classes.viewAll} onClick={() => navigate('/boxes')}>
              View All Boxes
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path d="M0.5 4.16667H12.3083L9.32083 1.17917L10.5 0L15.5 5L10.5 10L9.32083 8.82083L12.3083 5.83333H0.5V4.16667Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <div className={classes.casesGrid}>
            {boxes.slice(0, 5).map((caseItem) => (
              <CaseItem
                item={caseItem}
                onClick={() => {
                  navigate(`/boxes/${caseItem.slug}`);
                }}
              />
            ))}
          </div>
        </div>

        <div className={classes.battlesSection}>
          <div className={classes.sectionHeader}>
            <div className={classes.sectionTitle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="m7.05 13.406 3.534 3.536-1.413 1.414 1.415 1.415-1.414 1.414-2.475-2.475-2.829 2.829-1.414-1.414 2.83-2.83-2.476-2.474 1.414-1.414 1.414 1.413 1.413-1.414zM3 3l3.546.003 11.817 11.818 1.415-1.414 1.414 1.414-2.474 2.475 2.828 2.829-1.414 1.414-2.829-2.829-2.475 2.475-1.414-1.414 1.414-1.415L3.003 6.531zm14.457 0L21 3.003l.002 3.523-4.053 4.052-3.536-3.535z"/>
              </svg>
              <h2>Battle Highlights</h2>
            </div>
            <div className={classes.viewAll} onClick={() => navigate('/box-battles')}>
              View All Battles
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path d="M0.5 4.16667H12.3083L9.32083 1.17917L10.5 0L15.5 5L10.5 10L9.32083 8.82083L12.3083 5.83333H0.5V4.16667Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <div className={classes.battlesGrid}>
            {battleHistory.slice(0, 3).map((battle) => (
              <StaticBattleCard
                key={battle._id}
                game={battle}
              />
            ))}
          </div>
        </div>

        <div className={classes.faqSection}>
          <div className={classes.faqTitle}>Frequently Asked Questions</div>
          <div className={classes.faqDescription}>
            Find answers to the most common questions about Solclash, deposits, withdrawals, and gameplay.
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

        <div className={classes.paymentSection}>
          <div className={classes.paymentMethodsContainer}>
            <motion.div 
              className={classes.paymentRow}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 30,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              {[...PAYMENT_METHODS, ...PAYMENT_METHODS, ...PAYMENT_METHODS].map((method, i) => (
                <div
                  key={i}
                  className={classes.methodBox}
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${method.gradientColor} 0%, rgba(15, 17, 23, 0) 100%)`
                  }}
                >
                  <img src={method.icon} alt={method.name} />
                </div>
              ))}
            </motion.div>
            <motion.div 
              className={classes.paymentRow}
              animate={{ x: ["-50%", "0%"] }}
              transition={{ 
                duration: 30,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              {[...PAYMENT_METHODS, ...PAYMENT_METHODS, ...PAYMENT_METHODS].map((method, i) => (
                <div
                  key={`bottom-${i}`}
                  className={classes.methodBox}
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${method.gradientColor} 0%, rgba(15, 17, 23, 0) 100%)`
                  }}
                >
                  <img src={method.icon} alt={method.name} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>


        <LoginModel 
          open={showLoginModal} 
          handleClose={() => setShowLoginModal(false)} 
        />
      </div>
  );
};

export default Home;