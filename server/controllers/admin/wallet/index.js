// Load database models
const Wallet = require('../../../database/models/Wallet');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');

const {
    adminCheckGetWalletBalancesData,
    adminCheckUpdateWalletAddressData,
    adminCheckSyncWalletBalancesData
} = require('../../../utils/admin/wallet');

// Import admin action logging
const { logAdminAction } = require('../actions');

// Mock cryptochill API for this example
const cryptochillApi = {
    getBalances: async () => {
        // This would normally make a network request to the cryptochill API
        // For now, return mock data
        return {
            success: true,
            balances: {
                BTC: { balance: 1.25, address: '13XprHeZMR1XpKsQfZRCHgS8YhgGVgkz3c' },
                SOL: { balance: 50.75, address: '4zJ2zCgrNGEJGSyHxRyfggaZZBUBNXLNoqpz7X9sdwN' },
                ETH: { balance: 3.42, address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
                USDC: { balance: 5200.50, address: '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326' },
                USDT: { balance: 4750.25, address: '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326' },
                TRX: { balance: 15000, address: 'TKQYYd8ypLnRzSQNPEdnYRNwfLmcCWC79r' },
                XRP: { balance: 2500, address: 'rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg' }
            }
        };
    }
};

const adminGetWalletBalancesSocket = async (io, socket, user, data, callback) => {
    try {
        adminCheckGetWalletBalancesData(data);

        // Get all wallet records from database
        const wallets = await Wallet.find({}).sort({ currency: 1 }).lean();

        // If there are no wallets in the database, create default ones
        if (!wallets || wallets.length === 0) {
            const defaultCurrencies = ['BTC', 'SOL', 'ETH', 'USDC', 'USDT', 'TRX', 'XRP'];
            const defaultWallets = [];

            for (const currency of defaultCurrencies) {
                const wallet = await Wallet.create({
                    currency,
                    balance: 0,
                    address: ''
                });
                defaultWallets.push(wallet.toObject());
            }

            callback({ success: true, wallets: defaultWallets });
        } else {
            callback({ success: true, wallets });
        }
    } catch (err) {
        callback({ success: false, error: { message: err.message } });
    }
};

const adminUpdateWalletAddressSocket = async (io, socket, user, data, callback) => {
    try {
        adminCheckUpdateWalletAddressData(data);

        // Find wallet by currency
        let wallet = await Wallet.findOne({ currency: data.currency });
        const previousAddress = wallet?.address || '';

        // If wallet doesn't exist, create it
        if (!wallet) {
            wallet = await Wallet.create({
                currency: data.currency,
                balance: 0,
                address: data.address
            });
        } else {
            // Update wallet address
            wallet = await Wallet.findByIdAndUpdate(
                wallet._id,
                { address: data.address },
                { new: true }
            );
        }

        // Log admin action
        const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
        await logAdminAction(
            user, 
            'update', 
            'wallet', 
            wallet._id, 
            null, 
            { 
                currency: data.currency, 
                previousAddress,
                newAddress: data.address
            },
            identifier
        );

        callback({ success: true, wallet });

        socketRemoveAntiSpam(user._id);
    } catch (err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { message: err.message } });
    }
};

const adminSyncWalletBalancesSocket = async (io, socket, user, data, callback) => {
    try {
        adminCheckSyncWalletBalancesData(data);

        // In a real implementation, this would call your payment provider's API
        // to get current wallet balances
        const apiResponse = await cryptochillApi.getBalances();

        if (!apiResponse.success) {
            throw new Error('Failed to retrieve balances from payment provider');
        }

        // Update each wallet in the database with the new balance
        const updatePromises = [];
        const updates = [];
        
        for (const [currency, walletData] of Object.entries(apiResponse.balances)) {
            // Find wallet by currency
            let wallet = await Wallet.findOne({ currency });

            // If wallet doesn't exist, create it
            if (!wallet) {
                const newWallet = await Wallet.create({
                    currency,
                    balance: walletData.balance,
                    address: walletData.address
                });
                updates.push({
                    currency,
                    previousBalance: 0,
                    newBalance: walletData.balance,
                    walletId: newWallet._id
                });
            } else {
                // Store previous balance for logging
                const previousBalance = wallet.balance;
                
                // Update wallet balance and address
                const updatedWallet = await Wallet.findByIdAndUpdate(
                    wallet._id,
                    { 
                        balance: walletData.balance,
                        address: walletData.address || wallet.address
                    },
                    { new: true }
                );
                
                updates.push({
                    currency,
                    previousBalance,
                    newBalance: walletData.balance,
                    walletId: wallet._id
                });
            }
        }

        // Log admin action
        const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
        await logAdminAction(
            user, 
            'update', 
            'wallet', 
            null, 
            null, 
            { 
                action: 'sync_balances',
                updates
            },
            identifier
        );

        // Get updated wallets
        const updatedWallets = await Wallet.find({}).sort({ currency: 1 }).lean();

        callback({ success: true, wallets: updatedWallets });

        socketRemoveAntiSpam(user._id);
    } catch (err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { message: err.message } });
    }
};

module.exports = {
    adminGetWalletBalancesSocket,
    adminUpdateWalletAddressSocket,
    adminSyncWalletBalancesSocket
}; 