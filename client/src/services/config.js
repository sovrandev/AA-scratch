const IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  site: {
    hcaptcha_api_key: "c5bcc878-9664-4334-a5b2-8f02311c399e",
    backend: {
      url: IS_PRODUCTION 
        ? "https://aa-scratch.onrender.com"  // Render deployment URL
        : "http://localhost:5000",    // Your local development API URL
    },
    frontend: {
      url: IS_PRODUCTION
        ? "https://solclash.com"      // Your production frontend URL
        : "http://localhost:3000",    // Your local development frontend URL
    }
  },
  socket: {
    options: {
      transports: ['websocket'],      // Use WebSocket protocol only
      reconnection: true,             // Enable auto-reconnection
      reconnectionDelay: 500,         // Wait 500ms before attempting to reconnect
      reconnectionAttempts: 10        // Try to reconnect 10 times before giving up
    }
  }
};