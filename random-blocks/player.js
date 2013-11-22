var Player = function (game, color) {
    this.x = 0;
    this.y = 0;
    this.prevx = 0;
    this.prevy = 0;
    this.game = game;
    this.color = color;
    this.isAt = function (x, y) {
        return this.x === x && this.y === y;
    }
    this.dir = 'N';
};

Player.prototype.move = function (d) {
    this.dir = d;
    this.x += dir[this.dir].x;
    this.y += dir[this.dir].y;
}

Player.prototype.input = function (key) {
    this.prevx = this.x;
    this.prevy = this.y;

    var p = this,
    act = {
        37: function () {
            p.move('E');
        },
        38: function () {
            p.move('N');
        },
        39: function () {
            p.move('W');
        },
        40: function () {
            p.move('S');
        },
        88: function () {
            var d = dir[p.dir];
            p.game.map(p.x+d.x, p.y+d.y, 0);
        },
        67: function () {
            var d = dir[p.dir];
            p.game.map(p.x-d.x, p.y-d.y, 1);
        }
    };

    if (act[key] !== undefined) {
        act[key]();
    }
};
