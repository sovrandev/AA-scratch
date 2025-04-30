const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminActionSchema = new Schema({
  adminUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String,
    enum: [
      'create', 
      'update', 
      'delete', 
      'approve', 
      'reject', 
      'block', 
      'unblock', 
      'reset', 
      'withdraw', 
      'deposit',
      'credit',
      'debit',
      'login',
      'logout',
      'setting_change',
      'other'
    ],
    required: true
  },
  resource: {
    type: String,
    enum: [
      'user',
      'streamer',
      'affiliate',
      'transaction',
      'wallet',
      'setting',
      'game',
      'promotion',
      'reward',
      'other'
    ],
    required: true
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: false
  },
  targetUserName: {
    type: String,
    required: false
  },
  details: {
    type: Object,
    required: false
  },
  ipAddress: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
adminActionSchema.index({ adminUser: 1 });
adminActionSchema.index({ actionType: 1 });
adminActionSchema.index({ resource: 1 });
adminActionSchema.index({ createdAt: 1 });

module.exports = mongoose.model('AdminAction', adminActionSchema); 