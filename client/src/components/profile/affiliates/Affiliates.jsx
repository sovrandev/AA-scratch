import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ProfilePageTemplate from '../template/ProfilePageTemplate';
import { useUser } from '../../../contexts/user';
import { useNotification } from '../../../contexts/notification';
import Loader from '../../common/Loader';
import config from '../../../services/config';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  titleSection: {
    padding: "34px",
    background: theme.bg.box,
    borderRadius: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    position: 'relative',
    overflow: 'hidden',
    minHeight: 154,
    "@media (max-width: 1200px)": {
      padding: theme.spacing(2),
    }
  },
  titleGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '70%',
    background: `radial-gradient(ellipse at top, ${theme.accent.primary} 0%, rgba(0, 0, 0, 0) 80%)`,
    opacity: 0.3,
    filter: 'blur(10px)',
    zIndex: 0,
  },
  title: {
    fontSize: "34px",
    fontWeight: 600,
    color: theme.text.primary,
    "& span": {
      color: theme.accent.primary
    },
    "@media (max-width: 1200px)": {
      fontSize: "24px",
    }
  },
  description: {
    fontSize: "14px",
    fontWeight: 500,
    color: theme.text.secondary,
    "@media (max-width: 1200px)": {
      fontSize: "12px",
    }
  },
  section: {
    background: theme.bg.box,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2.5),
    "@media (max-width: 1200px)": {
      padding: theme.spacing(2),
    }
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: theme.text.primary
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2)
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    width: "100%"
  },
  inputLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: theme.text.secondary
  },
  inputValue: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    background: theme.bg.main,
    padding: "4px 4px 4px 12px",
    borderRadius: 6,
    width: "100%"
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: theme.text.primary,
    fontSize: "14px",
    fontWeight: 500,
    "&:focus": {
      outline: "none"
    }
  },
  copyButton: {
    background: theme.accent.primaryGradient,
    color: theme.text.primary,
    border: "none",
    minWidth: 80,
    borderRadius: 4,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      opacity: 0.9,
    }
  },
  statsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  topStats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    "@media (max-width: 1200px)": {
      gridTemplateColumns: "1fr",
    }
  },
  bottomStats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    "@media (max-width: 1200px)": {
      gridTemplateColumns: "1fr 1fr",
    }
  },
  largeStatItem: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    background: theme.bg.box,
    padding: theme.spacing(3),
    borderRadius: theme.spacing(0.75)
  },
  smallStatItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: theme.bg.box,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(0.75),
    "@media (max-width: 1200px)": {
      width: "100%"
    }
  },
  statLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: theme.text.secondary,
    position: "relative",
    zIndex: 1
  },
  largeStatValue: {
    fontSize: "24px",
    fontWeight: 600,
    color: theme.text.primary,
    position: "relative",
    zIndex: 1
  },
  smallStatValue: {
    fontSize: "14px", 
    fontWeight: 600,
    color: theme.text.primary
  },
  statLabelContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  claimButton: {
    background: theme.accent.primaryGradient,
    color: theme.text.primary,
    border: "none",
    minWidth: 80,
    borderRadius: 4,
    padding: "10px 16px",
    zIndex: 1,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: theme.transitions.normal,
    "&:hover": {
      opacity: 0.8,
    }
  },
  availableLabel: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      padding: "1px",
      borderRadius: "6px",
      background: `linear-gradient(90deg, ${theme.accent.primary} 0%, ${theme.bg.box} 100%)`,
      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "6px",
      background: `linear-gradient(270deg, ${theme.bg.box} 0%, ${theme.accent.primary} 100%)`,
      opacity: 0.2,
    }
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%'
  },
  username: {
    color: theme.text.primary,
    fontWeight: 500
  },
  generated: {
    color: theme.palette.success.main,
    fontWeight: 600
  },
  tableSection: {
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    minWidth: 650
  },
  tableHead: {
    background: theme.bg.box,
    "& tr": {
      "& th:first-child": {
        borderTopLeftRadius: theme.spacing(1),
      },
      "& th:last-child": {
        borderTopRightRadius: theme.spacing(1),
      },
    },
    "& th": {
      padding: theme.spacing(2),
      fontSize: "14px",
      fontWeight: 600,
      color: theme.text.secondary,
      textAlign: "left",
    }
  },
  tableBody: {
    "& tr:last-child": {
      "& td:first-child": {
        borderBottomLeftRadius: theme.spacing(1),
      },
      "& td:last-child": {
        borderBottomRightRadius: theme.spacing(1),
      }
    },
    "& td": {
      padding: theme.spacing(2),
      fontSize: "14px",
      color: theme.text.primary,
      background: theme.bg.box,
      borderTop: `1px solid ${theme.bg.border}80`,
    },
    "&:nth-child(even)": {
      background: theme.bg.inner
    },
  },
  userId: {
    cursor: 'pointer',
    color: theme.text.primary,
    textDecoration: 'underline',
    "&:hover": {
      opacity: 0.8
    }
  },
  userCell: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5)
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    objectFit: "cover"
  },
}));

