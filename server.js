const http = require('http');
const WebSocket = require('ws');
const { handleConnection } = require('./ws-handlers');

const server = http.createServer((req, res) => {
  // Health check endpoint
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Yjs server is healthy ✅');
    return;
  }

  res.writeHead(404);
  res.end();
});

const wss = new WebSocket.Server({ server });

wss.on('connection', handleConnection);

server.listen(1234, () => {
  console.log('✅ Yjs server running at ws://localhost:1234');
});
