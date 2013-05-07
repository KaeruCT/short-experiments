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
      h: 0, s: 100, l: 50,
      get: function() {
        return 'hsl('+this.h+','+this.s+'%,'+this.l+'%'+')';
      },
      get_inc_h: function (h) {
        return 'hsl('+((this.h+h)%360)+','+this.s+'%,'+this.l+'%'+')';
      },
      inc_h: function () {
        this.h = (this.h+this.colorIntv)%360;
      }
    };
}

var canvas, ctx,
    play = true,
    color = new Color(),
    x = 0, y = 0,
    h2, w2, cw,
    lw = 16,
    scrollWheelFactor = 0;

window.onload = function () {
    canvas = document.getElementById('main-canvas');
    ctx = canvas.getContext('2d');

    drawLoop(canvas);
    canvas.focus();

    setDimensions();
};

window.addEventListener('mousewheel', onScroll);
window.addEventListener('DOMMouseScroll', onScroll);

window.addEventListener('resize', setDimensions);

window.addEventListener('mousemove', function (e) {
    x = (e.clientX - w2) / (2*canvas.width);
    y = (e.clientY - h2) / (canvas.height);
});

window.addEventListener('click', function (e) {
    play = !play;

    if (play) {
        drawLoop(canvas);
    }
});

function onScroll(e) {
    e.preventDefault();
    var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40; // http://tech.pro/tutorial/705/javascript-tutorial-the-scroll-wheel
    scrollWheelFactor += wheelData * 0.1;
    setDimensions();
}

function setDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    h2 = window.innerHeight/2,
    w2 = window.innerWidth/2,
    w = window.innerWidth/lw;
    cw = canvas.width;

    color.colorIntv = 360/Math.ceil(cw/lw) + scrollWheelFactor;
}

function drawLoop () {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStuff();

    if (play) {
        requestAnimFrame(drawLoop);
    }
}

function drawStuff() {
    var c, n = 0;

    for (var i = 0; i < cw; i += lw) {
        n += color.colorIntv;
        dx = Math.sin(x) * i;
        dy = Math.sin(y) * i;

        color.l = 10 + (80 * i / cw); // 10% light min, 90% light max
        c = color.get_inc_h(n);

        ctx.strokeStyle = c;
        ctx.fillColor = c;

        ctx.lineWidth = lw*2;

        ctx.beginPath();
        ctx.arc(
            dx + w2,
            dy + h2,
            i,
            0,
            6.3);

        ctx.stroke();
    }

    color.inc_h();
}
