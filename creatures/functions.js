function randv(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function distance(p1, p2) {
  return Math.hypot(p1.x-p2.x, p1.y-p2.y);
}

function formatDuration(value) {
  function s (val) {
    return s === 1 ? '' : 's';
  }
  var days = Math.floor(value/86400);
  value = value%86400;
  var hours = Math.floor(value/3600);
  value = value%3600;
  var minutes = Math.floor(value/60);
  value = value%60;
  return (days ? days + ' day' + s(days) + ' ' : '')
       + (hours + ' hour' + s(hours) + ' ')
       + (minutes + ' minute' + s(minutes) + ' ')
       + (value ? value + 's' : '');
}

function remove(arr, el) {
  arr.splice(arr.indexOf(el), 1);
}

function fuseNames(name1, name2) {
  function isVocal(char) {
    return 'AEIOUaeiou'.indexOf(char) !== -1;
  }
  var name = '';
  for (var i = 0; i < name1.length; i++) {
    name += name1[i];
    if (i >= Math.floor(name1.length/2)-1 && !isVocal(name1[i]) || name.length > MAX_NAME_LENGTH/2) break;
  }
  for (var i = Math.floor(name2.length/2); i < name2.length; i++) {
    name += name2[i];
    if (i >= name2.length && !isVocal(name2[i]) || name.length > MAX_NAME_LENGTH/2) break;
  }
  return name;
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
