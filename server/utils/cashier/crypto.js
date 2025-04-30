const {
    settingGet
} = require("../setting");

const validator = require('validator');
const fetch = require('node-fetch');
const crypto = require('crypto');



const SUPPORTED_CURRENCIES = [
    "btc",
    "eth",
    "ltc",
    "sol",
    "usdt",
    "usdc",
    "xrp",
    "trx"
];

// Define minimum withdrawal amounts (in USD) for each currency
// These should be higher than typical network fees
const MIN_WITHDRAWAL_AMOUNTS = {
    'btc': 15,   // $15 minimum for BTC
    'eth': 20,   // $20 minimum for ETH (gas costs can be high)
    'ltc': 10,   // $10 minimum for LTC
    'sol': 5,    // $5 minimum for SOL
    'usdt': 20,  // $20 minimum for USDT (ERC20 gas costs)
    'usdc': 20,  // $20 minimum for USDC (ERC20 gas costs)
    'xrp': 10,   // $10 minimum for XRP
    'trx': 10    // $10 minimum for TRX
};

const cashierCheckSendCryptoWithdrawData = (data) => {
    if(data === undefined || data === null) {
        throw new Error("Something went wrong. Please try again in a few seconds.");
    } else if(data.currency === undefined || typeof data.currency !== "string" || !SUPPORTED_CURRENCIES.includes(data.currency)) {
        throw new Error("You've entered an invalid withdraw currency.");
    } else if(data.amount === undefined || isNaN(data.amount) === true || data.amount <= 0) {
        throw new Error("You've entered an invalid withdraw amount.");
    } else if(data.address === undefined || typeof data.address !== "string") {
        throw new Error(`You've entered an invalid ${data.currency} withdraw address.`);
    }

    // Check if amount meets the minimum threshold for the currency
    const currencyCode = data.currency.toLowerCase();
    const minAmountUSD = MIN_WITHDRAWAL_AMOUNTS[currencyCode] || 10; // Default to $10
    
    // Use parseFloat and toFixed(2) to avoid floating-point comparison issues
    const amountToCheck = parseFloat(parseFloat(data.amount).toFixed(2));
    const minToCheck = parseFloat(minAmountUSD.toFixed(2));
    
    if (amountToCheck < minToCheck) {
        throw new Error(`Minimum withdrawal amount for ${data.currency.toUpperCase()} is $${minAmountUSD}. This is required to cover network fees.`);
    }

    // Validate address format based on currency
    switch(data.currency) {
        case "btc":
            if (!validator.isBtcAddress(data.address)) {
                throw new Error("Invalid Bitcoin address format");
            }
            break;
        case "eth":
        case "usdt": // Assuming ERC20
            if (!validator.isEthereumAddress(data.address)) {
                throw new Error("Invalid Ethereum address format");
            }
            break;
        case "sol":
            if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(data.address)) {
                throw new Error("Invalid Solana address format");
            }
            break;
        // Add other currency validations as needed
    }
}

const cashierCheckSendCryptoWithdrawUser = (data, user) => {
    // Check if user has enough balance (no conversion needed, everything in USD)
    if(user.balance < data.amount) {
        throw new Error("You don't have enough balance for this action.");
    } else if(user.limits && user.limits.betToWithdraw && user.limits.betToWithdraw > 0) {
        throw new Error(`You need to wager $${(user.limits.betToWithdraw).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} more before you can withdraw.`);
    } else if(user.limits && user.limits.blockSponsor === true) {
        throw new Error("You aren't allowed to withdraw at the moment. Please contact the support for more information.");
    }
}

const cashierCheckSendCryptoWithdrawTransactions = (transactionsDatabase) => {
    if(transactionsDatabase.length >= 5) {
        throw new Error('You aren\'t allowed to have more than 5 pending crypto withdraws.');
    }
}

const createCryptoChillSignature = (payload) => {
    if (!process.env.CRYPTOCHILL_SECRET_KEY) {
        throw new Error('CRYPTOCHILL_SECRET_KEY is not configured');
    }
    
    // Encode payload to base64 format
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    // Create signature using the API_SECRET
    const signature = crypto
        .createHmac('sha256', process.env.CRYPTOCHILL_SECRET_KEY)
        .update(encodedPayload)
        .digest('hex');
    
    return {
        payload: encodedPayload,
        signature
    };
}

