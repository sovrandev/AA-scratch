import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import config from "../../../services/config";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.bg.box,
    borderRadius: theme.spacing(1),
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    justifyContent: "space-around",
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(1),
    minWidth: 260,
  },
  top: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1)
  },  
  battleType: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.text.primary,
    textTransform: "capitalize"
  },
  players: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1)
  },
  manyPlayers: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    maxWidth: 260,
    justifyContent: "center"
  },
  playerRow: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1)
  },
  playerAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: `${theme.bg.main}CC`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  swordIcon: {
    color: theme.text.secondary,
    margin: "0 4px"
  },
  casesSection: {
    flex: 1,
    position: "relative",
    backgroundColor: `${theme.bg.main}CC`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    minHeight: 100,
    maxWidth: 560,
    overflow: "hidden",
    marginRight: theme.spacing(2),
    "@media (max-width: 1200px)": {
      width: "100%",
      marginRight: 0,
    },
  },
  caseCount: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: theme.bg.box,
    borderRadius: theme.spacing(1.5),
    padding: "4px 8px",
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: theme.text.secondary,
    zIndex: 100
  },
  caseImage: {
    width: 84,
    height: 84,
    objectFit: "contain",
    zIndex: 5,
    position: "relative"
  },
  ticker: {
    position: "absolute",
    left: 4,
    top: 4,
    height: 92,
    width: 92,
    backgroundColor: theme.bg.box,
    borderRadius: theme.spacing(0.75),
    transition: "transform 0.3s ease",
    zIndex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 0
  },
  tickerArrow: {
    width: 12,
    height: 12,
    color: theme.bg.inner,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "translateY(-8px)",
    "&:last-child": {
      transform: "translateY(8px)"
    }
  },
  valueSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1),
    minWidth: 120,
    marginRight: theme.spacing(2)
  },
  battleValue: {
    fontSize: 12,
    color: theme.text.secondary,
    fontWeight: 500
  },
  price: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    gap: theme.spacing(0.5),
    fontSize: 12,
    fontWeight: 600,
    color: theme.text.primary,
    "& span": {
      color: theme.text.secondary
    }
  },
  coinIcon: {
    width: 16,
    height: 16
  },
  actionButton: {
    minWidth: 110,
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    userSelect: "none",
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1),
    transition: "opacity 0.2s ease",
    "&:hover": {
      opacity: 0.9
    }
  },
  joinButton: {
    backgroundColor: theme.accent.primary,
    color: theme.text.primary,
  },
  watchButton: {
    backgroundColor: theme.bg.inner,
    color: theme.text.primary,
  },
  gamemodeCrazy: {
    height: 28  ,
    width: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#E337FF20"
  },
  gamemodeJackpot: {
    height: 28,
    width: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#FF589E20"
  },
  gamemodeTerminal: {
    height: 28,
    width: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#FFD04D20"
  },
  gamemodeGroup: {
    height: 28,
    width: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#41FF6A20",
  }
}));

const EmptyPlayerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0_132_11334)">
      <path d="M9.99992 10.0002C11.8416 10.0002 13.3333 8.50433 13.3333 6.66683C13.3333 4.82516 11.8416 3.3335 9.99992 3.3335C8.15825 3.3335 6.66659 4.82516 6.66659 6.66683C6.66659 8.50433 8.15825 10.0002 9.99992 10.0002ZM9.99992 11.6668C7.77909 11.6668 3.33325 12.7793 3.33325 15.0002V16.6668H16.6666V15.0002C16.6666 12.7793 12.2208 11.6668 9.99992 11.6668Z" fill="#959597"/>
    </g>
    <defs>
      <clipPath id="clip0_132_11334">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const CrossSwordIcon = ({ color = "#959597" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
    <g opacity="1">
      <path d="M3.63521 9.30042C3.92707 9.86406 3.84875 10.5781 3.38701 11.0518C3.10887 11.3368 2.73866 11.4936 2.3441 11.4936C1.94954 11.4936 1.57933 11.3368 1.3014 11.0518C0.735302 10.4712 0.735302 9.52571 1.30119 8.94466C1.74838 8.48612 2.46327 8.40259 3.01621 8.6819L3.91484 7.7603L2.65001 6.46278C2.48146 6.28975 2.48509 6.01289 2.65791 5.84413C2.83116 5.6758 3.1078 5.67836 3.27678 5.85182L3.74656 6.33373L8.31315 0.949174C8.38514 0.864152 8.48661 0.809892 8.59727 0.797502L11.1212 0.509538C11.2532 0.491593 11.3848 0.540299 11.4793 0.633866C11.5735 0.727433 11.62 0.859025 11.6057 0.991044L11.325 3.58016C11.3133 3.68782 11.2622 3.78737 11.1815 3.85957L5.91531 8.55856L6.40165 9.05745C6.5702 9.23048 6.56657 9.50734 6.39375 9.6761C6.30851 9.75899 6.1985 9.80043 6.08827 9.80043C5.97441 9.80043 5.86076 9.75642 5.77488 9.66841L4.52578 8.38705L3.63521 9.30042Z" fill={color}/>
      <path d="M2.87878 0.509462C2.74753 0.491945 2.61626 0.540064 2.52002 0.631948C2.42814 0.728212 2.38002 0.859457 2.39313 0.990701L2.67314 3.58069C2.68628 3.68569 2.73877 3.78633 2.81752 3.8607L3.88502 4.81445L6.4269 1.82196L5.68752 0.951315C5.61315 0.863836 5.51251 0.811338 5.40313 0.7982L2.87878 0.509462Z" fill={color}/>
      <path d="M10.9856 8.68196L10.0844 7.75881L11.3488 6.46383C11.5194 6.28882 11.515 6.01319 11.34 5.84259C11.1694 5.67633 10.8938 5.67633 10.7231 5.85132L10.255 6.33258L10.0275 6.06134L7.65626 8.17444L8.085 8.55944L7.59938 9.0582C7.42875 9.22883 7.43313 9.50881 7.60814 9.67506C7.69127 9.75819 7.80064 9.80195 7.91002 9.80195C8.02377 9.80195 8.1375 9.75819 8.22501 9.66633L9.47625 8.38881L10.3644 9.29882C10.0713 9.86318 10.15 10.5763 10.6138 11.0532C10.8894 11.3376 11.2613 11.4951 11.655 11.4951C12.0488 11.4951 12.4206 11.3376 12.7006 11.0532C13.265 10.4713 13.265 9.52633 12.7006 8.94444C12.25 8.48508 11.5369 8.40195 10.9856 8.68196Z" fill={color}/>
    </g>
  </svg>
);

const TickerArrow = ({ direction = "up" }) => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 12 12" 
    fill="currentColor"
    style={{ transform: direction === "down" ? "rotate(180deg)" : "none" }}
  >
    <path d="M6 2.25L11.25 7.5H0.75L6 2.25Z"/>
  </svg>
);

