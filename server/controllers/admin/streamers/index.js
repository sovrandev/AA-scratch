// Load database models
const User = require('../../../database/models/User');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');

const {
    adminCheckGetStreamersData,
    adminCheckGetStreamerStatsData,
    adminCheckUpdateStreamerStatusData
} = require('../../../utils/admin/streamers');

const adminGetStreamersSocket = async (io, socket, user, data, callback) => {
    try {
        adminCheckGetStreamersData(data);

        const limit = 10;
        const skip = (data.page - 1) * limit;
        const searchRegex = new RegExp(data.search, 'i');

        // Get all users with creator role
        const query = { 
            rank: 'creator',
            $or: [
                { username: { $regex: searchRegex } },
                { 'roblox.id': { $regex: searchRegex } }
            ]
        };

        let sort = {};
        switch (data.sort) {
            case 'username':
                sort = { username: 1 };
                break;
            case 'userCount':
                sort = { 'affiliates.referred': -1 };
                break;
            case 'profit':
                sort = { 'affiliates.earned': -1 };
                break;
            case 'cashouts':
                sort = { 'stats.withdraw': -1 };
                break;
            case 'earnings':
                sort = { 'stats.deposit': -1 };
                break;
            default:
                sort = { username: 1 };
        }

        // Execute database queries
        const [totalCount, streamers] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select('username avatar balance roles stats affiliates createdAt updatedAt')
                .lean()
        ]);

        callback({ 
            success: true, 
            streamers,
            totalCount
        });
    } catch (err) {
        callback({ success: false, error: { message: err.message } });
    }
};

const adminGetStreamerStatsSocket = async (io, socket, user, data, callback) => {
    try {
        adminCheckGetStreamerStatsData(data);

        const streamerId = data.streamerId;

        // Get the streamer
        const streamer = await User.findById(streamerId)
            .select('username avatar balance rank stats affiliates createdAt updatedAt')
            .lean();

        if (!streamer) {
            throw new Error('Streamer not found');
        }

        if (streamer.rank !== 'creator') {
            throw new Error('Streamer is not a creator');
        }

        // Get users who used streamer's referral code
        const referredUsers = await User.find({ 'affiliates.referrer': streamerId })
            .select('username avatar balance stats')
            .lean();

        // Get total deposits and withdrawals from referred users
        const totalDeposits = referredUsers.reduce((sum, user) => sum + (user.stats?.deposit || 0), 0);
        const totalWithdrawals = referredUsers.reduce((sum, user) => sum + (user.stats?.withdraw || 0), 0);

        const stats = {
            userCount: referredUsers.length,
            totalDeposits,
            totalWithdrawals,
            profit: totalDeposits - totalWithdrawals,
            streamerInfo: streamer,
            referredUsers
        };

        callback({ success: true, stats });
    } catch (err) {
        callback({ success: false, error: { message: err.message } });
    }
};

const adminUpdateStreamerStatusSocket = async (io, socket, user, data, callback) => {
    try {
        adminCheckUpdateStreamerStatusData(data);

        const streamerId = data.streamerId;
        const status = data.status;

        // Update the streamer's role status
        const updateOperation = status ? 
            { $set: { rank: 'creator' } } : 
            { $set: { rank: 'user' } };

        // Execute the update
        const updatedStreamer = await User.findByIdAndUpdate(
            streamerId,
            updateOperation,
            { new: true }
        ).select('username avatar rank').lean();

        if (!updatedStreamer) {
            throw new Error('Streamer not found');
        }

        callback({ 
            success: true, 
            streamer: updatedStreamer
        });

        socketRemoveAntiSpam(user._id);
    } catch (err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { message: err.message } });
    }
};

module.exports = {
    adminGetStreamersSocket,
    adminGetStreamerStatsSocket,
    adminUpdateStreamerStatusSocket
}; 