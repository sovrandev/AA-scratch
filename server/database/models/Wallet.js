const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    currency: { 
        type: String, 
        required: true,
        enum: ['BTC', 'SOL', 'ETH', 'USDC', 'USDT', 'TRX', 'XRP'] 
    },
    balance: { 
        type: Number, 
        default: 0 
    },
    address: { 
        type: String, 
        default: '' 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Wallet', walletSchema); 