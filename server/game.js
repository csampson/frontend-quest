const Monster = require('./monster');

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
}

module.exports = Game;
