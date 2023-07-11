const Monster = require('./monster');
const Player = require('./player');

class Game {
  constructor() {
    this.players = [];
    this.spawnMonster();
  }

  damageMonster(damage) {
    this.monster.hitpoints -= damage;
  }

  spawnMonster() {
    this.monster = new Monster();
  }

  addPlayer(name) {
    this.players.push(new Player(name));
  }
}

module.exports = Game;
