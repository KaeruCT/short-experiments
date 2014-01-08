(function (exports, g) {
    var Behavior = {};
    Behavior.gravity_particle = function (p) {
        this.x = p.x || 0;
        this.y = p.y || 0;
        this.r = p.r || 5;
        this.dx = p.dx || 0;
        this.dy = p.dy || 0;
        this.mx = p.mx || 0;
        this.my = p.my || 0;
        this.airborne = false;
        this.height = function () {
            return this.r*2;
        }

        this.collides_with = function (p) {
            var dx = p.x - this.x;
				dy = p.y - this.y;

			return Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(this.r + p.r, 2);
        }
    }

    Behavior.mortal_object = function () {
        this.alive = true;
        this.die = function () {
            this.alive = false;
        };
    }

    Behavior.bouncy_particle = function () {
        this.bouncy = true;
    };

    Behavior.gravity = function () {
        function sign (val) {
            return val > 0 ? 1 : -1;
        }

        function mins () {
            var args = Array.prototype.slice.call(arguments, 0),
                first = args[0], min, s;

            args[0] = Math.abs(first);
            return sign(first) * Math.min.apply(this, args);
        }

        if (this.mx !== 0) {
            this.mx -= sign(this.mx) * g.md;
        } else if (this.controlled) {
            this.dx -= sign(this.dx) * g.md; // deaccelerate
        }

        if (this.my !== 0) {
            this.my -= sign(this.my) * g.md;
        }

        this.dx += this.mx;
        this.dy += g.gravity;

        this.dx = mins(this.dx, g.maxx);
        this.dy = mins(this.dy, g.maxy);

        if (this.y + this.r >= Game.height) {
            // floor
            if (this.bouncy) {
                this.dy = -this.dy;
            } else {
                this.dy = 0;
            }
            this.y = Game.height - this.r;
            this.my = -this.my;
        } else if (this.y - this.r <= 0) {
            // ceiling
            this.dy = -this.dy;
            this.y = this.r;
            this.my = -this.my;
        } else {
            this.dy += this.my;
        }

        if (this.x - this.r <= 0) {
            // left wall
            this.dx = -this.dx;
            this.x = this.r;
            this.mx = -this.mx;
        } else if (this.x + this.r >= Game.width) {
            // right wall
            this.dx = -this.dx;
            this.x = Game.width - this.r;
            this.mx = -this.mx;
        }

        this.x += this.dx;
        this.y += this.dy;

        // TODO: this shouldn't be needed...
        this.y = Math.min(Game.height - this.r, this.y);

        this.airborne = this.dy !== 0;
    }

    exports.Behavior = Behavior;
}(window, Game));
