window.r = new Math.seedrandom('raindrops');

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

window.Generator = (function() {
  var MapObject = function (obj, withParts) {
    var minPartSize = 5;
    this.x = obj.x || 0;
    this.y = obj.y || 0;
    this.w = obj.w || 0;
    this.h = obj.h || 0;
    this.parts = [];

    if (withParts) {
      for (var i = 0; i < randRange(2,8); i++) {
        var x = randRange(0, this.w - minPartSize);
        var y = randRange(0, this.h - minPartSize);
        this.parts.push(new MapObject({
          x: x, y: y,
          w: randRange(minPartSize, this.w - x),
          h: randRange(minPartSize, this.h - y)
        }));
      }
    }
  };
  MapObject.prototype = {
    setCoords: function (coords) {
      this.x = coords.x;
      this.y = coords.y;
      return this;
    },
    getCenter: function () {
      return {
        x: this.x + this.w/2,
        y: this.y + this.h/2
      };
    }
  };

  var Generator = function () {
    this.map = {};
    this.objs = [];
    this.expandRadius = 100;
    this.minObjSize = 10;
    this.maxObjSize = 30; // should be kept way lower than chunk size
    this.minBetweenObj = 10;
    this.chunkSize = 100;
  };

  Generator.prototype = {
    step: function () {
      if (this.objs.length !== 0 && randBool()) {
        // place something next to something else
        var obj = this.findRandObj().getCenter();
        var newObj = new MapObject(this.randObjSize(), true).setCoords(this.radiusRange(obj));
        if (!this.onChunkEdge(newObj) && this.collidingObj(newObj) === null) {
          this.place(newObj);
        }
      } else {
        // place something within expand radius of random
        var coords = {x: 0, y: 0};
        if (this.objs.length !== 0) {
          coords = this.findRandObj();
        }
        var newObj = new MapObject(this.randObjSize(), true).setCoords(this.radiusRange(coords));

        if (!this.onChunkEdge(newObj) && this.collidingObj(newObj) === null) {
          this.place(newObj);
        }
      }

      return this;
    },

    place: function(obj, coords) {
      coords = coords || obj;
      var chunk = this.chunkCoords(coords);
      // initialize chunk if it's empty
      if (!this.map[chunk.y]) this.map[chunk.y] = [];
      if (!this.map[chunk.y][chunk.x]) this.map[chunk.y][chunk.x] = [];

      this.map[chunk.y][chunk.x].push(obj);
      this.objs.push(obj);
    },

    relativeChunkCoords: function (coords) {
      var chunk = this.chunkCoords(coords);
      var x = coords.x;
      var y = coords.y;
      if (x < 0) x = (x % this.chunkSize) + this.chunkSize;
      else x -=chunk.x * this.chunkSize;
      if (y < 0) y = (y % this.chunkSize) + this.chunkSize;
      else y -= chunk.y * this.chunkSize;

      return {
        x: x,
        y: y,
      };
    },

    chunkCoords: function (coords) {
      return {
        x: Math.floor(coords.x/this.chunkSize),
        y: Math.floor(coords.y/this.chunkSize)
      };
    },

    radiusRange: function (coords) {
      return {
        x: randRange(coords.x, this.expandRadius * 2) - this.expandRadius,
        y: randRange(coords.y, this.expandRadius * 2) - this.expandRadius
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

    onChunkEdge: function (obj) {
      var coords = this.relativeChunkCoords(obj);
      if (coords.x + obj.w >= this.chunkSize) return true;
      if (coords.y + obj.h >= this.chunkSize) return true;
      return false;
    },

    collidingObj: function (obj) {
      var c = this.relativeChunkCoords(obj);
      var chunk = this.chunkCoords(obj);
      if (!this.map[chunk.y]) return null;
      if (!this.map[chunk.y][chunk.x]) return null;

      var objs = this.map[chunk.y][chunk.x];
      for (var o in objs) {
        var robj = {
          x: c.x, y: c.y, w: obj.w, h: obj.h
        };

        var c2 = this.relativeChunkCoords(objs[o]);
        // make robj2 a little bigger before comparing
        var robj2 = {
          x: Math.max(c2.x - this.minBetweenObj, 0),
          y: Math.max(c2.y - this.minBetweenObj, 0),
          w: objs[o].w + this.minBetweenObj,
          h: objs[o].h + this.minBetweenObj
        };

        if (rectIntersect(robj, robj2)) {
          return obj;
        }
      }
      return null;
    }
  };
  return Generator;
}());
