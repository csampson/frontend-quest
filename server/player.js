class Player {
  constructor(name) {
    this.name = name;
    this.hitpoints = 50;
  }

  get attributes() {
    return {
      name: this.name,
      hitpoints: this.hitpoints,
    };
  }
}

module.exports = Player;
