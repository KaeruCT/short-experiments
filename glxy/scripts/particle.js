define(function () {
	function Particle(p) {
		var i = 0, prop,
			props = ['x', 'y', 'dx', 'dy', 'r', 'dead'];

		p = p || {};
		for (i in props) {
			prop = props[i];
			this[prop] = p[prop] || 0;
		}

		return this;
	}

	Particle.prototype = {
		get r() {
			return this._r;
		},

		set r(r) {
			this._r = r;
			this.mass = 0.5 * Math.pow(this.r, 3);
		},

		update: function () {
			this.x += this.dx;
			this.y += this.dy;
		},

		kill: function () {
			this.dead = true;
		},

		collidesWith: function (p2) {
			var dx = p2.x - this.x;
				dy = p2.y - this.y;

			return Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(this.r + p2.r, 2);
		}
	};
	return Particle;
});
