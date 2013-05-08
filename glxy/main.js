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
    G = 0.01,
    sG = G*10,

    psize = pmin,
    mousep = new Particle(0, 0, psize),
    particles = [],

    mdown = false, prevx = 0, prevy = 0,
    initx = 0, inity = 0;

    pause = false,
    collision = false,
    trails = false
    ;

function Particle(p) {
	var i = 0, prop,
		props = ['x', 'y', 'dx', 'dy', 'r'];

    p = p || {};
    for (i in props) {
		prop = props[i];
		this[prop] = p[prop] || 0;
	}

    this.update = function () {
		//var max = 100, max2 = Math.pow(max, 2),
			//dx, dy
			//s = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
//
		//if (s > max) {
			//dx = this.dx;
			//dy = this.dy;
			//this.dx = Math.sqrt(max2 - Math.pow(this.dy, 2)) || 0;
			//this.dy = Math.sqrt(max2 - Math.pow(this.dy, 2)) || 0;
		//}
        this.x += this.dx;
        this.y += this.dy;
    };
}

function addParticle(p) {
    particles.push(p);
    partcount.textContent = particles.length;
}

function save() {
	var strurl = window.location.href;
	strurl = strurl.replace(/#.+$/, '');
	strurl += "#" + lzw_encode(JSON.stringify(particles));
	window.prompt('Copy/paste the following URL to share your system', strurl);
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
        collision = !collision;
        break;
    case 82: //R
        particles = [];
        partcount.textContent = 0;
        clear(ctx2);
        break;
    case 72: //H
        var help = document.getElementById('help'),
            d = help.style.display;

        help.style.display = (d === '' || d === 'block' ? 'none' : 'block');
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
    case 83: //S
		save();
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
    var p, p2, adx, ady,
        dx, dy, force,
        mtd,
        k = 0, j = 0, i = 0;

    if (!pause) {
        // physics magic
        for (; j < particles.length; j += 1) {
            p = particles[j];

            for (k = 0; k < particles.length; k += 1) {
                if (j !== k) {
                    p2 = particles[k];
                    dx = p2.x - p.x;
					dy = p2.y - p.y;
					d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) || 1;

                    if (collision && Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(p.r + p2.r, 2)) {
						// collision
						mtd = (p.r + p2.r - d)/d;

						p2.dx += dx * mtd / p2.r;
						p2.dy += dy * mtd / p2.r;
						p.dx -= dx * mtd / p.r;
						p.dy -= dy * mtd / p.r;
						//p.update();
						//p2.update();
						// update smallest particle to keep it from getting stuck
						(p2.r > p.r ? p : p2).update();
                    } else {
						// "gravity"
						d = p.r*p2.r;
						adx = Math.abs(dx);
						ady = Math.abs(dy);
						if (adx < d) {
							dx *= d/adx;
							adx = Math.abs(dx);
						}
						if (ady < d) {
							dy *= d/ady;
							ady = Math.abs(dy);
						}

						force = G * Math.pow(p2.r, 3);

						p.dx += force * dx / (adx * Math.pow(dy, 2));
						p.dy += force * dy / (ady * Math.pow(dx, 2));
					}
                }
            }
        }

        for (j = 0; j < particles.length; j += 1) {
			particles[j].update();
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

    if (window.location.hash) {
		try {
			var json = lzw_decode(window.location.hash.replace(/^#/, "")),
				plist = JSON.parse(json);

			for (var i = 0; i < plist.length; i += 1) {
				particles.push(new Particle(plist[i]));
			}
		} catch (e) {
			console.log(json,e);
		}
	}

    drawLoop();
};

window.addEventListener('mousewheel', scroll);
window.addEventListener('DOMMouseScroll', scroll);
window.addEventListener('mousemove', mousemove);
window.addEventListener('mouseup', mouseup);
window.addEventListener('mousedown', mousedown);
window.addEventListener('keydown', keydown);