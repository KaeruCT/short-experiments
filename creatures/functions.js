function randv(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function distance(p1, p2) {
  return Math.hypot(p1.x-p2.x, p1.y-p2.y);
}

function remove(arr, el) {
  arr.splice(arr.indexOf(el), 1);
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
  differentGender: function (c1) {
    return function (c2) {
      return c1.gender !== c2.gender;
    };
  },
};
