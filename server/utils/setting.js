// Load database models
const Setting = require('../database/models/Setting');

// Setting variables
let settings = null;

const settingInitDatabase = async() => {
    try {
        settings = await Setting.findOne({}).select('general chat games robux limited steam crypto gift credit').lean();

        if(settings === undefined || settings === null) {
            settings = await Setting.create({
                general: {
                    'maintenance.enabled': false,
                    'rain.enabled': false,
                    'leaderboard.enabled': false,
                    'tip.enabled': false,
                    'affiliate.enabled': false,
                    'reward.multiplier': 1
                },
                chat: {
                    mode: 'normal',
                    enabled: false,
                    rooms: {
                        'en.enabled': false,
                        'tr.enabled': false,
                        'de.enabled': false,
                        'es.enabled': false,
                        'beg.enabled': false,
                        'whale.enabled': false
                    }
                },
                games: {
                    'crash.enabled': false,
                    'roll.enabled': false,
                    'blackjack.enabled': false,
                    'duels.enabled': false,
                    'mines.enabled': false,
                    'towers.enabled': false,
                    'unbox.enabled': false,
                    'battles.enabled': true,
                    'upgrader.enabled': true
                },
                robux: {
                    'deposit.enabled': false,
                    'withdraw.enabled': false
                },
                limited: {
                    'deposit.enabled': false,
                    'withdraw.enabled': false
                },
                steam: {
                    'deposit.enabled': false,
                    'withdraw.enabled': false
                },
                crypto: {
                    'deposit.enabled': false,
                    'withdraw.enabled': false,
                    'manual.enabled': false
                },
                gift: {
                    'deposit.enabled': false,
                    'withdraw.enabled': false
                },
                credit: {
                    'deposit.enabled': false,
                    'withdraw.enabled': false
                }
            });
            settings = settings.toObject();
        }

        delete settings._id;
    } catch(err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

const settingCheck = (user, value) => {
    if(settings.general.maintenance.enabled === true && (user === null || user.rank !== 'admin')) {
        throw new Error('Site is in maintenance! Please try again later.');
    } else if(value !== undefined && value.split('.').reduce((o, i) => o[i], settings) === false && (user === null || user.rank !== 'admin')) {
        throw new Error('The action you’ve requested is currently unavailable.');
    }
}

const settingGet = () => {
    return settings;
}

const settingSetValue = (setting, value) => {
    return new Promise(async(resolve, reject) => {
        settings = await Setting.findOneAndUpdate({}, {
            [setting]: value
        }, { new: true }).select('general chat games robux limited steam crypto gift credit').lean();
        delete settings._id;

        resolve(settings);
    });
}

module.exports = {
    settingInitDatabase,
    settingCheck,
    settingGet,
    settingSetValue
}
