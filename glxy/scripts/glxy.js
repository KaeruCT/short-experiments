define(["./particle", "./options"], function (Particle, options) {
	var
	canvas, // main canvas
	ctx, // main canvas context
	ctx2, // trail canvas context
    partcount, // element that displays particle count
    help, // element that displays help

    minRadius = 2,
    maxRadius = 70,
    G = 0.1,
    sG = G * 0.5,

    protoParticle = new Particle({r: minRadius}),
    particles = [],

    mouseDown = false,
    prevx = 0, prevy = 0,
    initx = 0, inity = 0;

	function addParticle(p) {
		particles.push(p);
		partcount.textContent = particles.length;
	}

	function removeParticle(i) {
		particles.splice(i, 1);
		partcount.textContent = particles.length;
	}

	function clear(ctx) {
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
	}

	function keydown(e) {
		switch(e.keyCode) {
		case 67: //C
			options.toggle('collision');
			break;
		case 82: //R
			particles = [];
			partcount.textContent = 0;
			clear(ctx2);
			break;
		case 72: //H
			var d = help.style.display;

			options.toggle('help');
			help.style.display = (d === '' || d === 'block' ? 'none' : 'block');
			break;
		case 80: //P
			options.toggle('pause');
			break;
		case 81: //Q
			var i = 0, p;
			for (; i < 10; i += 1) {
				p = new Particle({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					r: minRadius + Math.random() * 4
				});
				addParticle(p);
			}
			break;

		case 84: //T
			options.toggle('trails');
			clear(ctx2);
			break;
		}
	}

	function scroll(e) {
		var d = (e.detail ? e.detail * -1 : e.wheelDelta / 40) * 0.4,
			psize = protoParticle.r;

		d = d > 0 ? d : -1/d;
		psize *= d;
		psize = Math.min(maxRadius, Math.max(minRadius, psize));
		protoParticle.r = psize;
	}

	function mousedown(e) {
		mouseDown = true;
		protoParticle.dx = 0;
		protoParticle.dy = 0;
		prevx = e.clientX;
		prevy = e.clientY;
		initx = prevx;
		inity = prevy;
	}

	function mouseup(e) {
		var p = new Particle(protoParticle);
		addParticle(p);
		mouseDown = false;
	}

	function mousemove(e) {
		protoParticle.x = e.clientX;
		protoParticle.y = e.clientY;
		if (mouseDown) {
			protoParticle.dx += (prevx - e.clientX) * sG;
			protoParticle.dy += (prevy - e.clientY) * sG;
			prevx = e.clientX;
			prevy = e.clientY;
		}
	}

	function updateParticles() {
		var p, p2,  dx, dy,
			theta, force, fscale,
			k, j, mtd;

		for (j = 0; j < particles.length; j += 1) {
			p = particles[j];
			if (p.dead) continue;

			for (k = 0; k < particles.length; k += 1) {
				p2 = particles[k];
				if (p2.dead || j === k) continue;

				dx = p2.x - p.x;
				dy = p2.y - p.y;
				d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

				if (p.collidesWith(p2)) {
					if (options.get('collision')) {
						// collision
						mtd = (p.r + p2.r - d)/(d||1);

						p2.dx += dx * mtd / p2.r;
						p2.dy += dy * mtd / p2.r;
						p.dx -= dx * mtd / p.r;
						p.dy -= dy * mtd / p.r;

						// update smallest particle to keep it from getting stuck
						(p2.r > p.r ? p : p2).update();
					} else {
						// kill smaller particle
						if (p.r > p2.r) {
							p.r += Math.sqrt(p2.r/2);
							p2.kill();
							break;
						} else {
							p2.r += Math.sqrt(p.r/2);
							p.kill();
						}
					}
				} else {
					// "gravity"
					force = G * p.mass * p2.mass / Math.pow(d, 2);
					fscale = force / d;
					p.dx += fscale * dx / p.mass;
					p.dy += fscale * dy / p.mass;
				}
			}
		}

		for (j = particles.length-1; j >= 0; j -= 1) {
			p = particles[j];
			if (p.dead) {
				removeParticle(j);
			} else {
				p.update();
			}
		}
	}

	function drawParticles() {
		var p = protoParticle,
			i = 0;

		clear(ctx);

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

			if (i > 0 && options.get('trails')) {
				// trail
				ctx2.beginPath();
				ctx2.arc(p.x, p.y, Math.sqrt(Math.sqrt(p.r)), 0, 6.28);
				ctx2.fill();
			}

			p = particles[i++];

		} while (i <= particles.length);

		ctx.restore();

		if (mouseDown) {
			// draw line
			ctx.beginPath();
			ctx.moveTo(initx, inity);
			ctx.lineTo(prevx, prevy);
			ctx.stroke();
		}
	}

	function drawLoop () {
		if (!options.get('pause')) {
			updateParticles();
		}

		drawParticles();
		window.requestAnimFrame(drawLoop);
	}

    return {
		init: function (params) {
			var c2 = params.trailCanvas;

			window.addEventListener('mousewheel', scroll);
			window.addEventListener('DOMMouseScroll', scroll);
			window.addEventListener('mousemove', mousemove);
			window.addEventListener('mouseup', mouseup);
			window.addEventListener('mousedown', mousedown);
			window.addEventListener('keydown', keydown);

			help = params.help;

			canvas = params.mainCanvas;
			partcount = params.particleCount;

			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			c2.width = canvas.width;
			c2.height = canvas.height;

			ctx = canvas.getContext('2d');
			ctx.fillStyle = '#eee';
			ctx.strokeStyle = '#999';

			ctx2 = c2.getContext('2d');
			ctx2.fillStyle = '#71AAB9';
			ctx2.strokeStyle = '#71AAB9';

			options.init({
				pause: false,
				collision: false,
				trails: true,
				help: true
			});
		},

		start: function () {
			drawLoop();
		}
	};
});