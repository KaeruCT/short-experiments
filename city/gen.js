window.Generator = (function() {
  var MapObject = function (obj, withParts) {
    var minPartSize = 10;
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
    this.expandRadius = 300;
    this.minObjSize = 20;
    this.maxObjSize = 50; // should be kept way lower than chunk size
    this.minBetweenObj = 5;
    this.chunkSize = 200;
  };

  Generator.prototype = {
    step: function () {
      var coords = {x: 0, y: 0};
      if (this.objs.length !== 0) {
        coords = this.findRandObj().getCenter();
      }
      var newObj = new MapObject(this.randObjSize(), true).setCoords(this.radiusRange(coords));

      if (!this.onChunkEdge(newObj) && this.collidingObj(newObj) === null) {
        this.place(newObj);
      }

      if (randBool()) {

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
        x: randRange(coords.x - this.expandRadius, coords.x + this.expandRadius),
        y: randRange(coords.y - this.expandRadius, coords.y + this.expandRadius)
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
