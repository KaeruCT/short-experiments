(function (exports) {
    var canvas, canvas2, ctx, ctx2, gens, objects,
        tsize, onLoop, tcolor, d,
        requestAnimFrame =
        window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        },
        Game = {
            init: init,
            gravity: 0.08,
            md: 0.1,
            maxy: 10,
            maxx: 5,
            width: 0,
            height: 0,
            tsize: 1,
            tick: 0,
            generators: function () {
                return gens;
            },
            top_edge: function (p) {
                var cy = Game.tsize * Math.floor(p.y/Game.tsize);
                return p.y*2-cy;
            },
            bottom_edge: function (p) {
                var cy = Game.tsize * Math.floor(p.y/Game.tsize);
                if (p.y+p.r >= Game.height) return Game.height-p.r;
                return cy-p.r+Game.tsize;
            },
            left_edge: function (p) {
                var cx = Game.tsize * Math.floor(p.x/Game.tsize);
                return p.x*2-cx;
            },
            right_edge: function (p) {
                var cx = Game.tsize * Math.floor(p.x/Game.tsize);
                return p.x*2-cx-Game.tsize;
            },
            size: function (w, h) {
                var i;
                Game.width = canvas.width = w;
                Game.height = canvas.height = h;
                canvas2.width = w;
                canvas2.height = h;

                if (gens) {
                    for (i = 0; i < gens.length; i++) {
                        gens[i].x = canvas.width/2;
                        gens[i].y = canvas.height/2;
                    }
                }
            }
        };

    function init (w, h, fn) {
        tcolor = new Color(0, 40, 10);
        onLoop = fn || function () {};
        canvas = document.getElementById('stage');
        canvas2 = document.getElementById('stage2');
        Game.size(w, h);

        canvas.focus();
        ctx = canvas.getContext('2d');
        ctx2 = canvas2.getContext('2d');

        objects = [];
        gens = [];
        gens.push(new ParticleGenerator({
            x: canvas.width/2,
            y: canvas.height/2,
            intensity: 10,
            r: 5
        }));

        loop();
    }

    function loop () {
        var i, j, p, explode, newColor, n = 8, tsize = Game.tsize;
        Game.tick++;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Game.tick % 2 == 0) {
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
        }

        // update objects
        for (i = 0; i < objects.length; i++) {
            p = objects[i];
            explode = p.update();
            if (!p.alive || p.y >= canvas.height || p.x <= 0 || p.x >= canvas.width) {
                objects.splice(objects.indexOf(p), 1);
            }
            if (explode) {
                newColor = p.color.rand();
                for (j = 0; j < n; j++) {
                    objects.push(new Particle({
                        x: p.x,
                        y: p.y,
                        dx: 2 * Math.cos(2*Math.PI / n * j),
                        dy: 2 * Math.sin(2*Math.PI / n * j),
                        color: newColor,
                        r: 2 + (Math.random()*4)
                    }));
                }
            }

            if (!p.alive) {
                p.r = explode ? 16 : 1.5;
                p.render(ctx2);
            }
        }

        // update generators
        for (i = 0; i < gens.length; i++) {
            if (Game.tick % 2 === 0) {
                gens[i].angle = -(Math.PI/4 + (Math.random() * Math.PI/2));
                p = gens[i].update();
                if (p !== undefined) {
                    objects.push(p);
                }
            }
        }

        // render
        for (i = 0; i < objects.length; i++) {
            p = objects[i];
            p.render(ctx);
        }

        input.update(); // update input

        onLoop();
        requestAnimFrame(loop);
    }

    exports.Game = Game;
}(window));
