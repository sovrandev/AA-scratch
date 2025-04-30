const crypto = require('crypto');

// Load database models
const User = require('../../../database/models/User');
const Box = require('../../../database/models/Box');
const BalanceTransaction = require('../../../database/models/BalanceTransaction');
const UserSeed = require('../../../database/models/UserSeed');
const UnboxGame = require('../../../database/models/UnboxGame');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    generalCheckSendRakebackClaimUser,
    generalCheckRakebackBoxClaim,
    generalGetUserLevelBoxes
} = require('../../../utils/general/rakeback');
const {
    unboxCheckSendBetSeed,
    unboxGetOutcomeItem
} = require('../../../utils/unbox');
const {
    generalCheckGetUserInfoUser
} = require('../../../utils/general/user');
const {
    generalUserGetLevel,
    generalUserGetRakeback
} = require('../../../utils/general/user');

const generalGetRakebackDataSocket = async(io, socket, user, data, callback) => {
    try {
        // Get rakeback boxes
        const boxesDatabase = await Box.find({ type: 'free', state: 'active' }).select('name amount levelMin type state');


        // If user is logged in, get their rakeback data and level boxes
        let rakebackData = null;
        let levelBoxes = null;
        let level = 0;
        if (user) {
            let userDatabase = await User.findById(user._id).select('username avatar rank xp stats createdAt rakeback levelBoxes').lean();
            generalCheckGetUserInfoUser(userDatabase);
            
            rakebackData = {
                daily: {
                    available: userDatabase.rakeback.daily.available,
                    lastClaim: userDatabase.rakeback.daily.lastClaim
                },
                weekly: {
                    available: userDatabase.rakeback.weekly.available,
                    lastClaim: userDatabase.rakeback.weekly.lastClaim
                },
                monthly: {
                    available: userDatabase.rakeback.monthly.available,
                    lastClaim: userDatabase.rakeback.monthly.lastClaim
                }
            };
            levelBoxes = userDatabase.levelBoxes;
            level = generalUserGetLevel(userDatabase);
        }

        callback({ success: true, boxes: boxesDatabase, rakeback: rakebackData, levelBoxes, level });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendRakebackClaimSocket = async(io, socket, user, data, callback) => {
    try {
        const { type } = data;
        if (!type || !['daily', 'weekly', 'monthly'].includes(type)) {
            throw new Error('Invalid rakeback type specified.');
        }

        // Check if user has enough available rakeback earnings
        generalCheckSendRakebackClaimUser(user, type);

        const now = Date.now();
        const rakebackAmount = user.rakeback[type].available;

        // Update claiming user and create balance transaction in database
        const dataDatabase = await Promise.all([
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: rakebackAmount,
                    'stats.rakebackClaimed': rakebackAmount
                },
                [`rakeback.${type}.available`]: 0,
                [`rakeback.${type}.lastClaim`]: now,
                updatedAt: now
            }, { new: true }).select('balance xp stats rakeback ban updatedAt'),
            BalanceTransaction.create({
                amount: rakebackAmount,
                type: `rakebackClaim${type.charAt(0).toUpperCase() + type.slice(1)}`,
                user: user._id,
                state: 'completed'
            })
        ]);

        callback({ success: true, user: dataDatabase[0] });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendRakebackBoxClaimSocket = async(io, socket, user, data, callback) => {
    try {
        const { boxId, level } = data;
        
        // Validate box claim
        generalCheckRakebackBoxClaim(user, boxId, level);

        // Get box from database
        const boxDatabase = await Box.findById(boxId).select('amount items state').populate({ path: 'items.item', select: 'name image amountFixed' }).lean();
        if (!boxDatabase || boxDatabase.state !== 'active') {
            throw new Error('The requested box is not available.');
        }

        // Get user seed from database and check if available
        const seedDatabase = await UserSeed.findOne({ user: user._id, state: 'active' }).select('seedClient seedServer nonce user state');
        unboxCheckSendBetSeed(seedDatabase);

        // Combine nonce, server seed and client seed to one string
        const combined = `${seedDatabase.seedServer}-${seedDatabase.nonce}-${seedDatabase.seedClient}`;

        // Sha256 hash combined string
        const hash = crypto.createHash('sha256').update(combined).digest('hex');

        // Get game outcome
        const outcome = parseInt(hash.substr(0, 8), 16) % 100000;

        // Get box item for game outcome
        const outcomeItem = unboxGetOutcomeItem(boxDatabase, outcome);

        // Update user and create game record
        const dataDatabase = await Promise.all([
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: outcomeItem.amountFixed,
                    'stats.won': outcomeItem.amountFixed,
                    'stats.dailyBoxEarnings': outcomeItem.amountFixed
                },
                [`levelBoxes.level${level}.lastClaim`]: Date.now(),
                updatedAt: Date.now()
            }, { new: true }).select('balance xp stats levelBoxes ban updatedAt'),
            UserSeed.findByIdAndUpdate(seedDatabase._id, {
                $inc: { nonce: 1 }
            }),
            UnboxGame.create({
                amount: boxDatabase.amount,
                payout: outcomeItem.amountFixed,
                multiplier: Math.floor((outcomeItem.amountFixed / boxDatabase.amount) * 100),
                outcome: outcome,
                box: boxDatabase._id,
                fair: {
                    seed: seedDatabase._id,
                    nonce: seedDatabase.nonce
                },
                user: user._id,
                state: 'completed'
            })
        ]);

        callback({ 
            success: true, 
            user: dataDatabase[0],
            games: [dataDatabase[2].toObject()]
        });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    generalGetRakebackDataSocket,
    generalSendRakebackClaimSocket,
    generalSendRakebackBoxClaimSocket
}