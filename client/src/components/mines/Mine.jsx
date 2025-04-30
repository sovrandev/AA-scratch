import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { motion } from "framer-motion";
import swords from "../../assets/img/swords.svg";
import theme from "../../styles/theme";

const useStyles = makeStyles((theme) => ({
  mine: {
    backgroundColor: theme.bg.box,
    height: "124.8px",
    width: "124.8px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
    WebkitUserSelect: "none",
    WebkitTouchCallout: "none",
    "& img": {
      pointerEvents: "none",
      userSelect: "none",
      WebkitUserSelect: "none",
      WebkitTouchCallout: "none",
      WebkitUserDrag: "none",
    },
    "@media (max-width: 1200px)": {
      height: "60px",
      width: "60px",
      borderRadius: "6px",
    },
  },
  sword: {
    width: "70px",
    height: "70px",
    opacity: 0.2,
    "@media (max-width: 1200px)": {
      width: "35px",
      height: "35px",
    }
  },
  gem: {
    width: "70px",
    height: "70px",
    "@media (max-width: 1200px)": {
      width: "35px",
      height: "35px",
    }
  }

}));

const Mine = ({ bomb, gem, disabled, onClick, revealed, completed }) => {
  const classes = useStyles();

  const variants = {
    front: { 
      rotateY: 0,
      background: theme.bg.inner + "CC",
      transition: { duration: 0.2, transformStyle: "preserve-3d" }
    },
    bomb: { 
      rotateY: 180,
      background: "#3F192A",
      transition: { duration: 0.2, transformStyle: "preserve-3d" }
    },
    gem: {
      rotateY: 180,
      background: theme.accent.primaryGradientLowOpacity,
      transition: { duration: 0.2, transformStyle: "preserve-3d" }
    }
  };

  const currentState = completed ? (bomb ? "bomb" : "gem") : (gem ? "gem" : bomb ? "bomb" : "front");

  return (
    <motion.div 
      className={classes.mine}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      animate={currentState}
      initial={false}
      onClick={disabled ? undefined : onClick}
      style={{ 
        perspective: "1000px", 
        borderBottom: variants[currentState].borderBottom,
        opacity: completed ? (revealed ? 1 : 0.5) : (disabled ? 0.5 : 1),
        cursor: disabled ? "not-allowed" : "pointer"
      }}
      variants={variants}
    >
      {currentState === "front" ? (
        <img 
          src={swords} 
          draggable="false"
          alt=""
          className={classes.sword}
        />
      ) : currentState === "bomb" ? (
        <svg className={classes.gem} xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 81 81" fill="none"><g clipPath="url(#clip0_214_1498)"><path d="M79.1251 11.52C72.1969 7.08564 66.3007 7.96846 61.1607 10.8977C56.6659 7.05781 52.4467 6.93134 52.4467 6.93134L46.037 13.3463C34.1838 7.64214 19.5482 9.67591 9.72874 19.4982C-2.70873 31.9361 -2.70873 52.1068 9.72874 64.5422C22.1662 76.9826 42.3313 76.9826 54.7687 64.5422C64.5958 54.7199 66.627 40.0813 60.9306 28.2328L67.3428 21.8178C67.3428 21.8178 67.2543 18.8026 64.9221 15.1575C68.471 13.4526 71.9844 13.5006 76.1479 16.1693C77.4304 16.9914 79.1429 16.617 79.9624 15.332C80.782 14.0495 80.4177 12.3446 79.1251 11.52ZM30.0304 22.2934C29.4056 22.4274 14.6688 25.6956 12.6503 39.33C12.4277 40.8326 11.0213 41.8798 9.5112 41.6521C8.90413 41.5636 8.37041 41.2828 7.96822 40.8756C7.37126 40.2786 7.05255 39.416 7.18661 38.5129C9.77427 21.0261 28.1307 17.0445 28.9098 16.8852C30.4047 16.5791 31.8617 17.5403 32.1754 19.0302C32.4789 20.5252 31.5228 21.9822 30.0304 22.2934ZM39.4881 20.5379C38.4232 21.6053 36.688 21.6028 35.6231 20.5379C34.5556 19.4704 34.5556 17.7402 35.6231 16.6727C36.688 15.6052 38.4232 15.6077 39.4881 16.6727C40.5556 17.7376 40.5556 19.4729 39.4881 20.5379Z" fill="#ED1B5B"/></g><defs><clipPath id="clip0_214_1498"><rect width="80" height="80" fill="white" transform="translate(0.399902 0.399994)"/></clipPath></defs></svg>
      ) : (
        <svg className={classes.gem} xmlns="http://www.w3.org/2000/svg" width="80" height="81" viewBox="0 0 80 81" fill="none"><g clip-path="url(#clip0_2187_4637)"><path d="M40 0.199951L5.35889 20.2V60.2L40 80.2L74.6411 60.2V20.2L40 0.199951Z" fill="#82D2FF"/><path d="M40 40.2V0.199951L5.35889 20.2L40 40.2Z" fill="#08B7FC"/><path d="M5.35889 20.2V60.2L40 40.2L5.35889 20.2Z" fill="#006DFF"/><path d="M74.6411 20.2L40 40.2L74.6411 60.2V20.2Z" fill="#08B7FC"/><path d="M40 40.2L5.35889 60.2L40 80.2V40.2Z" fill="#0050C0"/><path d="M40 80.2L74.6411 60.2L40 40.2V80.2Z" fill="#006DFF"/><path d="M59.5501 51.4872V28.9128L40 17.6255L20.4498 28.9128V51.4872L40 62.7745L59.5501 51.4872Z" fill="#82D2FF"/><path d="M59.5502 51.4872V28.9128L40 17.6255V62.7745L59.5502 51.4872Z" fill="#55CBFF"/></g><defs><clipPath id="clip0_2187_4637"><rect width="80" height="80" fill="white" transform="translate(0 0.199951)"/></clipPath></defs></svg>      
      )}
    </motion.div>
  );
};

export default Mine;