/**
 * Test script for CryptoChill Address Generation
 * 
 * Usage: 
 * 1. Make sure your environment variables are set in server/config/config.env
 * 2. Run: node server/scripts/test-address-generation.js [currency]
 * 
 * Example: node server/scripts/test-address-generation.js btc
 */

require('dotenv').config({ path: './server/config/config.env' });
const { cashierCryptoGenerateAddress } = require('../utils/cashier/crypto');

// Get currency from command line arguments or default to BTC
const currency = process.argv[2]?.toLowerCase() || 'btc';

// For visibility - manually define the mapping function here for testing
function getTestCurrencyKind(currency) {
    switch (currency.toLowerCase()) {
        case 'btc': return 'BTC';
        case 'eth': return 'ETH';
        case 'ltc': return 'LTC';
        case 'sol': return 'SOL';
        case 'usdt': return 'ETH_USDT'; // Most common USDT is on ETH network
        case 'usdc': return 'ETH_USDC'; // Most common USDC is on ETH network
        case 'xrp': return 'XRP';
        case 'trx': return 'TRX';
        default: return currency.toUpperCase();
    }
}

const testAddressGeneration = async () => {
    try {
        console.log(`Testing address generation for ${currency.toUpperCase()}...`);
        
        // Show the currency kind being used
        const currencyKind = getTestCurrencyKind(currency);
        console.log(`Expected currency kind for API: ${currencyKind}`);
        
        // Use the updated function to generate an address
        const result = await cashierCryptoGenerateAddress(currency);
        
        console.log('\nAddress generation successful:');
        console.log('------------------------');
        console.log(`Currency: ${currency.toUpperCase()}`);
        console.log(`Address: ${result.address}`);
        if (result.tag) {
            console.log(`Tag/Memo: ${result.tag}`);
        }
        console.log(`Network: ${result.network}`);
        console.log(`CryptoChill ID: ${result.cryptochill_id}`);
        console.log('------------------------');
        
        return result;
    } catch (error) {
        console.error('\nAddress generation failed:');
        console.error(error);
    }
};

// Run the test
console.log('Starting address generation test...');
testAddressGeneration(); 