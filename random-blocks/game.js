var game = (function () {
    var map = [],
    ctx,
    s = 16,
    w = 38,
    h = 38,
    players = [],

    game = {
        map: function (x, y, val) {
            map[y][x] = val;
        },
        getPlayer: function (i) {
            return players[i];
        },
        addPlayer: function (color, x, y) {
            var player = new Player(this, color);
            player.x = x;
            player.y = y;
            players.push(player);
        },
        init: function (c) {
            ctx = c.getContext('2d');
            c.width = w*s;
            c.height = h*s;
            c.style.width = (w*s)+"px";
            c.style.height = (h*s)+"px";

            for (var i = 0; i < h; i += 1) {
                map[i] = [];
                for (var j = 0; j < w; j += 1) {
                    if (Math.random() < 0.1) {
                        map[i][j] = 1;
                    } else {
                        map[i][j] = 0;
                    }
                }
            }
        },

        render: function () {
            ctx.strokeStyle = '#111';
            ctx.clearRect(0, 0, w*s, h*s);

            for (pind in players) {
                var p = players[pind];
                if (p.y < 0) p.y = 0;
                if (p.y >= w) p.y = w-1;
                if (p.x < 0) p.x = 0;
                if (p.x >= h) p.x = h-1;

                if (map[p.y][p.x] !== 0) {
                    p.x = p.prevx;
                    p.y = p.prevy;
                }
            }

            for (var i = 0; i < h; i += 1) {
                for (var j = 0; j < w; j += 1) {
                    ctx.strokeRect(j*s, i*s, s-1, s-1);

                    if (map[i][j] == 1) {
                        ctx.fillStyle = '#333';
                        ctx.fillRect(j*s, i*s, s-1, s-1);
                    }

                    for (pind in players) {
                        var p = players[pind];
                        if (p.isAt(j, i)) {
                            ctx.fillStyle = p.color;
                            ctx.fillRect(j*s, i*s, s-1, s-1);
                        }
                    }
                }
            }
        },
    }

    return game;

}());
