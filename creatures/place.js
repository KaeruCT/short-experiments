var Place = function (opts, game) {
  this.game = game;
  this.name = opts.name;
  this.x = opts.x;
  this.y = opts.y;
  this.radius = opts.radius;
  this.creatures = [];

  this.plants = MAX;
  this.refill = new Timed(4 * HOUR, this.game.getTime);
  this.lastPlantRefill = 0;
}

Place.prototype = {
  tick: function () {
    this.refillPlants();
  },
  refillPlants: function () {
    if (!this.refill.check()) {
      return;
    }
    this.plants += MAX/randint(2, 4);
    this.refill.set();
  },
  plantsConsumed: function () {
    if (!this.plants) {
      return 0;
    }

    var consumed = Math.min(MAX/randint(2, 4), this.plants);
    this.plants -= consumed;
    return consumed;
  },
  addCreature: function (c) {
    this.creatures.push(c);
  },
  removeCreature: function (c) {
    remove(this.creatures, c);
  }
};
