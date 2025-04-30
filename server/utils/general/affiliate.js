const validator = require('validator');

const generalCheckSendAffiliateCodeData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong! Please try again in a few seconds.');
    } else if(data.code === undefined || data.code === null || typeof data.code !== 'string' || data.code.trim() === '' || data.code.length < 2 || data.code.length > 20 || validator.isAlphanumeric(data.code, 'en-US', { ignore: '-_' }) !== true) {
        throw new Error('Your entered affiliate code is invalid.');
    }
}

const generalCheckSendAffiliateCodeCode = (checkCode) => {
    if(checkCode !== undefined && checkCode !== null) {
        throw new Error('You’ve entered an affiliate code that is already used by another user.');
    }
}

const generalCheckSendAffiliateClaimCodeData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong! Please try again in a few seconds.');
    } else if(data.code === undefined || data.code === null || typeof data.code !== 'string' || data.code.trim() === '' || data.code.length < 2 || data.code.length > 20 || validator.isAlphanumeric(data.code, 'en-US', { ignore: '-_' }) !== true) {
        throw new Error('Your entered affiliate code is invalid.');
    }
}

const generalCheckSendAffiliateClaimCodeUser = (user, addressDatabase) => {
    if(user === undefined || user === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(user.affiliates.referredAddress !== undefined || addressDatabase !== null) {
        throw new Error('You have already redeemed a affiliate code.');
    } 
}

const generalCheckSendAffiliateClaimCodeCode = (user, codeDatabase) => {
    if(codeDatabase === null) {
        throw new Error('Your provided affiliate code is invalid.');
    } else if(user._id.toString() === codeDatabase._id.toString()) {
        throw new Error('You are not allowed to redeem your own affiliate code.');
    }
}

const generalCheckSendAffiliateClaimEarningsUser = (user) => {
    if(user === undefined) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(user.affiliates.available < (process.env.AFFILIATE_MIN_CLAIM)) {
        throw new Error(`You’ll need a minimum of $${process.env.AFFILIATE_MIN_CLAIM} in earnings to claim.`);
    }
}

module.exports = {
    generalCheckSendAffiliateCodeData,
    generalCheckSendAffiliateCodeCode,
    generalCheckSendAffiliateClaimCodeData,
    generalCheckSendAffiliateClaimCodeUser,
    generalCheckSendAffiliateClaimCodeCode,
    generalCheckSendAffiliateClaimEarningsUser
}
