// Load database models
const User = require('../../../database/models/User');
const RobuxTransaction = require('../../../database/models/RobuxTransaction');
const LimitedTransaction = require('../../../database/models/LimitedTransaction');
const SteamTransaction = require('../../../database/models/SteamTransaction');
const CryptoTransaction = require('../../../database/models/CryptoTransaction');
const GiftTransaction = require('../../../database/models/GiftTransaction');
const CreditTransaction = require('../../../database/models/CreditTransaction');
const TipTransaction = require('../../../database/models/TipTransaction');
const BalanceTransaction = require('../../../database/models/BalanceTransaction');
// Game models
const CrashBet = require('../../../database/models/CrashBet');
const RollBet = require('../../../database/models/RollBet');
const BlackjackBet = require('../../../database/models/BlackjackBet');
const DuelsBet = require('../../../database/models/DuelsBet');
const MinesGame = require('../../../database/models/MinesGame');
const TowersGame = require('../../../database/models/TowersGame');
const UnboxGame = require('../../../database/models/UnboxGame');
const BattlesBet = require('../../../database/models/BattlesBet');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');

const {
    adminCheckGetLedgerTransactionsData,
    adminCheckGetLedgerBalancesData
} = require('../../../utils/admin/ledger');

const adminGetLedgerTransactionsSocket = async (io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetLedgerTransactionsData(data);

        // Pagination settings
        const limit = 20;
        const skip = (data.page - 1) * limit;

        // Base query for all transactions
        const baseQuery = {};

        // Game transactions require payout to be set
        const gameQuery = { 
            ...baseQuery,
            payout: { $exists: true, $ne: null }
        };

        // Add search filter if provided
        if (data.search && data.search.trim() !== '') {
            const searchRegex = new RegExp(data.search, 'i');
            baseQuery.$or = [
                { 'user.username': searchRegex },
                { 'data.transaction': searchRegex },
                { 'data.txid': searchRegex },
                { type: searchRegex }
            ];

            gameQuery.$or = [
                { 'user.username': searchRegex }
            ];
        }

        // Transaction model mapping
        const transactionModels = {
            // Payment methods
            robux: { model: RobuxTransaction, query: baseQuery },
            limited: { model: LimitedTransaction, query: baseQuery },
            steam: { model: SteamTransaction, query: baseQuery },
            crypto: { model: CryptoTransaction, query: baseQuery },
            gift: { model: GiftTransaction, query: baseQuery },
            credit: { model: CreditTransaction, query: baseQuery },
            tip: { model: TipTransaction, query: baseQuery },
            balance: { model: BalanceTransaction, query: baseQuery },
            // Games
            crash: { model: CrashBet, query: gameQuery },
            roll: { model: RollBet, query: gameQuery },
            blackjack: { model: BlackjackBet, query: gameQuery },
            duels: { model: DuelsBet, query: gameQuery },
            mines: { model: MinesGame, query: gameQuery },
            towers: { model: TowersGame, query: gameQuery },
            unbox: { model: UnboxGame, query: gameQuery },
            battles: { model: BattlesBet, query: gameQuery }
        };

        // Filter transaction types if provided
        const selectedTypes = data.filters && data.filters.length > 0 ? data.filters : Object.keys(transactionModels);

        // Create promises for count and transactions from each model
        const promises = [];
        const countPromises = [];

        selectedTypes.forEach(type => {
            if (transactionModels[type]) {
                const { model, query } = transactionModels[type];
                countPromises.push(model.countDocuments(query));
                promises.push(
                    model.find(query)
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate('user', 'username avatar')
                        .lean()
                        .then(docs => docs.map(doc => ({ 
                            ...doc, 
                            method: type,
                            // For game transactions, add consistent fields
                            type: ['crash', 'roll', 'blackjack', 'duels', 'mines', 'towers', 'unbox', 'battles'].includes(type) ? 'game' : doc.type,
                            amount: doc.amount || 0,
                            payout: doc.payout || 0
                        })))
                );
            }
        });

        // Execute all promises
        const [counts, results] = await Promise.all([
            Promise.all(countPromises),
            Promise.all(promises)
        ]);

        // Calculate total count and flatten transactions
        const totalCount = counts.reduce((sum, count) => sum + count, 0);
        let transactions = [].concat(...results);

        // Sort combined results by date
        transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Trim to limit
        transactions = transactions.slice(0, limit);

        callback({
            success: true,
            transactions,
            count: totalCount
        });
    } catch (err) {
        callback({ success: false, error: { message: err.message } });
    }
};

const adminGetLedgerBalancesSocket = async (io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetLedgerBalancesData(data);

        // Get totals from each transaction model
        const [
            robuxDeposit,
            robuxWithdraw,
            limitedDeposit,
            limitedWithdraw,
            steamDeposit,
            cryptoDeposit,
            cryptoWithdraw,
            giftDeposit,
            creditDeposit,
            tipTotal
        ] = await Promise.all([
            RobuxTransaction.aggregate([
                { $match: { type: 'deposit', state: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            RobuxTransaction.aggregate([
                { $match: { type: 'withdraw', state: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            LimitedTransaction.aggregate([
                { $match: { type: 'deposit', state: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            LimitedTransaction.aggregate([
                { $match: { type: 'withdraw', state: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            SteamTransaction.aggregate([
                { $match: { state: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            CryptoTransaction.aggregate([
                { $match: { type: 'deposit', state: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            CryptoTransaction.aggregate([
                { $match: { type: 'withdraw', state: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            GiftTransaction.aggregate([
                { $match: { state: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            CreditTransaction.aggregate([
                { $match: { state: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            TipTransaction.aggregate([
                { $match: { state: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);

        // Format balances
        const balances = {
            robux: {
                deposit: robuxDeposit[0]?.total || 0,
                withdraw: robuxWithdraw[0]?.total || 0
            },
            limited: {
                deposit: limitedDeposit[0]?.total || 0,
                withdraw: limitedWithdraw[0]?.total || 0
            },
            steam: {
                deposit: steamDeposit[0]?.total || 0,
                withdraw: 0
            },
            crypto: {
                deposit: cryptoDeposit[0]?.total || 0,
                withdraw: cryptoWithdraw[0]?.total || 0
            },
            gift: {
                deposit: giftDeposit[0]?.total || 0,
                withdraw: 0
            },
            credit: {
                deposit: creditDeposit[0]?.total || 0,
                withdraw: 0
            },
            tip: {
                total: tipTotal[0]?.total || 0
            },
            total: {
                deposit: (robuxDeposit[0]?.total || 0) + 
                         (limitedDeposit[0]?.total || 0) + 
                         (steamDeposit[0]?.total || 0) + 
                         (cryptoDeposit[0]?.total || 0) + 
                         (giftDeposit[0]?.total || 0) + 
                         (creditDeposit[0]?.total || 0),
                withdraw: (robuxWithdraw[0]?.total || 0) + 
                          (limitedWithdraw[0]?.total || 0) + 
                          (cryptoWithdraw[0]?.total || 0)
            }
        };

        // Calculate profit
        balances.total.profit = balances.total.deposit - balances.total.withdraw;

        callback({
            success: true,
            balances
        });
    } catch (err) {
        callback({ success: false, error: { message: err.message } });
    }
};

module.exports = {
    adminGetLedgerTransactionsSocket,
    adminGetLedgerBalancesSocket
}; 