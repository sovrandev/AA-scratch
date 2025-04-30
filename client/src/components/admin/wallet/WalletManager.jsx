  import React, { useState, useEffect } from 'react';
import { useAdminStyles } from '../styles/adminStyles';
import { useAdmin } from '../../../contexts/admin';
import { useNotification } from '../../../contexts/notification';
import { 
  CircularProgress, 
  TextField, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { 
  Refresh, 
  FileCopy, 
  Edit
} from '@material-ui/icons';

const currencyIcons = {
  BTC: '₿',
  SOL: 'Ӿ',
  ETH: 'Ξ',
  USDC: '$',
  USDT: '$',
  TRX: 'τ',
  XRP: '✕'
};

const currencyColors = {
  BTC: '#F7931A',
  SOL: '#14F195',
  ETH: '#627EEA',
  USDC: '#2775CA',
  USDT: '#26A17B',
  TRX: '#FF0013',
  XRP: '#23292F'
};

const WalletManager = () => {
  const classes = useAdminStyles();
  const { getWalletBalances, updateWalletAddress, syncWalletBalances, loading } = useAdmin();
  const notify = useNotification();
  
  const [wallets, setWallets] = useState([]);
  const [editingWallet, setEditingWallet] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [totalUSD, setTotalUSD] = useState(0);

  useEffect(() => {
    loadWallets();
  }, []);

  useEffect(() => {
    // Calculate total USD value (simplified approach)
    if (wallets.length > 0) {
      const rates = {
        BTC: 45000,
        SOL: 120,
        ETH: 3000,
        USDC: 1,
        USDT: 1,
        TRX: 0.12,
        XRP: 0.5
      };

      const total = wallets.reduce((sum, wallet) => {
        return sum + (wallet.balance * (rates[wallet.currency] || 0));
      }, 0);

      setTotalUSD(total);
    }
  }, [wallets]);

  const loadWallets = async () => {
    const data = await getWalletBalances();
    if (data) {
      setWallets(data);
      setLastSync(new Date());
    }
  };

  const handleSync = async () => {
    const success = await syncWalletBalances();
    if (success) {
      loadWallets();
    }
  };

  const handleEditWallet = (wallet) => {
    setEditingWallet(wallet);
    setNewAddress(wallet.address || '');
    setDialogOpen(true);
  };

  const handleSaveAddress = async () => {
    if (!editingWallet) return;

    const success = await updateWalletAddress(editingWallet.currency, newAddress);
    if (success) {
      setDialogOpen(false);
      loadWallets();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    notify.success('Address copied to clipboard');
  };

  const formatCurrency = (amount, currency) => {
    return `${parseFloat(amount).toFixed(currency === 'BTC' ? 8 : currency === 'ETH' ? 6 : 2)} ${currency}`;
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h1 className={classes.title}>Wallet Manager</h1>
        <div className={classes.actions}>
          <button 
            className={classes.actionButton}
            onClick={handleSync}
            disabled={loading}
          >
            <Refresh fontSize="small" color="inherit" /> Sync Balances
          </button>
        </div>
      </div>

      <div className={classes.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className={classes.sectionTitle}>Overview</div>
          {lastSync && (
            <span className={classes.secondaryText}>
              Last synced: {lastSync.toLocaleString()}
            </span>
          )}
        </div>

        <div className={classes.statsGrid}>
          <div className={classes.statCard}>
            <div className={classes.statTitle}>Total Balance (USD)</div>
            <div className={classes.statValue}>${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>
          </div>
          <div className={classes.statCard}>
            <div className={classes.statTitle}>Active Currencies</div>
            <div className={classes.statValue}>{wallets.filter(w => w.balance > 0).length}</div>
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <div className={classes.sectionTitle}>Wallet Balances</div>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <CircularProgress />
          </div>
        ) : (
          <div className={classes.walletGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {wallets.map((wallet) => (
              <div 
                key={wallet.currency} 
                className={classes.card}
                style={{ 
                  borderLeft: `4px solid ${currencyColors[wallet.currency] || '#ccc'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      width: '30px', 
                      height: '30px', 
                      borderRadius: '50%', 
                      backgroundColor: currencyColors[wallet.currency] || '#ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: '#fff'
                    }}>
                      {currencyIcons[wallet.currency] || wallet.currency.charAt(0)}
                    </span>
                    <span className={classes.primaryText} style={{ fontWeight: 'bold' }}>
                      {wallet.currency}
                    </span>
                  </div>
                  <span className={classes.successText} style={{ fontWeight: 'bold' }}>
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span className={classes.secondaryText} style={{ fontSize: '12px' }}>
                      {wallet.address ? wallet.address : 'No address set'}
                    </span>
                  </div>
                  {wallet.address && (
                    <Button 
                      size="small" 
                      onClick={() => copyToClipboard(wallet.address)}
                      style={{ minWidth: 'auto', padding: '4px' }}
                    >
                      <FileCopy fontSize="small" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          Edit {editingWallet?.currency} Wallet Address
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Wallet Address"
            type="text"
            fullWidth
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className={classes.input}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveAddress} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WalletManager; 