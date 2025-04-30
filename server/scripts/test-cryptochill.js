/**
 * Test script for CryptoChill API connection
 * 
 * Usage: 
 * 1. Make sure your environment variables are set in server/config/config.env
 * 2. Run: node server/scripts/test-cryptochill.js
 */

require('dotenv').config({ path: './server/config/config.env' });
const crypto = require('crypto');
const fetch = require('node-fetch');

// Format the current time as a timestamp
const getNonce = () => Math.floor(Date.now());

// Create signature according to CryptoChill API documentation
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
        encodedPayload,
        signature
    };
};

// Make API request to CryptoChill
const makeCryptoChillRequest = async (endpoint, method = 'GET', payload = null) => {
    try {
        const requestPath = `/v1/${endpoint}/`;
        
        // Prepare final payload
        const finalPayload = {
            request: requestPath,
            nonce: getNonce(),
            ...(payload || {})
        };
        
        // Generate signature
        const { encodedPayload, signature } = createCryptoChillSignature(finalPayload);
        
        // Setup headers
        const headers = {
            'Content-Type': 'application/json',
            'X-CC-KEY': process.env.CRYPTOCHILL_API_KEY,
            'X-CC-PAYLOAD': encodedPayload,
            'X-CC-SIGNATURE': signature,
        };
        
        // Make the request
        const response = await fetch(`${process.env.CRYPTOCHILL_API_URL}${requestPath}`, {
            method,
            headers,
            ...(method !== 'GET' && { body: JSON.stringify(finalPayload) })
        });
        
        // Handle response
        const responseData = await response.json();
        
        if (response.ok) {
            return responseData;
        } else {
            throw new Error(`API Error: ${responseData.message || response.statusText}`);
        }
    } catch (error) {
        console.error(`Error making request to ${endpoint}:`, error.message);
        throw error;
    }
};

// Test the API connection
const testCryptoChillApi = async () => {
    try {
        // 1. List available profiles
        console.log('Listing available profiles...');
        const profilesResponse = await makeCryptoChillRequest('profiles');
        
        console.log(`Found ${profilesResponse.result?.length || 0} profiles`);
        
        // Print profiles for debugging
        if (profilesResponse.result && profilesResponse.result.length > 0) {
            profilesResponse.result.forEach(profile => {
                console.log(`- Profile: ${profile.name} (ID: ${profile.id})`);
            });
            
            // Get the first profile ID
            const profileId = profilesResponse.result[0].id;
            console.log(`\nUsing profile ID: ${profileId} for further tests`);
            
            // Check currencies supported by this profile
            console.log('\nChecking supported currencies for this profile...');
            await checkProfileCurrencies(profileId);
            
            // 2. Now test invoice/address generation
            console.log('\nTesting invoice creation for BTC...');
            const invoice = await testCreateInvoice('BTC', profileId);
            
            // 3. Test withdrawal creation with proper amount formatting
            if (invoice) {
                console.log('\nTesting payout/withdrawal creation with $10.00 (likely below minimum)...');
                await testCreatePayout('BTC', 'bc1qv2syrxfmysmay8fz5j9y5f4p28w70zvfpfjmz3', 10.00, profileId);
                
                console.log('\nTesting payout/withdrawal creation with $50.00 (should be above minimum)...');
                await testCreatePayout('BTC', 'bc1qv2syrxfmysmay8fz5j9y5f4p28w70zvfpfjmz3', 50.00, profileId);
            }
        } else {
            console.log('No profiles found. Please create a profile in your CryptoChill dashboard.');
        }
        
    } catch (error) {
        console.error('Error testing CryptoChill API:', error.message);
    }
};

// Check which currencies are supported by a profile
const checkProfileCurrencies = async (profileId) => {
    try {
        // Get profile details including supported currencies
        const profileResponse = await makeCryptoChillRequest(`profiles/${profileId}`);
        
        if (profileResponse.result && profileResponse.result.currencies) {
            console.log('Supported currencies:');
            profileResponse.result.currencies.forEach(currency => {
                console.log(`- ${currency.name} (${currency.kind})`);
            });
            return profileResponse.result.currencies;
        } else {
            console.log('No currency information available for this profile');
            return [];
        }
    } catch (error) {
        console.error(`Error checking profile currencies:`, error.message);
        return [];
    }
};

// Test invoice creation with a valid profile ID
const testCreateInvoice = async (currency, profileId) => {
    try {
        // Create an invoice for the specified currency
        const invoicePayload = {
            currency: 'USD',
            kind: currency,
            profile_id: profileId, 
            label: `Test ${currency} ${new Date().toISOString()}`,
            passthrough: `test_${Date.now()}`
        };
        
        const invoiceResponse = await makeCryptoChillRequest('invoices', 'POST', invoicePayload);
        
        if (invoiceResponse.result) {
            console.log(`Successfully created invoice for ${currency}:`);
            console.log(`- Invoice ID: ${invoiceResponse.result.id}`);
            console.log(`- Address: ${invoiceResponse.result.address}`);
            if (invoiceResponse.result.tag) {
                console.log(`- Tag/Memo: ${invoiceResponse.result.tag}`);
            }
            console.log(`- Network: ${invoiceResponse.result.network}`);
            
            return invoiceResponse.result;
        }
    } catch (error) {
        console.error(`Error creating invoice for ${currency}:`, error.message);
    }
};

// Test payout/withdrawal creation with a valid profile ID
const testCreatePayout = async (currency, address, amount, profileId) => {
    try {
        // Format amount to 2 decimal places as a string
        const formattedAmount = amount.toFixed(2);
        
        // Create a payout for the specified currency
        const payoutPayload = {
            profile_id: profileId,
            kind: currency,
            network_fee_pays: "recipient",
            passthrough: `test_${Date.now()}`,
            recipients: [
                {
                    amount: formattedAmount,
                    currency: "USD",
                    address: address
                }
            ]
        };
        
        const payoutResponse = await makeCryptoChillRequest('payouts', 'POST', payoutPayload);
        
        if (payoutResponse.result) {
            console.log(`Successfully created payout request:`);
            console.log(`- Payout ID: ${payoutResponse.result.id}`);
            console.log(`- Status: ${payoutResponse.result.status}`);
            
            return payoutResponse.result;
        }
    } catch (error) {
        console.error(`Error creating payout for ${currency}:`, error.message);
    }
};

// Run the test
console.log('Starting CryptoChill API test...');
testCryptoChillApi(); 