// Load database models
const User = require('../../../database/models/User');

// Load middleware
const {
    rateLimiter
} = require('../../../middleware/rateLimiter');

// Load utils
const {
    socketCheckUserData,
    socketCheckUserRank,
    socketCheckAntiSpam,
    socketRemoveAntiSpam
} = require('../../../utils/socket');

// Load controllers
const {
    adminGetWalletBalancesSocket,
    adminUpdateWalletAddressSocket,
    adminSyncWalletBalancesSocket
} = require('../../../controllers/admin/wallet');

module.exports = (io, socket) => {

    socket.on('getWalletBalances', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        try {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            await rateLimiter.consume(identifier);
            try {
                let user = null;
                if(socket.decoded !== undefined && socket.decoded !== null) { user = await User.findById(socket.decoded._id).select('username avatar rank mute ban'); }
                socketCheckUserData(user, true);
                socketCheckUserRank(user, ['admin']);
                adminGetWalletBalancesSocket(io, socket, user, data, callback);
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message } });
            }
        } catch(err) {
            callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
        }
    });

    socket.on('updateWalletAddress', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('username avatar rank mute ban').lean();
                    socketCheckUserData(user, true);
                    socketCheckUserRank(user, ['admin']);
                    adminUpdateWalletAddressSocket(io, socket, user, data, callback);
                } catch(err) {
                    socketRemoveAntiSpam(socket.decoded._id);
                    callback({ success: false, error: { type: 'error', message: err.message } });
                }
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
            }
        } else { callback({ success: false, error: { type: 'error', message: 'You need to sign in to perform this action.' } }); }
    });

    socket.on('syncWalletBalances', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('username avatar rank mute ban').lean();
                    socketCheckUserData(user, true);
                    socketCheckUserRank(user, ['admin']);
                    adminSyncWalletBalancesSocket(io, socket, user, data, callback);
                } catch(err) {
                    socketRemoveAntiSpam(socket.decoded._id);
                    callback({ success: false, error: { type: 'error', message: err.message } });
                }
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
            }
        } else { callback({ success: false, error: { type: 'error', message: 'You need to sign in to perform this action.' } }); }
    });

} 