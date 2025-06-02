import { makeStyles } from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';

export const useAdminStyles = makeStyles(theme => ({
  pageContainer: {
    padding: theme.spacing(1, 2),
    minHeight: '100vh',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: theme.text.primary
  },
  contentBox: {
    borderRadius: theme.spacing(0.75),
    padding: theme.spacing(3),
    border: `1px solid ${theme.bg.border}`
  },
  actionButton: {
    display: "flex",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    background: theme.accent.primaryGradient,
    gap: "6px",
    padding: "10px 14px",
    borderRadius: "4px",
    cursor: "pointer",
    userSelect: "none",
    height: 40,
    fontWeight: 600,
    textShadow: "0px 2px 3px rgba(0, 0, 0, 0.25)",
    width: "fit-content",
    border: 'none',
    '&:hover': {
      opacity: 0.9
    }
  },
  secondaryButton: {
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    color: theme.text.primary,
    padding: '8px 12px',
    borderRadius: theme.spacing(0.5),
    border: `1px solid ${theme.bg.border}`,
    cursor: 'pointer',
    transitionDuration: '0.2s',
    height: 40,
    '&:hover': {
      backgroundColor: theme.palette.hover_lightgrey
    }
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    borderRadius: '6px',
    border: `1px solid ${theme.bg.border}`,
    '& tr': {
      fontWeight: 500
    },
    '& th': {
      textAlign: 'left',
      padding: theme.spacing(1.5),
      color: theme.text.secondary,
      borderRight: `1px solid ${theme.bg.border}`,
    },
    '& td': {
      padding: theme.spacing(1.5),
      color: theme.text.primary,
      borderRight: `1px solid ${theme.bg.border}`,
    },
    '& th:first-of-type': {
      borderTopLeftRadius: '10px',
    },
    '& th:last-of-type': {
      borderTopRightRadius: '10px',
    },
    '& tr:last-of-type td:first-of-type': {
      borderBottomLeftRadius: '10px',
    },
    '& tr:last-of-type td:last-of-type': {
      borderBottomRightRadius: '10px',
    }
  },
  searchInput: {
    background: 'transparent',
    border: `1px solid ${theme.bg.border}`,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1, 1.5, 1, 4.5),
    color: theme.text.primary,
    width: '250px',
    height: 40,
    '&::placeholder': {
      color: theme.text.secondary
    },
    '&:focus': {
      outline: 'none',
      border: `1px solid ${theme.bg.border}`
    }
  },
  modal: {
    '& .MuiDialog-paper': {
      backgroundColor: 'theme.bg.main',
      border: `1px solid ${theme.bg.border}`,
      borderRadius: theme.spacing(0.75),
      maxWidth: '600px',
      minWidth: '600px',
      maxHeight: '800px',
      minHeight: '800px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      '&::-webkit-scrollbar': {
        width: '0px',
      },
    },
  },
  primaryText: {
    color: theme.text.primary
  },
  secondaryText: {
    color: theme.text.secondary
  },
  successText: {
    color: theme.green
  },
  errorText: {
    color: theme.red
  },
  warningText: {
    color: theme.yellow
  },
  input: {
    '& .MuiFormLabel-root': {
      position: 'relative',      color: theme.text.secondary,
      fontSize: '14px',
      marginBottom: theme.spacing(1),
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(0.75),
      '& fieldset': {
        borderColor: theme.bg.border
      },
      '&:hover fieldset': {
        borderColor: theme.bg.border
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.bg.border
      }
    },
    '& .MuiInputBase-input': {
      color: theme.text.primary,
      height: '40px',
      padding: '0 12px',
      fontSize: '14px',
      fontWeight: 500,
      fontFamily: 'Onest'
    }
  },
  card: {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    border: `1px solid ${theme.bg.border}`,
    transition: 'all 0.2s ease',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: theme.spacing(0.5),
    fontSize: '12px',
    fontWeight: 500,
    border: 'none'
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBadge: {
    backgroundColor: `${theme.green}20`,
    color: theme.green,
  },
  errorBadge: {
    backgroundColor: `${theme.red}20`,
    color: theme.red
  },
  warningBadge: {
    backgroundColor: `${theme.yellow}20`,
    color: theme.yellow
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: '0',
    backgroundColor: 'transparent',
    border: `1px solid ${theme.bg.border}`,
    borderRadius: theme.spacing(0.5),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.hover_lightgrey
    },
    '& svg': {
      width: '16px',
      height: '16px'
    }
  },
  tabs: {
    borderBottom: `1px solid ${theme.bg.border}`,
    color: theme.text.primary,
    marginBottom: theme.spacing(2),
    '& .MuiTabs-indicator': {
      backgroundColor: "#ffffff",
      height: '1px'
    },
    '& .MuiTab-root': {
      color: theme.text.primary,
      textTransform: 'none',
      minWidth: 100,
      padding: theme.spacing(1.5),
      height: 35,
      '&.Mui-selected': {
        color: theme.text.primary,
      },
      '&:hover': {
        color: theme.text.primary,
      },
      '& .MuiTouchRipple-root': {
        display: 'none'
      },
      '&.MuiTab-textColorInherit': {
      color: theme.text.primary,
      opacity: 1
    }
    }
  },
  tab: {
    color: theme.text.primary,
    textTransform: 'none',
    minWidth: '120px',
    '&.Mui-selected': {
      color: theme.text.primary
    },
    
  },
  section: {
    borderRadius: theme.spacing(0.75),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.bg.border}`,
  },
  sectionTitle: {
    color: theme.text.primary,
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  createButton: {
    backgroundColor: theme.blue,
    color: theme.text.primary,
    padding: '10px 20px',
    borderRadius: theme.spacing(0.5),
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&:hover': {
      opacity: 0.9
    }
  },
  settingsGrid: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(0.75),
    border: `1px solid ${theme.bg.border}`,
  },
  settingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.bg.border}`,
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  settingInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  settingTitle: {
    color: theme.text.primary,
    fontSize: '14px',
    fontWeight: 500,
  },
  settingDescription: {
    color: theme.text.secondary,
    fontSize: '12px',
  },
  itemSelection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3)
  },
  itemCard: {
    backgroundColor: theme.bg.box,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    border: `1px solid ${theme.bg.border}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.hover_lightgrey,
      transform: 'translateY(-2px)'
    },
    '&.selected': {
      borderColor: theme.blue,
      backgroundColor: `${theme.blue}10`
    }
  },
  itemImage: {
    width: '64px',
    height: '64px',
    objectFit: 'contain'
  },
  itemName: {
    color: theme.text.primary,
    fontSize: '14px',
    fontWeight: 500,
    textAlign: 'center'
  },
  itemPrice: {
    color: theme.text.secondary,
    fontSize: '12px'
  },
  settingsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2)
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    borderBottom: `1px solid ${theme.bg.border}`,
    '& div': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1)
    },
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  settingControls: {
    display: 'flex',
    gap: theme.spacing(2)
  },
  settingControl: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  },
  controlLabel: {
    color: theme.text.secondary,
    fontSize: '12px'
  },
  switchTrack: {
    backgroundColor: `${theme.bg.border} !important`,
    opacity: '1 !important'
  },
  switchBase: {
    color: `${theme.text.secondary} !important`,
    '&.Mui-checked': {
      color: `${theme.blue} !important`
    }
  },
  switchChecked: {
    '& + .MuiSwitch-track': {
      backgroundColor: `${theme.blue}40 !important`,
      opacity: '1 !important'
    }
  },
  statsBookContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    color: theme.text.primary,
    fontSize: '14px',
    fontWeight: 500,
    border: `1px solid ${theme.bg.border}`,
    borderRadius: theme.spacing(0.75),
    padding: theme.spacing(2),
    minHeight: '600px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3)
  },
  statCard: {
    borderRadius: theme.spacing(0.75),
    gap: theme.spacing(1),
    padding: theme.spacing(2),
    border: `1px solid ${theme.bg.border}`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  statTitle: {
    color: theme.text.secondary,
    fontSize: '14px'
  },
  statValue: {
    color: theme.text.primary,
    fontSize: '16px',
    fontWeight: 500,
  },
  statTrend: {
    fontSize: '12px',
    fontWeight: 500
  },
  chartContainer: {
    height: '400px',
    padding: theme.spacing(2)
  },
  adminTabs: {
    display: 'flex',
    justifyContent: 'center',
    borderBottom: `1px solid ${theme.bg.border}`,
    color: theme.text.primary,
    '& .MuiTabs-flexContainer': {
      justifyContent: 'center'
    }
  },
  controls: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center'
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      position: 'absolute',
      left: '12px',
      color: theme.text.secondary
    }
  },
  select: {
    background: 'transparent',
    border: `1px solid ${theme.bg.border}`,
    height: 35,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1, 1.5),
    color: theme.text.primary,
    cursor: 'pointer',
    '&:focus': {
      outline: 'none',
      border: `1px solid ${theme.bg.border}`
    },
    '-webkit-appearance': 'none',
    '-moz-appearance': 'none',
    appearance: 'none'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3)
  },
  paginationButton: {
    backgroundColor: theme.bg.box,
    border: `1px solid ${theme.bg.border}`,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1, 2),
    color: theme.text.primary,
    cursor: 'pointer',
    '&:hover:not(:disabled)': {
      backgroundColor: theme.palette.hover_lightgrey
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  pageInfo: {
    color: theme.text.secondary,
    fontSize: '14px'
  },
  adminRoot: {
    display: 'flex',
    backgroundColor: theme.palette.darkgrey,
    border: `1px solid ${theme.bg.border}`,
    borderRadius: theme.spacing(0.75),
    maxWidth: '1200px',
    width: '100%',
    margin: '2rem auto',
    position: 'relative',
    zIndex: 100,
  },
  sidebar: {
    width: '240px',
    borderRight: `1px solid ${theme.bg.border}`,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.spacing(0.75),
    color: theme.text.secondary,
    cursor: 'pointer',
    border: `1px solid ${theme.bg.border}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.bg.border,
      color: theme.text.primary,
    },
    '& svg': {
      width: 16,
      height: 16,
    }
  },
  activeSidebarItem: {
    backgroundColor: theme.bg.border,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.bg.border,
      opacity: 0.9,
    },
  },
  mainContent: {
    flex: 1,
    backgroundColor: theme.palette.darkgrey,
  },
  boxListContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  boxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: theme.spacing(2),
  },
  boxCard: {
    backgroundColor: theme.bg.inner,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    border: `1px solid ${theme.bg.border}`,
  },
  boxHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  boxName: {
    color: theme.text.primary,
    fontSize: '16px',
    fontWeight: 600,
    margin: 0,
  },
  boxPrice: {
    color: theme.green,
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: theme.spacing(2),
  },
  boxItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  boxItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.bg.box,
    borderRadius: theme.spacing(0.5),
  },
  boxItemImage: {
    width: '32px',
    height: '32px',
    objectFit: 'contain',
  },
  boxItemInfo: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxItemName: {
    color: theme.text.primary,
    fontSize: '14px',
  },
  boxItemOdds: {
    color: theme.text.secondary,
    fontSize: '12px',
  },
  leaderboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: theme.spacing(2),
  },
  leaderboardCard: {
    backgroundColor: theme.bg.inner,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    border: `1px solid ${theme.bg.border}`,
  },
  leaderboardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  leaderboardName: {
    color: theme.text.primary,
    fontSize: '16px',
    fontWeight: 600,
    margin: 0,
  },
  leaderboardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: theme.text.secondary,
    fontSize: '14px',
  },
  infoValue: {
    color: theme.text.primary,
    fontSize: '14px',
    fontWeight: 500,
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '12px',
    width: '100%',
  },
  filterCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: theme.palette.darkgrey,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.bg.border}`,
  },
  filterPhrase: {
    color: theme.text.primary,
    fontSize: '14px',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  addForm: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  modalTitle: {
    color: theme.text.primary,
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: theme.spacing(3),
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
    padding: '14px 10px',
    borderTop: `1px solid ${theme.bg.border}`,
    height: 64,
  },
  userStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: theme.spacing(2),
  },
  editGrid: {
    display: 'flex',
    flexDirection: 'column',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: theme.spacing(2),
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.bg.border}`,
  },
  statLabel: {
    color: theme.text.secondary,
    fontSize: '12px',
    marginBottom: theme.spacing(0.5),
  },
  statValue: {
    color: theme.text.primary,
    fontSize: '16px',
    fontWeight: 500,
  },
  inputWithButton: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'flex-start',
    width: '100%',
    '& .MuiTextField-root': {
      flex: 1
    }
  },
  balanceRow: {
    display: 'flex',
    gap: theme.spacing(2),
    '& > div': {
      flex: 1
    }
  },
  inputLabel: {
    color: theme.text.primary,
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  inputRow: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    width: '100%',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.bg.border}`,
    borderRadius: theme.spacing(0.5),
    padding: '8px 12px',
    color: theme.text.primary,
    fontSize: '14px',
    height: '40px',
    '&:focus': {
      outline: 'none',
      borderColor: theme.blue,
    },
    '&::placeholder': {
      color: theme.text.secondary,
    },
    '& option': {
      backgroundColor: theme.bg.inner,
      color: theme.text.primary,
      padding: theme.spacing(1),
    }
  },
  codeBlock: {
    borderRadius: theme.spacing(0.75),
    padding: theme.spacing(2),
    border: `1px solid ${theme.bg.border}`,
    overflow: 'auto',
    scrollbarWidth: 'none',
    maxHeight: '600px',
    margin: 0,
    '& code': {
      color: theme.text.primary,
      fontSize: '14px',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      '& pre': {
        margin: 0,
      }
    }
  },
  inputWithButton: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  profileRow: {
    display: 'flex',
    gap: theme.spacing(3),
    backgroundColor: theme.bg.inner,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    border: `1px solid ${theme.bg.border}`,
    marginBottom: theme.spacing(3),
  },
  userAvatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `1px solid ${theme.bg.border}`,
  },
  profileInputs: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  userSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    border: `1px solid ${theme.bg.border}`,
    marginBottom: theme.spacing(3),
  },
  userHeader: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  userInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  userControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: '100%',
    marginTop: theme.spacing(2),
  },
  paginationControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  paginationButton: {
    background: 'transparent',
    color: theme.text.primary,
    padding: '8px 16px',
    borderRadius: theme.spacing(0.5),
    border: `1px solid ${theme.bg.border}`,
    cursor: 'pointer',
    transitionDuration: '0.2s',
    '&:hover:not(:disabled)': {
      backgroundColor: theme.palette.hover_lightgrey
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  pageNumber: {
    color: theme.text.secondary,
    fontSize: '14px',
  },
  copyId: {
    textDecoration: 'underline',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8
    }
  },
  itemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
    padding: '16px',
    maxHeight: '500px',
    overflowY: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  itemCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      transform: 'translateY(-2px)',
    },
  },
  selectedItem: {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  itemImage: {
    width: '100%',
    height: 'auto',
    marginBottom: '8px',
    borderRadius: theme.shape.borderRadius,
  },
  boxImage: {
    width: '75px',
    height: '75px',
    borderRadius: theme.shape.borderRadius,
    objectFit: 'cover',
  },
  itemInfo: {
    width: '100%',
    textAlign: 'center',
  },
  itemName: {
    fontSize: '14px',
    fontWeight: 500,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  successButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: theme.palette.success.main,
    border: `1px solid ${theme.palette.success.main}`,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.success.main, 0.1),
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  emptyState: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: theme.text.secondary,
  },
  avatar: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  dangerButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: theme.palette.error.main,
    border: `1px solid ${theme.palette.error.main}`,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.error.main, 0.1),
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  tableRow: {
    border: `1px solid ${theme.bg.border}`,
  },
  expanded: {
    backgroundColor: '#fcfcfc',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
    },
  },
  expandedContent: {
    backgroundColor: theme.palette.background.paper,
    padding: '16px',
  },
  itemSelectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderRadius: theme.shape.borderRadius,
    width: '100%',
  },
  itemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '12px',
    maxHeight: '600px',
    overflowY: 'auto',
    padding: '12px',
    backgroundColor: theme.palette.darkgrey,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.bg.border}`,
  },
  itemCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.bg.border}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  selectedItem: {
    borderColor: theme.blue,
    backgroundColor: theme.palette.darkgrey,
    '& .itemName': {
      color: theme.blue,
    },
  },
  itemImage: {
    width: '100%',
    height: 'auto',
    marginBottom: '6px',
    borderRadius: theme.shape.borderRadius,
  },
  itemInfo: {
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  itemName: {
    fontSize: '12px',
    fontWeight: 500,
    color: theme.text.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemPrice: {
    fontSize: '11px',
    color: theme.green,
  },
  selectedItemsContainer: {
    borderRadius: theme.shape.borderRadius,
  },
  selectedItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  selectedItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: theme.palette.darkgrey,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.bg.border}`,
  },
  selectedItemInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  smallItemImage: {
    width: '40px',
    height: '40px',
    borderRadius: theme.shape.borderRadius,
    objectFit: 'cover',
  },
  chanceInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    '& input': {
      width: '100px',
    },
  },
  imageUploadContainer: {
    width: '100px',
    height: '100px',
  },
  imageUploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    height: '100px',
    backgroundColor: theme.palette.darkgrey,
    borderRadius: theme.shape.borderRadius,
    border: `2px dashed ${theme.bg.border}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: theme.blue,
      backgroundColor: alpha(theme.blue, 0.1),
    },
    '& svg': {
      width: '32px',
      height: '32px',
      color: theme.text.secondary,
    },
    '& span': {
      color: theme.text.secondary,
      fontSize: '14px',
    },
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
  },
  expandedContent: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.bg.inner,
    borderRadius: theme.spacing(0.75),
    border: `1px solid ${theme.bg.border}`,
  },
  expandedTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: theme.text.primary,
    marginBottom: theme.spacing(2),
  },
  winnersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  winnerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.darkgrey,
    borderRadius: theme.spacing(0.5),
    border: `1px solid ${theme.bg.border}`,
    color: theme.text.primary,
  },
  noWinners: {
    color: theme.text.secondary,
    fontSize: '14px',
    fontStyle: 'italic',
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    padding: '16px',
    backgroundColor: theme.palette.darkgrey,
    borderRadius: theme.shape.borderRadius,
  },
  expandedItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: theme.bg.inner,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.bg.border}`,
    gap: '8px',
  },
  expandedItemInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    textAlign: 'center',
  },
  itemChance: {
    fontSize: '12px',
    color: theme.green,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: theme.palette.darkgrey,
    border: `1px solid ${theme.bg.border}`,
    borderRadius: theme.shape.borderRadius,
    padding: '24px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  modalTitle: {
    color: theme.text.primary,
    fontSize: '20px',
    fontWeight: 600,
    margin: 0,
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
    paddingTop: '16px',
    borderTop: `1px solid ${theme.bg.border}`,
  },
  successBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.green, 0.1),
    color: theme.green,
    fontSize: '12px',
    fontWeight: 500,
  },
  prizesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: '100%',
  },
  prizeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    width: '100%',
  },
  prizePosition: {
    color: theme.text.primary,
    fontSize: '14px',
    fontWeight: 500,
    minWidth: '30px',
  },
  countdownTimer: {
    color: theme.blue,
    fontFamily: 'monospace',
    fontSize: '14px',
    fontWeight: 500,
    padding: theme.spacing(0.5, 1),
    backgroundColor: alpha(theme.blue, 0.1),
    borderRadius: theme.spacing(0.5),
    display: 'inline-block',
  },
  prizesCell: {
    position: 'relative',
    cursor: 'pointer',
    '&:hover .prizesPopup': {
      display: 'block',
    }
  },
  prizesTooltip: {
    position: 'relative',
    color: theme.text.primary,
    fontSize: '14px',
    fontWeight: 500,
  },
  prizesPopup: {
    display: 'none',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: theme.palette.darkgrey,
    border: `1px solid ${theme.bg.border}`,
    borderRadius: theme.spacing(0.75),
    padding: theme.spacing(1.5),
    minWidth: '150px',
    zIndex: 1000,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -6,
      left: '50%',
      transform: 'translateX(-50%) rotate(45deg)',
      width: 12,
      height: 12,
      backgroundColor: theme.palette.darkgrey,
      borderLeft: `1px solid ${theme.bg.border}`,
      borderTop: `1px solid ${theme.bg.border}`,
    }
  },
  prizePopupRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0.75),
    borderBottom: `1px solid ${alpha(theme.bg.border, 0.5)}`,
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  prizeAmount: {
    color: theme.green,
    fontWeight: 500,
  },
})); 