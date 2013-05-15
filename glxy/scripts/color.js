define(function () {
    function Color(c) {
        var i = 0, prop,
            props = ['r', 'g', 'b'];

        c = c || {};
        for (i in props) {
            prop = props[i];
            this[prop] = c[prop] || 0;
        }

        return this;
    };

    Color.prototype = {
        set: function (r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        },

        interpolate: function (color, x) {
            x = x !== undefined ? x : 1;
            return new Color ({
                r: Math.floor(this.r + ((color.r - this.r) * x)),
                g: Math.floor(this.g + ((color.g - this.g) * x)),
                b: Math.floor(this.b + ((color.b - this.b) * x)),
            });
        },

        toString: function () {
            return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
        }
    };
    return Color;
});
