(function () {
    var
    canvas,
    ctx,
    i = 0,
    j = 0,
    rate = 0.01,
    size = 1,
    color,
    clear = true,

    init = function (c) {
        var self = this;

        canvas = c;
        ctx = canvas.getContext('2d');
        self.change_color(canvas.width/2);

        ctx.draw_point = function (x, y) {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, 2 * Math.PI, false);
            ctx.fill();
        };
    },

    toggle_clear = function() {
        clear = !clear;
    },

    change_rate = function (r) {
        var f = canvas.width * 0.01;
        rate = f/r;
    },

    change_color = function (c) {
        var c2 = canvas.height/2;
        size = Math.abs(c-c2)/c2;

        color = {
            h: Math.floor(c/canvas.height * 360),
            s: '50%',
            l: '50%'
        };
    },

    fill_color = function () {
        return 'hsl('+color.h+', '+color.s+', '+color.l+')';
    },

    draw = function () {
        var self = this;

        window.requestAnimFrame(function () {
            draw.call();
        });

        ctx.save();

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        if (clear) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        draw_stuff();

        ctx.restore();
    },

    draw_stuff = function () {
        var x, y, l = 0, k = 0,
            ch = rate,
            w = canvas.width,
            h = canvas.height,
            h2 = h/2,
            inc = 8;

        ctx.fillStyle = fill_color();

        for (j = 0; j < w; j += 1) {
            ctx.draw_point(
                j,
                h2 + size * (Math.sin((j+i) * ch) * h2)
            );
        }

        i += inc;
    };

    window.tabcin = {
        init: init,
        draw: draw,
        change_color: change_color,
        change_rate: change_rate,
        toggle_clear: toggle_clear
    };
}(window));

