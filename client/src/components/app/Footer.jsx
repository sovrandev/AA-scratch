import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';

const useStyles = makeStyles((theme) => ({
  root: {
    userSelect: "none",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    color: "#fff",
    backgroundColor: theme.bg.nav,
    borderTop: `1px solid ${theme.bg.border}`,
    padding: "40px 0",
    fontWeight: 600,
    position: "relative",
  },
  mainContent: {
    maxWidth: 1200,
    width: "100%",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    maxWidth: "350px",
  },
  logo: {
    width: 172,
    marginBottom: theme.spacing(2),
    "@media (max-width: 1200px)": {
      margin: "auto 0",
    },
  },
  description: {
    color: theme.text.secondary,
    fontSize: 14,
    opacity: 0.7,
    "@media (max-width: 1200px)": {
      display: "none",
    },
  },
  rightSection: {
    display: "flex",
    gap: theme.spacing(8),
    "@media (max-width: 1200px)": {
      display: "none",
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  columnHeader: {
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: 500,
    marginBottom: theme.spacing(0.5),
  },
  link: {
    color: theme.text.secondary,
    fontSize: 14,
    opacity: 0.7,
    cursor: "pointer",
    transition: "opacity 0.2s ease",
    "&:hover": {
      opacity: 1,
    },
  },
  socialIcons: {
    display: "flex",
    gap: theme.spacing(2),
  },
  icon: {
    color: theme.text.secondary,
    opacity: 0.7,
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
    },
  },
  copyright: {
    paddingTop: theme.spacing(2),
    fontSize: 12,
    color: theme.text.secondary,
    opacity: 0.7,
    borderTop: `1px solid ${theme.bg.border}`,
    marginTop: theme.spacing(2),
  },
  copyrightContent: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 20px",
    textAlign: "center",
  },
  emails: {
    borderTop: `1px solid ${theme.bg.border}`,
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(2),
    gap: theme.spacing(8),
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.text.secondary,
  },
  emailText: {
    fontWeight: 500,
    fontSize: 12,
    color: theme.text.secondary,
    display: "flex",
    gap: theme.spacing(0.5),
    "& span": {
      color: theme.text.primary,
    }
  }

  }));

const Footer = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className={classes.root}>
      <div className={classes.mainContent}>
        <div className={classes.leftSection}>
          <img src={logo} alt="Logo" className={classes.logo} />
          <span className={classes.description}>
            Open boxes and battle to win rare and valuable items.
          </span>
        </div>
        <div className={classes.rightSection}>
          <div className={classes.column}>
            <span className={classes.columnHeader}>GAMES</span>
            <span className={classes.link} onClick={() => handleNavigation('/boxes')}>Boxes</span>
            <span className={classes.link} onClick={() => handleNavigation('/box-battles')}>Battles</span>
            <span className={classes.link} onClick={() => handleNavigation('/upgrader')}>Upgrader</span>
            <span className={classes.link} onClick={() => handleNavigation('/mines')}>Mines</span>
            <span className={classes.link} onClick={() => handleNavigation('/rewards')}>Rewards</span>
          </div>
          <div className={classes.column}>
            <span className={classes.columnHeader}>LEGAL</span>
            <span className={classes.link} onClick={() => handleNavigation('/provably-fair')}>Provably Fair</span>
            <span className={classes.link} onClick={() => handleNavigation('/privacy-policy')}>Privacy Policy</span>
            <span className={classes.link} onClick={() => handleNavigation('/terms-of-service')}>Terms of Service</span>
          </div>
          <div className={classes.column}>
            <span className={classes.columnHeader}>COMMUNITY</span>
            <div className={classes.socialIcons}>
              <TwitterIcon className={classes.icon} />
              <InstagramIcon className={classes.icon} />
              <YouTubeIcon className={classes.icon} />
            </div>
            <span className={classes.columnHeader} style={{ marginTop: 16 }}>SUPPORT</span>
            <span className={classes.link}>support@solclash.com</span>
          </div>
        </div>
      </div>
      <div className={classes.copyright}>
        <div className={classes.copyrightContent}>
          SolClash is a brand name of SolClash Group which is composed by SolClash Limited, a company duly incorporated under the laws of Malta with the company number MT 123456, and registered office at 123 Gaming Street, Valletta VLT 1234, Malta and SolClash US, LLC, a company duly incorporated under the laws of United States of America with the registered number 98765432 and registered office at 456 Tech Avenue, Suite 789, Las Vegas, Nevada 89101, United States.
        </div>
      </div>
      {/*<div className={classes.emails}>
        <div className={classes.emailText}><span>Support:</span> support@solclash.com</div>
        <div className={classes.emailText}><span>Partners:</span> partners@solclash.com</div>
        <div className={classes.emailText}><span>Legal:</span> legal@solclash.com</div>
      </div> */}
    </footer>
  );
};

export default Footer;