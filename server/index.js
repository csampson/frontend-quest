const { WebSocket, WebSocketServer } = require('ws');
const Game = require('./game');

const PORT = process.env.PORT || 3000;
const wss = new WebSocketServer({ port: PORT });

const game = new Game();

console.log(`Starting on port ${PORT}`);

function sendMessage(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (message) => {
    const { type, data } = JSON.parse(message.toString());

    switch (type) {
      case 'PLAYER_ATTACK':
        game.damageMonster(data.damage);

        if (game.monster.hitpoints > 0) {
          sendMessage({
            type: 'MONSTER_STATE',
            payload: { monster: game.monster.attributes }
          });
        } else {
          game.spawnMonster();

          sendMessage({
            type: 'MONSTER_RESPAWN',
            payload: { monster: game.monster.attributes }
          });
        }
    }
  });

  ws.send(JSON.stringify({
    type: 'PLAYER_INIT',
    payload: { monster: game.monster.attributes }
  }));
});
