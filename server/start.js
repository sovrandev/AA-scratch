const { execSync } = require('child_process');
const path = require('path');

// Build the frontend
console.log('Building frontend...');
execSync('cd ../client && npm install --legacy-peer-deps && npm run build', { stdio: 'inherit' });

// Start the server
console.log('Starting server...');
execSync('cd ../server && npm install --legacy-peer-deps && node index.js', { stdio: 'inherit' });
require('./index.js'); 