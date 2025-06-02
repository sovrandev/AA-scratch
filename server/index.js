const path = require('path');
const express = require('express');
const http = require('http');
const hpp = require('hpp');
const cors = require('cors');
const socket = require('socket.io');

// Load application config
require('dotenv').config();

// Init express app & create http server
const app = express();
const server = http.createServer(app);

// Create socket server
const io = socket(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: '*',
        credentials: true,
        methods: ["GET", "POST"]
    },
    allowEIO3: true,
    path: '/socket.io/'
});

// Load database
require('./database')();

// Init page settings
require('./utils/setting').settingInitDatabase();

// Enable if you are behind a reverse proxy
app.set('trust proxy', 1);

// Set other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hpp());
app.use(cors({
    origin: '*',
    credentials: true
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Mount routes
app.use('/api', require('./routes')(io));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: { 
      type: 'error', 
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    } 
  });
});

// Add 404 handler - serve index.html for client-side routing
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ 
      success: false, 
      error: { 
        type: 'error', 
        message: 'Route not found' 
      } 
    });
  } else {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  }
});

// Mount sockets
require('./sockets')(io);

// Set app port
const PORT = process.env.PORT || 10000;

// Add error handling for server startup
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using this port.`);
  } else {
    console.error('Failed to start server:', err);
  }
  process.exit(1);
});