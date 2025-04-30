const adminCheckGetWalletBalancesData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    }
}

const adminCheckUpdateWalletAddressData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.currency === undefined || data.currency === null || typeof data.currency !== 'string' || 
        !['BTC', 'SOL', 'ETH', 'USDC', 'USDT', 'TRX', 'XRP'].includes(data.currency)) {
        throw new Error('Your entered currency is invalid.');
    } else if(data.address === undefined || data.address === null || typeof data.address !== 'string' || data.address.trim() === '') {
        throw new Error('Your entered address is invalid.');
    }
}

const adminCheckSyncWalletBalancesData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    }
}

module.exports = {
    adminCheckGetWalletBalancesData,
    adminCheckUpdateWalletAddressData,
    adminCheckSyncWalletBalancesData
} 