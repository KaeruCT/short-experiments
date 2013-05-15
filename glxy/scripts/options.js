define(function () {
	var flags = {};

	return {
		toggle: function (arg) {
			var d = document.getElementById(arg);
			flags[arg] = !flags[arg];

			if (d) {
				d.setAttribute('class', flags[arg] ? 'enabled' : '');
			}
		},
		get: function (arg) {
			return flags[arg];
		},
		init: function (options) {
			flags = options;

			for (var p in flags) {
				this.toggle(p);
				this.toggle(p);
			}
		}
	};
});