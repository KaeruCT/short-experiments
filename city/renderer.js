window.renderer = (function() {
  var off = {};

  function renderObj(ctx, obj) {
    ctx.beginPath();
    ctx.rect(obj.x, obj.y, obj.w, obj.h);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  function renderChunks(gen) {
    var map = gen.map;
    var c = gen.chunkSize;
    for (var y in map) {
      for (var x in map[y]) {
        ctx.beginPath();
        ctx.rect(x * c, y * c, c, c);
        ctx.strokeStyle = '#777';
        ctx.stroke();
      }
    }
  }

  function render (ctx, gen, w, h) {
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
