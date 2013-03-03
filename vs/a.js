(function () {
    var
    canvas,
    ctx,
    i = 0,
    rate = 0.05,
    color,

    init = function (c) {
        var self = this;

        canvas = c;
        ctx = canvas.getContext('2d');
        self.change_color(canvas.width/2);

        ctx.draw_circle = function (x, y, r) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI, false);
            ctx.fill();
        };
    },

    change_rate = function (r) {
        rate = ((r/canvas.height)) * 0.025;
        console.log(rate);
    },

    change_color = function (c) {
        color = {
            h: Math.floor(c/canvas.width * 360),
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
        //if ((new Date()).getSeconds() % 2 == 0) {
        //    ctx.clearRect(0, 0, canvas.width, canvas.height);
        //}
        //ctx.fillStyle = '#000';
        //ctx.fillRect(0, 0, canvas.width, canvas.height);

        i += rate;

        draw_stuff();

        ctx.restore();
    },

    draw_stuff = function () {
        var x, y, j, k, l,
            circle_radius = 2,
            yoff = circle_radius,
            h = canvas.height - yoff*2,
            inc = canvas.height;

        ctx.fillStyle = fill_color();

        for (j = 0; j < canvas.width; j += circle_radius) {
            k = j*inc;

            y = yoff + h / 2 + (Math.sin(i+k) * h / 2);
            x = j;

            ctx.draw_circle(x, y, circle_radius);
        }
    };

    window.tabcin = {
        init: init,
        draw: draw,
        change_color: change_color,
        change_rate: change_rate
    };
}(window));

