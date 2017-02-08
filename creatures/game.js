var game = (function () {

    var exports = {};
    var time = Math.round((new Date()).getTime() / 1000); // current UNIX timestamp
    var s = UNIT; // render pixel size
    var w = DIM;
    var h = DIM;
    var m = {x: 0, y: 0}; // normalized mouse coords
    var ctx; // canvas ctx

    var places = [];
    var creatures = [];
    var focusedPlace = null;
    var focusedCreature = null;
    var generalInfo, logInfo, placeInfo, creatureInfo;
    var paused = true;

    function norm(coord) {
      return Math.floor(coord/s);
    }

    function circleContains(cx, cy, r, x, y) {
      return Math.sqrt((x-cx)*(x-cx) + (y-cy)*(y-cy)) < r;
    }

    function title(title) {
      return '<h2>' + title + '</h2>';
    }

    function label(title, value) {
      var str= '<div class="label">' + title + ':</div><div class="label-v">' + value + '</div>';
      str += '<div class="clear"></div>';
      return str;
    }

    function creatureDesc(c) {
      var gender = c.gender === 'M' ? 'male' : 'female';
      return c.name + ', ' + gender + ' ' + c.species;
    }

    exports.init = function (opts) {
      var c = opts.canvas;
      generalInfo = opts.generalInfo;
      placeInfo = opts.placeInfo;
      creatureInfo = opts.creatureInfo;
      logInfo = opts.logInfo;
      ctx = c.getContext('2d');
      c.width = w*s;
      c.height = h*s;
      c.style.width = (w*s)+"px";
      c.style.height = (h*s)+"px";

      c.onmousemove = function (e) {
        m = {x: norm(e.offsetX), y: norm(e.offsetY)};
      };
    };

    exports.render = function () {
      ctx.clearRect(0, 0, w*s, h*s);

      places.forEach(function (p) {
        if (circleContains(p.x, p.y, p.radius, m.x, m.y)) {
          if (!focusedPlace || distance(p, m) < distance(focusedPlace, m)) {
            // get closest place
            focusedPlace = p;
          }
        }

        ctx.fillStyle = '#030';
        ctx.beginPath();
        ctx.arc(p.x*s, p.y*s, p.radius*s, 0, 2*Math.PI, false);
        ctx.fill();
      });

      if (focusedPlace) {
        var p = focusedPlace;
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p.x*s, p.y*s, p.radius*s, 0, 2*Math.PI, false);
        ctx.stroke();

        var str = '';
        str = title(p.name);
        str += label('Food', p.plants.toFixed(2));
        if (p.creatures.length) {
          str += title('Inhabitants ');
          str += '<ul><li>' + p.creatures.map(creatureDesc).join('</li><li>') + '</li></ul>';
        }
        placeInfo.innerHTML = str;
      }

      creatures.forEach(function (c) {
        if (circleContains(c.x, c.y, NEARNESS, m.x, m.y)) {
          if (!focusedCreature || distance(c, m) < distance(focusedCreature, m)) {
            // get closest creature
            focusedCreature = c;
          }
        }

        if (c.gender === 'M') {
          ctx.fillStyle = '#0aa';
        } else {
          if (c.partner) {
            ctx.fillStyle = '#a33';
          } else {
            ctx.fillStyle = '#a0a';
          }
        }


        ctx.beginPath();
        ctx.arc(c.x*s, c.y*s, s/2, 0, 2*Math.PI, false);
        ctx.fill();
      });

      if (focusedCreature && !focusedCreature.dead) {
        var c = focusedCreature;
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.arc(c.x*s, c.y*s, s/2+0.5, 0, 2*Math.PI, false);
        ctx.stroke();

        // TODO: bars
        var str = title(creatureDesc(c));
        str += label('Age', formatDuration(time-c.born));
        str += label('Happiness', c.happiness.toFixed(2));
        str += label('Health', c.health.toFixed(2));
        str += label('Fullness', c.fullness.toFixed(2));
        str += label('Energy', c.energy.toFixed(2));
        str += label('Sleeping', c.asleep ? 'Yes' : 'No');
        str += label('Hungry', c.hungry ? 'Yes' : 'No');
        str += label('Settled', c.settled ? 'At ' + c.place.name : 'No');
        str += label('Pregnant', c.partner ? 'From ' + creatureDesc(c.partner) : 'No');
        if (c.partner) {
          str += label('Due in', formatDuration(c.pregnancy.timeLeft()));
        }
        str += '<div class="status">' + c.status + '</div>';
        creatureInfo.innerHTML = str;
      } else {
        creatureInfo.innerHTML = '';
      }

      var general = label('Date', moment(time * 1000).format(DATE_FORMAT));
      generalInfo.innerHTML = general;
    };

    exports.creaturesNearTo = function (c1) {
      return creatures.filter(function (c2) {
        return c1 !== c2 && distance(c1, c2) <= NEARNESS;
      });
    };

    exports.nearestInterestingCreature = function (c1) {
      var candidates = creatures.filter(function (c2) {
        return c1 !== c2 && distance(c1, c2) <= MAX_PLACE_RAD;
      });
      if (!candidates) {
        return null;
      }
      return candidates.sort(function (c2) {
        return c1.species === c2.species ? (c1.gender === c2.gender ? 1 : -1) : -2;
      })[0];
    };

    exports.nearestPlaceTo = function (c) {
      var all = places.slice();
      var found = all;

      if (c.gender === 'M') {
        found = found.filter(function (p) {
          return p.creatures.filter(function (c) {
            return c.gender === 'F'
          }).length > 0;
        });
        if (!found.length) {
          found = all;
        }
      }

      if (c.lastPlace) {
        remove(found, c.lastPlace);
      }

      return found.sort(function (p1, p2) {
        return distance(c, p1) - distance(c, p2);
      })[0];
    };

    exports.tick = function () {
      if (paused) {
        return;
      }
      creatures.forEach(function (c) {
        c.tick();
      });
      places.forEach(function (p) {
        p.tick();
      });
      time += TIME_STEP;
    };

    exports.emit = function (creature, obj, description) {
      if (obj instanceof Creature) {
        description += ' ' + obj.name + ' (' + obj.species + ')';
      } else if (obj instanceof Place) {
        description += ' ' + obj.name;
      }

      creature.status = creature.name + ' (' + creature.species + ') ' + description;

      var entry = document.createElement('div');
      entry.innerText = moment(time * 1000).format(SHORT_DATE_FORMAT) + ': ' + creature.status;
      logInfo.appendChild(entry);
      logInfo.scrollTop = logInfo.scrollHeight;

      if (description === 'died') {
        remove(creatures, creature);
      }
    };

    exports.addCreature = function (opts) {
      var c = new Creature(opts, exports);
      creatures.push(c);
      return c;
    };

    exports.addPlace = function (opts) {
      places.push(new Place(opts, exports));
    };

    exports.getTime = function () {
      return time;
    };

    exports.togglePause = function () {
      paused = !paused;
      return paused;
    };

    return exports;
}());
