const AdminAction = require('../../../database/models/AdminAction');

/**
 * Log an admin action
 * @param {Object} adminUser - Admin user object
 * @param {String} actionType - Type of action
 * @param {String} resource - Resource type
 * @param {String} targetId - ID of the target resource
 * @param {String} targetUserName - Username of target user (if applicable)
 * @param {Object} details - Additional details about the action
 * @param {String} ipAddress - IP address of the admin
 */
const logAdminAction = async (adminUser, actionType, resource, targetId = null, targetUserName = null, details = {}, ipAddress = null) => {
  try {
    await AdminAction.create({
      adminUser: adminUser._id,
      actionType,
      resource,
      targetId,
      targetUserName,
      details,
      ipAddress
    });
    return true;
  } catch (error) {
    console.error('Error logging admin action:', error);
    return false;
  }
};

/**
 * Get admin action logs
 * @param {Number} page - Page number
 * @param {String} search - Search query
 * @param {Array} filters - Array of filters
 * @param {Date} startDate - Start date for filtering
 * @param {Date} endDate - End date for filtering
 */
const getAdminActions = async (page = 1, search = '', filters = [], startDate = null, endDate = null) => {
  try {
    const limit = 20;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    // Add search if provided
    if (search) {
      query.$or = [
        { targetUserName: { $regex: search, $options: 'i' } },
        { 'details.message': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add filters if provided
    if (filters && filters.length > 0) {
      query.actionType = { $in: filters };
    }
    
    // Add date range if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
    
    // Get total count
    const count = await AdminAction.countDocuments(query);
    
    // Get actions
    const actions = await AdminAction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('adminUser', 'username avatar')
      .lean();
    
    return {
      actions,
      count
    };
  } catch (error) {
    console.error('Error getting admin actions:', error);
    throw error;
  }
};

// Socket handlers
const adminGetActionsSocket = async (io, socket, user, data, callback) => {
  try {
    // Validate data
    if (!data) {
      throw new Error('Invalid request data');
    }

    const limit = 20;
    const page = data.page || 1;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    // Add search if provided
    if (data.search) {
      query.$or = [
        { targetUserName: { $regex: data.search, $options: 'i' } },
        { 'details.message': { $regex: data.search, $options: 'i' } }
      ];
    }
    
    // Add filters if provided
    if (data.filters && data.filters.length > 0) {
      query.actionType = { $in: data.filters };
    }
    
    // Add date range if provided
    if (data.startDate || data.endDate) {
      query.createdAt = {};
      if (data.startDate) {
        query.createdAt.$gte = new Date(data.startDate);
      }
      if (data.endDate) {
        query.createdAt.$lte = new Date(data.endDate);
      }
    }
    
    // Get total count
    const count = await AdminAction.countDocuments(query);
    
    // Get actions
    const actions = await AdminAction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('adminUser', 'username avatar')
      .lean();
    
    callback({
      success: true,
      actions,
      count
    });

  } catch (error) {
    callback({ success: false, error: { message: error.message } });
  }
};

module.exports = {
  logAdminAction,
  getAdminActions,
  adminGetActionsSocket
}; 