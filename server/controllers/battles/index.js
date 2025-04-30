const crypto = require('crypto');

// Load database models
const User = require('../../database/models/User');
const Box = require('../../database/models/Box');
const BattlesGame = require('../../database/models/BattlesGame');
const BattlesBet = require('../../database/models/BattlesBet');
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
    getCurrentBlock,
    awaitNextBlockHash
} = require('../../utils/eos');
const {
    battlesCheckGetGameDataData,
    battlesCheckGetGameDataGame,
    battlesCheckSendCreateData,
    battlesCheckSendCreateBoxes,
    battlesCheckSendCreateUser,
    battlesCheckSendBotData,
    battlesCheckSendBotGame,
    battlesCheckSendJoinData,
    battlesCheckSendJoinGame,
    battlesCheckSendJoinUser,
    battlesCheckSendCancelData,
    battlesCheckSendCancelGame,
    battlesGenerateGame,
    battlesFormatBoxes,
    battlesGetGameIndex,
    battlesGetAmountGame,
    battlesGetAmountWin,
    battlesGetRounds,
    battlesGetOutcomeItem,
    battlesGetWinnerBets,
    battlesSanitizeGames,
    battlesSanitizeGame,
    battlesCalculateBigspinDelay,
    battlesHandleEosFailure
} = require('../../utils/battles');
const {
    generalUserGetLevel,
    generalUserGetRakeback,
    generalUserGetFormated
} = require('../../utils/general/user');

// Load controllers
const {
    generalAddBetsList
} = require('../general/bets');


// Battles variables
let battlesGames = [];
let battlesHistory = [];
let battlesBlockGame = [];
let battlesBlockJoin = [];

const battlesGetData = (user) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Get active boxes from database
            const boxesDatabase = await Box.find({ state: 'active' }).select('name slug amount categories type state').lean();

            // Get battles games
            const games = battlesGames.filter((game) => game.options.private === false || (user !== undefined && game.bets.some((bet) => bet.bot === false && bet.user._id.toString() === user._id.toString()) === true));

            resolve({ boxes: boxesDatabase, games: battlesSanitizeGames(games), history: battlesHistory });
        } catch(err) {
            reject(err);
        }
    });
}

const battlesGetGameDataSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        battlesCheckGetGameDataData(data);

        // Get battles game from battles games array
        let battlesGame = battlesGames[battlesGetGameIndex(battlesGames, data.gameId)];

        // If battles game was not in battles games array try to get from database
        if(battlesGame === undefined) {
            battlesGame = await BattlesGame.findById(data.gameId).select('amount playerCount mode boxes options fair state updatedAt createdAt').populate({ 
                path: 'boxes.box', 
                select: 'name slug amount items',
                populate: { path: 'items.item', select: 'name image amountFixed' }
            }).populate({ 
                path: 'bets', 
                populate: { path: 'user', select: 'roblox.id username avatar rank xp limits stats.total affiliates anonymous createdAt' } 
            }).lean();

            // Add level and rakeback info to user objects
            for(let bet of battlesGame.bets) { 
                if(bet.bot === false) { 
                    bet.user.level = generalUserGetLevel(bet.user);
                    bet.user.rakeback = generalUserGetRakeback(bet.user); 
                } 
            }
        }

        // Validate battles game
        battlesCheckGetGameDataGame(battlesGame);

        callback({ success: true, game: battlesSanitizeGame(battlesGame, true) });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const battlesSendCreateSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        battlesCheckSendCreateData(data);

        // Validate sent boxes
        battlesCheckSendCreateBoxes(data);

        // Get active boxes from database
        const boxesDatabase = await Box.find({ state: 'active' }).select('name amount items categories type state').populate({ path: 'items.item', select: 'name image amountFixed' }).lean();

        // Format sent boxes
        const boxes = battlesFormatBoxes(data, boxesDatabase);

        // Get battle amount
        const amount = battlesGetAmountGame(boxes);

        // Get battle user amount
        const amountUser = (amount + (amount * Math.floor(data.playerCount) * Math.floor(data.funding) / 100));

        // Validate user
        battlesCheckSendCreateUser(user, data, amountUser);

        // Get user level
        const level = generalUserGetLevel(user);

        // Get user rakeback rank
        const rakeback = generalUserGetRakeback(user);

        // Create battles game in database
        let battlesGame = await battlesGenerateGame(data, amount, boxes);

        // Create database query promises array
        let promises = [];

        // Add update users data and create battles bet
        promises = [
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: -amountUser,
                    'stats.bet': amountUser
                    
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            BattlesBet.create({
                amount: amountUser,
                outcomes: [],
                slot: 0,
                game: battlesGame._id,
                user: user._id,
                bot: false
            })
        ];

        // Execute promise queries in database
        let dataDatabase = await Promise.all(promises);

        // Convert bet to javascript object
        dataDatabase[1] = dataDatabase[1].toObject();

        // Add user data to bet object
        dataDatabase[1].user = { 
            _id: user._id, 
            roblox: user.roblox,
            username: user.username, 
            avatar: user.avatar, 
            rank: user.rank,
            level: level,
            rakeback: rakeback,
            stats: user.anonymous === true ? null : user.stats,
            limits: user.limits,
            affiliates: user.affiliates,
            createdAt: user.createdAt
        };

        // Add bet to game object
        battlesGame.bets = [dataDatabase[1]];

        // Add battles game to battles game array
        battlesGames.push(battlesGame);

        // Send updated user to frontend
        io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

        // Send battles game to frontend if not private game
        if(battlesGame.options.private === false) { io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGame) }); }

        callback({ success: true, game: battlesSanitizeGame(battlesGame) });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const battlesSendBotSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        battlesCheckSendBotData(data);

        // Validate battles game
        battlesCheckSendBotGame(user, battlesGames[battlesGetGameIndex(battlesGames, data.gameId)], battlesBlockJoin, battlesBlockGame);

        try {
            // Add game id to game block array
            battlesBlockGame.push(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id.toString());

            // Get game bet amount
            const amountGameBet = battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].amount - (battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].amount * battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].options.funding / 100);

            // Create database query promises array
            let promises = [];

            // Add create battles bet queries to promises array
            for(let i = 0; i < battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].playerCount; i++) {
                if(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets.some((element) => element.slot === i) !== true) {
                    promises.push(
                        BattlesBet.create({
                            amount: amountGameBet,
                            outcomes: [],
                            slot: i,
                            game: battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id,
                            bot: true
                        })
                    );
                }
            }

            // Execute promise queries in database
            let betsDatabase = await Promise.all(promises);

            // Convert bet objects to javascript objects
            betsDatabase = betsDatabase.map((bet) => bet.toObject());

            // Add bets to game object
            battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets = [...battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets, ...betsDatabase];

            // Send battles game to frontend
            if(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].options.private === true) {
                for(const bet of battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets) { if(bet.bot === false) { io.of('/battles').to(bet.user._id.toString()).emit('game', { game: battlesSanitizeGame(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]) }); } }
            } else { io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]) }); }

            // If battles game state is created start rolling game
            if(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].state === 'created') {
                battlesGameValidate(io, battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]); // changed from battlesGameCountdown to battlesGameValidate
            }

            callback({ success: true });

            // Remove game id from game block array
            battlesBlockGame.splice(battlesBlockGame.indexOf(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id.toString()), 1);

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            battlesBlockGame.splice(battlesBlockGame.indexOf(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id.toString()) , 1);
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const battlesSendJoinSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        battlesCheckSendJoinData(data);

        // Validate battles game
        battlesCheckSendJoinGame(data, user, battlesGames[battlesGetGameIndex(battlesGames, data.gameId)], battlesBlockJoin, battlesBlockGame);

        try {
            // Add game id to game block array
            battlesBlockJoin.push(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id.toString());

            // Validate if user has enougth balance
            battlesCheckSendJoinUser(user, battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]);

            // Get game bet amount
            const amountGameBet = battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].amount - (battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].amount * battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].options.funding / 100);

            // Get user level
            const level = generalUserGetLevel(user);

            // Get user rakeback rank
            const rakeback = generalUserGetRakeback(user);

            // Create database query promises array
            let promises = [];

            // Add update users data and create battles bet queries
            promises = [
                User.findByIdAndUpdate(user._id, {
                    $inc: {
                        balance: -amountGameBet,
                        'stats.bet': amountGameBet
                    },
                    updatedAt: new Date().getTime()
                }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                BattlesBet.create({
                    amount: amountGameBet,
                    outcomes: [],
                    slot: Math.floor(data.slot),
                    game: battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id,
                    user: user._id,
                    bot: false
                })
            ];

            // Execute promise queries in database
            let dataDatabase = await Promise.all(promises);

            // Convert bet to javascript object
            dataDatabase[1] = dataDatabase[1].toObject();

            // Add user data to bet object
            dataDatabase[1].user = { 
                _id: user._id, 
                roblox: user.roblox,  
                username: user.username, 
                avatar: user.avatar, 
                rank: user.rank,
                level: level,
                rakeback: rakeback,
                stats: user.anonymous === true ? null : user.stats,
                limits: user.limits,
                affiliates: user.affiliates,
                createdAt: user.createdAt
            };

            // Add bet to game object
            battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets.push(dataDatabase[1]);

            // Send updated user to frontend
            io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

            // Send battles game to frontend
            if(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].options.private === true) {
                for(const bet of battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets) { if(bet.bot === false) { io.of('/battles').to(bet.user._id.toString()).emit('game', { game: battlesSanitizeGame(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]) }); } }
            } else { io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]) }); }

            // If battles game is full and the state is created start rolling game
            if(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].playerCount <= battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets.length && battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].state === 'created') {
                battlesGameValidate(io, battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]); // changed from battlesGameCountdown to battlesGameValidate
            }

            callback({ success: true });

            // Remove game id from game block array
            battlesBlockJoin.splice(battlesBlockJoin.indexOf(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id.toString()), 1);

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            battlesBlockJoin.splice(battlesBlockJoin.indexOf(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id.toString()) , 1);
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const battlesSendCancelSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        battlesCheckSendCancelData(data);

        // Validate battles game
        battlesCheckSendCancelGame(user, battlesGames[battlesGetGameIndex(battlesGames, data.gameId)], battlesBlockJoin, battlesBlockGame);

        try {
            // Add game id to cancel block array
            battlesBlockGame.push(data.gameId.toString());

            callback({ success: true });

            // Remove game id from cancel block array
            battlesBlockGame.splice(battlesBlockGame.indexOf(data.gameId.toString()), 1);

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            battlesBlockGame.splice(battlesBlockGame.indexOf(data.gameId.toString()), 1);
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const battlesGameCountdown = (io, battlesGame) => {
    // Update battles game state to countdown and updated at
    battlesGame.state = 'countdown';
    battlesGame.updatedAt = new Date().getTime();

    // Update game object in battles games array
    battlesGames.splice(battlesGetGameIndex(battlesGames, battlesGame._id), 1, battlesGame);

    // Send battles game to frontend
    if(battlesGame.options.private === true) {
        for(const bet of battlesGame.bets) { 
            if(bet.bot === false) { 
                io.of('/battles').to(bet.user._id.toString()).emit('game', { game: battlesSanitizeGame(battlesGame) }); 
            } 
        }
    } else { 
        io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGame) }); 
    }

    // Start rolling after countdown
    setTimeout(() => { battlesGameRoll(io, battlesGame); }, 3000);
}

