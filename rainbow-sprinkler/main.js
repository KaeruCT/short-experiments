window.requestAnimFrame =
        window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

function Color(h, s, l) {
    this.hincv = 2;
    this.lincv = 0.1;
    this.l_dir = 0;
    this.h = h !== undefined ? h : 0;
    this.s = s !== undefined ? s : 100;
    this.l = l !== undefined ? l : 50;
    this.minl = 10;
    this.maxl = 90;
}
Color.prototype.get = function() {
    return 'hsl('+this.h+','+this.s+'%,'+this.l+'%'+')';
};
Color.prototype.inc_h = function () {
    this.h = (this.h + this.hincv)%360;
};
Color.prototype.inc_l = function () {
    this.l = Math.min(this.l + this.lincv, 100);
};

function Particle(p) {
    p = p || {};
    this.x = p.x || 0;
    this.y = p.y || 0;
    this.r = p.r || 5;
    this.color = p.color || new Color();
    this.dx = p.dx || 0;
    this.dy = p.dy || 0;
}

Particle.prototype.update = function () {
    this.color.inc_h();
    this.color.inc_l();
    this.x += this.dx;
    this.y += this.dy;
    if (this.r > 0.1) {
        this.r -= 0.01;
    }

    this.dy += g_inc;
}

function ParticleGenerator(p) {
    p = p || {};
    this.angle_from = p.angle_from || Math.PI;
    this.angle_to = p.angle_to || Math.PI*2;
    this.angle_change = 0.1 || p.angle_to;
    
    this.x = p.x || canvas.width/2;
    this.y = p.y || canvas.height/2;
    this.freq = p.freq || 5;
    this.angle = p.angle || this.angle_from;
    this.a_dir = 1;
    
    this.intensity = p.intensity || 5;
    this.counter = 0;
}

ParticleGenerator.prototype.update = function () {
    if ((this.counter++) % this.freq === 0) {
        this.generate();
    }
}

ParticleGenerator.prototype.generate = function () {
    if (this.angle >= this.angle_to) {
        this.a_dir = -1;
    } else if (this.angle <= this.angle_from) {
        this.a_dir = 1;
    }
    
    this.angle += this.angle_change * this.a_dir;
    
    particles.push(new Particle({
        x: this.x,
        y: this.y,
        dx: this.intensity * Math.cos(this.angle),
        dy: this.intensity * Math.sin(this.angle),
        color: new Color(200, 60, 50)
    }));
}

var canvas, ctx, gens, particles,
    g = 9.8, g_inc = 0.1;

window.onload = function () {
    canvas = document.getElementById('main-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx = canvas.getContext('2d');

    particles = [];
    gens = [];
    
    for (var i = 0; i < 8; i++) {
        gens.push( new ParticleGenerator({
            angle: i%2 == 0 ? Math.PI : Math.PI*2,
            intensity: i
        }));
    }

    loop(canvas);
    canvas.focus();
};

function loop () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (var i = 0; i < particles.length; i++) {
        p = particles[i];
        p.update();
        if (p.y >= canvas.height || p.x <= 0 || p.x >= canvas.width) {
            particles.splice(i, 1);
        }
    }
    
    for (var i = 0; i < gens.length; i++) gens[i].update();
    
    for (var i = 0; i < particles.length; i++) {
        p = particles[i];
        ctx.fillStyle = p.color.get();

        ctx.beginPath();
        ctx.arc(
            p.x,
            p.y,
            p.r,
            0,
            6.28);
        ctx.fill();
    }
    requestAnimFrame(loop);
}
