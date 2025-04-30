const crypto = require('crypto');

// Load database models
const User = require('../../../database/models/User');
const CryptoPrice = require('../../../database/models/CryptoPrice');
const CryptoAddress = require('../../../database/models/CryptoAddress');
const CryptoTransaction = require('../../../database/models/CryptoTransaction');
const Report = require('../../../database/models/Report');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    cashierCheckSendCryptoWithdrawData,
    cashierCheckSendCryptoWithdrawUser,
    cashierCheckSendCryptoWithdrawTransactions,
    cashierCryptoGetPrices,
    cashierCryptoGenerateAddress,
    getDefaultNetwork,
    cashierCryptoCreateWithdrawal
} = require('../../../utils/cashier/crypto');
const {
    settingGet
} = require('../../../utils/setting');

const SUPPORTED_CURRENCIES = ['btc', 'eth', 'ltc', 'sol', 'usdt', 'usdc', 'xrp', 'trx'];

const cashierGetCryptoDataSocket = async(io, socket, user, data, callback) => {
    try {
        // Get crypto prices from database or fetch if needed
        let cryptoPrices = await CryptoPrice.find({}).select('name price fee').lean();
        
        // If we don't have prices in DB, fetch them now
        if(cryptoPrices.length === 0) {
            const prices = await cashierCryptoGetPrices();
            
            // Save prices to database
            const pricePromises = Object.entries(prices).map(([currency, data]) => {
                return CryptoPrice.findOneAndUpdate(
                    { name: currency },
                    { price: data.price, fee: data.fee },
                    { upsert: true, new: true }
                );
            });
            
            await Promise.all(pricePromises);
            cryptoPrices = await CryptoPrice.find({}).select('name price fee').lean();
        }
        
        // Format crypto prices - now directly in USD, no conversion needed
        const formattedPrices = cryptoPrices.reduce((acc, currency) => { 
            acc[currency.name] = { 
                price: currency.price, 
                fee: currency.fee,
                withdrawalFee: currency.fee // Match the field name used in frontend
            }; 
            return acc; 
        }, {});

        // Get user's existing addresses
        let userAddresses = await CryptoAddress.find({ user: user._id }).select('name address tag network').lean();
        
        // Find which currencies we need to generate addresses for
        const existingCurrencies = userAddresses.map(addr => addr.name);
        const missingCurrencies = SUPPORTED_CURRENCIES.filter(curr => !existingCurrencies.includes(curr));
        
        // Only log missing currencies if there are any
        if (missingCurrencies.length > 0) {
            console.error(`[Crypto] Generating addresses for: ${missingCurrencies.join(', ')} for user ${user._id}`);
        }
        
        // Generate missing addresses
        if(missingCurrencies.length > 0) {
            const addressPromises = missingCurrencies.map(async (currency) => {
                try {
                    const addressData = await cashierCryptoGenerateAddress(currency);
                    
                    if (!addressData || !addressData.address) {
                        console.error(`[Crypto] Failed to get valid address for ${currency}`);
                        return null;
                    }
                    
                    const newAddress = await CryptoAddress.create({ 
                        name: currency, 
                        address: addressData.address,
                        tag: addressData.tag || null,
                        network: addressData.network || null,
                        cryptochill_id: addressData.cryptochill_id || null,
                        user: user._id 
                    });
                    return newAddress;
                } catch (error) {
                    console.error(`[Crypto] Error generating address for ${currency}:`, error);
                    return null;
                }
            });
            
            const newAddresses = (await Promise.all(addressPromises)).filter(addr => addr !== null);
            
            if (newAddresses.length === 0) {
                console.error(`[Crypto] Failed to generate any new addresses`);
            }
            
            if (newAddresses.length > 0) {
                userAddresses = [...userAddresses, ...newAddresses];
            }
        }
        
        // Format addresses for response
        const formattedAddresses = userAddresses.reduce((acc, addr) => { 
            if (addr && addr.name && addr.address) {
                acc[addr.name] = {
                    address: addr.address,
                    tag: addr.tag || null,
                    network: addr.network || null
                };
            }
            return acc; 
        }, {});
        
        // Get pending transactions
        const pendingTransactions = await CryptoTransaction.find({
            user: user._id,
            state: { $in: ['pending', 'processing'] }
        }).select('amount data type state createdAt').sort({ createdAt: -1 }).lean();

        callback({ 
            success: true, 
            data: {
                addresses: formattedAddresses, 
                prices: formattedPrices,
                transactions: pendingTransactions,
                supportedCurrencies: SUPPORTED_CURRENCIES
            }
        });
    } catch(err) {
        console.error('Error in cashierGetCryptoDataSocket:', err);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const cashierSendCryptoWithdrawSocket = async(io, socket, user, data, callback) => {
    try {
        // NO CONVERSION NEEDED - amount is already in USD
        // Just ensure proper decimal formatting
        if (data && data.amount) {
            data.amount = parseFloat(parseFloat(data.amount).toFixed(2));
        }
        
        // Validate sent data
        cashierCheckSendCryptoWithdrawData(data);

        // Validate withdraw user
        cashierCheckSendCryptoWithdrawUser(data, user);

        // Get user's pending transactions
        const pendingTransactions = await CryptoTransaction.find({ 
            user: user._id, 
            state: 'pending' 
        }).select('user state').lean();

        // Validate withdraw transactions
        cashierCheckSendCryptoWithdrawTransactions(pendingTransactions);

        const network = getDefaultNetwork(data.currency);

        try {
            // The amount is already in USD, no conversion needed
            const usdAmount = data.amount;
            let transaction;

            if(settingGet().crypto.manual.enabled != true) {
                const withdrawal = await cashierCryptoCreateWithdrawal(
                    data.currency,
                    data.address,
                    usdAmount, 
                    user._id.toString()
                );
                
                transaction = await CryptoTransaction.create({
                    amount: data.amount,
                    data: {
                        externalId: withdrawal.id,
                        transactionId: withdrawal.id,
                        currency: data.currency,
                        address: data.address,
                        network: network,
                        cryptoAmount: withdrawal.amount
                    },
                    type: 'withdraw',
                    user: user._id,
                    state: 'completed'
                });
            } else {
                transaction = await CryptoTransaction.create({
                    amount: data.amount,
                    data: {
                        externalId: null,
                        transactionId: null,
                        currency: data.currency,
                        address: data.address,
                        network: network,
                    },
                    type: 'withdraw',
                    user: user._id,
                    state: 'pending'
                });
            }

            // Update user balance
            const userDatabase = await User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: -data.amount,
                    'stats.withdraw': data.amount,
                    'stats.crypto.withdraw': data.amount
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean();

            // Update report
            await Report.findOneAndUpdate({ 
                createdAt: new Date().toISOString().slice(0, 10) 
            }, {
                $inc: {
                    'stats.total.withdraw': data.amount,
                    'stats.crypto.withdraw': data.amount
                }
            }, { upsert: true });

            // Send updated user to frontend
            io.of('/general').to(userDatabase._id.toString()).emit('user', { user: userDatabase });

            callback({ success: true, user: userDatabase, transaction: transaction });

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            console.error('Crypto Withdraw Error:', err);
            
            // Handle specific error messages with more user-friendly and generic messages
            let errorMessage = err.message;
            
            // Check for network fee errors or insufficient funds - use generic message
            if (errorMessage.includes('network fee') || 
                errorMessage.includes('less than network fee') || 
                errorMessage.includes('Insufficient funds')) {
                errorMessage = `Unable to process withdrawal at this time. This might be due to temporary service limitations. Please try again later or contact support.`;
            }
            
            socketRemoveAntiSpam(socket.decoded._id);
            callback({ success: false, error: { type: 'error', message: errorMessage } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const cashierCryptoCheckPrices = async() => {
    try {
        // Get crypto prices from CryptoChill API
        const prices = await cashierCryptoGetPrices();

        // Create update promises for each supported currency
        const updatePromises = SUPPORTED_CURRENCIES.map(currency => {
            const price = prices[currency];
            if (!price) return null;

            return CryptoPrice.findOneAndUpdate(
                { name: currency },
                { 
                    price: price.price, // Store price directly in USD
                    fee: price.fee // Store fee directly in USD
                },
                { upsert: true }
            );
        });

        await Promise.all(updatePromises.filter(p => p !== null));

        setTimeout(() => { cashierCryptoCheckPrices(); }, 1000 * 60 * 60 * 6);
    } catch(err) {
        setTimeout(() => { cashierCryptoCheckPrices(); }, 1000 * 60 * 60 * 6);
        console.error('Error checking crypto prices:', err);
    }
}

const cashierCryptoInit = (io) => {
    try {
        // Check for crypto prices
        cashierCryptoCheckPrices();
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    cashierGetCryptoDataSocket,
    cashierSendCryptoWithdrawSocket,
    cashierCryptoInit
}