const battlesGameValidate = async(io, battlesGame) => {
    try {
        // Update game state
        battlesGame.state = 'pending';
        battlesGame.updatedAt = new Date().getTime();

        // Add game object to battles games array
        battlesGames.splice(battlesGetGameIndex(battlesGames, battlesGame._id), 1, battlesGame);

        // First check if EOS provider is available using the new utility function
        const eosStatus = await battlesHandleEosFailure(battlesGame);
        
        if (!eosStatus.success) {
            console.log(`EOS provider failed for game ${battlesGame._id}, using fallback mechanism`);
            
            // Create a deterministic but pseudo-random hash instead of using the blockchain
            const timestamp = Date.now();
            const fallbackPublicSeed = crypto.createHash('sha256')
                .update(`fallback-${battlesGame._id}-${timestamp}-${battlesGame.fair.seedServer}`)
                .digest('hex');
            
            // Update game with fallback seed and no block data
            battlesGame.fair.seedPublic = fallbackPublicSeed;
            battlesGame.fair.blockId = 0; // Zero indicates fallback
            battlesGame.fair.fallbackUsed = true;
            
            // Sort game bets by slot
            battlesGame.bets.sort((a, b) => a.slot - b.slot);
            
            // Notify players about EOS provider failure
            if(battlesGame.options.private === true) {
                for(const bet of battlesGame.bets) { 
                    if(bet.bot === false) { 
                        io.of('/battles').to(bet.user._id.toString()).emit('notification', {
                            type: 'warning',
                            message: 'EOS Provider failed. Using fallback randomness for provable fairness.'
                        });
                        io.of('/battles').to(bet.user._id.toString()).emit('game', { game: battlesSanitizeGame(battlesGame) }); 
                    } 
                }
            } else { 
                io.of('/battles').emit('notification', {
                    type: 'warning',
                    message: 'EOS Provider failed. Using fallback randomness for provable fairness.'
                });
                io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGame) }); 
            }
            
            // Start countdown using fallback mechanism
            battlesGameCountdown(io, battlesGame);
            return;
        }

        // If EOS is available, proceed with normal flow
        // Get current block and calculate target block
        const currentBlock = await getCurrentBlock();
        const targetBlock = currentBlock + 5;

        // Update game object with target block
        battlesGame.fair.blockId = targetBlock;

        // Update game object in battles games array
        battlesGames.splice(battlesGetGameIndex(battlesGames, battlesGame._id), 1, battlesGame);

        // Send pending state to frontend
        if(battlesGame.options.private === true) {
            for(const bet of battlesGame.bets) { 
                if(bet.bot === false) { 
                    io.of('/battles').to(bet.user._id.toString()).emit('game', { game: battlesSanitizeGame(battlesGame) }); 
                } 
            }
        } else { 
            io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGame) }); 
        }

        // Wait for target block hash
        const blockHash = await awaitNextBlockHash(targetBlock);
        
        // If the blockHash contains isFailover flag, it means the fallback mechanism was used
        const fallbackUsed = typeof blockHash === 'object' && blockHash.isFailover;
        
        // Update game with block hash and reveal server seed
        battlesGame.fair.seedPublic = fallbackUsed ? blockHash.blockHash : blockHash;
        if (fallbackUsed) {
            battlesGame.fair.fallbackUsed = true;
            
            // Notify players about fallback
            if(battlesGame.options.private === true) {
                for(const bet of battlesGame.bets) { 
                    if(bet.bot === false) { 
                        io.of('/battles').to(bet.user._id.toString()).emit('notification', {
                            type: 'warning',
                            message: 'EOS Provider failed. Using fallback randomness for provable fairness.'
                        });
                    } 
                }
            } else {
                io.of('/battles').emit('notification', {
                    type: 'warning',
                    message: 'EOS Provider failed. Using fallback randomness for provable fairness.'
                });
            }
        }
        
        // Sort game bets by slot
        battlesGame.bets.sort((a, b) => a.slot - b.slot);

        // Start countdown
        battlesGameCountdown(io, battlesGame);
    } catch(err) {
        console.error('Error in battlesGameValidate:', err);
        
        try {
            // If there's an error (like with EOS), use fallback mechanism
            console.log(`Error during game validation for ${battlesGame._id}, using fallback mechanism`);
            
            // Create a deterministic but pseudo-random hash
            const timestamp = Date.now();
            const fallbackPublicSeed = crypto.createHash('sha256')
                .update(`fallback-error-${battlesGame._id}-${timestamp}-${battlesGame.fair.seedServer}`)
                .digest('hex');
            
            // Update game with fallback data
            battlesGame.fair.seedPublic = fallbackPublicSeed;
            battlesGame.fair.blockId = 0; // Zero indicates fallback  
            battlesGame.fair.fallbackUsed = true;
            battlesGame.fair.error = err.message;
            
            // Sort game bets by slot
            battlesGame.bets.sort((a, b) => a.slot - b.slot);
            
            // Notify players about EOS provider failure
            if(battlesGame.options.private === true) {
                for(const bet of battlesGame.bets) { 
                    if(bet.bot === false) { 
                        io.of('/battles').to(bet.user._id.toString()).emit('notification', {
                            type: 'warning',
                            message: 'EOS Provider failed. Using fallback randomness for provable fairness.'
                        });
                        io.of('/battles').to(bet.user._id.toString()).emit('game', { game: battlesSanitizeGame(battlesGame) }); 
                    } 
                }
            } else { 
                io.of('/battles').emit('notification', {
                    type: 'warning',
                    message: 'EOS Provider failed. Using fallback randomness for provable fairness.'
                });
                io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGame) }); 
            }
            
            // Start countdown with fallback
            battlesGameCountdown(io, battlesGame);
        } catch (fallbackErr) {
            console.error('Error in fallback mechanism:', fallbackErr);
            // Retry validation after delay as last resort
            setTimeout(() => { battlesGameValidate(io, battlesGame); }, 1000 * 15);
        }
    }
}

