function Particle(p) {
    p = p || {};
    Behavior.gravity_particle.call(this, p);
    Behavior.mortal_object.call(this);
    Behavior.bouncy_particle.call(this);
    this.color = p.color || new Color();
    this.explode = !!p.explode;
}

Particle.prototype.update = function () {
    var min = this.explode ? 1 : 0.25;
    Behavior.gravity.call(this);
    this.color.inc_h();
    this.color.inc_l();
    if (this.r > min) {
        this.r -= 0.1;
    } else {
        this.die();
        return this.explode;
    }
};

Particle.prototype.render = function (ctx) {
    ctx.fillStyle = this.color.get();
    ctx.beginPath();
    ctx.arc(
        this.x,
        this.y,
        this.r,
        0,
        6.28);
    ctx.fill();
};

function ParticleGenerator(p) {
    p = p || {};
    this.r = p.r;
    this.color = new Color(200, 60, 50);
    this.color.hinvc = 0.01;

    this.x = p.x || 0;
    this.y = p.y || 0;
    this.freq = p.freq || 5;
    this.a_dir = 1;

    this.intensity = p.intensity || 5;
    this.counter = 0;
}

ParticleGenerator.prototype.update = function () {
    this.color.inc_h();

    return new Particle({
        x: this.x,
        y: this.y,
        dx: this.intensity * Math.cos(this.angle),
        dy: this.intensity * Math.sin(this.angle),
        color: new Color(this.color),
        r: this.r,
        explode: true
    });
};

function Player(p) {
    p = p || {};
    Behavior.gravity_particle.call(this, p);
    Behavior.mortal_object.call(this);
    this.controlled = true;
    this.color = new Color(200, 60, 50);
    this.c = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
}

Player.prototype.render = function (ctx) {
    var i, self = this,
        w2 = Game.width/2, h2 = Game.height/2;

    function v (i) {
        var n = self.c[i] += 0.01;
        return Math.abs(Math.sin(n));
    }
    ctx.fillStyle = this.color.get({a: 20, l: 20});
    ctx.strokeStyle = this.color.get();

    ctx.beginPath();
    ctx.arc(
        this.x,
        this.y,
        this.r,
        0,
        6.28);
    ctx.closePath();
    ctx.fill();

    for (i = 0; i < 2; i ++) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (i%2 === 1) {
            ctx.scale(v(i), 1);
        } else {
            ctx.scale(1, v(i));
        }
        ctx.beginPath();
        ctx.arc(
            0,
            0,
            this.r * v(i),
            0,
            6.28);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
};

Player.prototype.update = function () {
    Behavior.gravity.call(this);

    if (input.isDown(input.RIGHT)) {
        this.mx = 0.05*this.r;
    }

    if (input.isDown(input.LEFT)) {
        this.mx = -0.05*this.r;
    }

    if (input.justReleased(input.RIGHT) || input.justReleased(input.LEFT)) {
        this.mx = 0;
    }

    if (!this.airborne && input.isDown(input.UP)) {
        this.my = 1.5*-Game.gravity*this.r;
        this.y -= this.r/4;
    }
};
