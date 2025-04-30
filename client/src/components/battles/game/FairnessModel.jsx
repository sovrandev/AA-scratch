import React from "react";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M11.8333 1.34585L10.6542 0.166687L6 4.82085L1.34583 0.166687L0.166664 1.34585L4.82083 6.00002L0.166664 10.6542L1.34583 11.8334L6 7.17919L10.6542 11.8334L11.8333 10.6542L7.17916 6.00002L11.8333 1.34585Z" fill="#959597"/>
  </svg>
);

const useStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperWidthSm": {
      background: theme.bg.nav,
      borderRadius: 12,
      width: 580,
      height: "fit-content",
      position: "relative",
      display: "flex",
      flexDirection: "row",
      padding: 0,

    },
  },
  dialog: {
    background: theme.bg.nav,
    borderRadius: 12,
    width: 580,
    minHeight: 400,
    maxHeight: 784,
    position: "relative",
    display: "flex",
    flexDirection: "row",
    padding: 0,
    "@media (max-width: 1200px)": {
      margin: 4,
    },
  },
  content: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    backgroundColor: theme.bg.nav,
    padding: "24px",
    overflow: "hidden"
  },
  topContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  pageInfo: {
    display: "flex",
    alignItems: "start",
    flexDirection: "column",
    gap: theme.spacing(0.5),
    color: theme.text.primary,
    "& svg": {
      fontSize: 24
    }
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: theme.text.primary
  },
  pageDescription: {
    fontSize: 14,
    fontWeight: 400,
    color: theme.text.secondary
  },
  closeButton: {
    color: theme.text.secondary,
    cursor: "pointer",
    transition: "color 0.2s ease",
    "&:hover": {
      color: theme.text.primary
    },
    "& svg": {
      fontSize: 24
    }
  },
  divider: {
    height: 1,
    backgroundColor: theme.bg.border,
    opacity: 0.1
  },
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%"
  },
  header: {
    display: "flex",  
    justifyContent: "space-between",
    paddingBottom: "24px",
    borderBottom: `1px solid ${theme.bg.border}`,
  },
  fairnessContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingBottom: "24px",
    gap: "8px"
  },
  fairnessTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.text.primary,
  },
  inputContainer: {
    position: 'relative',
    width: '100%'
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: `${theme.bg.box}`,
    border: 'none',
    borderRadius: 8,
    padding: '0 16px',
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.secondary,
    '&::input': {
      textWrap: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '70%'
    },
    '&:focus': {
      outline: 'none',
    },
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingRight: '100px'
  },
  buttonSecondary: {
    position: 'absolute',
    right: 4,
    top: '50%',
    transform: 'translateY(-50%)',
    background: theme.accent.primaryGradient,
    color: theme.text.primary,
    border: 'none',
    borderRadius: 6,
    padding: '0 12px',
    height: 32,
    fontSize: 14,
    textShadow: "0px 2px 3px rgba(0, 0, 0, 0.25)",
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      opacity: 0.8
    }
  },
}));
const FairnessModel = ({ open, handleClose, EOSBlockNumber, EOSHash, ServerSeedHash, ServerSeed, ClientSeed, Nonce }) => {
  const classes = useStyles();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      classes={{ paper: classes.dialog }}
    >
      <div className={classes.content}>
        <div className={classes.header}>
          <div className={classes.pageInfo}>
            <div className={classes.pageTitle}>
              Fairness
            </div>
            <div className={classes.pageDescription}>Here you can check and validate any of the fairness concerns you may have, we display all data here.</div>
          </div>
          <div className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </div>
        </div>
        <div className={classes.content} style={{ padding: "24px 0 0 0"}}>
          {ServerSeedHash && (
            <div className={classes.fairnessContainer}>
              <div className={classes.fairnessTitle}>
                Server Seed Hash:
              </div>
              <div className={classes.inputContainer}>
                <input
                  type="text"
                  className={classes.input}
                  value={ServerSeedHash}
                />
                <button 
                  className={classes.buttonSecondary}
                  onClick={() => handleCopy(ServerSeedHash)}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
          {ServerSeed && (
            <div className={classes.fairnessContainer}>
              <div className={classes.fairnessTitle}>
                Server Seed:
              </div>
              <div className={classes.inputContainer}>
                <input
                  type="text"
                  className={classes.input}
                  value={ServerSeed}
                />
                <button 
                  className={classes.buttonSecondary}
                  onClick={() => handleCopy(ServerSeed)}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
          {EOSBlockNumber && (
            <div className={classes.fairnessContainer}>
              <div className={classes.fairnessTitle}>
                EOS Block Number:
              </div>
              <div className={classes.inputContainer}>
                <input
                  type="text"
                  className={classes.input}
                  value={EOSBlockNumber}
                />
                <button 
                  className={classes.buttonSecondary}
                  onClick={() => handleCopy(EOSBlockNumber)}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
          {EOSHash && (
            <div className={classes.fairnessContainer}>
              <div className={classes.fairnessTitle}>
                EOS Hash:
              </div>
              <div className={classes.inputContainer}>
                <input
                  type="text"
                  className={classes.input}
                  value={EOSHash}
                />
                <button 
                  className={classes.buttonSecondary}
                  onClick={() => handleCopy(EOSHash)}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
          {Nonce && (
            <div className={classes.fairnessContainer}>
              <div className={classes.fairnessTitle}>
                Nonce:
              </div>
              <div className={classes.inputContainer}>
                <input
                  type="text"
                  className={classes.input}
                  value={Nonce}
                />
                <button 
                  className={classes.buttonSecondary}
                  onClick={() => handleCopy(Nonce)}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </Dialog>

  );
};

export default FairnessModel;