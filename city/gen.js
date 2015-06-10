window.r = new Math.seedrandom('soca');

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
    this.expandRadius = 200;
    this.minObjSize = 5;
    this.maxObjSize = 20; // should be kept way lower than chunk size
    this.minBetweenObj = 5;
    this.chunkSize = 100;
  };

  Generator.prototype = {
    step: function () {
      if (this.objs.length !== 0 && false) {
        // place something next to something else
        var obj = this.findRandObj();
        var newObj = {};
        var chunk = this.chunkCoords(obj);
        var relCoords = this.relativeChunkCoords(obj);
        var minSpaceRequired = this.minObjSize + this.minBetweenObj;
        var edges = {
          top: relCoords.x,
          left: relCoords.y,
          bottom: relCoords.x + obj.w,
          right: relCoords.y + obj.h
        };
        var margin = {
          top: edges.top,
          left: edges.left,
          right: edges.right - this.chunkSize,
          bottom: edges.bottom - this.chunkSize,
        };

        if (margin.left > margin.right && margin.left > minSpaceRequired) {
          newObj.x = this.minBetweenObj;
          newObj.w = randRange(this.minObjSize, edges.left - this.minBetweenObj);
        } else if (margin.right > minSpaceRequired) {
          newObj.x = edges.right + this.minBetweenObj;
          newObj.w = randRange(this.minObjSize, this.chunkSize - edges.right);
        }
        if (margin.top > margin.bottom && margin.top > minSpaceRequired) {
          newObj.y = this.minBetweenObj;
          newObj.h = randRange(this.minObjSize, edges.top - this.minBetweenObj);
        } else if (margin.bottom > minSpaceRequired) {
          newObj.y = edges.bottom + this.minBetweenObj;
          newObj.h = randRange(this.minObjSize, this.chunkSize - edges.bottom);
        }
        if ('x' in newObj && 'y' in newObj) {
          // translate relative coords back to global coords
          newObj.x += chunk.x * this.chunkSize;
          newObj.y += chunk.y * this.chunkSize;
          if (this.collidingObj(newObj) === null) {
            this.place(new MapObject(newObj));
          }
        }
      } else {
        // place something within expand radius of last object
        var coords;
        if (this.objs.length !== 0) {
          coords = this.objs[this.objs.length-1];
        }
        coords = this.radiusRange(coords);
        var newObj = new MapObject(this.randObjSize()).setCoords(coords);

        if (this.collidingObj(newObj) === null) {
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
      if (x < 0) x += this.chunkSize;
      if (y < 0) y += this.chunkSize;

      return {
        x: x - chunk.x * this.chunkSize,
        y: y - chunk.y * this.chunkSize,
      };
    },

    chunkCoords: function (coords) {
      coords = coords || {x: 0, y : 0};
      return {
        x: Math.floor(coords.x/this.chunkSize),
        y: Math.floor(coords.y/this.chunkSize)
      };
    },

    radiusRange: function (coords) {
      coords = coords || {x: 0, y : 0};
      return {
        x: randRange(coords.x - this.expandRadius, this.expandRadius),
        y: randRange(coords.y - this.expandRadius, this.expandRadius)
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
        // make obj a little bigger before comparing
        var obj2 = {
          x: objs[o].x - this.minBetweenObj,
          y: objs[o].y - this.minBetweenObj,
          w: objs[o].w + this.minBetweenObj,
          h: objs[o].h + this.minBetweenObj
        };

        if (rectIntersect(
          this.relativeChunkCoords(obj),
          this.relativeChunkCoords(obj2)) {
          return obj;
        }
      }
      return null;
    }
  };
  return Generator;
}());
