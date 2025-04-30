import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Loader from "../components/common/Loader";
import { useLeaderboard } from "../contexts/leaderboard";
import backgroundPattern from "../assets/img/pattern.png";
import NumberFlow from '@number-flow/react';
import LevelBox from "../components/common/LevelBox";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    color: "#fff",
    marginBottom: "10rem"
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
      height: "100px",
      background: `linear-gradient(90deg, ${theme.accent.primary}26, ${theme.accent.primary}26)`,
      filter: "blur(50px)",
    }
  },
  title: {
    fontSize: "64px",
    fontWeight: "bold",
    background: theme.accent.primaryGradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    width: "fit-content",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
    "@media (max-width: 1200px)": {
      fontSize: "48px",
    }
  },
  subtitle: {
    color: theme.text.primary,
    fontSize: "24px",
    fontWeight: 600,
    margin: "0 auto",
    top: -12.5,
    position: "relative",
    "@media (max-width: 1200px)": {
      marginTop: "0.75rem",
      fontSize: "20px",
    }
  },
  topThree: {
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(6),
    position: "relative",
    padding: theme.spacing(4, 0),
    alignItems: "flex-end",
    maxWidth: "835px",
    margin: "0 auto",
    "@media (max-width: 1200px)": {
      display: "none"
    }
  },
  playerCard: {
    width: "285px",
    height: "273px",
    position: "relative",
    "&.first": {
      transform: "translateY(-20px)"
    }
  },
  topSection: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "space-around",
    padding: theme.spacing(3),
    borderTopRightRadius: "8px",
    borderTopLeftRadius: "8px",
    background: `linear-gradient(to bottom, ${theme.bg.box} -10%, ${theme.bg.main} 100%)`,
    border: "1px solid transparent",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `url(${backgroundPattern})`,
      backgroundSize: "125%",
      backgroundPosition: "center bottom",
      backgroundRepeat: "no-repeat",
      zIndex: 2,
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-1px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "150%",
      height: "85%",
      background: "radial-gradient(ellipse at bottom, rgba(255,255,255,0.15) 0%, transparent 70%)",
      pointerEvents: "none",
      zIndex: 1
    },
    "& > *": {
      position: "relative",
      zIndex: 3
    },
    "&.first": {
      borderImageSource: `linear-gradient(to top, 
        rgba(255,167,36,0.6) 0%,
        rgba(255,167,36,0.3) 25%,
        rgba(255,167,36,0.1) 40%,
        transparent 60%
      )`,
      borderImageSlice: "1",
      "&::after": {
        background: "radial-gradient(ellipse at bottom, rgba(255,167,36,0.2) 0%, transparent 70%)"
      }
    },
    "&.second": {
      borderImageSource: `linear-gradient(to top, 
        rgba(192,192,192,0.6) 0%,
        rgba(192,192,192,0.3) 25%,
        rgba(192,192,192,0.1) 40%,
        transparent 60%
      )`,
      borderImageSlice: "1",
      "&::after": {
        background: "radial-gradient(ellipse at bottom, rgba(192,192,192,0.2) 0%, transparent 70%)"
      }
    },
    "&.third": {
      borderImageSource: `linear-gradient(to top, 
        rgba(205,127,50,0.6) 0%,
        rgba(205,127,50,0.3) 25%,
        rgba(205,127,50,0.1) 40%,
        transparent 60%
      )`,
      borderImageSlice: "1",
      "&::after": {
        background: "radial-gradient(ellipse at bottom, rgba(205,127,50,0.2) 0%, transparent 70%)"
      }
    }
  },
  wagered: {
    color: theme.text.secondary,
    fontSize: "14px",
    marginBottom: theme.spacing(1),
    fontWeight: 600,
    "& span": {
      display: "block",
      fontSize: "18px",
      fontWeight: 600,
      color: theme.text.primary,
    }
  },
  bottomSection: {
    borderBottomRightRadius: "8px",
    borderBottomLeftRadius: "8px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&.first": {
      background: `radial-gradient(circle at 50% 50%, rgba(255,167,36,0.15), transparent 70%), ${theme.bg.box}`,
      "& $prize": {
        "& span": {
          color: "#FFA724"
        }
      }
    },
    "&.second": {
      background: `radial-gradient(circle at 50% 50%, rgba(192,192,192,0.15), transparent 70%), ${theme.bg.box}`,
      "& $prize": {
        "& span": {
          color: "#C0C0C0"
        }
      }
    },
    "&.third": {
      background: `radial-gradient(circle at 50% 50%, rgba(205,127,50,0.15), transparent 70%), ${theme.bg.box}`,
      "& $prize": {
        "& span": {
          color: "#CD7F32"
        }
      }
    }
  },
  avatar: {
    width: "68px",
    height: "68px",
    position: "relative",
    margin: "0 auto",
    "&::before": {
      content: '""',
      position: "absolute",
      top: -3,
      left: -3,
      right: -3,
      bottom: -3,
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "50%"
    },
    ".first &::before": {
      border: "1px solid #FFA724"
    },
    ".second &::before": {
      border: "1px solid #C0C0C0"
    },
    ".third &::before": {
      border: "1px solid #CD7F32"
    },
    "& img": {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      objectFit: "cover"
    }
  },
  username: {
    fontSize: "22px",
    lineHeight: "22px",
    fontWeight: "600",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px",
    maxWidth: "835px",
    margin: "0 auto"
  },
  desktopTableRows: {
    "@media (max-width: 1200px)": {
      display: "none"
    }
  },
  mobileTableRows: {
    display: "none",
    "@media (max-width: 1200px)": {
      display: "table-row"
    }
  },
  tableHeader: {
    color: theme.text.secondary,
    textAlign: "left",
    padding: theme.spacing(1, 2),
    fontSize: "14px",
    fontWeight: "500",
  },
  tableHeaderRow: {
    '& th': {
      padding: theme.spacing(1, 2),
      '&:first-child': {
        width: "50%",
        paddingLeft: theme.spacing(2)
      },
      '&:not(:first-child)': {
        width: "25%"
      }
    }
  },
  tableRow: {
    backgroundColor: theme.bg.box,
    position: "relative",
    overflow: "hidden",
    /*"&:nth-child(odd)": {
      "& td:first-child::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "8px",
        background: `linear-gradient(to right, ${theme.accent.primary}80, transparent)`,
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
        opacity: 0.7,
      }
    },
    "&:nth-child(even)": {
      "& td:first-child::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "8px",
        background: `linear-gradient(to right, ${theme.accent.primary}80, transparent)`,
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
        opacity: 0.7,
      }
    },*/
    '& td': {
      padding: theme.spacing(2),
      position: "relative",
      '&:first-child': {
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
        width: "50%",
        borderLeft: `4px solid ${theme.bg.border}`
      },
      '&:not(:first-child)': {
        width: "25%"
      },
      '&:last-child': {
        borderTopRightRadius: '8px',
        borderBottomRightRadius: '8px'
      }
    }
  },
  rank: {
    color: theme.text.secondary,
    width: "50px"
  },
  player: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    "@media (max-width: 1200px)": {
      gap: theme.spacing(1)
    }
  },
  smallAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%"
  },
  amount: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    '& img': {
      width: "14px",
      height: "14px"
    }
  },
  countdownSection: {
    textAlign: 'center',
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(2),
  },
  countdownTitle: {
    color: theme.text.primary,
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  countdownSubtitle: {
    color: theme.text.secondary,
    fontSize: '10px',
    marginBottom: theme.spacing(1.5),
  },
  countdownTimer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(0.5),
    borderRadius: "4px",
    fontSize: "20px",
    fontWeight: "bold",
    backgroundColor: theme.bg.box,
    width: "fit-content",
    padding: theme.spacing(1, 1.5)
  },
  timeUnit: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.25),
    "& .value": {
      color: theme.text.primary,
      fontSize: "14px",
      minWidth: "1.5em",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      fontVariantNumeric: "tabular-nums",
      "& number-flow-react": {
        "--number-flow-char-height": "1em",
        "--number-flow-mask-height": "0.25em",
        "--number-flow-mask-width": "0.25em"
      }
    },
    "& .label": {
      color: theme.text.secondary,
      opacity: 0.6,
      fontSize: "12px",
    }
  },
  timeSeparator: {
    color: theme.text.secondary,
    opacity: 0.3,
    margin: '0 2px',
  },
  prize: {
    fontSize: "14px",
    fontWeight: "500",
    "& > span:first-child": {
      color: theme.text.secondary,
      marginRight: "4px"
    },
    "& > span:last-child": {
      marginRight: "4px",
      marginLeft: "4px"
    }
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(2),
    gap: theme.spacing(1)
  }
}));

