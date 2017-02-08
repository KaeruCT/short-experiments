var Creature = function (opts, game) {
  this.game = game;
  this.name = opts.name;
  this.born = 0;
  this.species = opts.species;
  this.gender = opts.gender;
  this.x = opts.x || 0;
  this.y = opts.y || 0;

  this.happiness = 0;
  this.fullness = MAX/2; // eat food to fill
  this.maxHealth = SPECIES[opts.species].maxHealth || MAX;
  this.maxEnergy = SPECIES[opts.species].maxEnergy || MAX;
  this.energy = this.maxEnergy/2; // sleep to fill back
  this.health = this.maxHealth/2;
  this.speed = SPECIES[opts.species].speed // speed might increment later

  this.asleep = false;
  this.hungry = false;
  this.settled = false;
  this.dead = false;

  this.partner = null;
  this.place = null;
  this.lastPlace = null;
  this.status = '';

  this.eating = new Timed(4 * HOUR, this.game.getTime);
  this.playing = new Timed(4 * HOUR, this.game.getTime);
  this.mating = new Timed(4 * HOUR, this.game.getTime);
  this.pregnancy = new Timed(1 * WEEK, this.game.getTime); // TODO: change per species
  this.emigrating = new Timed(3 * WEEK, this.game.getTime);
};

