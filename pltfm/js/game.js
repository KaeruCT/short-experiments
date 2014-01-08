(function (exports) {
    var canvas, ctx, gens, objects,
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
            height: 0
        };

    function init () {
        var i = 0;
        canvas = document.getElementById('stage');
        canvas.width = parseInt(canvas.style.width, 10);
        canvas.height = parseInt(canvas.style.height, 10);
        Game.width = canvas.width;
        Game.height = canvas.height;

        canvas.focus();
        ctx = canvas.getContext('2d');

        objects = [];
        gens = [];

        input.addHandler(input.PAUSE, function () {alert('hello');});

        for (; i < 8; i++) {
            //gens.push(new ParticleGenerator({
                //x: canvas.width/2,
                //y: canvas.height/2,
                //angle: i%2 === 0 ? Math.PI : Math.PI*2,
                //intensity: i
            //}));
        }

        objects.push(new Player({
            x: canvas.width/2,
            y: canvas.height/2,
            r: 5
        }));

        loop(canvas);
    }

    function loop () {
        var i, p;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // update objects
        for (i = 0; i < objects.length; i++) {
            p = objects[i];
            p.update();
            if (p.dead || p.y >= canvas.height || p.x <= 0 || p.x >= canvas.width) {
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

        requestAnimFrame(loop);
    }

    exports.Game = Game;
}(window));