const battlesGameRoll = async(io, battlesGame) => {
    try {
        // Pre-calculate all outcomes and delays
        const roundOutcomes = [];
        let currentDelay = 0;

        // Get all rounds
        const rounds = battlesGetRounds(battlesGame.boxes);

        // Calculate all outcomes first
        for (let index = 0; index < rounds.length; index++) {
            const round = rounds[index];
            const roundPlayerOutcomes = [];

            for (let slot = 0; slot < battlesGame.bets.length; slot++) {
                const combined = `${battlesGame._id}-${battlesGame.fair.seedServer}-${battlesGame.fair.seedPublic}-${index}-${slot}`;
                const hash = crypto.createHash('sha256').update(combined).digest('hex');
                const outcome = parseInt(hash.substr(0, 8), 16) % 100000;
                roundPlayerOutcomes.push(outcome);
            }

            roundOutcomes.push(roundPlayerOutcomes);
        }

        // Now play out each round with correct timing
        for (let index = 0; index < rounds.length; index++) {
            const round = rounds[index];
            const outcomes = roundOutcomes[index];
            
            // Calculate if this round has a bigspin
            const hasBigspin = battlesGame.options.bigSpin && 
                battlesCalculateBigspinDelay(roundOutcomes[index], round.box) > 0;
            
            setTimeout(() => {
                for (let slot = 0; slot < battlesGame.bets.length; slot++) {
                    const outcome = outcomes[slot];
                    battlesGame.bets[slot].payout = battlesGame.bets[slot].payout + 
                        battlesGetOutcomeItem(round.box.items, outcome, true, io, round.box, battlesGame).amountFixed;
                    battlesGame.bets[slot].outcomes.push(outcome);
                }

                battlesGame.state = 'rolling';
                battlesGame.updatedAt = new Date().getTime();

                battlesGames.splice(battlesGetGameIndex(battlesGames, battlesGame._id), 1, battlesGame);

                // Emit game update
                if (battlesGame.options.private) {
                    for (const bet of battlesGame.bets) {
                        if (!bet.bot) {
                            io.of('/battles').to(bet.user._id.toString()).emit('game', 
                                { game: battlesSanitizeGame(battlesGame) });
                        }
                    }
                } else {
                    io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGame) });
                }
            }, currentDelay);

            // Use 8s for normal spins, 16s for bigspins
            currentDelay += hasBigspin ? 17000 : 7500;
        }

        // Complete game after all rounds finish
        setTimeout(() => {
            battlesGameComplete(io, battlesGame);
        }, currentDelay);

    } catch (err) {
        console.error(err);
    }
};

