window.requestAnimFrame =
window.requestAnimationFrame       ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame    ||
window.oRequestAnimationFrame      ||
window.msRequestAnimationFrame     ||
function (callback) {
	window.setTimeout(callback, 1000 / 60);
};

var canvas, ctx,

	pmin = 2,
	G = 0.0003,
	sG = G*200

	psize = pmin,
	mousep = new Particle(0, 0, psize),
	particles = [],

	mdown = false, prevx = 0, prevy = 0,
	initx = 0, inity = 0;

function Particle(p) {
	p = p || {};
	this.x = p.x || 0;
	this.y = p.y || 0;
	this.r = p.r || 0;
	this.dx = p.dx || 0;
	this.dy = p.dy || 0;

	this.update = function () {
		this.x += this.dx;
		this.y += this.dy;
	}
}

function scroll(e) {
	psize += (e.detail ? e.detail * -1 : e.wheelDelta / 40) * 0.4;
	psize = Math.max(pmin, psize);
	mousemove(e);
}

function mousedown (e) {
	mdown = true;
	mousep.dx = 0;
	mousep.dy = 0;
	prevx = e.clientX;
	prevy = e.clientY;
	initx = prevx;
	inity = prevy;
}

function mouseup (e) {
	var p = new Particle(mousep);
	particles.push(p);
	mdown = false;
}

function mousemove(e) {
	mousep.x = e.clientX;
	mousep.y = e.clientY;
	mousep.r = psize;
	if (mdown) {
		mousep.dx += (prevx - e.clientX) * sG;
		mousep.dy += (prevy - e.clientY) * sG;
		prevx = e.clientX;
		prevy = e.clientY;
	}
}

function drawLoop () {
	var p, p2,
		dx, dy, dr,
		k = j = i = 0;

	// physics magic
	for (; j < particles.length; j += 1) {
		p = particles[j];
		for (k = 0; k < particles.length; k += 1) {
			if (j !== k) {
				p2 = particles[k];
				dx = p.x - p2.x;
				dy = p.y - p2.y;
				dr = p2.r / Math.pow(p.r, 2) * G;

				p.dx -= dx*dr;
				p.dy -= dy*dr;
			}
		}
		p.update();
	}

	// drawing magic
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    p = mousep;

    do {
        ctx.beginPath();
        ctx.arc(
            p.x,
            p.y,
            p.r,
            0,
            6.28);
        ctx.fill();
        p = particles[i++];
    } while (i <= particles.length);

	if (mdown) {
		ctx.beginPath();
		ctx.moveTo(initx, inity);
		ctx.lineTo(prevx, prevy);
		ctx.stroke();
	}

    requestAnimFrame(drawLoop);
}

window.onload = function () {
    canvas = document.getElementById('main-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#999';

    drawLoop();
};

window.addEventListener('mousewheel', scroll);
window.addEventListener('DOMMouseScroll', scroll);
window.addEventListener('mousemove', mousemove);
window.addEventListener('mouseup', mouseup);
window.addEventListener('mousedown', mousedown);