const TimeUnit = ({ value, suffix, className }) => {
  return (
    <div className={className}>
      <div className="value">
        <NumberFlow 
          value={parseInt(value)}
          format={{ 
            minimumIntegerDigits: 2,
            useGrouping: false
          }}
          transformTiming={{ 
            duration: 400, 
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)' 
          }}
          spinTiming={{ 
            duration: 400, 
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)' 
          }}
          trend={0}
        />
      </div>
      <span className="label">{suffix}</span>
    </div>
  );
};

const Countdown = ({ duration, updatedAt }) => {
  const classes = useStyles();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const startDate = new Date(updatedAt);
      const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
      const now = new Date();
      const difference = endDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [duration, updatedAt]);

  return (
    <div className={classes.countdownSection}>
      <div className={classes.countdownTitle}>Enjoy our weekly leaderboard</div>
      <div className={classes.countdownSubtitle}>Over thousands given away every week!</div>
      <div className={classes.countdownTimer}>
        <TimeUnit value={timeLeft.days} suffix="d" className={classes.timeUnit} />
        <TimeUnit value={timeLeft.hours} suffix="h" className={classes.timeUnit} />
        <TimeUnit value={timeLeft.minutes} suffix="m" className={classes.timeUnit} />
        <TimeUnit value={timeLeft.seconds} suffix="s" className={classes.timeUnit} />
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const classes = useStyles();
  const { leaderboard, loading } = useLeaderboard();

  if (loading) return <Loader />;

  const fillEmptySlots = (users, totalSlots = 10) => {
    const emptyUser = {
      user: {
        _id: null,
        username: 'Steven',
        avatar: 'https://cdn.pfps.gg/pfps/5792-miffy-7.png',
      },
      points: 0,
      prize: 0
    };

    const filledUsers = users.map(winner => {
      if (!winner.user) {
        return {
          ...winner,
          user: {
            _id: `empty-${Math.random()}`,
            username: 'Steven',
            avatar: 'https://cdn.pfps.gg/pfps/5792-miffy-7.png',
          }
        };
      }
      return winner;
    });

    while (filledUsers.length < totalSlots) {
      filledUsers.push({
        ...emptyUser,
        _id: `empty-${filledUsers.length}`
      });
    }
    return filledUsers;
  };

  const getTopThreeOrder = (users) => {
    if (users.length === 0) return [];
    const ordered = [...users];
    if (ordered.length > 1) {
      [ordered[0], ordered[1]] = [ordered[1], ordered[0]];
    }
    return ordered;
  };

  const users = fillEmptySlots(leaderboard?.winners || []);
  const topThree = getTopThreeOrder(users.slice(0, 3));
  const restUsers = users.slice(3);
  
  // For mobile view, we'll use all users in the table
  const allUsers = [...users];

  return (  
      <div className={classes.root}>
        <div className={classes.header}>
          <h1 className={classes.title}>Weekly Race</h1>
          <div className={classes.subtitle}>
            $10,000 in prizes
          </div>
        </div>

        <div className={classes.topThree}>
          {topThree.map((user, index) => {
            let position = '';
            if (index === 0) position = 'second';
            else if (index === 1) position = 'first';
            else position = 'third';

            return (
              <div key={user.user._id} className={`${classes.playerCard} ${position}`}>
                <div className={`${classes.topSection} ${position}`}>
                  <div className={classes.userSection}>
                    <div className={classes.avatar}>
                      <img src={user.user.avatar} alt={user.user.username} />
                    </div>
                    <div className={classes.userInfo}>
                      <LevelBox level={user.user.level} />
                      <div className={classes.username}>{user.user.username}</div>
                    </div>
                  </div>
                  <div className={classes.wagered}>
                    Wagered
                    <br/>
                    <span>${user?.points?.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                  </div>
                </div>
                <div className={`${classes.bottomSection} ${position}`}>
                  <div className={classes.prize}>
                    <span>Prize</span><span>$</span>{user?.prize?.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </div>
                </div>
              </div>
              
            );
          })}
        </div>

        {leaderboard?.duration && leaderboard?.updatedAt && (
          <Countdown 
            duration={leaderboard.duration} 
            updatedAt={leaderboard.updatedAt}
          />
        )}

        <table className={classes.table}>
          <thead>
            <tr className={classes.tableHeaderRow}>
              <th className={classes.tableHeader}>User</th>
              <th className={classes.tableHeader}>Wagered</th>
              <th className={classes.tableHeader}>Prize</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user, index) => (
              <tr key={`mobile-${user.user._id}`} className={`${classes.tableRow} ${classes.mobileTableRows}`}>
                <td>
                  <div className={classes.player}>
                    <div className={classes.rank}>#{index + 1}</div>
                    <img src={user.user.avatar} alt={user.user.username} className={classes.smallAvatar} />
                    <div className={classes.userInfo} style={{ marginTop: "0px" }}>
                      <span>{user.user.username}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={classes.amount}>
                    <span className={classes.dollarSign}>$</span>
                    {user?.points?.toFixed(2)}
                  </div>
                </td>
                <td>
                  <div className={classes.amount}>
                    <span className={classes.dollarSign}>$</span>
                    {user?.prize?.toFixed(2)}
                  </div>
                </td>
              </tr>
            ))}
            
            {restUsers.map((user, index) => (
              <tr key={`desktop-${user.user._id}`} className={`${classes.tableRow} ${classes.desktopTableRows}`}>
                <td>
                  <div className={classes.player}>
                    <div className={classes.rank}>#{index + 4}</div>
                    <img src={user.user.avatar} alt={user.user.username} className={classes.smallAvatar} />
                    <div className={classes.userInfo} style={{ marginTop: "0px" }}>
                      <LevelBox level={user.user.level} />
                      <span>{user.user.username}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={classes.amount}>
                    <span className={classes.dollarSign}>$</span>
                    {user?.points?.toFixed(2)}
                  </div>
                </td>
                <td>
                  <div className={classes.amount}>
                    <span className={classes.dollarSign}>$</span>
                    {user?.prize?.toFixed(2)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default Leaderboard;
