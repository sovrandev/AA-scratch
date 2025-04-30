const validator = require('validator');
const fetch = require('node-fetch');

const generalCheckGetUserInfoData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong! Please try again in a few seconds.');
    } else if(data.userId === undefined || typeof data.userId !== 'string' || validator.isMongoId(data.userId) !== true) {
        throw new Error('Your entered user id is invalid.');
    }
}

const generalCheckGetUserInfoUser = (userDatabase) => {
    if(userDatabase === null) {
        throw new Error('Your requested user was not found.');
    }
}

const generalCheckGetUserBetsData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.page === undefined || isNaN(data.page) === true || data.page <= 0) {
        throw new Error('Your entered page is invalid.');
    }
}

const generalCheckGetUserTransactionsData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.page === undefined || isNaN(data.page) === true || data.page <= 0) {
        throw new Error('Your entered page is invalid.');
    }
}

const generalCheckSendUserAnonymousData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong! Please try again in a few seconds.');
    } else if(data.anonymous === undefined || typeof data.anonymous !== 'boolean') {
        throw new Error('Your entered anonymous value is invalid.');
    }
}

const generalCheckSendUserDiscordData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong! Please try again in a few seconds.');
    } else if(data.method === undefined || typeof data.method !== 'string' || ['link', 'unlink'].includes(data.method) === false) {
        throw new Error('Your entered method value is invalid.');
    } else if(data.method === 'link' && (data.tokenDiscord === undefined || data.tokenDiscord === null || typeof data.tokenDiscord !== 'string')) {
        throw new Error('Your entered discord token is invalid.');
    }
}

const generalCheckSendUserDiscordUser = (data, user) => {
    if(data === undefined || user === undefined) {
        throw new Error('Something went wrong! Please try again in a few seconds.');
    } else if(data.method === 'link' && user.discordId !== undefined) {
        throw new Error('You have already linked a discord account.');
    } else if(data.method === 'unlink' && user.discordId === undefined) {
        throw new Error('You dont have a linked discord account at the moment.');
    }
}

const generalCheckSendUserSeedData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong! Please try again in a few seconds.');
    } else if(data.seedClient === undefined || typeof data.seedClient !== 'string' || data.seedClient.trim().length <= 0 || data.seedClient.trim().length > 64) {
        throw new Error('Your entered client seed is invalid.');
    }
} 

const generalCheckSendUserSeedGames = (gamesDatabase) => {
    if(gamesDatabase.length >= 1) {
        throw new Error('You’ve to complete all your open games first.');
    }
}

const generalCheckSendUserTipData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong! Please try again in a few seconds.');
    } else if(data.receiverId === undefined || typeof data.receiverId !== 'string' || validator.isMongoId(data.receiverId) !== true) {
        throw new Error('Your entered receiver id is invalid.');
    } else if(data.amount === undefined || isNaN(data.amount) === true || (data.amount) < 10) {
         throw new Error('Your entered tip amount is invalid.');
    }
}

const generalCheckSendUserTipUser = (data, user) => {
    if(user.balance < (data.amount)) {
        throw new Error('You have not enough balance for this action.');
    } else if(user.stats.deposit < (50)) {
        throw new Error('You need to have a total of $50 deposited.');
    } else if(user.limits.blockTip === true && user.limits.limitTip === 0) {
        throw new Error('You are not allowed to tip users.');
    } else if(user.limits.blockTip === true && user.limits.limitTip < (data.amount)) {
        throw new Error(`You are not allowed to tip users more then $${(user.limits.limitTip).toFixed(2)}.`);
    }
}

const generalCheckSendUserTipReceiver = (user, receiverDatabase) => {
    if(receiverDatabase === null) {
        throw new Error('Your entered receiver id is not available.');
    } else if(user._id.toString() === receiverDatabase._id.toString()) {
        throw new Error('You are not allowed to tip yourself.');
    }
}

const generalUserGetLevel = (user) => {
    const level = Math.floor(Math.pow(user.xp / 0.8, 1 / 3));
    return level >= 100 ? 100 : level;
}

