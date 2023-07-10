const sample = require('lodash/sample');

const monsters = [
  'dragon'
];

class Monster {
  constructor() {
    this.hitpoints = 100;
    this.name = sample(monsters);
  }

  get attributes() {
    return {
      name: this.name,
      hitpoints: this.hitpoints,
    };
  }
}

module.exports = Monster;