const cashierCryptoGetPrices = async () => {
    try {
        // Use CoinGecko API to get crypto prices
        const ids = [
            'bitcoin',        // btc
            'ethereum',       // eth
            'litecoin',       // ltc
            'solana',         // sol
            'tether',         // usdt
            'usd-coin',       // usdc
            'ripple',         // xrp
            'tron',           // trx
        ].join(',');

        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Map CoinGecko IDs to our currency codes
        const idToCode = {
            'bitcoin': 'btc',
            'ethereum': 'eth',
            'litecoin': 'ltc',
            'solana': 'sol',
            'tether': 'usdt',
            'usd-coin': 'usdc',
            'ripple': 'xrp',
            'tron': 'trx'
        };

        // Format prices to match our structure - now using USD directly without *1000
        const formattedPrices = {};
        for (const [id, priceData] of Object.entries(data)) {
            const code = idToCode[id];
            if (code && SUPPORTED_CURRENCIES.includes(code)) {
                formattedPrices[code] = {
                    price: priceData.usd, // Use USD price directly
                    fee: calculateWithdrawalFee(code, priceData.usd) // Calculate fee based on price
                };
            }
        }

        return formattedPrices;
    } catch (err) {
        console.error('Error fetching crypto prices:', err);
        throw new Error(`Failed to fetch crypto prices: ${err.message}`);
    }
}

// Helper function to calculate withdrawal fee
const calculateWithdrawalFee = (currency, price) => {
    // Define withdrawal fees as approximate fixed USD values
    const feeUSD = {
        'btc': 2,     // $2 fee for BTC withdrawal
        'eth': 5,     // $5 fee for ETH (gas costs)
        'ltc': 0.5,   // $0.50 fee for LTC
        'sol': 0.01,  // $0.01 fee for SOL
        'usdt': 5,    // $5 fee for USDT (ERC20 gas)
        'usdc': 5,    // $5 fee for USDC (ERC20 gas)
        'xrp': 0.5,   // $0.50 fee for XRP
        'trx': 0.5    // $0.50 fee for TRX
    };

    return feeUSD[currency] || 1; // Default to $1 fee
}

