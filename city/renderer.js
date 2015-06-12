window.renderer = (function() {
  var off = {};
  var prevFillColor;

  function fillRect(ctx, x, y, w, h, color) {
    if (prevFillColor != color) {
      ctx.fillStyle = color;
      prevFillColor = color;
    }
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
  }

  function renderObj(ctx, obj) {
    var shadowOff = 2;
    var fillOff = 4;
    var p, i;

    // shadow
    for (i in obj.parts) {
      p = obj.parts[i];
      fillRect(ctx,
        obj.x + p.x,
        obj.y + p.y - shadowOff,
        p.w + shadowOff,
        p.h - shadowOff, '#332');
    }

    // obj
    for (i in obj.parts) {
      p = obj.parts[i];
      fillRect(ctx, obj.x + p.x, obj.y + p.y, p.w, p.h, '#6a6a6c');
    }

    // fillin
    for (i in obj.parts) {
      p = obj.parts[i];
      fillRect(ctx, obj.x + p.x + fillOff,
        obj.y + p.y + fillOff,
        p.w - fillOff * 2,
        p.h - fillOff * 2, '#7a7a7c');
    }
  }

  function renderChunks(gen) {
    var map = gen.map;
    var c = gen.chunkSize;

    for (var y in map) {
      for (var x in map[y]) {
        var opacity = (100-Math.abs(x)+Math.abs(y))/100;
        ctx.fillStyle = 'rgba(56,64,43,' + opacity + ')';
        ctx.beginPath();
        ctx.rect(x * c - 1, y * c - 1, c + 1, c + 1);
        ctx.fill();
      }
    }
  }

  function render(ctx, gen, w, h) {
    ctx.save();
    ctx.translate(w/2, h/2);

    renderChunks(gen);

    for (var i in gen.objs) {
      renderObj(ctx, gen.objs[i]);
    }
    ctx.restore();
  };

  return {
    render: render
  };
}());
