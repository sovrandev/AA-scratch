const User = require('../../database/models/User');
const mongoose = require('mongoose');

/**
 * Check if a user is registered in the database
 * @param {string} userIdentifier - User ID or username
 * @returns {Promise<boolean>} True if user exists, false otherwise
 */
const userIsRegistered = async (userIdentifier) => {
  try {
    if (!userIdentifier) return false;
    
    let query = {};
    
    // Check if userIdentifier is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(userIdentifier)) {
      query._id = userIdentifier;
    } else {
      // If not an ObjectId, search by username
      query.username = userIdentifier;
    }
    
    // Find user in database
    const user = await User.findOne(query);
    
    // Return true if user exists, false otherwise
    return !!user;
  } catch (error) {
    console.error('Error checking if user is registered:', error);
    return false;
  }
};

module.exports = userIsRegistered; 