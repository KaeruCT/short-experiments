(function (exports, g) {
    var Behavior = {};
    Behavior.gravity_particle = function (p) {
        this.x = p.x || 0;
        this.y = p.y || 0;
        this.r = p.r || 5;
        this.dx = p.dx || 0;
        this.dy = p.dy || 0;
    }

    Behavior.mortal_object = function () {
        this.alive = true;
    }

    Behavior.gravity = function () {
        this.x += this.dx;
        this.y += this.dy;
        this.dy += g.dy;
    }

    exports.Behavior = Behavior;
}(window, Game));
