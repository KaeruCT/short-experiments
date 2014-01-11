module.exports = exports = z = (function () {
    var Z = function (args) {
        var i;
        this.arr = [];
        for (i in args) {
            this.append(args[i]);
        }
        return this;
    };
    
    Z.prototype.append = function () {
        var args = Array.prototype.slice.call(arguments),
            i, val;
        
        for (i in args) {
            val = args[i];
            if (val instanceof Array) {
                this.arr = this.arr.concat(val);
            } else if (val instanceof Z) {
                this.append(val.get());
            } else {
                this.arr.push(val);
            }
        }
        return this;
    };
    
    Z.prototype.each = function (fn) {
        var i;
        for (i in this.arr) {
            fn.call(this, this.arr[i]);
        }
        return this;
    };
    
    Z.prototype.sort = function (fn) {
        fn = fn || function (a, b) {
            return a > b;
        };
        this.arr = this.arr.sort(fn);
        return this;
    };
    
    Z.prototype.filter = function (arg) {
        var i, fn;
        if (arg === undefined) {
            fn = function (n) {
                return !n;
            };
        } else if (typeof arg === "function") {
            fn = arg;
        } else if (arg instanceof RegExp) {
            fn = function (n) {
                return n.match(arg);
            };
        } else {
            fn = function (n) {
                return n === arg;
            };
        }
        
        for (i = this.arr.length - 1; i >= 0; i--) {
            if (!fn.call(this, this.arr[i])) {
                this.arr.splice(i, 1);
            }
        }
        return this;
    };
    
    Z.prototype.length = function () {
        return this.arr.length;
    };
    
    Z.prototype.get = function () {
        return this.arr;
    };
    
    Z.prototype.log = function () {
        console.log(this.get());
        return this;
    };
    
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return new Z(args);
    };
}());

z.range = function (start, count) {
    return Array.apply(0, Array(count)).map(function (_, i) { 
        return i + start;  
    });
};
