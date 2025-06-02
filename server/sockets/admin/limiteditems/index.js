const User = require('../../../database/models/User');
const LimitedItem = require('../../../database/models/LimitedItem');
const { validateAdmin } = require('../../../middleware/auth');
const {
    rateLimiter
} = require('../../../middleware/rateLimiter');
const {
    socketCheckUserData,
    socketCheckUserRank,
    socketCheckAntiSpam,
    socketRemoveAntiSpam
} = require('../../../utils/socket');

module.exports = (io, socket) => {
  socket.on('getLimitedItems', async(data, callback) => {
    if(callback === undefined || typeof callback !== 'function') { return; }
    try {
      const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
      await rateLimiter.consume(identifier);
      try {
        let user = null;
        if(socket.decoded !== undefined && socket.decoded !== null) { 
          user = await User.findById(socket.decoded._id).select('username avatar rank mute ban'); 
        }
        socketCheckUserData(user, true);
        socketCheckUserRank(user, ['admin']);

        const page = parseInt(data.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        
        const query = {};
        if (data.search) {
          query.name = new RegExp(data.search, 'i');
        }

        const [items, total] = await Promise.all([
          LimitedItem.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
          LimitedItem.countDocuments(query)
        ]);

        callback({
          success: true,
          items,
          total,
          pages: Math.ceil(total / limit)
        });
      } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
      }
    } catch(err) {
      callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
    }
  });

  socket.on('sendLimitedItemCreate', async(data, callback) => {
    if(callback === undefined || typeof callback !== 'function') { return; }
    try {
      const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
      await rateLimiter.consume(identifier);
      await socketCheckAntiSpam(socket.decoded._id);
      try {
        let user = null;
        if(socket.decoded !== undefined && socket.decoded !== null) { 
          user = await User.findById(socket.decoded._id).select('username avatar rank mute ban'); 
        }
        socketCheckUserData(user, true);
        socketCheckUserRank(user, ['admin']);

        const { name, price, imageUrl } = data;
        
        if (!name || !price || !imageUrl) {
          throw new Error('Missing required fields');
        }

        const limitedItem = new LimitedItem({
          name,
          price: Number(price),
          image: imageUrl,
          accepted: true,
          amount: Number(price),
          amountFixed: Number(price)
        });

        await limitedItem.save();

        socketRemoveAntiSpam(socket.decoded._id);
        callback({
          success: true,
          item: limitedItem.toObject()
        });
      } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
      }
    } catch(err) {
      callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
    }
  });

  socket.on('sendLimitedItemUpdate', async(data, callback) => {
    if(callback === undefined || typeof callback !== 'function') { return; }
    try {
      const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
      await rateLimiter.consume(identifier);
      await socketCheckAntiSpam(socket.decoded._id);
      try {
        let user = null;
        if(socket.decoded !== undefined && socket.decoded !== null) { 
          user = await User.findById(socket.decoded._id).select('username avatar rank mute ban'); 
        }
        socketCheckUserData(user, true);
        socketCheckUserRank(user, ['admin']);

        const { itemId, name, price, imageUrl } = data;
        
        if (!itemId) {
          throw new Error('Item ID is required');
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (price) updateData.amountFixed = Number(price);
        if (imageUrl) updateData.image = imageUrl;

        const item = await LimitedItem.findByIdAndUpdate(
          itemId,
          updateData,
          { new: true, lean: true }
        );

        if (!item) {
          throw new Error('Limited item not found');
        }
        
        socketRemoveAntiSpam(socket.decoded._id);
        callback({
          success: true,
          item
        });
      } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
      }
    } catch(err) {
      callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
    }
  });

  socket.on('sendLimitedItemRemove', async(data, callback) => {
    if(callback === undefined || typeof callback !== 'function') { return; }
    try {
      const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
      await rateLimiter.consume(identifier);
      await socketCheckAntiSpam(socket.decoded._id);
      try {
        let user = null;
        if(socket.decoded !== undefined && socket.decoded !== null) { 
          user = await User.findById(socket.decoded._id).select('username avatar rank mute ban'); 
        }
        socketCheckUserData(user, true);
        socketCheckUserRank(user, ['admin']);

        const { itemId } = data;
        
        if (!itemId) {
          throw new Error('Item ID is required');
        }

        const item = await LimitedItem.findByIdAndDelete(itemId);

        if (!item) {
          throw new Error('Limited item not found');
        }

        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: true });
      } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
      }
    } catch(err) {
      callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
    }
  });
}; 