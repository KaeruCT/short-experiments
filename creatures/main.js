window.onload = function () {
    var creaturesInfo = document.getElementById('all-c-info');
    var creatureInfo = document.getElementById('c-info');
    var placeInfo = document.getElementById('p-info');

    game.init({
      canvas: document.getElementById('stage'),
      generalInfo: document.getElementById('info'),
      placeInfo: placeInfo,
      creatureInfo: creatureInfo,
      creaturesInfo: creaturesInfo,
      logInfo: document.getElementById('log')
    });

    function checkCreatureLink(e) {
      var target = e.target;
      var cssClass = target.getAttribute('class');
      if (cssClass && cssClass.indexOf('creature-link') !== -1) {
        var creatureId = +target.getAttribute('data-id');
        game.focusCreature(creatureId);
      }
    }

    creaturesInfo.onclick = checkCreatureLink;
    creatureInfo.onclick = checkCreatureLink;
    placeInfo.onclick = checkCreatureLink;

    var pauseBtn = document.getElementById('pause');
    pauseBtn.onclick = function (e) {
      e && e.preventDefault();
      pauseBtn.innerText = game.togglePause() ? 'Resume' : 'Pause';
    };
    pauseBtn.onclick();

    var speedSlide = document.getElementById('speed-slider');
    var speedVal = document.getElementById('speed-value');
    speedSlide.min = 1;
    speedSlide.max = 100;
    speedSlide.step = 1;
    speedSlide.onchange = function () {
      var speed = game.setSpeed(speedSlide.value);
      speedSlide.value = speed;
      speedVal.innerText = speed;
    };
    speedSlide.onchange();

    for (var i = 0; i < 100; i++) {
      var gender = randv(GENDERS);
      game.addCreature({
        name: randv(NAMES[gender]),
        species: randv(Object.keys(SPECIES)),
        x: randint(0, DIM),
        y: randint(0, DIM),
        gender: gender
      });
    }

    for (var i = 0; i < 20;) {
      var name = randv(PLACES);
      var added = game.addPlace({
        name: name,
        x: randint(MAX_PLACE_RAD, DIM-MAX_PLACE_RAD),
        y: randint(MAX_PLACE_RAD, DIM-MAX_PLACE_RAD),
        radius: randint(MIN_PLACE_RAD, MAX_PLACE_RAD)
      });
      if (added) {
        remove(PLACES, name);
        i += 1;
      }
    }

    function tick() {
      game.tick();
      setTimeout(tick, TICK_TIME * 1000);
    }

    function render () {
        game.render();
        window.requestAnimationFrame(render);
    };

    tick();
    render();
};
