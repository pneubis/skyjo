const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();
const server = require('http').createServer(app);

app.get('/', (req, res) => res.send('Skyjo PeerJS Server OK'));

const peerServer = ExpressPeerServer(server, {
  allow_discovery: true
});

app.use('/peerjs', peerServer);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log('PeerJS server running on port', PORT));
