var MAX = 100;
var DIM = 80; // world dimensions
var UNIT = 8;
var NEARNESS = 2;
var MIN_PLACE_RAD = 3;
var MAX_PLACE_RAD = 8;

var DATE_FORMAT = 'MMMM Do YYYY, h:mm a';
var SHORT_DATE_FORMAT = 'DD/MM/YYYY h:mm a';

var MINUTE = 60;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var WEEK = 7 * DAY;
var MONTH = 4 * WEEK;

var TICK_TIME = 0.1; // how much to wait between ticks, in seconds
var TIME_STEP = HOUR * TICK_TIME; // how many seconds to count per tick

var GENDERS = ['M', 'F'];

var PLACES = [
  'Deltron Station',
  'Ioka Hill',
  'Snake River Canyon',
  'Maleku Volcano',
  'Gibbs Gorge',
  'Melancholy Hill',
  'Central Valley',
  'Mount Kilimanjaro',
  'Gambino Mesa'
];
var NAMES = {
  M: ['Jose', 'Joe', 'Jack', 'Roberto', 'Alejandro', 'Diego', 'Justin', 'Manuel', 'Victor', 'Gabriel', 'Fabian', 'Stan', 'Marcus'],
  F: ['Catalina', 'Adriana', 'Ana', 'Laura', 'Gabriela', 'Nicole', 'Melissa', 'Katherine', 'Karen', 'Karina', 'Claudia', 'Sofia', 'Julia']
};

var SPECIES = {
  Bear: {
    plants: true,
    meat: true,
    speed: 2
  },
  Gorilla: {
    plants: true,
    meat: true,
    speed: 2
  },
  Lizard: {
    plants: true,
    meat: true,
    speed: 4
  },
  Turtle: {
    plants: true,
    meat: true,
    speed: 0.7
  },
  Pig: {
    plants: true,
    meat: true,
    speed: 2
  },
  Sloth: {
    plants: true,
    meat: true,
    speed: 0.3
  },
  Dragon: {
    meat: true,
    speed: 3
  },
  Cow: {
    plants: true,
    speed: 2
  },
  Koala: {
    plants: true,
    speed: 1
  },
  Unicorn: {
    plants: true,
    speed: 4
  },
  Zebra: {
    plants: true,
    speed: 3
  },
  Wolf: {
    meat: true,
    speed: 4
  },
  Lion: {
    meat: true,
    speed: 3
  },
  Tiger: {
    meat: true,
    speed: 4
  },
  Snake: {
    meat: true,
    speed: 3
  }
};
