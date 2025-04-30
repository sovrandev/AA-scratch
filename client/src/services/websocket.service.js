import io from 'socket.io-client';
import config from './config';

// Initialize sockets array first
const sockets = [];

const createSocket = (namespace = '') => {
  // Get token before creating socket
  const token = localStorage.getItem('token');
  
  // only send a token if it exists
  const socket = io(`${config.site.backend.url}${namespace}`, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 5000,
    timeout: 20000,
    path: '/socket.io/',
    query: token ? { token } : null,
    autoConnect: true
  });

  // Handle connection events
  socket.on('connect', () => {});

  socket.on('connect_error', (error) => {
    // Automatically try to reauthenticate if token becomes available
    const newToken = localStorage.getItem('token');
    if (newToken && newToken !== socket.auth?.token) {
      socket.auth = { token: newToken };
      socket.disconnect().connect();
    }
  });

  socket.on('disconnect', (reason) => {});

  return socket;
};

// Export individual socket connections
export const generalSocket = createSocket('/general');
sockets.push(generalSocket);

export const unboxSocket = createSocket('/unbox');
sockets.push(unboxSocket);

export const battlesSocket = createSocket('/battles');
sockets.push(battlesSocket);

export const upgraderSocket = createSocket('/upgrader');
sockets.push(upgraderSocket);

export const minesSocket = createSocket('/mines');
sockets.push(minesSocket);

export const cashierSocket = createSocket('/cashier');
sockets.push(cashierSocket);

export const adminSocket = createSocket('/admin');
sockets.push(adminSocket);

// Export the sockets array
export { sockets };

// Authenticate all socket connections
export const authenticateSockets = (token) => {
  if (!token) {
    return;
  }
  
  sockets.forEach(socket => {
    if (socket.auth?.token !== token) {
      socket.auth = { token };
      if (socket.connected) {
        socket.disconnect().connect();
      }
    }
  });
};

// Disconnect all sockets
export const disconnectSockets = () => {
  sockets.forEach(socket => {
    socket.removeAllListeners();
    if (socket.connected) {
      socket.disconnect();
    }
  });
};

// Refresh all sockets
export const refreshSockets = () => {
  sockets.forEach(socket => {
    socket.removeAllListeners();
    if (socket.connected) {
      socket.disconnect();
    }
    socket.connect();
  });
};