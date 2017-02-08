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
    maxEnergy: MAX*1.7,
    maxHealth: MAX*2,
    speed: 2
  },
  Gorilla: {
    plants: true,
    meat: true,
    maxEnergy: MAX*2,
    maxHealth: MAX*2,
    speed: 2
  },
  Lizard: {
    plants: true,
    meat: true,
    maxEnergy: MAX*1.5,
    maxHealth: MAX*0.5,
    speed: 4
  },
  Turtle: {
    plants: true,
    meat: true,
    maxEnergy: MAX*3,
    maxHealth: MAX*3,
    speed: 0.7
  },
  Pig: {
    plants: true,
    meat: true,
    maxEnergy: MAX*1.3,
    maxHealth: MAX*4,
    speed: 2
  },
  Sloth: {
    plants: true,
    meat: true,
    maxEnergy: MAX*0.9,
    maxHealth: MAX,
    speed: 0.3
  },
  Dragon: {
    meat: true,
    maxEnergy: MAX*2,
    maxHealth: MAX*3,
    speed: 3
  },
  Elephant: {
    plants: true,
    maxEnergy: MAX*4,
    maxHealth: MAX*6,
    speed: 2
  },
  Cow: {
    plants: true,
    maxEnergy: MAX*2,
    maxHealth: MAX*2,
    speed: 2
  },
  Koala: {
    plants: true,
    maxEnergy: MAX*2,
    maxHealth: MAX*0.7,
    speed: 1
  },
  Unicorn: {
    plants: true,
    maxEnergy: MAX*4,
    maxHealth: MAX*3,
    speed: 4
  },
  Zebra: {
    plants: true,
    maxEnergy: MAX*3,
    maxHealth: MAX,
    speed: 3
  },
  Wolf: {
    meat: true,
    maxHealth: MAX*2,
    speed: 4
  },
  Lion: {
    meat: true,
    maxEnergy: MAX*0.7,
    maxHealth: MAX*3,
    speed: 3
  },
  Tiger: {
    meat: true,
    maxEnergy: MAX*0.8,
    maxHealth: MAX*4,
    speed: 4
  },
  Snake: {
    meat: true,
    maxEnergy: MAX*0.5,
    maxHealth: MAX*3,
    speed: 5
  }
};
