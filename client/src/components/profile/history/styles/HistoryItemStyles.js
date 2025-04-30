import { makeStyles } from '@material-ui/core/styles';

export const useHistoryItemStyles = makeStyles((theme) => ({
  historyItem: {
    background: theme.bg.inner,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    transition: 'all 0.2s',
    '&:hover': {
      background: theme.bg.light
    }
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  amount: {
    fontSize: '16px',
    fontWeight: 600,
    color: theme.text.primary
  },
  method: {
    fontSize: '14px',
    color: theme.text.secondary,
    textTransform: 'capitalize'
  },
  timestamp: {
    fontSize: '14px',
    color: theme.text.secondary
  },
  status: {
    fontSize: '14px',
    padding: '4px 8px',
    borderRadius: theme.spacing(0.5),
    textTransform: 'capitalize'
  },
  statusCompleted: {
    background: theme.palette.success.main + '26',
    color: theme.palette.success.main
  },
  statusPending: {
    background: theme.palette.warning.main + '26',
    color: theme.palette.warning.main
  },
  win: {
    color: theme.palette.success.main
  },
  loss: {
    color: theme.palette.error.main
  }
})); 