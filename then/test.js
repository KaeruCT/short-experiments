function ajaxGet(file, callback) {
    var xhttp = new XMLHttpRequest();

    xhttp.open('GET', file);
    xhttp.send(null);
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            callback.call(xhttp, xhttp.responseText);
        }
    };
}

function Promise(fn) {
    var self = this;

    self.fn = fn;
    self.value = null;
    self.prevPromise = null;
    self.nextPromise = null;
    self.success = null;
    self.failure = null;

    self.then = function (success, failure) {
        self.success = success;
        self.failure = failure || null;

        self.nextPromise = new Promise(function (onDone) {
            onDone.call(null);
        });

        self.callFn();

        self.nextPromise.prevPromise = self;
        return self.nextPromise;
    };
}

Promise.prototype.callFn = function () {
    var self = this;

    if (self.prevPromise && !self.prevPromise.value) {
        return;
    }

    self.fn.call(null, function (value) {

        if (self.prevPromise && self.prevPromise.value) {
            value = self.prevPromise.value;
        }

        if (self.success) {
            self.value = self.success.call(null, value);

            if (self.nextPromise) {
                self.nextPromise.callFn();
            }
        }
    });
};
