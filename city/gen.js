window.r = new Math.seedrandom('montegoslay');

var randBool = function () {
  return r() > 0.5;
};

var randRange = function (max, min) {
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

window.Generator = (function() {
  var MapObject = function (obj, withParts) {
    var minPartSize = 4;

    this.x = obj.x || 0;
    this.y = obj.y || 0;
    this.w = obj.w || 0;
    this.h = obj.h || 0;
    this.parts = [];

    if (withParts) {
      for (var i = 0; i < 3; i++) {
        var x = randRange(0, this.w - minPartSize);
        var y = randRange(0, this.h - minPartSize);
        parts.push(new MapObject({
          x: x, y: y,
          w: randRange(0, this.w - x),
          h: randRange(0, this.h - y)
        }));
      }
    }
  };
  MapObject.prototype = {
    setCoords: function (pos) {
      this.x = pos.x;
      this.y = pos.y;
      return this;
    },
    getCenter: function () {
      return {
        x: this.x - this.w/2,
        y: this.y - this.h/2
      };
    }
  };

  var Generator = function () {
    this.map = {};
    this.objs = [];
    this.expandRadius = 100;
    this.minObjSize = 5;
    this.maxObjSize = 20;
    this.chunkSize = 50;
  };

  Generator.prototype = {
    step: function () {
      if (this.objs.length != 0 && randBool()) {
        // place something next to something else
        var coords = this.findRandObj().getCenter();
        coords = this.radiusRange(coords.x, coords.y);
        var obj = new MapObject(this.randObjSize()).setCoords(coords);

        if (this.collidingObj(obj) == null) {
          this.placeAt(obj, coords);
        }
      } else {
        this.placeAt(new MapObject(this.randObjSize()), {x: 0, y: 0});
      }

      return this;
    },

    placeAt: function(obj, pos) {
      var chunkX = Math.floor(pos.x/this.chunkSize);
      var chunkY = Math.floor(pos.y/this.chunkSize);
      // initialize chunk if it's empty
      if (!this.map[chunkY]) this.map[chunkY] = [];
      if (!this.map[chunkY][chunkX]) this.map[chunkY][chunkX] = [];

      this.map[chunkY][chunkX] = obj;
      this.objs.push(obj);
    },

    radiusRange: function (x, y) {
      return {
        x: randRange(x - this.expandRadius, this.expandRadius),
        y: randRange(y - this.expandRadius, this.expandRadius)
      };
    },

    randObjSize: function () {
      return {
        w: randRange(this.minObjSize, this.maxObjSize),
        h: randRange(this.minObjSize, this.maxObjSize)
      };
    },

    findRandObj: function () {
      return randValue(this.objs);
    },

    collidingObj: function (obj) {
      var chunkX = Math.floor(obj.x/this.chunkSize);
      var chunkY = Math.floor(obj.y/this.chunkSize);
      if (!this.map[chunkY]) return null;
      if (!this.map[chunkY][chunkY]) return null;

      var objs = this.map[chunkY][chunkX];
      for (var o in objs) {
        var obj2 = objs[o];
        if (rectIntersect(obj, obj2)) {
          return obj;
        }
      }
      return null;
    }
  };
  return Generator;
}());
