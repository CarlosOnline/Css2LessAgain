/// <reference path="references.ts" />
var ViewModel = (function () {
    function ViewModel() {
        var _this = this;
        this.css = "";
        this.less = "";
        this.settings = new Settings();
        this.subscriptions = new SubscriptionList();
        this.variables = "";
        this.convert = function () {
            console.log("converting");
            _this.less = "";
            _this.variables = "";
            if (_this.css.length == 0)
                return;

            var xform = new css2less(_this.css, _this.settings.options);
            _this.less = xform.processLess();
            _this.variables = xform.resources;
        };
        this.go = {
            click: function () {
                _this.convert();
            },
            enabled: ko.es5.mapping.computed(function () {
                return _this.less.length > 0 ? true : false;
            })
        };
        this.load = function () {
            _this.css = getCookie("view", "css", _this.css);
        };
        this.save = function () {
            var data = {
                css: _this.css
            };
            $.cookie("view", data, { expires: 365 });
        };
        this.load();
        this.convert();
        ko.es5.mapping.track(this);
        this.subscriptions.add(this.settings.options, function (newValue) {
            _this.convert();
        });

        //this.subscriptions.add(ko.getObservable(this.settings.rulesList, "values"), (newValue) => {
        //    this.convert();
        //});
        this.subscriptions.add(ko.getObservable(this, "css"), function (newValue) {
            _this.convert();
            _this.save();
        }, true, true);
    }
    return ViewModel;
})();
//# sourceMappingURL=viewModel.js.map
