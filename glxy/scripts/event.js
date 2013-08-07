define(function () {
	var aliases = {
		"mousewheel": ["DOMMouseScroll"],
		"pointerlockchange": ["mozpointerlockchange", "webkitpointerlockchange"],
		"mousedown": ["touchstart"],
		"mousemove": ["touchmove"],
		"mouseup": ["touchend"]
	},
	entryCoords = {};

	function getDelta(e) {
		var dx = e.movementX || e.mozMovementX || e.webkitMovementX || 0,
		dy = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

		return {x: dx, y: dy};
	}

	function getCoords(e) {
		var id = e.target.getAttribute("id"), p,
			d = getDelta(e),
			locked = e.target.getAttribute("data-locked");

		if (id in entryCoords) {
			p = entryCoords[id];
		} else {
			p = {x: 0, y: 0};
		}

		p.x += d.x;
		p.y += d.y;

		entryCoords[id] = p;

		return p;
	}

	function wrapHandler(fn) {
		return function (e) {
			var coords, d = getDelta(e);

			if (e.target.getAttribute && e.target.getAttribute("data-locked")) {
				coords = getCoords(e);
				e.ex = coords.x;
				e.ey = coords.y;
			} else {
				e.ex = e.clientX;
				e.ey = e.clientY;
			}

			e.dx = d.x;
			e.dy = d.y;

			fn(e);
		};
	}

	return {
		addListeners: function (el, events, wrap) {
			var event, fn, i, alias;
			wrap = wrap === undefined ? true : wrap;

			function ael(event, fn) {
				if (wrap) {
					fn = wrapHandler(fn);
				}

				el.addEventListener(event, fn);
			}

			for (event in events) {
				fn = events[event];
				ael(event, fn);

				if (event in aliases) {
					for (i in aliases[event]) {
						alias = aliases[event][i];
						ael(alias, fn);
					}
				}
			}
		}
	};
});