const cashierCryptoGenerateAddress = async (currency) => {
    try {
        if (!process.env.CRYPTOCHILL_API_URL || !process.env.CRYPTOCHILL_API_KEY) {
            throw new Error('CryptoChill API configuration is missing');
        }
        
        // Get the currency with network prefix if needed
        let currencyKind = getCurrencyKind(currency);
        
        const endpoint = '/v1/invoices/';
        
        // Prepare payload for invoice/address generation
        const payload = {
            request: endpoint,
            nonce: new Date().getTime(),
            currency: 'USD',
            kind: currencyKind,
            label: `${currency.toUpperCase()} Deposit Address`,
            profile_id: process.env.CRYPTOCHILL_PROFILE_ID,
            // We can add user ID if we have it in the context
            // passthrough: userId
        };
        
        const { payload: encodedPayload, signature } = createCryptoChillSignature(payload);

        const response = await fetch(`${process.env.CRYPTOCHILL_API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CC-KEY': process.env.CRYPTOCHILL_API_KEY,
                'X-CC-PAYLOAD': encodedPayload,
                'X-CC-SIGNATURE': signature
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            
            // Special handling for unsupported currencies
            if (error.message && error.message.includes("doesn't support selected payment currency")) {
                console.error(`[Crypto] Currency ${currencyKind} is not enabled in your CryptoChill profile. Please enable it in your CryptoChill dashboard.`);
                
                // In development, return a mock address for testing
                if (process.env.NODE_ENV !== 'production') {
                    console.error(`[Crypto] Development mode: Returning mock address for ${currency.toUpperCase()}`);
                    return {
                        address: `mock-${currency.toLowerCase()}-address-for-testing`,
                        tag: currency.toLowerCase() === 'xrp' || currency.toLowerCase() === 'xlm' ? '123456' : null,
                        network: getDefaultNetwork(currency),
                        cryptochill_id: `mock-id-${Date.now()}`
                    };
                }
            }
            
            throw new Error(error.message || response.statusText);
        }

        const data = await response.json();
        if (!data.result || !data.result.address) {
            throw new Error('Failed to generate deposit address');
        }

        // For XRP, the API returns address in format "address:tag"
        // We need to extract the tag and return it separately
        let address = data.result.address;
        let tag = data.result.tag || null;

        // Handle XRP addresses in format address:tag
        if (currency.toLowerCase() === 'xrp' && address.includes(':')) {
            const parts = address.split(':');
            address = parts[0];
            tag = parts[1];
        }

        return {
            address: address,
            tag: tag,
            network: data.result.network || getDefaultNetwork(currency),
            cryptochill_id: data.result.id
        };
    } catch (err) {
        console.error('CryptoChill API Error:', err);
        
        // In development, return a mock address when there's an error
        if (process.env.NODE_ENV !== 'production') {
            console.error(`[Crypto] Development mode: Returning mock address for ${currency.toUpperCase()} due to error`);
            return {
                address: `mock-${currency.toLowerCase()}-address-for-testing`,
                tag: currency.toLowerCase() === 'xrp' || currency.toLowerCase() === 'xlm' ? '123456' : null,
                network: getDefaultNetwork(currency),
                cryptochill_id: `mock-id-${Date.now()}`
            };
        }
        
        throw new Error(`Failed to generate address: ${err.message}`);
    }
}

const getCurrencyKind = (currency) => {
    switch (currency.toLowerCase()) {
        case 'btc':
            return 'BTC';
        case 'eth':
            return 'ETH';
        case 'ltc':
            return 'LTC';
        case 'sol':
            return 'SOL';
        case 'usdt':
            return 'ETH_USDT';
        case 'usdc':
            return 'ETH_USDC';
        case 'xrp':
            return 'XRP';
        case 'trx':
            return 'TRX';
        default:
            return currency.toUpperCase();
    }
}

const getDefaultNetwork = (currency) => {
    switch (currency.toLowerCase()) {
        case 'btc':
            return 'mainnet';
        case 'eth':
        case 'usdt':
        case 'usdc':
            return 'mainnet';
        case 'sol':
            return 'mainnet';
        case 'trx':
            return 'mainnet';
        case 'xrp':
            return 'mainnet';
        case 'ltc':
            return 'mainnet';
        default:
            return 'mainnet';
    }
}

const cashierCryptoCreateWithdrawal = async (currency, address, amount, userId) => {
    try {
        if(settingGet().crypto.withdraw.enabled === false) {
            throw new Error('Crypto withdrawals are currently disabled.');
        }

        const endpoint = '/v1/payouts/';
        
        // Get the correct currency kind
        const currencyKind = getCurrencyKind(currency);
        
        // Ensure amount is a valid number and properly formatted
        // CryptoChill requires a string that represents a valid number
        const formattedAmount = amount.toFixed(2);
        
        // Prepare payload for withdrawal
        const payload = {
            request: endpoint,
            nonce: new Date().getTime(),
            profile_id: process.env.CRYPTOCHILL_PROFILE_ID,
            kind: currencyKind,
            network_fee_pays: "recipient",
            passthrough: { id: userId },
            recipients: [
                {
                    amount: formattedAmount,
                    currency: "USD",
                    address: address
                }
            ]
        };
        
        const { payload: encodedPayload, signature } = createCryptoChillSignature(payload);

        const response = await fetch(`${process.env.CRYPTOCHILL_API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CC-KEY': process.env.CRYPTOCHILL_API_KEY,
                'X-CC-PAYLOAD': encodedPayload,
                'X-CC-SIGNATURE': signature
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || response.statusText);
        }

        const data = await response.json();
        if (!data.result || !data.result.id) {
            throw new Error('Failed to create withdrawal');
        }

        return {
            id: data.result.id,
            status: data.result.status || 'pending',
            amount: data.result.amount || amount,
            fee: data.result.fee || 0
        };
    } catch (err) {
        console.error('CryptoChill API Error:', err);
        throw new Error(`Failed to create withdrawal: ${err.message}`);
    }
}

// Helper function to get the correct network for each currency
const getCryptoNetwork = (currency) => {
    switch (currency.toLowerCase()) {
        case 'btc':
            return 'BTC';
        case 'eth':
        case 'usdt':
        case 'usdc':
            return 'ETH';
        case 'sol':
            return 'SOL';
        case 'trx':
            return 'TRX';
        case 'xrp':
            return 'XRP';
        case 'ltc':
            return 'LTC';
        default:
            throw new Error(`Unsupported currency network: ${currency}`);
    }
}

module.exports = {
    cashierCheckSendCryptoWithdrawData,
    cashierCheckSendCryptoWithdrawUser,
    cashierCheckSendCryptoWithdrawTransactions,
    cashierCryptoGetPrices,
    cashierCryptoGenerateAddress,
    cashierCryptoCreateWithdrawal,
    getCurrencyKind,
    getDefaultNetwork,
    getCryptoNetwork
}
