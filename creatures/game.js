var MIN_DISTANCE = 50;

var game = (function () {

    var exports = {};
    var time = Math.round((new Date()).getTime() / 1000); // current UNIX timestamp

    var creatures = [];

    exports.init = function () {
    };

    exports.creaturesNearTo = function (c1) {
      return creatures.filter(function (c2) {
        return Math.hypot(c1.x-c2.x, c1.y-c2.y) <= MIN_DISTANCE;
      });
    };

    // creates a context for the creature
    exports.ctx = function (creature) {
      return {
        near: function () {
          return exports.creaturesNearTo(creature);
        }
      };
    }

    exports.tick = function () {
      creatures.forEach(function (c) {
        c.tick(exports.ctx(c));
        time += TIME_STEP;
      });
    };

    exports.emit = function (creature, creature2, description) {
      if (creature2) {
        description += ' ' + creature2.name + ' (' + creature2.species + ')';
      }
      console.log(creature.name + ' (' + creature.species + ') ' + description);

      if (description === 'died') {
        creatures.splice(creatures.indexOf(creature), 1);
      }
    };

    exports.addCreature = function (opts) {
      creatures.push(new Creature(opts));
    };

    return exports;
}());
