window.requestAnimFrame = (function(){
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function Color() {
    return {
      colorIntv: 1,
      h: 0, s: 60, l: 50,
      get: function() {
        return 'hsl('+this.h+','+this.s+'%,'+this.l+'%'+')';
      },
      inc_h: function () {
        this.h += this.colorIntv;
        if (this.h > 255 || this.h < 0) {
            this.colorIntv *= -1;
        }
      }
    };
}

var canvas, ctx,
    n = 0,
    a = 100,
    inc = 0.003,
    aIntv = 0.01,
    clear = true,
    color = new Color(),
    bgcolor = new Color()

window.onload = function () {
    canvas = document.getElementById('main-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx = canvas.getContext('2d');

    drawLoop(canvas);
    canvas.focus();

    bgcolor.h=127;
    bgcolor.s=40;
    bgcolor.l=5;
};

window.addEventListener('mousemove', function (e) {
    var w2 = window.innerWidth/2,
        h2 = window.innerHeight/2,
        maxn = 50,
        maxinc = 0.03, mininc = 0.003;

    n = maxn - maxn*(Math.abs(e.clientX-w2)/w2);
    inc = Math.max(mininc, maxinc*(Math.abs(e.clientY-h2)/h2));
});

window.addEventListener('click', function (e) {
    clear = !clear;
});

function drawLoop () {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (clear) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    ctx.restore();

    drawPolarFlower(a, n);

    a += aIntv;
    if (a > 125 || a < 90) {
        aIntv *= -1;
    }

    requestAnimFrame(drawLoop);
}

function drawPolarFlower (a, k) {

    ctx.lineWidth = 1;

    for (var theta=-Math.PI; theta<Math.PI; theta+=inc) {
        var r = a * Math.cos(a * theta) + a * Math.sin(k * theta),
            rad = 5 + Math.sin(a * theta) * 5;

        ctx.strokeStyle = color.get();
        document.body.style.backgroundColor = bgcolor.get();

        color.inc_h();
        bgcolor.inc_h();

        ctx.beginPath();
        ctx.arc(
            r * Math.cos(theta) + canvas.width/2,
            r * Math.sin(theta) + canvas.height/2,
            rad,
            0,
            2*Math.PI);
        ctx.stroke();

    }
}
