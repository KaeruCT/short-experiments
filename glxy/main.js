window.requestAnimFrame =
window.requestAnimationFrame       ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame    ||
window.oRequestAnimationFrame      ||
window.msRequestAnimationFrame     ||
function (callback) {
	window.setTimeout(callback, 1000 / 60);
};

var canvas, ctx, ctx2,
	partcount,

	pmin = 2,
	G = 0.0003,
	sG = G*200

	psize = pmin,
	mousep = new Particle(0, 0, psize),
	particles = [],

	mdown = false, prevx = 0, prevy = 0,
	initx = 0, inity = 0;

	pause = false,
	trails = false
	;

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

function addParticle(p) {
	particles.push(p);
	partcount.innerText = particles.length;
}

function clear(ctx) {
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.restore();
}

function keydown(e) {
	switch(e.keyCode) {
	case 82: //R
		particles = [];
		partcount.innerText = 0;
		clear(ctx2);
		break;
	case 72: //H
		var help = document.getElementById('help'),
			d = help.style.display;

		help.style.display = (d == '' || d == 'block' ? 'none' : 'block');
		break;
	case 80: //P
		pause = !pause;
		break;
	case 81: //Q
		var i = 0, p;
		for (; i < 10; i += 1) {
			p = new Particle({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				r: pmin + Math.random() * 4
			});
			addParticle(p);
		}
		break;
	case 84: //T
		trails = !trails;
		clear(ctx2);
		break;
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
	addParticle(p);
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

	if (!pause) {
		// physics magic
		for (; j < particles.length; j += 1) {
			p = particles[j];
			for (k = 0; k < particles.length; k += 1) {
				if (j !== k) {
					p2 = particles[k];
					dx = p.x - p2.x;
					dy = p.y - p2.y;
					dr = Math.sqrt(p2.r) / Math.pow(p.r, 2) * G;

					p.dx -= dx*dr;
					p.dy -= dy*dr;
				}
			}
			p.update();
		}
	}

	// drawing magic
    clear(ctx);

    p = mousep;

    do {
		// particle
        ctx.beginPath();
        ctx.arc(
            p.x,
            p.y,
            p.r,
            0,
            6.28);
        ctx.fill();

		if (i > 0 && trails) {
			// trail
			ctx2.beginPath();
			ctx2.arc(p.x, p.y, Math.sqrt(Math.sqrt(p.r)), 0, 6.28);
			ctx2.fill();

			if (i == 1) {
				ctx.translate(cx, cy);
			}
		}

        p = particles[i++];

    } while (i <= particles.length);

    ctx.restore();

	if (mdown) {
		// draw line
		ctx.beginPath();
		ctx.moveTo(initx, inity);
		ctx.lineTo(prevx, prevy);
		ctx.stroke();
	}

    requestAnimFrame(drawLoop);
}

window.onload = function () {
	var c2 = document.getElementById('trail-canvas');
    canvas = document.getElementById('main-canvas');
    partcount = document.getElementById('particle-count');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    c2.width = canvas.width;
    c2.height = canvas.height;

    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#999';

    ctx2 = c2.getContext('2d');
    ctx2.fillStyle = '#555';
    ctx2.strokeStyle = '#555';

    drawLoop();
};

window.addEventListener('mousewheel', scroll);
window.addEventListener('DOMMouseScroll', scroll);
window.addEventListener('mousemove', mousemove);
window.addEventListener('mouseup', mouseup);
window.addEventListener('mousedown', mousedown);
window.addEventListener('keydown', keydown);