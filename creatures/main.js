window.onload = function () {
    game.init({
      canvas: document.getElementById('stage'),
      generalInfo: document.getElementById('info'),
      placeInfo: document.getElementById('p-info'),
      creatureInfo: document.getElementById('c-info'),
      logInfo: document.getElementById('log')
    });

    for (var i = 0; i < 50; i++) {
      var gender = randv(GENDERS);
      game.addCreature({
        name: randv(NAMES[gender]),
        species: randv(Object.keys(SPECIES)),
        x: randint(0, DIM),
        y: randint(0, DIM),
        gender: gender
      });
    }

    for (var i = 0; i < 3; i++) {
      game.addPlace({
        name: randv(PLACES),
        x: randint(0, DIM),
        y: randint(0, DIM),
        radius: randint(MIN_PLACE_RAD, MAX_PLACE_RAD)
      });
    }

    function tick() {
      game.tick();
      setTimeout(tick, TICK_TIME * 1000);
    }

    var render = function () {
        game.render();
        window.requestAnimationFrame(render);
    };

    tick();
    render();
};