const generalUserGetRakeback = (user) => {
    if(generalUserGetLevel(user) >= 10 && generalUserGetLevel(user) < 20) { rakeback = { name: 'bronze I', percentage: 0.0025 } }
    else if(generalUserGetLevel(user) >= 20 && generalUserGetLevel(user) < 30) { rakeback = { name: 'bronze II', percentage: 0.005 } }
    else if(generalUserGetLevel(user) >= 30 && generalUserGetLevel(user) < 40) { rakeback = { name: 'bronze III', percentage: 0.0075 } }
    else if(generalUserGetLevel(user) >= 40 && generalUserGetLevel(user) < 50) { rakeback = { name: 'silver I', percentage: 0.01 } }
    else if(generalUserGetLevel(user) >= 50 && generalUserGetLevel(user) < 60) { rakeback = { name: 'silver II', percentage: 0.0125} }
    else if(generalUserGetLevel(user) >= 60 && generalUserGetLevel(user) < 70) { rakeback = { name: 'silver III', percentage: 0.015 } }
    else if(generalUserGetLevel(user) >= 70 && generalUserGetLevel(user) < 80) { rakeback = { name: 'gold I', percentage: 0.0175 } }
    else if(generalUserGetLevel(user) >= 80 && generalUserGetLevel(user) < 90) { rakeback = { name: 'gold II', percentage: 0.02 } }
    else if(generalUserGetLevel(user) >= 90 && generalUserGetLevel(user) < 100) { rakeback = { name: 'gold III', percentage: 0.0225} }
    else if(generalUserGetLevel(user) == 100) { rakeback = { name: 'diamond', percentage: 0.025 } }

    return rakeback;
}

const userGetDiscordUserData = (discordToken) => {
    return new Promise(async(resolve, reject) => {
        try {
            let response = await fetch('https://discord.com/api/v9/users/@me', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${discordToken}` }
            });

            // Validate response object
            if(response !== undefined && response !== null && response.status === 200) {
                response = await response.json();
                resolve(response);
            } else { reject(new Error('We are not able to fetch your discord user data at the moment. Please try again later.')); }
        } catch(err) {
            reject(new Error('Something went wrong. Please try again in a few seconds.'));
        }
    });
}

const generalUserGetFormated = (user) => {
    // Get user level
    const level = generalUserGetLevel(user);

    // Get user rakeback
    const rakeback = generalUserGetRakeback(user);

    // Create new sanitized user object
    let sanitized = user.anonymous === true ? null : {
        _id: user._id,
        roblox: user.roblox,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        rank: user.rank,
        affiliates: user.affiliates,
        level: level,
        stats: user.stats,
        createdAt: user.createdAt
    };

    return sanitized;
}

const generalSanitizeBets = (bets) => {
    let sanitized = [];

    for(let bet of bets) {
        if(['mines', 'towers', 'unbox'].includes(bet.method) === true) {
            bet.fair.seed = {
                seedClient: bet.fair.seed.seedClient,
                hash: bet.fair.seed.hash,
                ...(bet.fair.seed.state === 'completed' ? { seedServer: bet.fair.seed.seedServer } : {})
            };
        } else if(['crash', 'roll'].includes(bet.method) === true) {
            bet.game.fair.seed = {
                ...bet.game.fair.seed,
                seedServer: bet.game.state === 'completed' ? bet.game.fair.seed.seedServer : undefined
            };
        }

        sanitized.push(bet);
    }

    return sanitized;
}

const generalSanitizeUserSeed = (seedDatabase) => {
    let sanitized = JSON.parse(JSON.stringify(seedDatabase));

    if(sanitized.state !== 'completed') {
        delete sanitized._id;
        delete sanitized.seedServer;
        delete sanitized.user;
        delete sanitized.state;
    }

    return sanitized;
}

const generalCheckUserUpdateUsernameData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong! Please try again in a few seconds.');
    } else if(data.username === undefined || typeof data.username !== 'string' || data.username.trim().length < 3 || data.username.trim().length > 16) {
        throw new Error('Username must be between 3 and 16 characters.');
    }
}

const generalCheckUserUpdateAvatarData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong! Please try again in a few seconds.');
    } else if(data.avatar === undefined || typeof data.avatar !== 'string' || !data.avatar.startsWith('http')) {
        throw new Error('Please provide a valid avatar URL.');
    }
}

module.exports = {
    generalCheckGetUserInfoData,
    generalCheckGetUserInfoUser,
    generalCheckGetUserBetsData,
    generalCheckGetUserTransactionsData,
    generalCheckSendUserAnonymousData,
    generalCheckSendUserDiscordData,
    generalCheckSendUserDiscordUser,
    generalCheckSendUserSeedData,
    generalCheckSendUserSeedGames,
    generalCheckSendUserTipData,
    generalCheckSendUserTipUser,
    generalCheckSendUserTipReceiver,
    generalUserGetLevel,
    generalUserGetRakeback,
    userGetDiscordUserData,
    generalUserGetFormated,
    generalSanitizeBets,
    generalSanitizeUserSeed,
    generalCheckUserUpdateUsernameData,
    generalCheckUserUpdateAvatarData,
};
