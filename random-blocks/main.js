var dir = {
    N: {x: 0, y: -1},
    S: {x: 0, y: 1},
    E: {x: -1, y: 0},
    W: {x: 1, y: 0}
};
window.onload = function () {
    game.init(document.getElementById('stage'));
    game.addPlayer('#6a6', 0, 0);

    var render = function () {
        game.render();
        window.requestAnimationFrame(render);
    };
    render();

    window.document.body.onkeydown = function (e) {
        game.getPlayer(0).input(e.keyCode);
    }

    var extraPlayers = 20;

    for (var i = 0; i < extraPlayers; i += 1) {
        game.addPlayer('#fff',
            Math.floor(Math.random()*100)%38,
            Math.floor(Math.random()*100)%38);
    }

    function randomInput() {
        var keys = [37, 38, 39, 40, 88, 67],
            key;

        for (var i = 1; i < extraPlayers+1; i += 1) {
            key = keys[Math.floor(Math.random()*100)%keys.length];
            game.getPlayer(i).input(key);
        }
    }

    setInterval(randomInput, 50);
};