Creature.prototype = {
  tick: function () {
    if (this.born === 0) {
      this.emit('was born');
      this.born = this.game.getTime();
    }

    this.checkPregnancy();

    if (this.asleep) {
      this.sleep();
      return;
    }

    var near = game.creaturesNearTo(this);

    this.fullness -= MAX * TIME_STEP / DAY;
    if (this.fullness < 0) {
      this.fullness = 0;
    }
    if (this.fullness < MAX/2) {
      if (this.fullness === 0 && !this.hungry) {
        this.becomeHungry();
      }
      if (this.hungry) {
        this.health -= MAX * TIME_STEP / WEEK;
      }
      if (this.eatsMeat() && near.length) {
        this.tryToEat(near);
      }
      if (this.eatsPlants() && this.settled) {
        this.graze();
      }
    } else {
      this.health += MAX * TIME_STEP / (WEEK * 2);
    }

    if (near.length) {
      this.play(near);
      this.mate(near);
    }

    this.locatePlace();
    this.planMove();

    if (this.health <= 0) {
      this.die();
    }

    this.energy -= (MAX * TIME_STEP / DAY) * 1/3;
    if (this.energy <= MAX/10) {
      this.fallAsleep();
    }
  },
  locatePlace: function () {
    if (!this.place) {
      this.place = game.nearestPlaceTo(this);
      if (this.place) {
        this.emit('is heading to', this.place);
      }
    }

    if (!this.partner && this.settled && this.emigrating.check()) {
      // do not leave places if prenant (this.partner)
      this.leavePlace();
      this.emigrating.set();
    }
  },
  moveTo: function (target) {
    var angle = Math.atan2(target.y - this.y, target.x - this.x);
    angle += (Math.PI/8)*(Math.random()-Math.random());
    this.x += Math.cos(angle) / UNIT * this.speed;
    this.y += Math.sin(angle) / UNIT * this.speed;
  },
  planMove: function () {
    if (this.settled) {
      // settled in a place, will find interesting creatures nearby instead
      var interest = this.game.nearestInterestingCreature(this);
      if (interest) {
        this.moveTo(interest);
      }
      return;
    }

    if (this.place) {
      if (distance(this, this.place) > this.place.radius) {
        this.moveTo(this.place);
      } else if (!this.settled) {
        this.settled = true;
        this.place.addCreature(this);
        this.emit('has arrived to', this.place);
      }
    }
  },
  leavePlace: function () {
    if (this.place) {
      if (this.settled) {
        if (this.health !== 0) {
          this.emit('left', this.place);
        }

        this.lastPlace = this.place;
        this.place.removeCreature(this);
        this.settled = false;
        this.place = null;
      }
    }
  },
  play: function (creatures) {
    if (!this.playing.check()) {
      return;
    }
    var c = randv(creatures.filter(filters.sameSpecies(this)));
    if (c) {
      this.playing.set();
      c.playing.set();
      this.happiness += c.happiness * 0.10;
      this.energy -= MAX/100;
      c.energy -= MAX/100;
      this.emit('played with', c);
    }
  },
  mate: function (c) {
    if (!this.mating.check()) {
      return;
    }
    var c = c.filter(filters.sameSpecies(this));
    c = c.filter(filters.differentGender(this));
    c = randv(c);
    if (c) {
      this.mating.set();
      c.mating.set();
      this.happiness += c.happiness * 0.20;
      this.emit('mated with', c);
      this.energy -= MAX/100;
      c.energy -= MAX/100;
      var mom = c.gender === 'F' ? c : this;
      var dad = c.gender === 'F' ? this : c;
      mom.maybeBecomePregnant(dad);
    }
  },
  maybeBecomePregnant: function (dad) {
    if (this.partner) {
      return;
    }
    if (randint(0, 2) === 0) {
      this.emit('became pregnant from ', dad);
      this.partner = dad;
      this.pregnancy.set();
    }
  },
  checkPregnancy: function () {
    if (!this.partner) {
      return;
    }
    if (this.pregnancy.check()) {
      var baby = this.game.addCreature({
        species: this.species,
        gender: randv(GENDERS),
        x: this.x,
        y: this.y,
        name: this.partner.name + ' Jr.' // TODO: lmao
      });
      this.emit('gave birth to', baby);
      this.energy -= MAX/2;
      this.partner = null;
    }
  },
  tryToEat: function (c) {
    if (!this.eating.check()) {
      return;
    }

    var c = randv(c.filter(filters.differentSpecies(this)));
    if (c) {
      if (c.eatsMeat() && c.energy > this.energy) {
        // the other creature might eat this one if it's stronger!
        c.eat(this);
      } else if (c.energy > this.energy && randint(0, 5) === 0) {
        // others may put up a fight
        this.energy -= MAX/10;
        this.health -= MAX/10;

        c.emit('almost got eaten by ', this);
        c.happiness += 10;
        c.health -= MAX/100;
        c.energy -= MAX/100;
      } else {
        this.eat(c);
      }

    }
  },
  eat: function (c) {
    this.eating.set();
    this.fullness += c.fullness;
    this.happiness += 1;
    this.emit('ate', c);
    c.die();
    this.checkHunger();
  },
  graze: function () {
    if (!this.eating.check()) {
      return;
    }
    if (this.place && this.settled) {
      var plants = this.place.plantsConsumed();
      if (plants > 0) {
        this.fullness += plants;
        this.happiness += 1;
        this.emit('grazed at', this.place);
        this.checkHunger();
      } else {
        this.emit('tried to graze but there was no food, at' , this.place);
        if (randint(0, 1)) {
          this.leavePlace();
        }
      }
      this.eating.set();
    }
  },
  eatsMeat: function () {
    return !!SPECIES[this.species].meat;
  },
  eatsPlants: function () {
    return !!SPECIES[this.species].plants;
  },
  sleep: function () {
    // sleep will recharge energy at 2/3
    this.energy += (this.maxEnergy * TIME_STEP / DAY) * 2/3;

    if (this.energy >= this.maxEnergy) {
      this.asleep = false;
      this.happiness += 1;
      this.emit('woke up');
    }
  },
  becomeHungry: function () {
    this.hungry = true;
    this.emit('is hungry');
  },
  checkHunger: function () {
    if (this.hungry && this.fullness >= MAX) {
      this.hungry = false;
      this.emit('is not hungry anymore');
    }
  },
  fallAsleep: function () {
    this.asleep = true;
    this.emit('fell asleep');
  },
  die: function () {
    if (!this.dead) {
      this.health = 0;
      this.leavePlace();
      this.emit('died');
      this.dead = true;
    }
  },
  emit: function (description, c) {
    this.game.emit(this, c, description);
  }
};