const BattleCard = ({ game }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const isActive = ['countdown', 'pending', 'rolling', 'completed'].includes(game.state);
  const currentRound = isActive ? game.bets[0]?.outcomes?.length || 0 : -1;
  const cardOpacity = game.state === "completed" ? 0.5 : 1;
  const players = React.useMemo(() => {   
    const realPlayers = game.bets.map((bet) => ({
      _id: bet.bot ? 'bot' : bet.user._id,
      username: bet.user.username,
      avatar: bet.user.avatar,
      rank: bet.user.rank,
      level: bet.user.level,
      slot: bet.slot,
      items: [],
      bot: bet.bot
    }));

    const allPlayers = Array.from({ length: game.playerCount }, (_, index) => {
      const realPlayer = realPlayers.find(player => player.slot === index);
      return realPlayer || { 
        _id: null,
        username: null,
        avatar: null,
        rank: null,
        level: null,
        slot: index,
        items: [],
        bot: false
      };
    });

    return allPlayers;
  }, [game]);
  const boxes = React.useMemo(() => {
    return game ? game.boxes.flatMap(box => 
      Array.from({ length: box.count }, (_, index) => ({
        ...box.box,
      }))
    ) : [];
  }, [game]);
  

  const getBoxImageUrl = (boxName) => {
    return `${config.site.backend.url}/public/img/${boxName
      .toLowerCase()
      .replace(/%/g, 'percent')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}.png`;
  };

  const casesSectionAnimation = {
    transform: game.state === "completed" ? "" : `translateX(-${Math.max(0, (currentRound - 4)) * 88}px)`
  };

  const tickerAnimation = {
    transform: `translateX(${Math.min(currentRound-1, 3) * 88}px)`
  };

  return (
    <motion.div 
      className={classes.root}
      style={{ opacity: cardOpacity }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: cardOpacity, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className={classes.leftSection}>
        <div className={classes.top}>
          <div className={classes.battleType}>{game.mode} Battle</div>
          {game.options.cursed && (
            <div className={classes.gamemodeCrazy}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 8L3 19L8.5 14L12 20L15.5 14L21 19L19 8H5ZM19 5C19 4.4 18.6 4 18 4H6C5.4 4 5 4.4 5 5V6H19V5Z" fill="#E337FF"/></svg>
            </div>
          )}
          {game.options.terminal && (
            <div className={classes.gamemodeTerminal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M15.3482 2.63793C14.0912 1.37873 12.4894 0.521029 10.7454 0.173328C9.00143 -0.174372 7.19364 0.00354495 5.55069 0.684576C3.90774 1.36561 2.50343 2.51916 1.5154 3.99931C0.527368 5.47947 0 7.21974 0 9C0 10.7803 0.527368 12.5205 1.5154 14.0007C2.50343 15.4808 3.90774 16.6344 5.55069 17.3154C7.19364 17.9965 9.00143 18.1744 10.7454 17.8267C12.4894 17.479 14.0912 16.6213 15.3482 15.3621C16.1883 14.5298 16.8553 13.5389 17.3105 12.4469C17.7656 11.3549 18 10.1833 18 9C18 7.8167 17.7656 6.64514 17.3105 5.55311C16.8553 4.46107 16.1883 3.47024 15.3482 2.63793ZM8.91592 11.6379L7.84647 15.6197C7.82597 15.6956 7.77744 15.7609 7.71069 15.8024C7.64394 15.8439 7.56394 15.8584 7.48688 15.8431C6.18621 15.5831 4.99159 14.9433 4.05372 14.0044C3.11586 13.0654 2.47677 11.8694 2.21709 10.5672C2.2018 10.4901 2.21634 10.41 2.25777 10.3432C2.2992 10.2763 2.36444 10.2278 2.44028 10.2072L6.42672 9.13655C6.47061 9.12506 6.51648 9.12335 6.5611 9.13155C6.60572 9.13975 6.64799 9.15765 6.68495 9.18399C6.7219 9.21033 6.75263 9.24447 6.77496 9.284C6.7973 9.32353 6.81069 9.36748 6.81421 9.41276C6.85495 9.88146 7.05905 10.3209 7.39078 10.6541C7.72239 10.9876 8.16221 11.1912 8.63074 11.2283C8.67815 11.23 8.72454 11.2427 8.76632 11.2652C8.80809 11.2877 8.84415 11.3195 8.8717 11.3582C8.89925 11.3969 8.91757 11.4414 8.92524 11.4883C8.9329 11.5351 8.92972 11.5832 8.91592 11.6286V11.6379ZM9.82109 6.73759C9.39581 6.53645 8.91299 6.49313 8.45876 6.61534C8.00454 6.73756 7.60846 7.01736 7.34119 7.40483C7.3154 7.44229 7.2817 7.47361 7.24247 7.49658C7.20325 7.51955 7.15946 7.5336 7.11421 7.53775C7.06896 7.54189 7.02335 7.53603 6.98061 7.52056C6.93788 7.5051 6.89906 7.48043 6.86691 7.44828L3.93752 4.52793C3.88347 4.47038 3.85337 4.39435 3.85337 4.31535C3.85337 4.23635 3.88347 4.16032 3.93752 4.10276C4.81216 3.10826 5.96087 2.39474 7.23932 2.05184C8.51777 1.70894 9.86894 1.75197 11.123 2.17552C11.1969 2.20111 11.2584 2.2537 11.2952 2.32276C11.332 2.39182 11.3414 2.47225 11.3214 2.54793L10.2551 6.53586C10.2436 6.58017 10.2224 6.62139 10.1931 6.65654C10.1638 6.6917 10.1271 6.71993 10.0856 6.73921C10.0441 6.75849 9.9989 6.76835 9.95317 6.76807C9.90743 6.76779 9.86233 6.75738 9.82109 6.73759ZM13.9315 14.0897C13.874 14.1438 13.7981 14.1739 13.7192 14.1739C13.6403 14.1739 13.5643 14.1438 13.5068 14.0897L10.5868 11.1693C10.5548 11.1369 10.5304 11.0979 10.5152 11.055C10.5 11.012 10.4944 10.9663 10.4988 10.921C10.5033 10.8757 10.5176 10.8319 10.5408 10.7927C10.5641 10.7536 10.5956 10.7201 10.6333 10.6945C11.0188 10.4257 11.2971 10.0291 11.4191 9.57487C11.541 9.12061 11.4987 8.63783 11.2997 8.21173C11.2799 8.17064 11.2694 8.1257 11.2689 8.08008C11.2685 8.03447 11.278 7.98932 11.297 7.94783C11.3159 7.90635 11.3438 7.86955 11.3785 7.84007C11.4133 7.81058 11.4541 7.78913 11.4981 7.77724L15.5001 6.68173C15.5761 6.66088 15.6572 6.66982 15.7269 6.70672C15.7965 6.74361 15.8496 6.8057 15.8751 6.88035C16.2995 8.13847 16.3429 9.49412 15.9998 10.7769C15.6568 12.0596 14.9426 13.2122 13.947 14.0897H13.9315Z" fill="#FFD04D"/></svg>
            </div>
          )}
          {game.options.jackpot && (
            <div className={classes.gamemodeJackpot}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M14.8725 5.625L13.17 3.9225C13.2225 3.6075 13.305 3.315 13.41 3.06C13.47 2.925 13.5 2.7825 13.5 2.625C13.5 2.0025 12.9975 1.5 12.375 1.5C11.145 1.5 10.0575 2.0925 9.375 3H5.625C3.345 3 1.5 4.845 1.5 7.125C1.5 9.405 3.375 15.75 3.375 15.75H7.5V14.25H9V15.75H13.125L14.385 11.5575L16.5 10.8525V5.625H14.8725ZM9.75 6.75H6V5.25H9.75V6.75ZM12 8.25C11.5875 8.25 11.25 7.9125 11.25 7.5C11.25 7.0875 11.5875 6.75 12 6.75C12.4125 6.75 12.75 7.0875 12.75 7.5C12.75 7.9125 12.4125 8.25 12 8.25Z" fill="#FF589E"/></svg>              
            </div>
          )}    
          {game.mode === 'group' && (
            <div className={classes.gamemodeGroup}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 16 12" fill="none"><path d="M11 9.75004V11.25H0.5V9.75004C0.5 9.75004 0.5 6.75004 5.75 6.75004C11 6.75004 11 9.75004 11 9.75004ZM8.375 2.62504C8.375 2.10586 8.22105 1.59835 7.93261 1.16667C7.64417 0.734989 7.2342 0.398536 6.75454 0.199856C6.27489 0.00117575 5.74709 -0.050808 5.23789 0.0504782C4.72869 0.151764 4.26096 0.401771 3.89384 0.768884C3.52673 1.136 3.27673 1.60373 3.17544 2.11293C3.07415 2.62213 3.12614 3.14993 3.32482 3.62958C3.5235 4.10924 3.85995 4.51921 4.29163 4.80765C4.72331 5.09609 5.23082 5.25004 5.75 5.25004C6.44619 5.25004 7.11387 4.97348 7.60616 4.48119C8.09844 3.98891 8.375 3.32123 8.375 2.62504ZM10.955 6.75004C11.4161 7.10685 11.7933 7.56036 12.0603 8.07867C12.3272 8.59698 12.4773 9.16748 12.5 9.75004V11.25H15.5V9.75004C15.5 9.75004 15.5 7.02754 10.955 6.75004ZM10.25 3.94343e-05C9.73377 -0.0028351 9.22889 0.151506 8.8025 0.44254C9.25808 1.07909 9.50304 1.84225 9.50304 2.62504C9.50304 3.40782 9.25808 4.17099 8.8025 4.80754C9.22889 5.09857 9.73377 5.25291 10.25 5.25004C10.9462 5.25004 11.6139 4.97348 12.1062 4.48119C12.5984 3.98891 12.875 3.32123 12.875 2.62504C12.875 1.92885 12.5984 1.26117 12.1062 0.768884C11.6139 0.276601 10.9462 3.94343e-05 10.25 3.94343e-05Z" fill="#41FF6A"/></svg>  
            </div>
          )}
        </div>    
        <div className={`${classes.players} ${players.length >= 6 ? classes.manyPlayers : ""}`}>
          {players.length >= 6 ? (
            Array.from({ length: Math.ceil(players.length / 3) }).map((_, rowIndex) => (
              <div key={rowIndex} className={classes.playerRow}>
                {players.slice(rowIndex * 3, (rowIndex + 1) * 3).map((player, index) => (
                  <React.Fragment key={player._id}>
                    {player._id ? (
                      <img 
                        className={classes.playerAvatar} 
                        src={player.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} 
                        alt={player.username} 
                      />
                    ) : (
                      <div className={classes.playerAvatar}>
                        <EmptyPlayerIcon />
                      </div>
                    )}
                    {game.mode !== "group" && (
                      (game.mode === "team" && ((index === 1 && game.playerCount === 4) || (index === 2 && game.playerCount === 6))) || (game.mode === "standard" && index !== players.length - 1) ? (
                        <div className={classes.swordIcon}>
                          <CrossSwordIcon />
                        </div>
                      ) : null
                    )}
                  </React.Fragment>
                ))}
              </div>
            ))
          ) : (
            players.map((player, index) => (
              <React.Fragment key={player._id}>
                {player._id ? (
                  <img 
                    className={classes.playerAvatar} 
                    src={player.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} 
                    alt={player.username} 
                  />
                ) : (
                  <div className={classes.playerAvatar}>
                    <EmptyPlayerIcon />
                  </div>
                )}
                {game.mode !== "group" && (
                  (game.mode === "team" && ((index === 1 && game.playerCount === 4) || (index === 2 && game.playerCount === 6))) || (game.mode === "standard" && index !== players.length - 1) ? (
                    <div className={classes.swordIcon}>
                      <CrossSwordIcon />
                    </div>
                  ) : null
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      <div className={classes.casesSection}>
        {isActive && game.state !== "completed" && (
          <motion.div 
            className={classes.ticker}
            animate={tickerAnimation}
            transition={{ type: "spring", stiffness: 200, damping:15 }}
          >
            <div className={classes.tickerArrow}>
              <TickerArrow direction="down" />
            </div>
            <div className={classes.tickerArrow}>
              <TickerArrow direction="up" />
            </div>
          </motion.div>
        )}
        <div className={classes.caseCount}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M15.6445 3.95755C15.6445 3.94063 15.6445 3.94063 15.6445 3.92372C15.6276 3.88989 15.6276 3.85607 15.6107 3.82224V3.80533C15.5938 3.77151 15.5599 3.73768 15.543 3.72077L15.5261 3.70386C15.5092 3.68694 15.4754 3.67003 15.4585 3.65312L15.4416 3.63621H15.4246L15.4077 3.61929L8.21989 0.0507378C8.08459 -0.0169126 7.91546 -0.0169126 7.76325 0.0507378L5.34475 1.25153L12.5664 4.95539L12.5833 4.9723C12.6002 4.9723 12.6002 4.98921 12.6172 4.98921C12.6341 5.00613 12.6341 5.02304 12.651 5.03995C12.651 5.05686 12.651 5.05686 12.651 5.07378V5.09069V9.01441C12.651 9.08206 12.6172 9.1328 12.5664 9.16662L11.1119 9.92769C11.0274 9.97843 10.9259 9.9446 10.8752 9.86004C10.8583 9.84313 10.8582 9.8093 10.8582 9.77547V5.93632L3.55201 2.16481L3.5351 2.1479L0.609224 3.60238L0.592312 3.61929H0.575399L0.558487 3.63621C0.541574 3.65312 0.507749 3.67003 0.490836 3.68694L0.473924 3.70386C0.440099 3.73768 0.423186 3.77151 0.389361 3.80533V3.82224C0.372448 3.85607 0.355536 3.88989 0.355536 3.92372C0.355536 3.94063 0.355536 3.94063 0.355536 3.95755C0.355536 3.99137 0.338623 4.00828 0.338623 4.04211V4.05902V11.9403C0.338623 12.1263 0.440099 12.3124 0.626137 12.3969L7.74634 15.9486C7.84781 15.9993 7.9662 16.0162 8.08459 15.9824L8.11841 15.9655C8.15224 15.9655 8.16915 15.9486 8.20297 15.9317L15.3739 12.38C15.543 12.2955 15.6614 12.1263 15.6614 11.9234V4.05902V4.04211C15.6445 4.00828 15.6445 3.99137 15.6445 3.95755Z" fill="currentColor"/>
          </svg>
          {['countdown', 'pending', 'rolling'].includes(game.state) ? `${currentRound}/${boxes.length}` : boxes.length}
        </div>
        <motion.div 
          style={{ display: 'flex', flexDirection: 'row', gap: 4, zIndex: 10 }}
          animate={casesSectionAnimation}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {boxes.map((box, index) => (
            <img 
              key={`${box._id}-${index}`}
              className={classes.caseImage}
              src={getBoxImageUrl(box.name) || '/default-case.png'}
              alt={box.name}
              style={{ opacity: game.state === "rolling" && index !== currentRound - 1 ? 0.5 : 1 }}
            />
          ))}
        </motion.div>
      </div>

      <div className={classes.valueSection}>
        <div 
          className={`${classes.actionButton} ${isActive ? classes.watchButton : classes.joinButton}`} 
          onClick={() => navigate(`/box-battles/${game._id}`)}
        >
          {isActive ? (
            <>
              {game.state == "completed" ? (
                <>
                  View Results
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                  </svg>
                  Watch
                </>
              )}
              
            </>
          ) : (
            <>
              Join Battle
            </>
          )}
        </div>
        <div className={classes.price}><span>Cost: </span>${game.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>
      
    </motion.div>
  );
};

export default BattleCard; 