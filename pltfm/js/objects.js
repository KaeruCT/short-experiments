function Particle(p) {
    p = p || {};
    Behavior.gravity_particle.call(this, p);
    Behavior.mortal_object.call(this);
    this.color = p.color || new Color();
}

Particle.prototype.update = function () {
    Behavior.gravity.call(this);
    this.color.inc_h();
    this.color.inc_l();
    if (this.r > 0.1) {
        this.r -= 0.01;
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
    this.angle_from = p.angle_from || Math.PI;
    this.angle_to = p.angle_to || Math.PI*2;
    this.angle_change = 0.1 || p.angle_to;

    this.x = p.x || 0;
    this.y = p.y || 0;
    this.freq = p.freq || 5;
    this.angle = p.angle || this.angle_from;
    this.a_dir = 1;

    this.intensity = p.intensity || 5;
    this.counter = 0;
}

ParticleGenerator.prototype.update = function () {
    if ((this.counter++) % this.freq === 0) {
        if (this.angle >= this.angle_to) {
        this.a_dir = -1;
    } else if (this.angle <= this.angle_from) {
        this.a_dir = 1;
    }

    this.angle += this.angle_change * this.a_dir;

    return new Particle({
        x: this.x,
        y: this.y,
        dx: this.intensity * Math.cos(this.angle),
        dy: this.intensity * Math.sin(this.angle),
        color: new Color(200, 60, 50)
    });
    }
};

function Player(p) {
    p = p || {};
    Behavior.gravity_particle.call(this, p);
    Behavior.mortal_object.call(this);
    this.has_jumped = false;
}

Player.prototype.render = function (ctx) {
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.beginPath();
    ctx.arc(
        this.x,
        this.y,
        this.r,
        0,
        6.28);
    ctx.fill();
};

Player.prototype.update = function () {
    Behavior.gravity.call(this);

    if (this.dy <= 0) {
        this.has_jumped = false;
    }

    if (input.isDown(input.RIGHT)) {
        this.dx += 2;
    }

    if (input.isDown(input.LEFT)) {
        this.dx -= 2;
    }

    if (!this.has_jumped && input.justPressed(input.UP)) {
        this.has_jumped = false;
        this.dy -= 2;
    }
}
