import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { TextField } from "@material-ui/core";
import authApi from '../../services/auth.api';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useNotification } from '../../contexts/notification';
import { useUser } from '../../contexts/user';

const useStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperWidthSm": {
      background: theme.bg.nav,
      borderRadius: 12,
      padding: 0,
      display: "flex",
      flexDirection: "row",
      gap: 0,
      width: "100%",
      maxWidth: 500,
      maxHeight: 750,
      position: "relative",
      "&::-webkit-scrollbar": {
        display: "none"
      },
      overflow: "hidden",
      "@media (max-width: 1200px)": {
        margin: 4,
      },
    },
    fontWeight: 600,
  },
  topContainer: {
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  authButton: {
    padding: "10px 12px",
    textAlign: "center",
    borderRadius: theme.spacing(0.75),
    cursor: "pointer",
    transition: "all 0.2s",
    userSelect: "none",
    width: "100%",
  },
  activeButton: {
    background: theme.accent.primaryGradient,
    color: theme.text.primary,
  },
  inactiveButton: {
    background: theme.bg.inner,
    color: theme.text.secondary,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  inputLabel: {
    color: theme.text.secondary,
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8
  },
  inputContainer: {
    position: "relative",
    "& .MuiInputBase-root": {
      background: `${theme.bg.box}`,
      borderRadius: 8,
      color: theme.text.primary,
      "& input": {
        padding: "12px 16px 12px 40px",
        fontFamily: "Inter",
        fontSize: 14,
        "&::placeholder": {
          fontFamily: "Inter",
          fontSize: 14
        }
      },
      "&::placeholder": {
        color: theme.text.secondary,
        opacity: 1
      }
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none"
    }
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: theme.text.secondary,
    zIndex: 1,
    height: 20,
    width: 20,
  },
  passwordIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: theme.text.secondary,
    cursor: "pointer",
    zIndex: 1
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    userSelect: "none"
  },
  customCheckbox: {
    width: 20,
    height: 20,
    minWidth: 20,
    borderRadius: 4,
    border: "1px solid #2F353D",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    background: props => props.isChecked ? theme.accent.primary : "transparent",
    borderColor: props => props.isChecked ? theme.accent.primary : theme.bg.border,
  },
  checkboxLabel: {
    color: theme.text.secondary,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.3,
    "& span": {
      color: theme.text.secondary,
      cursor: "pointer",
      textDecoration: "underline",
      transition: "all 0.1s",
      "&:hover": {
        color: theme.text.primary,
      }
    }
  },
  registerButton: {
    background: theme.accent.primaryGradient,
    color: theme.text.primary,
    padding: "10px",
    borderRadius: "6px",
    textAlign: "center",
    cursor: "pointer",
    fontWeight: 600,
    textShadow: "0px 2px 3px rgba(0, 0, 0, 0.25)",
    "&:hover": {
      opacity: props => props.isFormValid ? 0.9 : 1
    },
    opacity: props => props.isFormValid ? 1 : 0.5,
    pointerEvents: props => props.isFormValid ? "auto" : "none"
  },
  signInText: {
    textAlign: "center",
    color: theme.text.secondary,
    "& span": {
      color: theme.text.primary,
      cursor: "pointer"
    }
  },
  socialButtons: {
    display: "flex",
    gap: 12
  },
  socialButton: {
    flex: 1,
    padding: "10px 12px",
    background: theme.bg.box,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    fontWeight: 500,
    color: theme.text.primary,
    "&:hover": {
      opacity: 0.9
    }
  },
  divider: {
    borderTop: `1px solid ${theme.bg.border}`,
    opacity: 0.5
  },
  googleButton: {
    background: "#FF3C3C",
  },
  steamButton: {
    background: "#3A4148",
  },
  error: {
    color: theme.red,
    border: `1px solid ${theme.red}`,
    borderRadius: 8,
    padding: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  errorIcon: {
    width: 20,
    height: 20,
  },
  contentWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: "48px 64px",
    maxHeight: "100%",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      display: "none"
    },
    "@media (max-width: 1200px)": {
      padding: "24px 32px",
    },
  },
  loginGraphicsContainer: {
    width: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    flexShrink: 0,
  },
  loginGraphics: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  captchaModal: {
    "& .MuiDialog-paper": {
      background: theme.bg.box,
      borderRadius: 12,
      padding: "24px 48px",
      width: "fit-content",
      maxWidth: 400,
    }
  },
  captchaWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    alignItems: "center",
  },
  captchaTitle: {
    color: theme.text.primary,
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: theme.text.primary,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: theme.text.secondary,
    textAlign: "center",
    marginBottom: 16,
  },
}));

