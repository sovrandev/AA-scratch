const mongoose = require('mongoose');

const cryptoAddressSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String }, 
    tag: { type: String }, // For currencies that need a tag/memo (XRP, etc.)
    network: { type: String }, // The network the address belongs to
    cryptochill_id: { type: String }, // CryptoChill invoice ID for reference
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CryptoAddress',  cryptoAddressSchema);
