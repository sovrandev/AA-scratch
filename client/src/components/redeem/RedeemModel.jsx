import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import PrimaryButton from "../common/buttons/PrimaryButton";
import { useNotification } from "../../contexts/notification";
import { generalSocketService } from "../../services/sockets/general.socket.service";

const useStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperWidthSm": {
      background: theme.bg.main,
      padding: theme.spacing(3),
      gap: theme.spacing(3),
      borderRadius: theme.spacing(2),
      width: 480,
      height: 362,
      position: "relative",
      textAlign: "center",
      "&::-webkit-scrollbar": {
        display: "none"
      },

      overflow: "hidden",
    },
    fontWeight: 600,
  },
  top: {
    display: "flex",
    flexDirection: "column",
    position: 'relative',
  },
  crownCircle: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: theme.gradientLowOpacity,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: theme.text.primary,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
  },
  description: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.secondary,
  },
  middle: {
    display: "flex", 
    flexDirection: "column",
    gap: theme.spacing(1),
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
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.secondary,
    "& span": {
      color: theme.text.primary,
    }
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: theme.bg.box,
    border: "1px solid transparent",
    borderRadius: theme.spacing(1.25),
    padding: "0 16px",
    fontSize: 14,
    fontWeight: 500,
    color: theme.text.primary,
    '&::placeholder': {
      color: theme.text.secondary
    },
    '&:focus': {
      outline: 'none',
    }
  },
  closeButton: {
    position: "absolute",
    top: 24,
    right: 24,
    cursor: "pointer",
    zIndex: 1,
    color: theme.text.secondary,
    "&:hover": {
      color: theme.text.primary
    }
  },
}));

