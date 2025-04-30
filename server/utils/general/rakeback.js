const validator = require('validator');

const generalCheckSendRakebackClaimUser = (user, type) => {
    const rakebackType = user.rakeback[type];
    if (!rakebackType) {
        throw new Error('Invalid rakeback type specified.');
    }

    if (rakebackType.available < 0.1) {
        throw new Error(`You need a minimum of $0.10 in ${type} rakeback earnings to claim.`);
    }

    const now = Date.now();
    const cooldowns = {
        daily: 24 * 60 * 60 * 1000,    // 24 hours
        weekly: 7 * 24 * 60 * 60 * 1000,  // 7 days
        monthly: 30 * 24 * 60 * 60 * 1000 // 30 days
    };

    if (rakebackType.lastClaim && (now - rakebackType.lastClaim) < cooldowns[type]) {
        const timeLeft = cooldowns[type] - (now - rakebackType.lastClaim);
        const hoursLeft = Math.ceil(timeLeft / (60 * 60 * 1000));
        throw new Error(`You can claim your ${type} rakeback again in ${hoursLeft} hours.`);
    }
}

const generalCheckRakebackBoxClaim = (user, boxId, level) => {
    if (!boxId || typeof boxId !== 'string' || !validator.isMongoId(boxId)) {
        throw new Error('Invalid box ID specified.');
    }

    if (!level || typeof level !== 'number' || !Number.isInteger(level)) {
        throw new Error('Invalid level specified.');
    }

    if (![5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].includes(level)) {
        throw new Error('Invalid level specified.');
    }

    // Calculate user's current level based on XP
    const userLevel = Math.floor(Math.pow(user.xp / 0.8, 1 / 3));

    // Check if user has reached the required level
    if (userLevel < level) {
        throw new Error(`You need to reach level ${level} to claim this box.`);
    }

    // Check if user has already claimed this box in the last 24 hours
    const boxKey = `level${level}`;
    if (user.levelBoxes[boxKey]?.lastClaim) {
        const timeSinceLastClaim = Date.now() - user.levelBoxes[boxKey].lastClaim;
        if (timeSinceLastClaim < 24 * 60 * 60 * 1000) {
            const hoursLeft = Math.ceil((24 * 60 * 60 * 1000 - timeSinceLastClaim) / (60 * 60 * 1000));
            throw new Error(`You can claim this level box again in ${hoursLeft} hours.`);
        }
    }
}

const generalGetUserLevelBoxes = (user) => {
    const userLevel = Math.floor(Math.pow(user.xp / 0.8, 1 / 3));
    const availableLevels = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    
    return availableLevels.map(level => ({
        level,
        available: userLevel >= level,
        lastClaim: user.levelBoxes[`level${level}`]?.lastClaim || null
    }));
}

module.exports = {
    generalCheckSendRakebackClaimUser,
    generalCheckRakebackBoxClaim,
    generalGetUserLevelBoxes
}