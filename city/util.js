var randBool = function () {
  return r() > 0.5;
};

var randRange = function () {
  var args = Array.prototype.slice.call(arguments);
  var max = Math.max.apply(null, args);
  var min = Math.min.apply(null, args);
  if (min === max) return min;
  return Math.floor(r() * (max - min + 1)) + min;
};

var randValue = function (obj) {
  var keys = Object.keys(obj);
  return obj[keys[randRange(0, keys.length-1)]];
}

var rectIntersect = function (r1, r2) {
  return !(r2.x > r1.x + r1.w ||
           r2.x + r2.w < r1.x ||
           r2.y > r1.y + r1.h ||
           r2.y + r2.h < r1.y);
}
