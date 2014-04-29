(function (exports) {
    var canvas, ctx, gens, objects,
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
            gravity: 0,
            md: 0.1,
            maxy: 10,
            maxx: 5,
            width: 0,
            height: 0,
            tsize: 1,
            objects: function () {
                return objects.length;
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
                Game.height =canvas.height = h;

                if (gens) {
                    for (i = 0; i < gens.length; i++) {
                        gens[i].x = canvas.width/2;
                        gens[i].y = canvas.height/2;
                    }
                }
            }
        };



    function init (w, h, fn) {
        var i, j, val , n;
        tcolor = new Color(0, 40, 10);
        onLoop = fn || function () {};
        canvas = document.getElementById('stage');
        Game.size(w, h);

        canvas.focus();
        ctx = canvas.getContext('2d');

        objects = [];
        gens = [];
        d = 0;
        n = 8;
        for (i = 0; i < n; i++) {
            gens.push(new ParticleGenerator({
                x: canvas.width/2,
                y: canvas.height/2,
                angle: Math.PI / (n / 2) * i,
                intensity: i*2,
                r: 8
            }));
        }
        loop();
    }

    function loop () {
        var i, j, p, tsize = Game.tsize;
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        // update objects
        for (i = 0; i < objects.length; i++) {
            p = objects[i];
            p.update();
            if (!p.alive || p.y >= canvas.height || p.x <= 0 || p.x >= canvas.width) {
                objects.splice(objects.indexOf(p), 1);
            }
        }

        // update generators
        for (i = 0; i < gens.length; i++) {
            p = gens[i].update();
            if (p !== undefined) {
                objects.push(p);
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
        Game.gravity = 0;
    }

    exports.Game = Game;
}(window));
