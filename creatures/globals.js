var MAX = 100;

var MINUTE = 60;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var WEEK = 7 * DAY;

var TICK_TIME = 0.1; // how much to wait between ticks, in seconds
var TIME_STEP = HOUR * TICK_TIME; // how many seconds to count per tick

var NAMES = ['Jose', 'Mariana', 'Alfredo', 'Tatiana', 'Melissa', 'Katherine', 'Alejandro'];
var SPECIES = ['Rhino', 'Tiger', 'Lion', 'Dragon', 'Turtle', 'Eagle', 'Wolf', 'Elephant', 'Zebra', 'Snake'];

function randv(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

var filters = {
  sameSpecies: function (c1) {
    return function (c2) {
      return c1.species === c2.species;
    };
  },
  differentSpecies: function (c1) {
    return function (c2) {
      return c1.species !== c2.species;
    };
  },
};
