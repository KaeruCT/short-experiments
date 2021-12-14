window.requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

function Color() {
  this.colorIntv = 1;
  this.h = 0;
  this.s = 100;
  this.l = 50;
}

Color.prototype.get = function () {
  return "hsl(" + this.h + "," + this.s + "%," + this.l + "%" + ")";
};
Color.prototype.get_inc_h = function (h) {
  return (
    "hsl(" + ((this.h + h) % 360) + "," + this.s + "%," + this.l + "%" + ")"
  );
};
Color.prototype.inc_h = function () {
  this.h = (this.h + this.colorIntv) % 360;
};

var canvas,
  ctx,
  play = true,
  color = new Color(),
  x = 0,
  y = 0,
  n = 1000,
  h2,
  w2,
  cw,
  ch,
  lw = 8,
  scrollWheelFactor = 0;

window.onload = function () {
  canvas = document.getElementById("main-canvas");
  ctx = canvas.getContext("2d");

  drawLoop(canvas);
  canvas.focus();

  setDimensions();
};

window.addEventListener("resize", setDimensions);

window.addEventListener("mousemove", function (e) {
  x = (e.clientX - w2) / (2 * canvas.width);
  y = (e.clientY - h2) / canvas.height;
});

window.addEventListener("click", function (e) {
  play = !play;

  if (play) {
    drawLoop(canvas);
  }
});

function setDimensions() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  h2 = window.innerHeight / 2;
  w2 = window.innerWidth / 2;
  w = window.innerWidth / lw;
  cw = canvas.width;
  ch = canvas.height;

  //color.colorIntv = 360 / Math.ceil(cw / lw);
  color.h = 250;
}

function drawLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStuff();

  if (play) {
    requestAnimFrame(drawLoop);
  }
}

const widths = [10, 6, 10, 4, 8, 10, 14, 4, 8];
const heights = widths.map((n) => (n - 5) * 4);
function drawStuff() {
  var c,
    i,
    j,
    dx,
    dy,
    spacing = 0.1,
    ilw = lw;

  for (i = 0; i < ch; i += lw / 4) {
    color.h = (i * 2) % 360;
    color.l = 20 + (40 * i) / ch;

    dy = i;

    spacing += 0.05;
    dx = 0;
    ilw += 1;

    var ww = cw / spacing;

    for (j = 0; j < ww; j += ilw) {
      var tmp = (j + n) * spacing;
      dx = (tmp % cw) - tmp / cw;
      c = color.get();

      ctx.strokeStyle = c;
      ctx.fillStyle = c;

      ctx.fillRect(
        dx,
        (dy + (heights[ilw % heights.length] * dy) / ch) * (1 + y),
        widths[ilw % widths.length],
        ilw
      );
    }
    n += 0.01 * x * 2;
  }
}
