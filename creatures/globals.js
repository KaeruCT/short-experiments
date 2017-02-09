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
var YEAR = 12 * MONTH;

var TICK_TIME = 0.1; // how much to wait between ticks, in seconds
var TIME_STEP = HOUR * TICK_TIME; // how many seconds to count per tick, shouldn't be changed... smoothing issues

var GENDERS = ['M', 'F'];

var PLACES = [
  'Deltron Station',
  'Ioka Hill',
  'Cut Copy Valley',
  'Snake River Canyon',
  'Maleku Volcano',
  'Ikana Valley',
  'Mount DOOM',
  'Dragon Roost Cavern',
  'Haunted Gorge',
  'The Phantom Forest',
  'Forest Haven',
  'Blue Ridge Mountain',
  'Holy Peak',
  'Gibbs Gorge',
  'Lauryn Hill',
  'Fiasco Peak',
  'Melancholy Hill',
  'Drumheller',
  'Sburban Jungle',
  'Central Valley',
  'The Veldt',
  'Ill Peak',
  'Forest Of Oversensitivity',
  'Singing Mountain',
  'Death Mountain',
  'Mount Kilimanjaro',
  'Gambino Mesa',
  'Mount Trantor',
  'Terminus Savannah',
  'Kalgan'
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
    speed: 2,
    gestation: 6 * WEEK
  },
  Gorilla: {
    plants: true,
    meat: true,
    maxEnergy: MAX*2,
    maxHealth: MAX*2,
    speed: 2,
    gestation: 8 * WEEK
  },
  Lizard: {
    plants: true,
    meat: true,
    maxEnergy: MAX*1.5,
    maxHealth: MAX*0.5,
    speed: 4,
    gestation: 3 * WEEK
  },
  Turtle: {
    plants: true,
    meat: true,
    maxEnergy: MAX*3,
    maxHealth: MAX*3,
    gestation: 1 * WEEK,
    speed: 0.7
  },
  Mouse: {
    plants: true,
    maxEnergy: MAX*3,
    maxHealth: MAX*0.5,
    gestation: 1 * DAY,
    speed: 4
  },
  Rabbit: {
    plants: true,
    maxEnergy: MAX*5,
    maxHealth: MAX*2,
    gestation: 2 * DAY,
    speed: 6
  },
  Mouse: {
    plants: true,
    maxEnergy: MAX*3,
    maxHealth: MAX*0.5,
    gestation: 1 * DAY,
    speed: 4
  },
  Boar: {
    plants: true,
    meat: true,
    maxEnergy: MAX*1.3,
    maxHealth: MAX*4,
    speed: 2,
    gestation: 4 * WEEK
  },
  Sloth: {
    plants: true,
    meat: true,
    maxEnergy: MAX*0.9,
    maxHealth: MAX,
    speed: 0.4,
    gestation: 6 * WEEK
  },
  Dragon: {
    meat: true,
    maxEnergy: MAX*2,
    maxHealth: MAX*3,
    speed: 2.5,
    gestation: 5 * WEEK
  },
  Elephant: {
    plants: true,
    maxEnergy: MAX*4,
    maxHealth: MAX*6,
    speed: 2,
    gestation: 22 * WEEK
  },
  Koala: {
    plants: true,
    maxEnergy: MAX*2,
    maxHealth: MAX*0.7,
    speed: 1,
    gestation: 1 * WEEK,
  },
  Unicorn: {
    plants: true,
    maxEnergy: MAX*4,
    maxHealth: MAX*3,
    speed: 4,
    gestation: 9 * WEEK
  },
  Zebra: {
    plants: true,
    maxEnergy: MAX*3,
    maxHealth: MAX*2,
    speed: 3,
    gestation: 10 * WEEK
  },
  Fox: {
    meat: true,
    plants: true,
    maxHealth: MAX*1.5,
    speed: 3,
    gestation: 1 * WEEK
  },
  Wolf: {
    meat: true,
    maxHealth: MAX*2,
    speed: 4,
    gestation: 2 * WEEK
  },
  Lion: {
    meat: true,
    maxEnergy: MAX*0.7,
    maxHealth: MAX*3,
    speed: 3,
    gestation: 4 * WEEK
  },
  Tiger: {
    meat: true,
    maxEnergy: MAX*0.8,
    maxHealth: MAX*4,
    speed: 4,
    gestation: 3.5 * WEEK
  },
  Snake: {
    meat: true,
    maxEnergy: MAX*0.5,
    maxHealth: MAX*2.5,
    speed: 4,
    gestation: 2 * WEEK
  }
};

var COLORS = {
  male: '#3BECEF',
  female: '#F461AB',
  pregnant: '#D83C51',
  placeEmpty: '#5B6358',
  placeFull: '#637766',
  placePlants: 'rgba(20, 80, 20, 0.7)',
  focus: 'rgba(255, 255, 255, 0.6)',
  bg: '#352E29'
};
