const { execSync, spawn } = require('child_process');
const path = require('path');

// Build the frontend
console.log('Building frontend...');
execSync('cd ../client && npm install --legacy-peer-deps && npm run build', { stdio: 'inherit' });

// Start the server with timeout
console.log('Installing server dependencies with timeout...');
try {
    const npmInstall = spawn('npm', ['install', '--legacy-peer-deps'], {
        cwd: path.join(__dirname),
        stdio: 'inherit'
    });

    // Set 2 minute timeout
    const timeout = setTimeout(() => {
        console.log('Server package installation timed out after 2 minutes, proceeding with server start...');
        npmInstall.kill();
    }, 120000);

    npmInstall.on('close', (code) => {
        clearTimeout(timeout);
        if (code === 0) {
            console.log('Server dependencies installed successfully');
        } else {
            console.log('Server dependencies installation completed with code:', code);
        }
        // Start the server regardless of installation status
        console.log('Starting server...');
        require('./index.js');
    });
} catch (error) {
    console.log('Error during server package installation:', error);
    console.log('Proceeding with server start...');
    require('./index.js');
} 