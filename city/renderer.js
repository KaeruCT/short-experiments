window.renderer = (function() {
  var off = {};

  function renderObj(ctx, obj) {
    ctx.beginPath();
    ctx.fillStyle = '#38302B';
    ctx.rect(obj.x, obj.y, obj.w, obj.h);
    ctx.fill();

    ctx.fillStyle = '#666';
    for (var i in obj.parts) {
      var p = obj.parts[i];
      ctx.beginPath();
      ctx.rect(obj.x, obj.y + p.y, p.w, p.h);
      ctx.fill();
    }
  }

  function renderChunks(gen) {
    var map = gen.map;
    var c = gen.chunkSize;
    ctx.strokeStyle = '#444';
    for (var y in map) {
      for (var x in map[y]) {
        ctx.beginPath();
        ctx.rect(x * c, y * c, c, c);
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
