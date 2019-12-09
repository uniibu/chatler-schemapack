const io = require('socket.io-client');
const parser = require('./socketParser');
const WS_URL = 'https://ws.bitsler.com'
const WS_PATH = '/chat'
const socket = io(WS_URL, {
    parser,
    path: WS_PATH,
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 15000
});

// ...rest of the socket events and emits
