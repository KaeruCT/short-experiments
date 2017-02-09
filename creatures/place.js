var Place = function (opts, game) {
  this.game = game;
  this.name = opts.name;
  this.x = opts.x;
  this.y = opts.y;
  this.radius = opts.radius;
  this.creatures = [];

  this.maxPlants = MAX*5*this.radius;
  this.plants = this.maxPlants/2;
  this.refill = new Timed(3 * DAY, this.game.getTime);
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
    this.plants += MAX/randint(4, 10);
    this.plants = Math.min(this.plants, this.maxPlants);
    this.refill.set();
  },
  plantsConsumed: function () {
    if (!this.plants) {
      return 0;
    }

    var consumed = Math.min(MAX/randint(2, 3), this.plants);
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
