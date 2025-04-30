const mongoose = require('mongoose');

const cryptoTransactionSchema = new mongoose.Schema({
    amount: { type: Number },
    data: {
        externalId: { type: String },
        transactionId: { type: String },
        sender: { type: String },
        receiver: { type: String },
        address: { type: String },
        currency: { type: String },
        cryptoAmount: { type: Number },
        confirmations: { type: Number, default: 0 },
        requiredConfirmations: { type: Number, default: 1 },
        txid: { type: String },
        network: { type: String }
    },
    type: { type: String, enum: ['deposit', 'withdraw'], required: true },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    state: { 
        type: String, 
        enum: ['pending', 'confirming', 'completed', 'failed', 'cancelled', 'processing'],
        default: 'pending'
    },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CryptoTransaction',  cryptoTransactionSchema);
