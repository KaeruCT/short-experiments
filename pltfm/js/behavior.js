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
        var self = this;

        function up() {
            if (Game.tile_at(self, {y: -1}) === 1) {
                return true;
            }
            return self.y - self.r <= 0;
        }

        function down() {
            if (Game.tile_at(self, {y: 1}) === 1) {
                return true;
            }
            return self.y + self.r >= Game.height;
        }

        function left() {
            if (Game.tile_at(self, {x: -1}) === 1) {
                return true;
            }
            return self.x - self.r <= 0;
        }

        function right() {
            if (Game.tile_at(self, {x: 1}) === 1) {
                return true;
            }
            return self.x + self.r >= Game.width;
        }

        function sign (val) {
            return val > 0 ? 1 : -1;
        }

        function mins () {
            var args = Array.prototype.slice.call(arguments, 0),
                first = args[0], min, s;

            args[0] = Math.abs(first);
            return sign(first) * Math.min.apply(this, args);
        }

        function update_pos() {
            self.x += self.dx;
            self.y += self.dy;

            // TODO: this shouldn't be needed...
            self.y = Math.min(Game.height - self.r, self.y);
            self.x = Math.min(Game.width - self.r, self.x);

            self.airborne = self.dy !== 0;
        }

        if (this.mx !== 0) {
            this.mx -= sign(this.mx) * g.md;
        } else if (this.dx !== 0 && this.controlled) {
            this.dx -= sign(this.dx) * g.md; // deaccelerate
        }

        if (this.my !== 0) {
            this.my -= sign(this.my) * g.md;
        }

        this.dx += this.mx;
        this.dy += g.gravity;

        this.dx = mins(this.dx, g.maxx);
        this.dy = mins(this.dy, g.maxy);

        if (left()) {
            this.dx = -this.dx;
            this.x = Game.left_edge(this) + this.r;
            this.mx = -this.mx;
            update_pos();
        } else if (right()) {
            this.dx = -this.dx;
            this.x = Game.right_edge(this) - this.r;
            this.mx = -this.mx;
            update_pos();
        }

        if (up()) {
            this.dy = -this.dy;
            this.y = Game.top_edge(this) + this.r;
            this.my = -this.my;
            update_pos();
        } else if (down()) {
            if (this.bouncy) {
                this.dy = -this.dy;
            } else {
                this.dy = 0;
            }
            this.y = Game.bottom_edge(this) - this.r;
            this.my = -this.my;
            update_pos();
        } else {
            this.dy += this.my;
            update_pos();
        }
    }

    exports.Behavior = Behavior;
}(window, Game));
