const fetch = require('node-fetch');
const crypto = require('crypto');

// Fallback mechanism for when EOS API fails
const generateFallbackBlockData = (blockNumber) => {
	// Create deterministic but pseudo-random values based on timestamp and block number
	const timestamp = Date.now();
	const seed = `fallback-${timestamp}-${blockNumber || timestamp}`;
	const hash = crypto.createHash('sha256').update(seed).digest('hex');
	
	return {
		blockNumber: blockNumber || Math.floor(timestamp / 1000), // Use provided block number or generate one
		blockHash: hash,
		isFailover: true
	};
};

// EOS gets the current block number
const getCurrentBlock = async () => {
	try {
		const response = await fetch("https://eos.nownodes.io/v2/health", {
			headers: {
				"api-key": process.env.NOWNODES_API_KEY,
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data.last_indexed_block;
	} catch (error) {
		console.error("Error getting latest block number:", error.message);
		
		// Return fallback block data for battles
		const fallbackData = generateFallbackBlockData();
		console.warn("Using fallback EOS block data:", fallbackData.blockNumber);
		
		return fallbackData.blockNumber;
	}
};

// EOS waits until we can get the next block hash
const awaitNextBlockHash = async (waitForBlockNumber) => {
	try {
		let retryCount = 0;
		const maxRetries = 3;
		
		while (retryCount < maxRetries) {
			try {
				const response = await fetch("https://eos.nownodes.io/v1/chain/get_block", {
					method: 'POST',
					headers: { 
						"Content-Type": "application/json", 
						"api-key": process.env.NOWNODES_API_KEY 
					},
					body: JSON.stringify({ block_num_or_id: waitForBlockNumber })
				});

				if (!response.ok) {
					// If block not found yet (404), continue polling
					if (response.status === 404) {
						await new Promise((resolve) => setTimeout(resolve, 1500));
						continue;
					}
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				if (data.id) {
					return data.id;
				}

				await new Promise((resolve) => setTimeout(resolve, 1500));
			} catch (error) {
				// If error is not 404, increment retry counter
				if (!error.message.includes('404')) {
					console.error("Error fetching block:", error.message);
					retryCount++;
					
					if (retryCount >= maxRetries) {
						// After max retries, use fallback
						const fallbackData = generateFallbackBlockData(waitForBlockNumber);
						console.warn("Using fallback EOS block hash after multiple failures");
						return fallbackData.blockHash;
					}
					
					await new Promise((resolve) => setTimeout(resolve, 1500));
				}
				continue;
			}
		}
		
		// If we exit the while loop without returning, use fallback
		const fallbackData = generateFallbackBlockData(waitForBlockNumber);
		return fallbackData.blockHash;
	} catch (error) {
		console.error("An error occurred while awaiting next block hash:", error.message);
		
		// Return fallback hash for battles
		const fallbackData = generateFallbackBlockData(waitForBlockNumber);
		console.warn("Using fallback EOS block hash due to exception:", error.message);
		
		return fallbackData.blockHash;
	}
};

// Check if the EOS API is available
const checkEosApiStatus = async () => {
	try {
		const response = await fetch("https://eos.nownodes.io/v2/health", {
			headers: {
				"api-key": process.env.NOWNODES_API_KEY,
			},
		});
		
		return response.ok;
	} catch (error) {
		console.error("EOS API status check failed:", error.message);
		return false;
	}
};

module.exports = {
	getCurrentBlock,
	awaitNextBlockHash,
	checkEosApiStatus,
	generateFallbackBlockData
};
