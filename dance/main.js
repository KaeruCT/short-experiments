window.requestAnimFrame =
        window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

function Color() {
    this.hincv = 0.5;
    this.lincv = 0.1;
    this.l_dir = 0;
    this.h = 0;
    this.s = 100;
    this.l = 10;
    this.minl = 10;
    this.maxl = 90;
}

Color.prototype.get = function() {
    return 'hsl('+this.h+','+this.s+'%,'+this.l+'%'+')';
};
Color.prototype.inc_h = function () {
    this.h = (this.h+this.hincv)%360;
};
Color.prototype.inc_l = function () {
    this.l += (this.l_dir ? -1 : 1) * this.lincv;
    if (this.l <= this.minl) {
        this.l_dir = 0;
    } else if (this.l >= this.maxl) {
        this.l_dir = 1;
        this.l -= this.lincv;
    }
};


var canvas, ctx,
    count = 0,
    psize = 0,
    rot = 0,
    clear = false,
    countmult = 2,
    colors = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    psize = Math.min(canvas.width, canvas.height);
}

function drawLoop () {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (clear) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    ctx.restore();

    draw();

    requestAnimFrame(drawLoop);
}

function draw () {
    var npts = 50,
        x = 0, y = 0,
        r = 2*psize/countmult;
        
    count += countmult*0.001;
    ctx.lineWidth = 1;
    
    colors.forEach(function (c) {
        c.inc_h();
        c.inc_l();
    });
    rot += 0.01;
    for (var i = -1; i < npts; i++) {
        if (i > -1) {
            x = r * Math.cos(i + rot);
            y = r * Math.sin(i + rot);
        }

        for (var mult = 1; mult <= countmult; mult++) {
            ctx.strokeStyle = colors[mult-1].get();
            ctx.beginPath();
            ctx.arc(
                x + canvas.width/2,
                y + canvas.height/2,
                mult * r * Math.abs(Math.sin(count)),
                0,
                2*Math.PI
            );
            ctx.stroke();
        }
    }
}

window.onload = function () {
    canvas = document.getElementById('main-canvas');
    resize();

    ctx = canvas.getContext('2d');
    for (var i = 0; i < countmult; i++) {
        colors[i] = new Color();
        colors[i].h = (360/countmult*i);
    }

    drawLoop(canvas);
    canvas.focus();
};

window.addEventListener('resize', resize);

window.addEventListener('click', function (e) {
    clear = !clear;
});
