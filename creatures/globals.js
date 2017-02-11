var MAX = 100;
var DIM = 80; // world dimensions
var UNIT = 8;
var NEARNESS = 2;
var MIN_PLACE_RAD = 3;
var MAX_PLACE_RAD = 8;
var MAX_NAME_LENGTH = 16;

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
  M: ['Herbie', 'Zack', 'Samuel', 'Viktor', 'MC Ride', 'Lemmy', 'Freddie', 'Travis', 'Ernesto', 'Julio', 'Pablo', 'Rafael', 'Gerardo', 'James', 'Michael', 'Jose', 'Joe', 'Ken', 'Jack', 'Rafael', 'Kanye', 'Luis', 'Roberto', 'Chance', 'Carlos', 'Alejandro', 'Frank', 'Diego', 'Justin', 'Manuel', 'Victor', 'Gabriel', 'Fabian', 'Donald', 'Mohammed', 'Stan', 'Jeff', 'Oscar', 'David', 'Devin', 'William', 'Marcus'],
  F: ['Ericka', 'Rosa', 'Catalina', 'Jade', 'Jenny', 'Jaime', 'Janice', 'Lauryn', 'Maria', 'Adriana', 'Ana', 'Laura', 'Gabriela', 'Nicole', 'Melissa', 'Katherine', 'Karen', 'Karina', 'Claudia', 'Sofia', 'Julia', 'Andrea', 'Lisa', 'Hillary', 'Daniela', 'Alexa', 'Wanda', 'Isabelle', 'Michelle', 'Cassandra', 'Samantha', 'Francisca', 'Yuki', 'Natalia', 'Taylor', 'Paula', 'Haruhi', 'Miku', 'Bianca', 'Yoko', 'Rita', 'Remy']
};

var SPECIES = {
  Bear: {
    plants: true,
    meat: true,
    maxEnergy: MAX*1.7,
    maxHealth: MAX*2,
    speed: 2,
    gestation: 2 * WEEK,
    maxAge: 6 * MONTH
  },
  Gorilla: {
    plants: true,
    meat: true,
    maxEnergy: MAX*2,
    maxHealth: MAX*2,
    speed: 2,
    gestation: 3 * WEEK,
    maxAge: 6 * MONTH
  },
  Lizard: {
    plants: true,
    meat: true,
    maxEnergy: MAX*1.5,
    maxHealth: MAX*0.5,
    speed: 4,
    gestation: 3 * WEEK,
    maxAge: 3 * MONTH
  },
  Turtle: {
    plants: true,
    meat: true,
    maxEnergy: MAX*1.7,
    maxHealth: MAX*1.6,
    gestation: 1 * WEEK,
    maxAge: 5 * MONTH,
    speed: 0.7
  },
  Mouse: {
    plants: true,
    maxEnergy: MAX*3,
    maxHealth: MAX*4,
    gestation: 0.5 * DAY,
    maxAge: 4 * MONTH,
    speed: 6,
  },
  Rabbit: {
    plants: true,
    maxEnergy: MAX*5,
    maxHealth: MAX*2,
    gestation: 1.6 * DAY,
    maxAge: 1 * MONTH,
    speed: 8
  },
  Boar: {
    plants: true,
    meat: true,
    maxEnergy: MAX*1.3,
    maxHealth: MAX*4,
    speed: 2,
    gestation: 1.5 * WEEK,
    maxAge: 9 * MONTH
  },
  Sloth: {
    plants: true,
    meat: true,
    maxEnergy: MAX*0.9,
    maxHealth: MAX,
    speed: 0.4,
    gestation: 2 * WEEK,
    maxAge: 8 * MONTH
  },
  Dragon: {
    meat: true,
    maxEnergy: MAX*2,
    maxHealth: MAX*3,
    speed: 2.5,
    gestation: 1.2 * WEEK,
    maxAge: 4 * YEAR
  },
  Elephant: {
    plants: true,
    maxEnergy: MAX*4,
    maxHealth: MAX*6,
    speed: 2,
    gestation: 4 * WEEK,
    maxAge: 3 * YEAR
  },
  Koala: {
    plants: true,
    maxEnergy: MAX*2,
    maxHealth: MAX*0.7,
    speed: 1,
    gestation: 0.3 * WEEK,
    maxAge: 6 * MONTH
  },
  Unicorn: {
    plants: true,
    maxEnergy: MAX*4,
    maxHealth: MAX*3,
    speed: 4,
    gestation: 2 * WEEK,
    maxAge: 3 * YEAR
  },
  Zebra: {
    plants: true,
    maxEnergy: MAX*3,
    maxHealth: MAX*2,
    speed: 3,
    gestation: 3 * WEEK,
    maxAge: 10 * MONTH
  },
  Fox: {
    meat: true,
    plants: true,
    maxHealth: MAX*1.5,
    speed: 3,
    gestation: 0.3 * WEEK,
    maxAge: 3 * MONTH
  },
  Wolf: {
    meat: true,
    maxHealth: MAX*2,
    speed: 4,
    gestation: 0.5 * WEEK,
    maxAge: 7 * MONTH
  },
  Lion: {
    meat: true,
    maxEnergy: MAX*0.7,
    maxHealth: MAX*3,
    speed: 3,
    gestation: 3 * WEEK,
    maxAge: 11 * MONTH
  },
  Tiger: {
    meat: true,
    maxEnergy: MAX*0.8,
    maxHealth: MAX*4,
    speed: 4,
    gestation: 2.7 * WEEK,
    maxAge: 2 * YEAR
  },
  Snake: {
    meat: true,
    maxEnergy: MAX*0.5,
    maxHealth: MAX*2.5,
    speed: 4,
    gestation: 1.2 * WEEK,
    maxAge: 7 * MONTH
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