const CaptchaModal = ({ open, onClose, onVerify, loading }) => {
  const classes = useStyles();
  const captchaRef = useRef(null);

  return (
    <Dialog open={open} onClose={onClose} className={classes.captchaModal}>
      <div className={classes.captchaWrapper}>
        <div className={classes.captchaTitle}>
          {loading ? "Verifying..." : "Please complete the captcha"}
        </div>
        <HCaptcha
          ref={captchaRef}
          sitekey={"c5bcc878-9664-4334-a5b2-8f02311c399e"}
          onVerify={onVerify}
          theme="contrast"
        />
      </div>
    </Dialog>
  );
};

const LoginModel = ({ open, handleClose }) => {
  const { login } = useUser();
  const [isRegister, setIsRegister] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);
  const notify = useNotification();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const isFormValid = isRegister 
    ? isChecked && username && email && password
    : email && password;

  const classes = useStyles({ isChecked, isFormValid });

  useEffect(() => {
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
    setCaptchaToken(null);
  }, [isRegister]);

  const handleSubmit = async (token) => {
    setLoading(true);
    try {
      let res;
      if (isRegister) {
        res = await authApi.register(username, email, password, token);
      } else {
        res = await authApi.login(email, password, token);
      }
      await login(res);
      notify.success('Logged in successfully!');
      handleClose();
    } catch (err) {
      console.error('Full error:', err);
      notify.error(err?.response?.data?.error?.message || 'Authentication failed');
    }
    setLoading(false);
    setPendingSubmit(false);
    setShowCaptcha(false);
  };

  const handleButtonClick = () => {
    setShowCaptcha(true);
    setPendingSubmit(true);
  };

  const handleCaptchaVerify = (token) => {
    setCaptchaToken(token);
    handleSubmit(token);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} className={classes.modal}>
        <div className={classes.contentWrapper}>
          <div className={classes.welcomeContainer}> 
            <div className={classes.welcomeTitle}>Welcome to Solclash</div>
            <div className={classes.welcomeSubtitle}>Login to get started</div>
          </div>
          
          <div className={classes.topContainer}>
            <div 
              className={`${classes.authButton} ${classes.leftButton} ${!isRegister ? classes.activeButton : classes.inactiveButton}`}
              onClick={() => setIsRegister(false)}
            >
              Log In
            </div>
            <div 
              className={`${classes.authButton} ${classes.rightButton} ${isRegister ? classes.activeButton : classes.inactiveButton}`}
              onClick={() => setIsRegister(true)}
            >
              Register
            </div>
          </div>

          <div className={classes.divider} />

          <div className={classes.section}>
            {isRegister && (
              <div>
                <div className={classes.inputLabel}>Username</div>
                <div className={classes.inputContainer}>
                  <svg className={classes.inputIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clipPath="url(#clip0_656_7369)"><path opacity="0.5" d="M10.0002 9.99999C11.8418 9.99999 13.3335 8.50416 13.3335 6.66666C13.3335 4.82499 11.8418 3.33333 10.0002 3.33333C8.1585 3.33333 6.66683 4.82499 6.66683 6.66666C6.66683 8.50416 8.1585 9.99999 10.0002 9.99999ZM10.0002 11.6667C7.77933 11.6667 3.3335 12.7792 3.3335 15V16.6667H16.6668V15C16.6668 12.7792 12.221 11.6667 10.0002 11.6667Z" fill="white"/></g><defs><clipPath id="clip0_656_7369"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
                  <TextField 
                    fullWidth 
                    variant="outlined"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <div className={classes.inputLabel}>Email</div>
              <div className={classes.inputContainer}>
                <svg className={classes.inputIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clipPath="url(#clip0_656_7374)"><path opacity="0.5" d="M16.6665 3.33334H3.33317C2.41234 3.33334 1.67484 4.07917 1.67484 5L1.6665 15C1.6665 15.9208 2.41234 16.6667 3.33317 16.6667H16.6665C17.5873 16.6667 18.3332 15.9208 18.3332 15V5C18.3332 4.07917 17.5873 3.33334 16.6665 3.33334ZM16.6665 6.66667L9.99984 10.8333L3.33317 6.66667V5L9.99984 9.16667L16.6665 5V6.66667Z" fill="white"/></g><defs><clipPath id="clip0_656_7374"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
                <TextField 
                  fullWidth 
                  variant="outlined"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className={classes.inputLabel}>Password</div>
              <div className={classes.inputContainer}>
                <svg className={classes.inputIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clipPath="url(#clip0_656_7382)"><path opacity="0.5" d="M15.0002 6.66667H14.1668V5C14.1668 2.7 12.3002 0.833333 10.0002 0.833333C7.70016 0.833333 5.8335 2.7 5.8335 5V6.66667H5.00016C4.07933 6.66667 3.3335 7.4125 3.3335 8.33333V16.6667C3.3335 17.5875 4.07933 18.3333 5.00016 18.3333H15.0002C15.921 18.3333 16.6668 17.5875 16.6668 16.6667V8.33333C16.6668 7.4125 15.921 6.66667 15.0002 6.66667ZM10.0002 14.1667C9.07933 14.1667 8.3335 13.4208 8.3335 12.5C8.3335 11.5792 9.07933 10.8333 10.0002 10.8333C10.921 10.8333 11.6668 11.5792 11.6668 12.5C11.6668 13.4208 10.921 14.1667 10.0002 14.1667ZM12.5835 6.66667H7.41683V5C7.41683 3.575 8.57516 2.41667 10.0002 2.41667C11.4252 2.41667 12.5835 3.575 12.5835 5V6.66667Z" fill="white"/></g><defs><clipPath id="clip0_656_7382"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
                <TextField 
                  fullWidth 
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <svg 
                  className={classes.passwordIcon} 
                  onClick={() => setShowPassword(!showPassword)}
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="currentColor"
                >
                  {showPassword ? (
                    <path d="M8 3C4.667 3 1.82 5.073 0 8c1.82 2.927 4.667 5 8 5s6.18-2.073 8-5c-1.82-2.927-4.667-5-8-5zm0 8.333c-1.84 0-3.333-1.493-3.333-3.333 0-1.84 1.493-3.333 3.333-3.333 1.84 0 3.333 1.493 3.333 3.333 0 1.84-1.493 3.333-3.333 3.333z"/>
                  ) : (
                    <path d="M13.359 11.238l-1.88-1.88C11.825 8.718 12 7.877 12 7c0-2.42-1.79-4.44-4.12-4.44-.847 0-1.688.175-2.358.521L3.642 1.201C4.952.664 6.426.333 8 .333c3.333 0 6.18 2.073 8 5-1.298 2.085-3.157 3.719-5.641 4.405l3 3-.53.53-11.5-11.5.53-.53 3 3C4.052 3.962 3.333 5.397 3.333 7c0 2.42 1.79 4.44 4.12 4.44.847 0 1.688-.175 2.358-.521l1.88 1.88C10.381 13.336 9.209 13.667 8 13.667c-3.333 0-6.18-2.073-8-5 1.298-2.085 3.157-3.719 5.641-4.405l-3-3 .53-.53 11.5 11.5-.53.53-3-3z"/>
                  )}
                </svg>
              </div>
            </div>
          </div>

          {isRegister ? (
            <>
              <div className={classes.section}>
                <div 
                  className={classes.checkboxContainer}
                  onClick={() => setIsChecked(!isChecked)}
                >
                  <div className={classes.customCheckbox}>
                    {isChecked && (
                      <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className={classes.checkboxLabel}>
                    By checking this box and signing in, You confirm that you are of legal age (18+) and agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.
                  </div>
                </div>
              </div>
              <div className={classes.section}>
                <div className={classes.registerButton} onClick={handleButtonClick}>
                  {loading ? "Creating Account..." : "Register"}
                </div>
              </div>

              <div className={classes.divider} />

              <div className={classes.section}>
                <div className={classes.signInText}>
                  Already have an account? <span onClick={() => setIsRegister(false)}>Sign in</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={classes.section}>
                <div className={classes.registerButton} onClick={handleButtonClick}>
                  {loading ? "Signing In..." : "Sign In"}
                </div>
              </div>

              <div className={classes.divider} />

              <div className={classes.section}>
                <div className={classes.signInText}>
                  Don't have an account? <span onClick={() => setIsRegister(true)}>Register</span>
                </div>
              </div>
            </>
          )}
        </div>
      </Dialog>

      <CaptchaModal
        open={showCaptcha}
        onClose={() => {
          setShowCaptcha(false);
          setPendingSubmit(false);
        }}
        onVerify={handleCaptchaVerify}
        loading={loading}
      />
    </>
  );
};

export default LoginModel;