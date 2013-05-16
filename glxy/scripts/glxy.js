define(["./particle", "./color", "./options", "./event"],
    function (Particle, Color, options, ev) {
    var
    canvas, // main canvas
    trailCanvas, // trail canvas
    ctx, // main canvas context
    ctx2, // trail canvas context
    partcount, // element that displays particle count
    help, // element that displays help
    locked = false, // whether the pointer is locked

    minRadius = 2,
    maxRadius = 70,
    G = 0.1,
    sG = G * 0.5,

    protoParticle = new Particle({r: minRadius}),
    particles = [],
    particleColors = {},

    mouseDown = false,
    initx = 0, inity = 0,
    panx = 0, pany = 0;

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
		case 32: //SPACE
			options.set('panning', true);
			break;
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
                    x: (Math.random() * canvas.width) - panx,
                    y: (Math.random() * canvas.height) - pany,
                    r: minRadius + Math.random() * 6
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

    function keyup(e) {
		switch (e.keyCode) {
		case 32: //SPACE
			options.set('panning', false);
			break;
		}
	}

    function scroll(e) {
		if (locked) {
			var d = (e.detail ? e.detail * -1 : e.wheelDelta / 40) * 0.4,
				psize = protoParticle.r;

			d = d > 0 ? d : -1/d;
			psize *= d;
			psize = Math.min(maxRadius, Math.max(minRadius, psize));
			protoParticle.r = psize;
		}
    }

    function mousedown(e) {
        if (locked && !options.get('panning')) {
            mouseDown = true;
            protoParticle.dx = 0;
            protoParticle.dy = 0;
            initx = protoParticle.x;
            inity = protoParticle.y;
        }
    }

    function mousemove(e) {
        if (locked) {
			if (options.get('panning')) {
				panx += e.dx;
				pany += e.dy;
			} else {
				protoParticle.x += e.dx;
				protoParticle.y += e.dy;
				if (mouseDown) {
					protoParticle.dx -= (e.dx) * sG;
					protoParticle.dy -= (e.dy) * sG;
				}
			}
        }
    }

    function mouseup(e) {
        if (locked && !options.get('panning')) {
            var p = new Particle(protoParticle);
            addParticle(p);
            mouseDown = false;
        }
    }

    function resize() {
		panx -= canvas.width / 2;
		pany -= canvas.height /2;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        trailCanvas.width = canvas.width;
        trailCanvas.height = canvas.height;
        panx += canvas.width / 2;
        pany += canvas.height / 2;
    }

    function pointerlockchange () {
        locked = (document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas ||
            document.webkitPointerLockElement === canvas);
        canvas.setAttribute("data-locked", locked);
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
                d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) || 1;

                if (p.collidesWith(p2)) {
                    if (options.get('collision')) {
                        // collision
                        mtd = 2*(p.r + p2.r - d)/d;

                        p2.x += dx * mtd / p2.r;
                        p2.y += dy * mtd / p2.r;
                        p.x -= dx * mtd / p.r;
                        p.y -= dy * mtd / p.r;
                        p2.dx += dx * mtd / p2.mass;
                        p2.dy += dy * mtd / p2.mass;
                        p.dx -= dx * mtd / p.mass;
                        p.dy -= dy * mtd / p.mass;

                        // update smallest particle to keep it from getting stuck
                        //(p2.r > p.r ? p2 : p).update();
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
        var p, i, c;

        if (locked) {
			// only draw protoParticle if locked
			p = protoParticle;
			i = 0;
		} else {
			p = particles[0];
			i = 1;

			if (!p) {
				return;
			}
		}

        clear(ctx);

        ctx.save();
        ctx2.save();
		ctx.translate(panx, pany);
		ctx2.translate(panx, pany);

        do {
            // mass-based particle color
            // FIXME: changing the fillStyle is inefficient
            if (p.r < 5) {
                c = particleColors.small;
            } else if (p.r <= 35) {
                c = particleColors.small.interpolate(particleColors.medium, (p.r - 5) / 35);
            } else if (p.r <= 70) {
                c = particleColors.medium.interpolate(particleColors.large, (p.r - 35) / 70);
            } else if (p.r <= 100) {
                c = particleColors.large.interpolate(particleColors.huge, (p.r - 70) / 100);
            } else {
                c = particleColors.huge;
            }

            ctx.fillStyle = c.toString();

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
                ctx2.fillStyle = c.toString();
                ctx2.beginPath();
                ctx2.arc(p.x, p.y, Math.sqrt(Math.sqrt(p.r)), 0, 6.28);
                ctx2.fill();
            }

            p = particles[i++];

        } while (i <= particles.length);

        if (mouseDown) {
            // draw line
            ctx.strokeStyle = "#eee";
            ctx.beginPath();
            ctx.moveTo(initx, inity);
            ctx.lineTo(protoParticle.x, protoParticle.y);
            ctx.stroke();
        }

        ctx.restore();
        ctx2.restore();
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
            help = params.help;

            canvas = params.mainCanvas;
            trailCanvas = params.trailCanvas;
            partcount = params.particleCount;

            ctx = canvas.getContext('2d');
            ctx.fillStyle = '#eee';
            ctx.strokeStyle = '#999';

            ctx2 = trailCanvas.getContext('2d');
            ctx2.fillStyle = '#eee';
            ctx2.strokeStyle = '#eee';

            particleColors = {
                small: new Color({r: 150, g: 205, b: 205}),
                medium: new Color({r: 255, g: 240, b: 70}),
                large: new Color({r: 255, g: 90, b: 70}),
                huge: new Color({r: 60, g: 30, b: 70})
            };

            options.init(params.options);
            resize(); // set initial sizes

            if (!params.pointerLock) {
				document.body.style.cursor = "none";
				locked = true;
				ev.addListeners(canvas, {
					mousemove: function (e) {
						protoParticle.x = e.clientX - panx;
						protoParticle.y = e.clientY - pany;
					}
				}, false);
			}

            ev.addListeners(canvas, {
                click: function (e) {
					if (params.pointerLock) {
						if (!locked) {
							protoParticle.x = e.clientX - panx;
							protoParticle.y = e.clientY - pany;
						}

						canvas.requestPointerLock = canvas.requestPointerLock
						|| canvas.mozRequestPointerLock
						|| canvas.webkitRequestPointerLock;

						canvas.requestPointerLock();
					}
				}
            }, false);

            ev.addListeners(window, {
                mousewheel: scroll,
                mousemove: mousemove,
                mouseup: mouseup,
                mousedown: mousedown,
                keydown: keydown,
                keyup: keyup,
                resize: resize,
                pointerlockchange: pointerlockchange
            });
        },

        start: function () {
            drawLoop();
        }
    };
});