const RedeemModel = ({ open, handleClose }) => {
  const classes = useStyles();
  const notify = useNotification();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code) return;
    
    setLoading(true);
    try {
      const response = await generalSocketService.sendAffiliateClaimCode(code);
      notify.success(response.message);
      handleClose();
    } catch (error) {
      notify.error(error.message || "Failed to redeem code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      className={classes.modal}
    >
      <div className={classes.closeButton} onClick={handleClose}>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div className={classes.top}>
        <div className={classes.crownCircle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M28.7025 13.8075C27.0364 15.0935 24.6979 16.8036 23.6431 16.8036C23.4342 16.8036 23.3671 16.7358 23.3183 16.672C22.8876 16.1007 23.0041 14.0972 23.6654 10.7196C23.7308 10.3851 23.5669 10.0487 23.2753 9.91645C22.9838 9.78345 22.6452 9.8924 22.4684 10.1752C20.1925 13.8268 19.1502 14.5928 18.6778 14.5928C18.0077 14.5928 17.3267 12.5186 16.6508 8.42716C16.597 8.10066 16.341 7.8627 16.0369 7.84375V7.83975C16.0305 7.83975 16.0244 7.8412 16.0179 7.8412C16.0115 7.8412 16.0044 7.83975 15.9983 7.83975V7.84375C15.6952 7.8627 15.4399 8.10066 15.3851 8.42716C14.7085 12.5186 14.0268 14.5928 13.3574 14.5928C12.8847 14.5928 11.843 13.8264 9.56749 10.1752C9.39107 9.8924 9.05244 9.78345 8.76021 9.91645C8.46832 10.0487 8.30442 10.3851 8.37012 10.7196C9.03111 14.0972 9.14861 16.1007 8.71687 16.672C8.66912 16.7362 8.60106 16.8036 8.39247 16.8036C7.33765 16.8036 4.99911 15.0938 3.3324 13.8075C3.06895 13.6038 2.70764 13.637 2.47907 13.8837C2.25016 14.1293 2.22002 14.5181 2.40897 14.8019C6.21951 20.0464 5.50231 26.0655 5.50231 26.0655C5.48842 26.1489 5.48097 26.2342 5.48097 26.3239C5.48097 27.8026 7.40504 28.3878 9.08089 28.7325C10.9274 29.1133 13.3594 29.3254 15.9434 29.3327C15.9682 29.3327 15.9932 29.3334 16.0179 29.3327C16.0427 29.3334 16.0674 29.3334 16.0928 29.3334C18.6761 29.3258 21.1085 29.113 22.9543 28.7325C24.6305 28.3878 26.5549 27.8015 26.5549 26.3239C26.5549 26.2342 26.5475 26.1493 26.5336 26.0655C26.5336 26.0655 25.8167 20.0453 29.6266 14.8019C29.8159 14.5184 29.7861 14.1293 29.5572 13.8837C29.3272 13.6377 28.9666 13.6042 28.7025 13.8075ZM16.0921 27.2924H16.087C16.0633 27.2924 16.0406 27.2935 16.0173 27.2935C15.9936 27.2935 15.9716 27.2924 15.9479 27.2924H15.9428C11.8363 27.2797 9.12152 26.7655 7.92347 26.3242C9.12152 25.8822 11.8363 25.368 15.9428 25.3556H15.9526C15.9739 25.3556 15.9953 25.3556 16.0169 25.3556C16.0386 25.3556 16.0589 25.3556 16.0813 25.3556H16.0914C20.1976 25.368 22.912 25.8822 24.1104 26.3242C22.9127 26.7655 20.1983 27.2797 16.0921 27.2924Z" fill="url(#paint0_linear_2341_10732)"/><path d="M16.0176 6.97685C17.1236 6.97685 18.0202 6.012 18.0202 4.8218C18.0202 3.6316 17.1236 2.66675 16.0176 2.66675C14.9116 2.66675 14.015 3.6316 14.015 4.8218C14.015 6.012 14.9116 6.97685 16.0176 6.97685Z" fill="url(#paint1_linear_2341_10732)"/><path d="M7.56453 9.22118C8.48615 9.22118 9.23327 8.41719 9.23327 7.42543C9.23327 6.43366 8.48615 5.62967 7.56453 5.62967C6.64291 5.62967 5.89579 6.43366 5.89579 7.42543C5.89579 8.41719 6.64291 9.22118 7.56453 9.22118Z" fill="url(#paint2_linear_2341_10732)"/><path d="M24.3319 9.22118C25.2535 9.22118 26.0006 8.41719 26.0006 7.42543C26.0006 6.43366 25.2535 5.62967 24.3319 5.62967C23.4102 5.62967 22.6631 6.43366 22.6631 7.42543C22.6631 8.41719 23.4102 9.22118 24.3319 9.22118Z" fill="url(#paint3_linear_2341_10732)"/><path d="M1.12491 13.7525C1.74618 13.7525 2.24982 13.2105 2.24982 12.5419C2.24982 11.8734 1.74618 11.3314 1.12491 11.3314C0.503639 11.3314 0 11.8734 0 12.5419C0 13.2105 0.503639 13.7525 1.12491 13.7525Z" fill="url(#paint4_linear_2341_10732)"/><path d="M30.8751 13.7525C31.4964 13.7525 32 13.2105 32 12.5419C32 11.8734 31.4964 11.3314 30.8751 11.3314C30.2538 11.3314 29.7502 11.8734 29.7502 12.5419C29.7502 13.2105 30.2538 13.7525 30.8751 13.7525Z" fill="url(#paint5_linear_2341_10732)"/><defs><linearGradient id="paint0_linear_2341_10732" x1="0.639963" y1="28.8001" x2="25.8203" y2="-1.41629" gradientUnits="userSpaceOnUse"><stop stop-color="#9546FD"/><stop offset="0.5" stop-color="#4E89C7"/><stop offset="1" stop-color="#0FC397"/></linearGradient><linearGradient id="paint1_linear_2341_10732" x1="0.639963" y1="28.8001" x2="25.8203" y2="-1.41629" gradientUnits="userSpaceOnUse"><stop stop-color="#9546FD"/><stop offset="0.5" stop-color="#4E89C7"/><stop offset="1" stop-color="#0FC397"/></linearGradient><linearGradient id="paint2_linear_2341_10732" x1="0.639963" y1="28.8001" x2="25.8203" y2="-1.41629" gradientUnits="userSpaceOnUse"><stop stop-color="#9546FD"/><stop offset="0.5" stop-color="#4E89C7"/><stop offset="1" stop-color="#0FC397"/></linearGradient><linearGradient id="paint3_linear_2341_10732" x1="0.639963" y1="28.8001" x2="25.8203" y2="-1.41629" gradientUnits="userSpaceOnUse"><stop stop-color="#9546FD"/><stop offset="0.5" stop-color="#4E89C7"/><stop offset="1" stop-color="#0FC397"/></linearGradient><linearGradient id="paint4_linear_2341_10732" x1="0.639963" y1="28.8001" x2="25.8203" y2="-1.41629" gradientUnits="userSpaceOnUse"><stop stop-color="#9546FD"/><stop offset="0.5" stop-color="#4E89C7"/><stop offset="1" stop-color="#0FC397"/></linearGradient><linearGradient id="paint5_linear_2341_10732" x1="0.639963" y1="28.8001" x2="25.8203" y2="-1.41629" gradientUnits="userSpaceOnUse"><stop stop-color="#9546FD"/><stop offset="0.5" stop-color="#4E89C7"/><stop offset="1" stop-color="#0FC397"/></linearGradient></defs></svg>
        </div>
        <div className={classes.title}>Redeem Affiliate Code</div>
        <div className={classes.description}>Redeem an affiliate code to earn a +5% Bonus on all your next deposits</div>
      </div>

      <form onSubmit={handleRedeem} className={classes.middle}>
        <div className={classes.inputContainer}>
          <div className={classes.inputLabel}>Don't have a code? Use code <span>"FREE"</span></div>
          <input
            type="text"
            className={classes.input}
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
        </div>
      </form>
      <PrimaryButton 
        label={loading ? "Processing..." : "Redeem Code"} 
        style={{ width: "100%", height: 40 }} 
        disabled={loading || !code}
      />
    </Dialog>
  );
};

export default RedeemModel;