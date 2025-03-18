var MyPromise = /** @class */ (function () {
    function MyPromise(executor) {
        this._state = 'pending';
        this._result = undefined;
        this._successCallbacks = [];
        this._errorCallbacks = [];
        this._finallyCallbacks = [];
        if (typeof executor !== 'function') {
            throw new Error('Executor should be a function!');
        }
        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        }
        catch (error) {
            this.result = error;
            this.reject.call(this, error);
        }
    }
    Object.defineProperty(MyPromise.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (newState) {
            this._state = newState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyPromise.prototype, "result", {
        get: function () {
            return this._result;
        },
        set: function (newResult) {
            this._result = newResult;
        },
        enumerable: false,
        configurable: true
    });
    MyPromise.prototype.addSuccessCallback = function (cb) {
        if (cb) {
            this._successCallbacks.push(cb);
        }
    };
    MyPromise.prototype.addErrorCallback = function (cb) {
        if (cb) {
            this._errorCallbacks.push(cb);
        }
    };
    MyPromise.prototype.addFinallyCallback = function (cb) {
        if (cb) {
            this._finallyCallbacks.push(cb);
        }
    };
    Object.defineProperty(MyPromise.prototype, "successCallbacks", {
        get: function () {
            return this._successCallbacks;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyPromise.prototype, "errorCallbacks", {
        get: function () {
            return this._errorCallbacks;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyPromise.prototype, "finallyCallbacks", {
        get: function () {
            return this._finallyCallbacks;
        },
        enumerable: false,
        configurable: true
    });
    MyPromise.prototype.resolve = function (result) {
        if (this.state !== 'pending') {
            return;
        }
        this.state = 'fulfilled';
        this.result = result;
        this.onFullfilled();
        this.onFinally();
    };
    MyPromise.prototype.reject = function (reason) {
        if (this.state !== 'pending') {
            return;
        }
        this.state = 'rejected';
        this.result = reason;
        this.onRejected();
        this.onFinally();
    };
    MyPromise.prototype.onFullfilled = function () {
        var _this = this;
        setTimeout(function () {
            _this.successCallbacks.forEach(function (cb) {
                if (cb) {
                    cb(_this.result);
                }
            });
        });
    };
    MyPromise.prototype.onRejected = function () {
        var _this = this;
        setTimeout(function () {
            _this.errorCallbacks.forEach(function (cb) {
                if (typeof cb === 'function') {
                    cb(_this.result);
                }
            });
        });
    };
    MyPromise.prototype.onFinally = function () {
        var _this = this;
        setTimeout(function () {
            _this.finallyCallbacks.forEach(function (cb) {
                if (typeof cb === "function") {
                    cb();
                }
            });
        });
    };
    MyPromise.prototype.then = function (onFullfilled, onRejected) {
        var _this = this;
        if (this.state === 'fulfilled' && onFullfilled) {
            setTimeout(function () {
                onFullfilled(_this.result);
            });
            return this;
        }
        else if (this.state === 'rejected' && onRejected) {
            setTimeout(function () {
                onRejected(_this.result);
            });
            return this;
        }
        else {
            this.addSuccessCallback(onFullfilled);
            this.addErrorCallback(onRejected);
        }
        return this;
    };
    MyPromise.prototype.catch = function (onRejected) {
        return this.then(undefined, onRejected);
    };
    MyPromise.prototype.finally = function (onFinally) {
        if (this.state !== 'pending' && onFinally) {
            onFinally();
            return;
        }
        else {
            this.addFinallyCallback(onFinally);
            return this;
        }
    };
    return MyPromise;
}());
var promise = new MyPromise(function (resolve, reject) {
    reject("error");
});
setTimeout(function () {
    promise.then(undefined, function () { console.log("error"); }).finally(function () { return console.log("onFinally"); });
}, 1000);
