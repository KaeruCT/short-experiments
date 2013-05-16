// set up requestAnimFrame
window.requestAnimFrame =
window.requestAnimationFrame       ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame    ||
window.oRequestAnimationFrame      ||
window.msRequestAnimationFrame     ||
function (callback) {
    window.setTimeout(callback, 1000 / 60);
};

require(["./glxy"], function (glxy) {
	var $d = function (id) {
		return document.getElementById(id);
	};

	glxy.init({
		mainCanvas: $d("main-canvas"),
		trailCanvas: $d("trail-canvas"),
		particleCount: $d("particle-count"),
		help: $d("help-box"),
		pointerLock: false,
		options: {
			pause: false,
			collision: true,
			trails: false,
			help: true,
			panning: false
		}
	});

	glxy.start();
});
