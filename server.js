const http = require('http');
const WebSocket = require('ws');
const { handleConnection } = require('./ws-handlers');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', handleConnection);

server.listen(1234, () => {
  console.log('✅ Yjs server running at ws://localhost:1234');
});