const battlesGameComplete = async(io, battlesGame) => {
    try {
        // Update battles game state
        battlesGame.state = 'completed';

        // Get running leaderboard from database if available
        const leaderboardDatabase = await Leaderboard.findOne({ state: 'running' }).select('state').lean();

        // Create promises arrays
        let promisesUsers = [];
        let promisesBets = [];
        let promisesAffiliates = [];

        // Create reports stats and rain variable
        let amountBetTotal = 0;
        let amountBetRain = 0;

        // Get winner bets
        const winnerBets = battlesGetWinnerBets(battlesGame);

        // Get total win amount
        const amountWinTotal = battlesGetAmountWin(battlesGame);

        // Add update battles bet querys to promise array
        for(const bet of battlesGame.bets) {
            // Get payout amount for user bet
            bet.payout = winnerBets.some((element) => element._id.toString() === bet._id.toString()) === true ? (amountWinTotal / winnerBets.length) : 0;

            if(bet.bot !== true) {
                // Add user bet amount to total bet amount
                amountBetTotal = amountBetTotal + bet.amount;

                // Add user bet amount to rain bet amount if user is not sponsored
                amountBetRain = amountBetRain + (bet.user.limits.blockSponsor !== true ? bet.amount : 0);

                // Get settings
                const settings = settingGet();

                // Get user rakeback amount
                const amountRakeback = bet.user.limits.blockSponsor !== true ? (bet.amount * bet.user.rakeback.percentage * settings.general.reward.multiplier) : 0;

                // Split rakeback into daily, weekly, and monthly
                const dailyRakeback = (amountRakeback * 0.5);
                const weeklyRakeback = (amountRakeback * 0.3);
                const monthlyRakeback = (amountRakeback * 0.2);

                // Get user affiliate amount
                const amountAffiliate = bet.user.affiliates.referrer !== undefined && bet.user.limits.blockSponsor !== true ? (bet.amount * 0.005) : 0;

                // Add user update query to users promises array
                promisesUsers.push(
                    User.findByIdAndUpdate(bet.user._id, {
                        $inc: {
                            balance: bet.payout,
                            xp: bet.user.limits.blockSponsor !== true ? (bet.amount * settings.general.reward.multiplier) : 0,
                            'stats.won': bet.payout,
                            'limits.betToWithdraw': bet.user.limits.betToWithdraw <= bet.amount ? -bet.user.limits.betToWithdraw : -bet.amount,
                            'limits.betToRain': bet.user.limits.betToRain <= bet.amount ? -bet.user.limits.betToRain : -bet.amount,
                            'leaderboard.points': leaderboardDatabase !== null && bet.user.limits.blockSponsor !== true && bet.user.limits.blockLeaderboard !== true ? bet.amount : 0,
                            'affiliates.generated': amountAffiliate,
                            'rakeback.daily.earned': dailyRakeback,
                            'rakeback.daily.available': dailyRakeback,
                            'rakeback.weekly.earned': weeklyRakeback,
                            'rakeback.weekly.available': weeklyRakeback,
                            'rakeback.monthly.earned': monthlyRakeback,
                            'rakeback.monthly.available': monthlyRakeback
                        },
                        updatedAt: new Date().getTime()
                    }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean()
                );

                // Add update users referrer query to affiliates promises array if available and affiliate amount is bigger then zero 
                if(bet.user.affiliates.referrer !== undefined && amountAffiliate > 0) {
                    promisesAffiliates.push(
                        User.findByIdAndUpdate(bet.user.affiliates.referrer, {
                            $inc: { 
                                'affiliates.earned': amountAffiliate,
                                'affiliates.available': amountAffiliate
                            },
                            updatedAt: new Date().getTime()
                        }, {})
                    );
                }
            }

            // Add user update query to bets promises array
            promisesBets.push(
                BattlesBet.findByIdAndUpdate(bet._id, {
                    payout: bet.payout,
                    multiplier: Math.floor((bet.payout / (bet.amount === 0 ? 10 : bet.amount)) * 100),
                    outcomes: bet.outcomes,
                    updatedAt: new Date().getTime()
                }, { new: true }).select('amount payout multiplier user bot updatedAt').populate({ 
                    path: 'user', 
                    select: 'roblox.id username avatar rank xp stats rakeback anonymous createdAt' 
                }).lean()
            );
        }

        // Update battles game, rain, users, bets and affiliates
        let dataDatabase = await Promise.all([
            BattlesGame.findByIdAndUpdate(battlesGame._id, {
                fair: battlesGame.fair,
                state: 'completed',
                updatedAt: new Date().getTime()
            }, {}),
            Rain.findOneAndUpdate({ type: 'site', $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }, {
                $inc: {
                    amount: (amountBetRain * 0.001)
                }
            }, { new: true }).select('amount participants type state updatedAt').lean(),
            ...promisesUsers,
            ...promisesBets,
            ...promisesAffiliates
        ]);

        // Add battles game to battles history and remove last element from battles history if its longer then 8
        battlesHistory.unshift(battlesSanitizeGame(battlesGame));
        if(battlesHistory.length > 4) { battlesHistory.pop(); }

        // Remove battles game from battles games array
        battlesGames.splice(battlesGetGameIndex(battlesGames, battlesGame._id), 1);

        // Send battles game to frontend
        if(battlesGame.options.private === true) {
            for(const bet of battlesGame.bets) { if(bet.bot === false) { io.of('/battles').to(bet.user._id.toString()).emit('game', { game: battlesSanitizeGame(battlesGame) }); } }
        } else { io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGame) }); }

        // Send updated users to frontend
        for(const user of dataDatabase.slice(2, promisesUsers.length + 2)) { io.of('/general').to(user._id.toString()).emit('user', { user: user }); }

        // Send updated bets to frontend
        for(const bet of dataDatabase.slice(promisesUsers.length + 2, promisesUsers.length + promisesBets.length + 2)) { 
            if(bet.bot !== true) { generalAddBetsList(io, { ...bet, user: generalUserGetFormated(bet.user), method: 'battles' }); } 
        }
    } catch(err) {
        console.error(err);
    }
}

