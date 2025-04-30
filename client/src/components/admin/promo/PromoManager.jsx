import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useAdmin } from '../../../contexts/admin';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3)
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: theme.text.primary
  },
  createButton: {
    padding: '8px 16px',
    backgroundColor: theme.blue,
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
    '&:hover': {
      backgroundColor: theme.blueHover
    }
  },
  promoList: {
    backgroundColor: theme.bg.inner,
    borderRadius: '8px',
    overflow: 'hidden'
  },
  promoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.bg.border}`,
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  promoCode: {
    color: theme.text.primary,
    fontWeight: 500
  },
  promoDetails: {
    display: 'flex',
    gap: theme.spacing(3),
    color: theme.text.secondary
  },
  modal: {
    '& .MuiDialog-paper': {
      backgroundColor: theme.palette.darkgrey,
      padding: theme.spacing(3),
      width: '400px'
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2)
  },
  input: {
    '& .MuiOutlinedInput-root': {
      color: theme.text.primary,
      '& fieldset': {
        borderColor: theme.bg.border
      },
      '&:hover fieldset': {
        borderColor: theme.bg.border
      }
    },
    '& .MuiInputLabel-root': {
      color: theme.text.secondary
    }
  }
}));

const PromoManager = () => {
  const classes = useStyles();
  const { getPromos, createPromo, removePromo, loading } = useAdmin();
  const [promos, setPromos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    reward: '',
    maxUses: ''
  });

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    const data = await getPromos();
    setPromos(data);
  };

  const handleCreate = async () => {
    if (await createPromo(formData)) {
      setIsModalOpen(false);
      setFormData({ code: '', reward: '', maxUses: '' });
      loadPromos();
    }
  };

  const handleDelete = async (promoId) => {
    if (await removePromo(promoId)) {
      loadPromos();
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <h1 className={classes.title}>Promo Codes</h1>
        <button className={classes.createButton} onClick={() => setIsModalOpen(true)}>
          Create Promo Code
        </button>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <div className={classes.promoList}>
          {promos.map(promo => (
            <div key={promo._id} className={classes.promoItem}>
              <div className={classes.promoCode}>{promo.code}</div>
              <div className={classes.promoDetails}>
                <span>${promo.reward}</span>
                <span>{promo.redeemptionsTotal}/{promo.redeemptionsMax} uses</span>
                <button 
                  className={classes.deleteButton}
                  onClick={() => handleDelete(promo._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        className={classes.modal}
      >
        <div className={classes.form}>
          <TextField
            label="Promo Code"
            variant="outlined"
            className={classes.input}
            value={formData.code}
            onChange={(e) => setFormData({...formData, code: e.target.value})}
          />
          <TextField
            label="Reward Amount ($)"
            variant="outlined"
            type="number"
            className={classes.input}
            value={formData.reward}
            onChange={(e) => setFormData({...formData, reward: e.target.value})}
          />
          <TextField
            label="Max Uses"
            variant="outlined"
            type="number"
            className={classes.input}
            value={formData.maxUses}
            onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
          />
          <button className={classes.createButton} onClick={handleCreate}>
            Create
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default PromoManager; 