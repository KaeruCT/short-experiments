(function (exports) {
    var canvas, ctx, gens, objects, player,
        onLoop,
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
            maxy: 5,
            maxx: 5,
            width: 0,
            height: 0,
            objects: function () {
                return objects.length;
            }
        };

    function init (fn) {
        var i = 0;
        onLoop = fn || function () {};
        canvas = document.getElementById('stage');
        canvas.width = parseInt(canvas.style.width, 10);
        canvas.height = parseInt(canvas.style.height, 10);
        Game.width = canvas.width;
        Game.height = canvas.height;

        canvas.focus();
        ctx = canvas.getContext('2d');

        objects = [];
        gens = [];

        for (; i < 8; i++) {
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
        var i, p;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // update objects
        for (i = 0; i < objects.length; i++) {
            p = objects[i];
            if (p !== player && p.collides_with(player)) {
                p.die();
                player.r += 0.01;
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
