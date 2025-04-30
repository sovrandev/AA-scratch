const crypto = require('crypto');

// Load database models
const User = require('../../database/models/User');
const UserSeed = require('../../database/models/UserSeed');
const Box = require('../../database/models/Box');
const UnboxGame = require('../../database/models/UnboxGame');
const Leaderboard = require('../../database/models/Leaderboard');
const Rain = require('../../database/models/Rain');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../utils/socket');
const {
    settingGet
} = require('../../utils/setting');
const {
    unboxCheckGetBoxDataData,
    unboxCheckGetBoxDataBox,
    unboxCheckSendBetData,
    unboxCheckSendBetBox,
    unboxCheckSendBetUser,
    unboxCheckSendBetSeed,
    unboxGetOutcomeItem
} = require('../../utils/unbox');
const {
    generalUserGetRakeback,
    generalUserGetFormated
} = require('../../utils/general/user');

// Load controllers
const {
    generalAddDrop
} = require('../general/bets');

const unboxGetData = () => {
    return new Promise(async(resolve, reject) => {
        try {
            // Get active boxes from database with populated item data
            const boxesDatabase = await Box.find({ state: 'active' })
                .select('name slug items amount categories type state levelMin')
                .populate({ 
                    path: 'items.item',
                    select: 'name image amountFixed'
                })
                .lean();

            resolve({ boxes: boxesDatabase });
        } catch(err) {
            reject(err);
        }
    });
}

const unboxGetBoxDataSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        unboxCheckGetBoxDataData(data);

        // Get box from database
        const boxDatabase = await Box.findById(data.boxId).select('name slug amount items categories type state levelMin').populate({ path: 'items.item', select: 'name image amountFixed' }).lean();

        // Validate box
        unboxCheckGetBoxDataBox(boxDatabase);

        callback({ success: true, box: boxDatabase });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}


const unboxSendBetSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        unboxCheckSendBetData(data);

        // Validate box
        const boxDatabase = await Box.findById(data.boxId).select('amount slug items state levelMin type').populate({ path: 'items.item', select: 'name image amountFixed' }).lean();
        unboxCheckSendBetBox(boxDatabase, user);

        // Get unbox count
        const unboxCount = Math.floor(data.unboxCount);

        // Get total bet amount
        const amountBetTotal = (boxDatabase.amount * unboxCount);

        // Validate user
        unboxCheckSendBetUser(user, amountBetTotal);

        // Get user seed from database and check if available
        const seedDatabase = await UserSeed.findOne({ user: user._id, state: 'active' }).select('seedClient seedServer nonce user state');
        unboxCheckSendBetSeed(seedDatabase);

        // Get running leaderboard from database if available
        const leaderboardDatabase = await Leaderboard.findOne({ state: 'running' }).select('state').lean();

        // Get rain bet amount if user is not sponsored
        const amountBetRain = user.limits.blockSponsor !== true ? amountBetTotal : 0;

        // Get settings
        const settings = settingGet();

        // Get user rakeback rank
        const rakeback = generalUserGetRakeback(user);

        // Get user rakeback amount
        const amountRakeback = user.limits.blockSponsor !== true ? (amountBetTotal * rakeback.percentage * settings.general.reward.multiplier) : 0;

        // Split rakeback into daily, weekly, and monthly
        const dailyRakeback = (amountRakeback * 0.5);
        const weeklyRakeback = (amountRakeback * 0.3);
        const monthlyRakeback = (amountRakeback * 0.2);

        // Get user affiliate amount
        const amountAffiliate = user.affiliates.referrer !== undefined && user.limits.blockSponsor !== true ? (amountBetTotal * 0.005) : 0;

        // Create database query promises array
        let promises = [];

        // Create payout amount variable
        let amountPayout = 0;
        let outcomeItems = [];

        for(i = 0; i < unboxCount; i++) {
            // Combine nonce, server seed and client seed to one string
            const combined = `${seedDatabase.seedServer}-${seedDatabase.nonce + i}-${seedDatabase.seedClient}`;

            // Sha256 hash combined string
            const hash = crypto.createHash('sha256').update(combined).digest('hex');

            // Get game outcome
            const outcome = parseInt(hash.substr(0, 8), 16) % 100000;

            // Get box item for game outcome
            const outcomeItem = unboxGetOutcomeItem(boxDatabase, outcome);

            // Add payout amount to payout amount variable
            amountPayout = amountPayout + outcomeItem.amountFixed;

            // Add outcome item to outcome items array
            outcomeItems.push(outcomeItem);

            // Add create unbox game query to promises array
            promises.push(
                UnboxGame.create({
                    amount: boxDatabase.amount,
                    payout: outcomeItem.amountFixed,
                    multiplier: Math.floor((outcomeItem.amountFixed / boxDatabase.amount) * 100),
                    outcome: outcome,
                    box: boxDatabase._id,
                    fair: {
                        seed: seedDatabase._id,
                        nonce: (seedDatabase.nonce + i)
                    },
                    user: user._id,
                    state: 'completed'
                })
            );
        }

        // Add update users data, user seed and rain queries to promises array
        promises = [
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: (amountPayout - amountBetTotal),
                    xp: user.limits.blockSponsor !== true ? (amountBetTotal * settings.general.reward.multiplier) : 0,
                    'stats.bet': amountBetTotal,
                    'stats.won': amountPayout,
                    'limits.betToWithdraw': (user.limits.betToWithdraw - amountBetTotal) <= 0 ? -user.limits.betToWithdraw : -amountBetTotal,
                    'limits.betToRain': (user.limits.betToRain - amountBetTotal) <= 0 ? -user.limits.betToRain : -amountBetTotal,
                    'leaderboard.points': leaderboardDatabase !== null && user.limits.blockSponsor !== true && user.limits.blockLeaderboard !== true ? amountBetTotal : 0,
                    'affiliates.generated': amountAffiliate,
                    'rakeback.daily.earned': dailyRakeback,
                    'rakeback.daily.available': dailyRakeback,
                    'rakeback.weekly.earned': weeklyRakeback,
                    'rakeback.weekly.available': weeklyRakeback,
                    'rakeback.monthly.earned': monthlyRakeback,
                    'rakeback.monthly.available': monthlyRakeback
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback ban updatedAt').lean(),
            UserSeed.findByIdAndUpdate(seedDatabase._id, {
                $inc: {
                    nonce: unboxCount
                },
            }, {}),
            Rain.findOneAndUpdate({ type: 'site', $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }, {
                $inc: {
                    amount: (amountBetRain * 0.001)
                }
            }, { new: true }).select('amount participants type state updatedAt').lean(),
            ...promises
        ];

        // Add update users referrer query to promises array
        if(user.affiliates.referrer !== undefined && amountAffiliate > 0) {
            promises.push(
                User.findByIdAndUpdate(user.affiliates.referrer, {
                    $inc: { 
                        'affiliates.earned': amountAffiliate,
                        'affiliates.available': amountAffiliate
                    },
                    updatedAt: new Date().getTime()
                }, {})
            );
        }

        // Execute promise queries in database
        let dataDatabase = await Promise.all(promises);

        // Get created game objects
        let gamesDatabase = dataDatabase.slice(3, 3 + unboxCount);

        // Convert game objects to javascript objects
        gamesDatabase = gamesDatabase.map((game) => game.toObject());

        callback({ success: true, user: { ...dataDatabase[0], balance: (user.balance - amountBetTotal) }, games: gamesDatabase });

        for(const item of outcomeItems) { generalAddDrop(io, {...item, ratio: item.amountFixed / boxDatabase.amount, link: `boxes/${boxDatabase.slug}`}); }

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    unboxGetData,
    unboxGetBoxDataSocket,
    unboxSendBetSocket
}