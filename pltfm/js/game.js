(function (exports) {
    var canvas, ctx, gens, objects, player,
        map, tsize, onLoop, tcolor,
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
            gravity: 0.1,
            md: 0.1,
            maxy: 10,
            maxx: 5,
            width: 0,
            height: 0,
            twidth: 0,
            theight: 0,
            tsize: 30,
            map: null,
            objects: function () {
                return objects.length;
            },
            tile_at: function (p, offset) {
                offset = offset || {};
                var tile,
                    x = p.x + (offset.x || 0),
                    y = p.y + (offset.y || 0),
                    tx = Math.floor(x/Game.tsize),
                    ty = Math.floor(y/Game.tsize);

                if (Game.map[ty] === undefined) {
                    tile = 0;
                } else if (Game.map[ty][tx] === undefined) {
                    tile = 0;
                } else {
                    tile = Game.map[ty][tx];
                    //Game.map[ty][tx] = 0; // TODO: mp
                }
                return tile;
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

        };

    function init (fn) {
        var i, j, val;
        tcolor = new Color(0, 40, 10);
        onLoop = fn || function () {};
        canvas = document.getElementById('stage');
        canvas.width = parseInt(canvas.style.width, 10);
        canvas.height = parseInt(canvas.style.height, 10);
        Game.width = canvas.width;
        Game.height = canvas.height;
        Game.twidth = Math.floor(Game.width/Game.tsize);
        Game.theight = Math.floor(Game.height/Game.tsize);

        canvas.focus();
        ctx = canvas.getContext('2d');

        objects = [];
        gens = [];
        Game.map = [];
        for (i = 0; i < Game.theight; i++) {
            Game.map[i] = [];

            for (j = 0; j < Game.twidth; j++) {
                if ((j%5 === 0 || i%5 === 0) &&
                    (j%5 !== 1  && j%5 !== 2 && i%5 !== 1 && i%5 !== 2)) {
                    val = 1;
                }
                else {
                    val = 0;
                }
                Game.map[i][j] = val;
            }
        }

        for (i = 0; i < 8; i++) {
            gens.push(new ParticleGenerator({
                x: canvas.width/2,
                y: canvas.height/2,
                angle: i%2 === 0 ? Math.PI : Math.PI*2,
                intensity: i
            }));
        }

        player = new Player({
            x: canvas.width/2,
            y: canvas.height/2,
            r: 8
        });
        objects.push(player);

        loop();
    }

    function loop () {
        var i, j, p, tsize = Game.tsize;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // render tiles
        tcolor.inc_h();
        ctx.fillStyle = tcolor.get();
        ctx.strokeStyle = tcolor.get({a: 20, l: 30});
        for (i = 0; i < Game.map.length; i++) {
            for (j = 0; j < Game.map[i].length; j++) {
                p = Game.map[i][j];
                if (p === 1) {
                    ctx.beginPath();
                    ctx.rect(j*tsize, i*tsize, tsize, tsize);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }

        // update objects
        for (i = 0; i < objects.length; i++) {
            p = objects[i];
            if (p !== player && p.collides_with(player)) {
                p.die();
                //player.r += 0.5;
                player.color = p.color;
            }

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
    }

    exports.Game = Game;
}(window));
