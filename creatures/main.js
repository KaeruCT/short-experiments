window.onload = function () {
    game.init();

    for (var i = 0; i < 5; i++) {
      game.addCreature({
        name: randv(NAMES),
        species: randv(SPECIES)
      });
    }

    function tick() {
      game.tick();

      setTimeout(tick, TICK_TIME * 1000);
    }

    tick();
};