const Affiliates = () => {
  const classes = useStyles();
  const notify = useNotification();
  const { 
    affiliateData,
    referredUsers,
    affiliateLoading,
    fetchAffiliateData,
    setAffiliateCode,
    claimAffiliateEarnings,
    claimLoading
  } = useUser();
  const [code, setCode] = useState("");

  useEffect(() => {
    setCode(affiliateData?.code || '');
  }, [affiliateData?.code]);

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  // Add test data if no referred users
  const testUsers = [
    {
      user: {
        _id: '507f1f77bcf86cd799439011',
        username: 'CryptoKing',
        avatar: 'https://i.pravatar.cc/150?img=1',
        stats: {
          xp: 15750.25,
          deposit: 2500.00
        }
      }
    },
    {
      user: {
        _id: '507f1f77bcf86cd799439012',
        username: 'LuckyPlayer',
        avatar: 'https://i.pravatar.cc/150?img=2',
        stats: {
          xp: 8920.75,
          deposit: 1200.50
        }
      }
    },
    {
      user: {
        _id: '507f1f77bcf86cd799439013',
        username: 'GamingPro',
        avatar: 'https://i.pravatar.cc/150?img=3',
        stats: {
          xp: 25100.00,
          deposit: 4750.25
        }
      }
    },
    {
      user: {
        _id: '507f1f77bcf86cd799439014',
        username: 'RichieRich',
        avatar: 'https://i.pravatar.cc/150?img=4',
        stats: {
          xp: 45200.50,
          deposit: 8900.75
        }
      }
    },
    {
      user: {
        _id: '507f1f77bcf86cd799439015',
        username: 'BetMaster',
        avatar: 'https://i.pravatar.cc/150?img=5',
        stats: {
          xp: 12300.25,
          deposit: 1850.50
        }
      }
    }
  ];

  const handleSetCode = async () => {
    if (code.trim()) {
      const success = await setAffiliateCode(code);
      if (success) {
        setCode('');
      }
    }
  };

  const handleClaimEarnings = async () => {
    const success = await claimAffiliateEarnings();
    if (success) {
      await fetchAffiliateData(); // Refresh affiliate data after successful claim
    }
  };

  const handleCopyReferralLink = () => {
    if (affiliateData?.code) {
      const link = `${config.site.frontend.url}/r/${affiliateData.code}`;
      navigator.clipboard.writeText(link);
      notify.info('Referral link copied to clipboard!');
    }
  };

  const handleCopyUserId = (id) => {
    navigator.clipboard.writeText(id);
    notify.info('User ID copied to clipboard!');
  };

  return (
    <ProfilePageTemplate title="Affiliates">
      <div className={classes.root}>
        <div className={classes.titleSection}>
          <div className={classes.titleGradient} />
          <div className={classes.title}>Invite Friends, <span>earn passive income!</span></div>
          <div className={classes.description}>Get started by creating your own personalized affiliate code below. You will receive 5% of each affiliates wager.</div>
        </div>

        <div className={classes.section}>
          <div className={classes.inputContainer}>
            <div className={classes.inputGroup}>
              <div className={classes.inputLabel}>Your Affiliate Code</div>
              <div className={classes.inputValue}>
                <input
                  type="text"
                  className={classes.input}
                  placeholder="Enter your affiliate code"
                  value={affiliateLoading ? 'Loading...' : code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button
                  className={classes.copyButton}
                  onClick={handleSetCode}
                >
                  Set Code
                </button>
              </div>
            </div>
            <div className={classes.inputGroup}>
              <div className={classes.inputLabel}>Referral Link</div>
              <div className={classes.inputValue}>
                <input
                  type="text"
                  className={classes.input}
                  value={`${config.site.frontend.url}/r/${affiliateLoading ? 'Loading...' : affiliateData?.code}`}
                  disabled
                />
                <button
                  className={classes.copyButton}
                  onClick={handleCopyReferralLink}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.statsGrid}>
          <div className={classes.topStats}>
            <div className={`${classes.largeStatItem} ${classes.availableLabel}`}>
              <div className={classes.statLabelContainer}>
                <div className={classes.statLabel}>Available to Claim</div>
                <div className={classes.largeStatValue}>
                  ${affiliateLoading ? 'Loading...' : affiliateData?.available?.toFixed(2) || '0.00'}
                </div>
              </div>
              <button 
                className={classes.claimButton}
                onClick={handleClaimEarnings}
              >
                {claimLoading ? 'Claiming...' : 'Claim'}
              </button>
            </div>
            <div className={classes.largeStatItem}>
              <div className={classes.statLabel}>Total Earned</div>
              <div className={classes.largeStatValue}>
                ${affiliateLoading ? 'Loading...' : affiliateData?.earned?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>

          <div className={classes.bottomStats}>
            <div className={classes.smallStatItem}>
              <div className={classes.statLabel}>Total Referred</div>
              <div className={classes.smallStatValue}>
                {affiliateLoading ? 'Loading...' : affiliateData?.referred || 0}
              </div>
            </div>
            <div className={classes.smallStatItem}>
              <div className={classes.statLabel}>Total Wagered</div>
              <div className={classes.smallStatValue}>
                ${affiliateLoading ? 'Loading...' : referredUsers?.reduce((total, user) => total + user.user.stats.bet, 0)?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) || '0.00'}
              </div>
            </div>
            <div className={classes.smallStatItem}>
              <div className={classes.statLabel}>Total Deposits</div>
              <div className={classes.smallStatValue}>
                ${affiliateLoading ? 'Loading...' : referredUsers?.reduce((total, user) => total + user.user.stats.deposit, 0)?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) || '0.00'}
              </div>
            </div>
          </div>
        </div>

          <div className={classes.tableSection}>
            <table className={classes.table}>
              <thead className={classes.tableHead}>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Wagered</th>
                  <th>Deposited</th>
                </tr>
              </thead>
              <tbody className={classes.tableBody}>
                {referredUsers.map((referred) => (
                  <tr key={referred.user._id}>
                    <td>
                      <span 
                        className={classes.userId}
                        onClick={() => handleCopyUserId(referred.user._id)}
                      >
                        {referred.user._id.slice(0, 8)}...
                      </span>
                    </td>
                    <td>
                      <div className={classes.userCell}>
                        <img 
                          src={referred.user.avatar} 
                          alt="" 
                          className={classes.userAvatar}
                        />
                        <span className={classes.username}>
                          {referred.user.username}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={classes.statValue}>
                        ${referred.user.stats?.bet?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) || '0.00'}
                      </span>
                    </td>
                    <td>
                      <span className={classes.statValue}>
                        ${referred.user.stats?.deposit?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) || '0.00'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </ProfilePageTemplate>
  );
};

export default Affiliates; 