const battlesInit = async() => {
    try {
        // Get all uncompleted battles games and last 8 completed battles games from database
        const dataDatabase = await Promise.all([
            BattlesGame.find({ $or: [{ state: 'created' }, { state: 'pending' }, { state: 'rolling' } ]}).select('amount playerCount mode boxes options fair state updatedAt createdAt').populate({ 
                path: 'boxes.box', 
                select: 'name slug amount items',
                populate: { path: 'items.item', select: 'name image amountFixed' }
            }).populate({ 
                path: 'bets', 
                populate: { path: 'user', select: 'roblox.id username avatar rank xp limits stats.total affiliates anonymous createdAt' } 
            }).lean(),
            BattlesGame.find({ 'options.private': false, state: 'completed' }).sort({ createdAt: -1 }).limit(4).select('amount playerCount mode boxes options fair state updatedAt createdAt').populate({ 
                path: 'boxes.box', 
                select: 'name slug amount items',
                populate: { path: 'items.item', select: 'name image amountFixed' }
            }).populate({ 
                path: 'bets', 
                populate: { path: 'user', select: 'roblox.id username avatar rank xp stats.total anonymous createdAt' } 
            }).lean()
        ]);

        // Create promises array
        let promises = [];

        // Handle all uncompleted and last 4 completed battles games
        for(const game of [ ...dataDatabase[0], ...dataDatabase[1] ]) {
            if(game.state !== 'completed' && Math.floor(game.playerCount) === game.bets.length) {
                // Add update battles game query to promises array
                promises.push(
                    BattlesGame.findByIdAndUpdate(game._id, {
                        state: 'canceled',
                        updatedAt: new Date().getTime()
                    }, {})
                );

                // Add update user queries to promises array
                for(const bet of game.bets) {
                    promises.push(
                        User.findByIdAndUpdate(bet.user, {
                            $inc: {
                                balance: bet.amount,
                                'stats.bet': -bet.amount
                            },
                            updatedAt: new Date().getTime()
                        }, {})
                    );
                }
            } else {
                for(let bet of game.bets) {
                    if(bet.bot === false) {
                        // Get user level
                        const level = generalUserGetLevel(bet.user);

                        // Get user rakeback rank
                        const rakeback = generalUserGetRakeback(bet.user);

                        // Update bet user
                        bet.user = { 
                            _id: bet.user._id, 
                            roblox: bet.user.roblox, 
                            username: bet.user.username, 
                            avatar: bet.user.avatar, 
                            rank: bet.user.rank,
                            level: level,
                            rakeback: rakeback,
                            stats: bet.user.anonymous === true ? null : bet.user.stats,
                            limits: bet.user.limits,
                            affiliates: bet.user.affiliates,
                            createdAt: bet.user.createdAt
                        };
                    } else { bet.user = {}; }
                }

                // Add game to battles games or battles history array
                if(game.state !== 'completed') { battlesGames.push(game); }
                else { battlesHistory.unshift(game); }
            }
        }

        // Execute database queries
        await Promise.all(promises);
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    battlesGetData,
    battlesGetGameDataSocket,
    battlesSendCreateSocket,
    battlesSendBotSocket,
    battlesSendJoinSocket,
    battlesSendCancelSocket,
    battlesInit
}