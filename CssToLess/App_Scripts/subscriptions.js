/// <reference path="references.ts" />
var Subscription = (function () {
    function Subscription(data, callback, subscribe, deferred) {
        if (typeof subscribe === "undefined") { subscribe = true; }
        if (typeof deferred === "undefined") { deferred = false; }
        var _this = this;
        this.data = data;
        this.callback = callback;
        this.deferred = deferred;
        this.deferredInterval = null;
        this.deferredData = null;
        this.isObject = function (value) {
            if (value == null || typeof (value) == "function")
                return false;
            if (typeof (value) == "object" && value.__proto__ == undefined)
                return true;
            var xtor = value.__proto__.constructor;
            return xtor !== undefined && xtor.name == "Object" ? true : false;
        };
        this.subscribe = method(function (deferred) {
            if (deferred !== undefined)
                _this.deferred = deferred;

            if (_this.data != null) {
                _this.dispose();
                _this.dirtyFlag = _this.isObject(_this.data) ? ko.dirtyFlag(_this.data) : null;
            }

            if (_this.dirtyFlag != null) {
                _this.subscription = _this.dirtyFlag.isDirty.subscribe(_this.callback);
            } else {
                if (_this.data === null)
                    return;

                _this.subscription = _this.data.subscribe(function (data) {
                    if (!_this.deferred)
                        _this.callback(data);
else
                        _this.deferredCallback(data, false);
                });
            }
        });
        this.dispose = method(function () {
            if (_this.subscription != null) {
                _this.subscription.dispose();
                _this.subscription = null;
            }
        });
        this.deferredCallback = method(function (data, Force) {
            _this.deferredInterval = _this.deferredInterval || null;
            _this.deferredData = data;
            data = data || _this.deferredData;

            Force = Force || false;
            if (Force) {
                _this.deferredData = null;

                if (_this.deferredInterval != null) {
                    window.clearInterval(_this.deferredInterval);
                    _this.deferredInterval = null;
                }

                _this.callback(data);
            } else if (_this.deferredInterval == null) {
                var subscription = _this;
                _this.deferredInterval = setInterval(function () {
                    subscription.deferredCallback(null, true);
                }, 1000);
            } else {
                // save already pending
            }
        });
        if (data === null || data === undefined) {
            console.log(data, "null subscription object");
            console.trace();
            throw Error("Missing subscription object");
        }

        if (this.callback === undefined)
            this.callback = function () {
            };

        if (this.data === undefined)
            this.data = null;

        if (subscribe) {
            this.subscribe();
        }
    }
    return Subscription;
})();

var SubscriptionList = (function () {
    function SubscriptionList(subscribe) {
        if (typeof subscribe === "undefined") { subscribe = true; }
        var _this = this;
        this.subscribe = subscribe;
        this.list = [];
        this.add = function (data, callback, subscribe, deferred) {
            if (data === null || data === undefined) {
                console.log(data, "null subscription object");
                console.trace();
                throw Error("Missing subscription object");
            }

            if (subscribe === undefined)
                subscribe = _this.subscribe;

            var subscription = new Subscription(data, callback, subscribe, deferred);
            _this.list.push(subscription);
            return subscription;
        };
        this.remove = function (subscription) {
            var idx = _this.list.indexOf(subscription);
            if (idx != -1) {
                _this.list.slice(idx, 1);
                return true;
            }
            return false;
        };
        this.subscribeAll = function () {
            _this.list.forEach(function (subscription) {
                subscription.subscribe();
            });
        };
        this.disposeAll = function () {
            _this.list.forEach(function (subscription) {
                subscription.subscribe();
            });
        };
    }
    return SubscriptionList;
})();
//# sourceMappingURL=subscriptions.js.map
