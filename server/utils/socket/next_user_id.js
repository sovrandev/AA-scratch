const User = require('../../database/models/User');

/**
 * Get the next available user ID from MongoDB
 * This function finds the highest current user ID and increments it by 1
 * @returns {Promise<number>} The next available user ID
 */
const getNextUserId = async () => {
  try {
    // Find the user with the highest current user ID
    // Sort by userId in descending order and get the first document
    const highestUserDoc = await User.findOne()
      .sort({ userId: -1 })
      .select('userId')
      .lean();
    
    // If no users exist yet, start with ID 1
    if (!highestUserDoc || !highestUserDoc.userId) {
      return 1;
    }
    
    // Increment the highest ID by 1
    return highestUserDoc.userId + 1;
  } catch (error) {
    console.error('Error getting next user ID:', error);
    // If there was an error, return a fallback ID that's very high
    // This is to prevent collision in case of errors
    return Math.floor(Date.now() / 1000);
  }
};

module.exports = getNextUserId; 