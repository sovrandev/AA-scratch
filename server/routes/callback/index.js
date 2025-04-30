const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Load database models
const User = require('../../database/models/User');
const CryptoAddress = require('../../database/models/CryptoAddress');
const CryptoTransaction = require('../../database/models/CryptoTransaction');
const SteamTransaction = require('../../database/models/SteamTransaction');
const CreditTransaction = require('../../database/models/CreditTransaction');
const Report = require('../../database/models/Report');

// Load middleware
const {
    rateLimiterMiddleware
} = require('../../middleware/rateLimiter');

// Load utils
const {

} = require('../../utils/callback');

// Callback variables
let callbackBlockTransactionCrypto = [];
let callbackBlockTransactionCredit = [];
let callbackBlockTransactionSteam = [];

module.exports = (io) => {

    // @desc    Get CryptoChill callback
    // @route   POST /callback/cryptochill
    // @access  Public
    router.post('/cryptochill', async(req, res) => {
        try {
            // Get signature from headers and callback_id from body
            const signature = req.headers['x-cryptochill-signature'];
            const callbackData = req.body;
            
            if (!signature || !callbackData || !callbackData.id) {
                console.error('[CryptoChill Webhook] Missing required data');
                return res.status(400).json({ error: 'Missing required data' });
            }
            
            // Verify the signature
            const expectedSignature = crypto
                .createHmac('sha256', process.env.CRYPTOCHILL_WEBHOOK_SECRET)
                .update(callbackData.id)
                .digest('hex');
                
            if (signature !== expectedSignature) {
                console.error('[CryptoChill Webhook] Invalid signature');
                return res.status(401).json({ error: 'Invalid signature' });
            }
            
            console.log(`[CryptoChill Webhook] Received event type: ${callbackData.type}`, callbackData);
            
            // Process based on the event type
            if (callbackData.type === 'payment') {
                // Find the crypto address associated with this payment
                const cryptoAddress = await CryptoAddress.findOne({
                    cryptochill_id: callbackData.invoice_id
                }).select('user name').lean();
                
                if (!cryptoAddress) {
                    console.error(`[CryptoChill Webhook] Address not found for invoice: ${callbackData.invoice_id}`);
                    return res.status(404).json({ error: 'Address not found' });
                }
                
                // Calculate amount in site currency (USD)
                const usdAmount = parseFloat(callbackData.amount_usd);
                // No conversion needed, we now work directly in USD
                const siteAmount = parseFloat(usdAmount.toFixed(2));
                
                // For pending transactions (detected on blockchain but not confirmed)
                if (callbackData.status === 'pending') {
                    // Find or create a transaction for this deposit
                    let transaction = await CryptoTransaction.findOne({
                        'data.externalId': callbackData.id
                    });
                    
                    if (!transaction) {
                        // Create new transaction record with pending state
                        transaction = await CryptoTransaction.create({
                            amount: siteAmount,
                            data: {
                                externalId: callbackData.id,
                                transactionId: callbackData.txid,
                                currency: cryptoAddress.name,
                                address: callbackData.address,
                                cryptoAmount: callbackData.amount,
                                confirmations: callbackData.confirmations || 0,
                                requiredConfirmations: callbackData.required_confirmations || 1
                            },
                            type: 'deposit',
                            user: cryptoAddress.user,
                            state: 'pending'
                        });
                        
                        // Emit transaction update to cashier socket for pending notification
                        io.of('/cashier').to(cryptoAddress.user.toString()).emit('transaction', { 
                            transaction,
                            status: 'pending',
                            message: `Deposit of ${siteAmount.toFixed(2)} USD detected on blockchain. Waiting for confirmation.`
                        });
                    } else if (transaction.state === 'pending' && callbackData.confirmations) {
                        // Update confirmations count for existing pending transaction
                        await CryptoTransaction.findByIdAndUpdate(transaction._id, {
                            'data.confirmations': callbackData.confirmations
                        });
                        
                        // Emit confirmation update
                        io.of('/cashier').to(cryptoAddress.user.toString()).emit('transaction', { 
                            transaction,
                            status: 'confirming',
                            message: `Deposit confirming: ${callbackData.confirmations}/${callbackData.required_confirmations || 1} confirmations`
                        });
                    }
                }
                // For completed transactions (fully confirmed)
                else if (callbackData.status === 'completed') {
                    // Find or create a transaction for this deposit
                    let transaction = await CryptoTransaction.findOne({
                        'data.externalId': callbackData.id
                    });
                    
                    if (!transaction) {
                        // Create new transaction record directly with completed state
                        transaction = await CryptoTransaction.create({
                            amount: siteAmount,
                            data: {
                                externalId: callbackData.id,
                                transactionId: callbackData.txid,
                                currency: cryptoAddress.name,
                                address: callbackData.address,
                                cryptoAmount: callbackData.amount
                            },
                            type: 'deposit',
                            user: cryptoAddress.user,
                            state: 'completed'
                        });
                    } else if (transaction.state !== 'completed') {
                        // Update existing transaction to completed state
                        transaction = await CryptoTransaction.findByIdAndUpdate(transaction._id, {
                            state: 'completed',
                            'data.confirmations': callbackData.confirmations || 1
                        }, { new: true });
                    } else {
                        // Transaction already completed, nothing to do
                        return res.json({ success: true });
                    }
                    
                    // Only update user balance and other data for newly completed transactions
                    // Update user balance - directly in USD
                    const userDatabase = await User.findByIdAndUpdate(cryptoAddress.user, {
                        $inc: {
                            balance: siteAmount,
                            'stats.deposit': siteAmount,
                            'stats.crypto.deposit': siteAmount,
                            'limits.betToWithdraw': siteAmount
                        },
                        updatedAt: new Date().getTime()
                    }, { new: true }).select('balance xp stats rakeback levelBoxes ban updatedAt affiliates').lean();
                    
                    // Update daily report - directly in USD
                    await Report.findOneAndUpdate({ 
                        createdAt: new Date().toISOString().slice(0, 10) 
                    }, {
                        $inc: {
                            'stats.total.deposit': siteAmount,
                            'stats.crypto.deposit': siteAmount
                        }
                    }, { upsert: true });
                    
                    // Handle affiliate commission if applicable
                    if (userDatabase.affiliates?.referrer) {
                        await User.findByIdAndUpdate(userDatabase.affiliates.referrer, {
                            $inc: { 
                                'affiliates.deposit': siteAmount
                            },
                            updatedAt: new Date().getTime()
                        });
                    }
                    
                    // Emit user update to socket
                    io.of('/general').to(userDatabase._id.toString()).emit('user', { user: userDatabase });
                    
                    // Emit transaction update to cashier socket with completed status
                    io.of('/cashier').to(userDatabase._id.toString()).emit('transaction', { 
                        transaction,
                        status: 'completed',
                        message: `Your deposit of ${siteAmount.toFixed(2)} USD has been confirmed and credited to your account.`
                    });
                }
            } else if (callbackData.type === 'payout' && callbackData.status === 'completed') {
                // Update withdrawal transaction state
                const transaction = await CryptoTransaction.findOneAndUpdate({
                    'data.externalId': callbackData.id,
                    state: { $in: ['pending', 'processing'] }
                }, {
                    state: 'completed',
                    'data.cryptoAmount': callbackData.amount,
                    'data.txid': callbackData.txid
                }, { new: true });
                
                if (transaction) {
                    // Emit transaction update to cashier socket
                    io.of('/cashier').to(transaction.user.toString()).emit('transaction', { 
                        transaction,
                        status: 'completed',
                        message: `Your withdrawal of ${transaction.amount.toFixed(2)} USD has been sent to your wallet.`
                    });
                }
            }
            
            // Always return success to avoid webhook retries
            res.json({ success: true });
        } catch(err) {
            console.error('CryptoChill Webhook Error:', err);
            res.status(500).json({ error: err.message });
        }
    });

    return router;

}