// ============================================================
// SKYJO MULTIPLAYER — Serveur WebSocket
// Déployable sur Render.com (plan Free)
// ============================================================
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8080;

// rooms[roomCode] = { hostId, clients: Map<id, ws> }
const rooms = new Map();

const wss = new WebSocketServer({ port: PORT });
console.log(`Skyjo WS Server listening on port ${PORT}`);

wss.on('connection', (ws) => {
  ws.id       = Math.random().toString(36).substr(2, 9);
  ws.roomCode = null;
  ws.playerId = null;
  ws.isAlive  = true;

  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {

      case 'create': {
        const code = msg.code;
        if (rooms.has(code)) {
          send(ws, { type: 'error', code: 'ERR_CODE_TAKEN', msg: 'Code déjà utilisé' });
          return;
        }
        ws.roomCode = code;
        ws.playerId = msg.playerId;
        rooms.set(code, { hostId: ws.id, clients: new Map([[ws.id, ws]]) });
        send(ws, { type: 'created', code });
        console.log(`[${code}] Créée par ${ws.id}`);
        break;
      }

      case 'join': {
        const code = msg.code;
        const room = rooms.get(code);
        if (!room) {
          send(ws, { type: 'error', code: 'ERR_ROOM_NOT_FOUND', msg: 'Salle introuvable. Vérifiez le code.' });
          return;
        }
        ws.roomCode = code;
        ws.playerId = msg.playerId;
        room.clients.set(ws.id, ws);
        // Notifier l'hôte qu'un client veut rejoindre
        const host = getHost(room);
        if (host) {
          send(host, { type: 'player_join', playerId: msg.playerId, name: msg.name, wsId: ws.id });
        }
        send(ws, { type: 'joined', code });
        console.log(`[${code}] ${msg.name} a rejoint`);
        break;
      }

      // Hôte → tous les clients : état du jeu
      case 'state': {
        const room = rooms.get(ws.roomCode);
        if (!room || room.hostId !== ws.id) return;
        broadcast(room, { type: 'state', state: msg.state }, ws.id);
        break;
      }

      // Hôte → tous : toast
      case 'toast': {
        const room = rooms.get(ws.roomCode);
        if (!room || room.hostId !== ws.id) return;
        broadcast(room, { type: 'toast', msg: msg.msg }, ws.id);
        break;
      }

      // Hôte → tous : boom
      case 'boom': {
        const room = rooms.get(ws.roomCode);
        if (!room || room.hostId !== ws.id) return;
        broadcast(room, { type: 'boom' }, ws.id);
        break;
      }

      // Client → hôte : action de jeu
      case 'action': {
        const room = rooms.get(ws.roomCode);
        if (!room) return;
        const host = getHost(room);
        if (host) send(host, { type: 'action', playerId: msg.playerId, data: msg.data });
        break;
      }

      case 'ping':
        send(ws, { type: 'pong' });
        break;
    }
  });

  ws.on('close', () => {
    const room = ws.roomCode ? rooms.get(ws.roomCode) : null;
    if (!room) return;

    room.clients.delete(ws.id);

    if (room.hostId === ws.id) {
      // L'hôte s'est déconnecté → fermer la room
      broadcast(room, { type: 'host_left' }, ws.id);
      rooms.delete(ws.roomCode);
      console.log(`[${ws.roomCode}] Fermée (hôte parti)`);
    } else {
      // Un client s'est déconnecté → notifier l'hôte
      const host = getHost(room);
      if (host) send(host, { type: 'player_left', playerId: ws.playerId, wsId: ws.id });
      if (room.clients.size === 0) {
        rooms.delete(ws.roomCode);
        console.log(`[${ws.roomCode}] Fermée (vide)`);
      }
    }
  });

  ws.on('error', (err) => console.error(`WS error [${ws.id}]:`, err.message));
});

// ─── Helpers ──────────────────────────────────────────────────
function send(ws, data) {
  if (ws && ws.readyState === 1) {
    try { ws.send(JSON.stringify(data)); } catch {}
  }
}

function broadcast(room, data, excludeWsId = null) {
  room.clients.forEach((ws) => {
    if (ws.id !== excludeWsId) send(ws, data);
  });
}

function getHost(room) {
  return room.clients.get(room.hostId);
}

// ─── Heartbeat (détecter les connexions zombies) ──────────────
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) { ws.terminate(); return; }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

// ─── Nettoyage des rooms abandonnées (>2h) ────────────────────
setInterval(() => {
  const cutoff = Date.now() - 2 * 60 * 60 * 1000;
  rooms.forEach((room, code) => {
    if (room.clients.size === 0) rooms.delete(code);
  });
}, 10 * 60 * 1000);
