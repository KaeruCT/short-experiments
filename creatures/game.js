var game = (function () {

    var exports = {};
    var speed = 1; // adjustable speed
    var time = Math.round((new Date()).getTime() / 1000); // current UNIX timestamp
    var s = UNIT; // render pixel size
    var w = DIM;
    var h = DIM;
    var m = {x: 0, y: 0}; // normalized mouse coords
    var ctx; // canvas ctx
    var queuedLogs = [];
    var renderTime;

    var places = [];
    var creatures = [];
    var focusedPlace = null;
    var focusedCreature = null;
    var generalInfo, logInfo, placeInfo, creatureInfo;
    var paused = true;

    var stats = {
      born: 0,
      died: 0
    };

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
      return c.name + ' (' + gender + ' ' + c.species + ')';
    }

    function familyTree(ancestors) {
      if (!ancestors.length) {
        return '';
      }
      var str = '<div class="tnode">- Mother: ' + ancestors[0].name + familyTree(ancestors[0].ancestors) + '</div>';
      str += '<div class="tnode">- Father: ' + ancestors[1].name + familyTree(ancestors[1].ancestors) + '</div>';
      return str;
    };

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
      c.style.background = COLORS.bg;

      c.onmousemove = function (e) {
        m = {x: norm(e.offsetX), y: norm(e.offsetY)};
      };
    };

    exports.render = function () {
      var now = new Date().getTime();
      refreshHTML = speed < 4 || now - renderTime < speed;
      renderTime = now;

      ctx.clearRect(0, 0, w*s, h*s);

      places.forEach(function (p) {
        if (circleContains(p.x, p.y, p.radius, m.x, m.y)) {
          if (!focusedPlace || distance(p, m) < distance(focusedPlace, m)) {
            // get closest place
            focusedPlace = p;
          }
        }

        if (p.creatures.length) {
          ctx.fillStyle = COLORS.placeFull;
        } else {
          ctx.fillStyle = COLORS.placeEmpty;
        }
        ctx.beginPath();
        ctx.arc(p.x*s, p.y*s, p.radius*s, 0, 2*Math.PI, false);
        ctx.fill();

        // fullness
        ctx.fillStyle = COLORS.placePlants;
        ctx.beginPath();
        ctx.arc(p.x*s, p.y*s, p.radius*s*p.plants/p.maxPlants, 0, 2*Math.PI, false);
        ctx.fill();
      });

      if (focusedPlace) {
        var p = focusedPlace;
        ctx.strokeStyle = COLORS.focus;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x*s, p.y*s, p.radius*s, 0, 2*Math.PI, false);
        ctx.stroke();

        if (refreshHTML) {
          var str = '';
          str = title(p.name);
          str += '<div class="info">';
          str += label('Food', p.plants.toFixed(2) + '/' + p.maxPlants.toFixed(2));
          str += '</div>';
          if (p.creatures.length) {
            str += title('Population');
            str += '<ul><li>' + p.creatures.map(creatureDesc).join('</li><li>') + '</li></ul>';
          }
          placeInfo.innerHTML = str;
        }
      }

      var crm = function (c) {
        // creature radius multiplier
        var val = s/2 * ((c.maxHealth)/MAX);
        val = Math.max(0.5, Math.min(val, UNIT*0.75));
        return val;
      };

      creatures.forEach(function (c) {
        if (circleContains(c.x, c.y, NEARNESS, m.x, m.y)) {
          if (!focusedCreature || distance(c, m) < distance(focusedCreature, m)) {
            // get closest creature
            focusedCreature = c;
          }
        }

        if (c.gender === 'M') {
          ctx.fillStyle = COLORS.male;
        } else {
          if (c.partner) {
            ctx.fillStyle = COLORS.pregnant;
          } else {
            ctx.fillStyle = COLORS.female;
          }
        }

        ctx.beginPath();
        ctx.arc(c.x*s, c.y*s, crm(c), 0, 2*Math.PI, false);
        ctx.fill();
      });

      if (focusedCreature && !focusedCreature.dead) {
        var c = focusedCreature;
        ctx.strokeStyle = COLORS.focus;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(c.x*s, c.y*s, crm(c)+0.5, 0, 2*Math.PI, false);
        ctx.stroke();

        // TODO: bars
        if (refreshHTML) {
          var str = title(creatureDesc(c));
          str += label('Age', formatDuration(time-c.born));
          str += label('Happiness', c.happiness.toFixed(2));
          str += label('Health', c.health.toFixed(2));
          str += label('Fullness', c.fullness.toFixed(2));
          str += label('Speed', c.speed.toFixed(2));
          str += label('Energy', c.energy.toFixed(2));
          str += label('Sleeping', c.asleep ? 'Yes' : 'No');
          str += label('Hungry', c.hungry ? 'Yes' : 'No');
          str += label('Settled', c.settled ? 'At ' + c.place.name : (c.place ? 'Heading to ' + c.place.name : 'No'));
          str += label('Pregnant', c.partner ? 'From ' + creatureDesc(c.partner) : 'No');
          if (c.partner) {
            str += label('Due in', formatDuration(c.pregnancy.timeLeft()));
          }
          str += '<div class="status">' + c.status + '</div>';
          var tree = familyTree(c.ancestors);
          if (tree) {
            str += '<div class="status">' + tree + '</div>';
          }
          creatureInfo.innerHTML = str;
        }
      } else {
        creatureInfo.innerHTML = '';
      }

      if (refreshHTML) {
        var general = label('Date', moment(time * 1000).format(DATE_FORMAT));
        general += label('Population', creatures.length);
        general += label('Births', stats.born);
        general += label('Deaths', stats.died);
        generalInfo.innerHTML = general;

        if (logInfo.children.length > 300 && queuedLogs.length) {
          // TODO: make configurable?
          logInfo.innerHTML = '';
        }
        var logEntry;
        while (logEntry = queuedLogs.shift()) {
          var entry = document.createElement('div');
          entry.innerText = logEntry;
          logInfo.appendChild(entry);
          logInfo.scrollTop = logInfo.scrollHeight;
        }
      }
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
      var found = all.slice();

      if (c.gender === 'M') {
        found = found.filter(function (p) {
          return p.creatures.filter(function (c) {
            return c.gender === 'F';
          }).length > 0;
        });
        c.lastPlaces.forEach(function (p) {
          remove(found, p);
        });
        if (!found.length) {
          found = all;
        }
      }

      c.lastPlaces.forEach(function (p) {
        remove(found, p);
      });
      found = found.sort(function (p1, p2) {
        // prefer places with food, then other creatures, then closest
        var val = 0;
        if (c.hungry) {
          if (!c.eatsMeat()) {
            val += (p1.plants - p2.plants)/MAX;
          } else {
            val += 10*(p1.creatures.filter(filters.differentSpecies(c)).length - p2.creatures.filter(filters.differentSpecies(c)).length);
          }
        } else {
          // prefer places with other creatures if not hungry
          val += p1.creatures.length - p2.creatures.length;
        }
        val += distance(c, p1) - distance(c, p2);
        return Math.floor(val*100);
      });
      return found[0];
    };

    exports.tick = function () {
      if (paused) {
        return;
      }

      for (var i = 0; i < speed; i++) {
        creatures.forEach(function (c) {
          if (!c.dead) {
            c.tick();
          }
        });
        places.forEach(function (p) {
          p.tick();
        });
        time += TIME_STEP;
      }
    };

    exports.emit = function (creature, obj, description) {
      if (obj instanceof Creature) {
        description += ' ' + creatureDesc(obj);
      } else if (obj instanceof Place) {
        description += ' ' + obj.name;
      }

      creature.status = creatureDesc(creature) + ' ' + description;
      queuedLogs.push(moment(time * 1000).format(SHORT_DATE_FORMAT) + ': ' + creature.status);

      if (description.startsWith('was born')) {
        stats.born += 1;
      }
      if (description.startsWith('died')) {
        stats.died += 1;
        remove(creatures, creature);
      }
    };

    exports.addCreature = function (opts) {
      var c = new Creature(opts, exports);
      creatures.push(c);
      return c;
    };

    exports.addPlace = function (opts) {
      var overlapping = places.some(function (p) {
        return  Math.hypot(opts.x-p.x, opts.y-p.y) <= (opts.radius + p.radius);
      });
      if (overlapping) {
        return false;
      }
      places.push(new Place(opts, exports));
      return true;
    };

    exports.getTime = function () {
      return time;
    };

    exports.setSpeed = function (val) {
      speed = +val || 1;
      return speed;
    };

    exports.togglePause = function () {
      paused = !paused;
      return paused;
    };

    return exports;
}());
