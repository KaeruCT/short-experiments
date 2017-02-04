var Creature = function (opts, game) {
  this.game = game;
  this.name = opts.name;
  this.age = 0;
  this.species = opts.species;
  this.x = opts.x || 0;
  this.y = opts.y || 0;
  this.health = MAX;
  this.fullness = MAX; // eat food to fill
  this.energy = MAX; // sleep to fill back
  this.asleep = false;

  // TODO:
  // points in the map that the creature will want to move to
  // hervibore/carnivore/omnivore types
  // eating things that aren't creatures
  // if same species, do not eat, try to mate
};

Creature.prototype = {
  tick: function (ctx) {
    if (this.age === 0) {
      this.emit('was born');
    }
    this.age += TIME_STEP;

    if (this.asleep) {
      this.sleep();
      return;
    }

    var near = ctx.near();

    this.fullness -= MAX * TIME_STEP / DAY;
    if (this.fullness < 0) {
      this.fullness = 0;
    }
    if (this.fullness < MAX/2) {
      if (this.fullness === 0) {
        this.emit('is hungry');
        this.health -= MAX * TIME_STEP / WEEK;
      }
      if (near.length) {
        this.eat(near);
      }
    } else {
      this.health += MAX * TIME_STEP / WEEK;
    }

    this.move(ctx);

    if (this.health === 0) {
      this.die();
    }

    this.energy -= (MAX * TIME_STEP / DAY) * 1/3;
    if (this.energy <= MAX/10) {
      this.fallAsleep();
    }
  },
  move: function (ctx) {
    this.x = 0;
    this.y = 0;
  },
  eat: function (creatures) {
    var c = randv(creatures.filter(filters.differentSpecies(this)));
    this.fullness += c.getFullness();
    this.emit('ate', c);
    c.die();
  },
  sleep: function () {
    // sleep will recharge energy at 2/3
    this.energy += (MAX * TIME_STEP / DAY) * 2/3;

    if (this.energy >= MAX) {
      this.asleep = false;
      this.emit('woke up');
    }
  },
  fallAsleep: function () {
    this.asleep = true;
    this.emit('fell asleep');
  },
  die: function () {
    this.emit('died');
  },
  getFullness: function () {
    return this.fullness;
  },
  emit: function (description, c) {
    game.emit(this, c, description);
  }
};
