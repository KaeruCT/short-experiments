function Color(h, s, l) {
    this.hincv = 2;
    this.lincv = 0.1;
    this.l_dir = 0;
    if (h instanceof Color) {
        s = h.s;
        l = h.l;
        h = h.h;
    }
    this.h = h !== undefined ? h : 0;
    this.s = s !== undefined ? s : 100;
    this.l = l !== undefined ? l : 50;
    this.minl = 10;
    this.maxl = 90;
    this.a = 100;
}
Color.prototype.get = function(opts) {
    var h, s, l, a;
    opts = opts || {};
    h = opts.h !== undefined ? opts.h : this.h;
    s = opts.s !== undefined ? opts.s : this.s;
    l = opts.l !== undefined ? opts.l : this.l;
    a = opts.a !== undefined ? opts.a : this.a;

    return 'hsla('+h+','+s+'%,'+l+'%'+','+a+')';
};
Color.prototype.inc_h = function () {
    this.h = (this.h + this.hincv)%360;
};
Color.prototype.inc_l = function () {
    this.l = Math.min(this.l + this.lincv, 100);
};

(function (exports) {
    var handlers = {}, // handlers[keyCode] = [{function: function () {}, args: []}, ...]
    keyState = {},

    KEY_UP = 0,
    KEY_DOWN = 1,
    KEY_JUST_PRESSED = 3,
    KEY_JUST_RELEASED = 4,

    key = {
        'LEFT':   37,
        'UP':     38,
        'RIGHT':  39,
        'DOWN':   40,
        'ACTION': 90,

        'PAUSE':  27, // ESC

        'update': function () {
            var c,
                keyCode;

            for (keyCode in keyState) {
                c = keyState[keyCode];

                if (c === KEY_JUST_PRESSED) {
                    keyState[keyCode] = KEY_DOWN;
                } else if (c === KEY_JUST_RELEASED) {
                    keyState[keyCode] = KEY_UP;
                }
            }
        },

        'justPressed': function (keyCode) {
            return keyState[keyCode] === KEY_JUST_PRESSED;
        },

        'justReleased': function (keyCode) {
            return keyState[keyCode] === KEY_JUST_RELEASED;
        },

        'isUp': function (keyCode) {
            if (typeof keyState[keyCode] === 'undefined') {
                keyState[keyCode] = KEY_UP;
            }

            return keyState[keyCode] === KEY_UP;
        },

        'isDown': function (keyCode) {
            return keyState[keyCode] === KEY_DOWN;
        },

        'addHandler': function (keyCode, handler) {

            // handler: {function: function () {}, args: []}

            if (typeof handlers[keyCode] === 'undefined') {
                handlers[keyCode] = [];
            }

            if (typeof handler === 'function') {
                handler = {
                    'callback': handler,
                    'args': []
                };
            } else if (typeof handler.args === 'undefined') {
                handler.args = [];
            }

            handlers[keyCode].push(handler);
        },

        'onKeyDown': function (event) {
            var i,
                handler,
                keyHandlers;

            // avoid keydown events repeatedly fired when key is held down
            if (key.isUp(event.keyCode)) {
                keyState[event.keyCode] = KEY_JUST_PRESSED;

                if (typeof handlers[event.keyCode] !== 'undefined') {

                    keyHandlers = handlers[event.keyCode];

                    for (i = 0; i < keyHandlers.length; i += 1) {

                        handler = handlers[event.keyCode][i];
                        handler.callback.apply(application, [handler.args]);
                    }
                }
            }

        },

        'onKeyUp': function (event) {
            keyState[event.keyCode] = KEY_JUST_RELEASED;
        }
    };

    exports.input = key;
}(window));
