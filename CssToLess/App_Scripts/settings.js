var Settings = (function () {
    function Settings() {
        var _this = this;
        this.closed = true;
        this.options = {
            blockFromNewLine: true,
            blockSeparatorText: "\\n",
            blockSeparator: ko.es5.mapping.computed(function () {
                return _this.options.blockSeparatorText.replace("\\n", String.fromCharCode(13));
            }),
            combineVariables: false,
            indentSize: 4,
            indentSymbol: " ",
            rulesList: [
                "font-size",
                "background-color"
            ],
            selectorSeparatorText: ",\\n",
            selectorSeparator: ko.es5.mapping.computed(function () {
                return _this.options.selectorSeparatorText.replace("\\n", String.fromCharCode(13));
            }),
            vendorPrefixesListText: "-moz,-o,-ms,-webkit",
            vendorPrefixesList: ko.es5.mapping.computed(function () {
                return _this.options.vendorPrefixesListText.split(",");
            })
        };
        this.rulesList = null;
        this.subscriptions = new SubscriptionList();
        this.width = 200;
        this.close = function () {
            _this.closed = true;
            $("#settings").animate({ width: 'toggle' });
            $("#settingsCell").width($("#settingsLabel").height());
            $("#settingsLabel").fadeIn();
        };
        this.show = function () {
            _this.closed = false;
            $("#settingsLabel").fadeOut();
            $("#settings").animate({ width: 'toggle' });
            $("#settingsCell").width($("#settings").width());
        };
        this.clearCookies = function () {
            eraseAllCookies();
        };
        this.displayContents = ko.es5.mapping.computed(function () {
            return _this.closed ? "none" : "block";
        });
        this.displayLabel = ko.es5.mapping.computed(function () {
            // Label must be displayed block, not inline
            return _this.closed ? "block" : "none";
        });
        this.load = function () {
            _this.closed = getCookie("settings", "closed", _this.closed);
            _this.width = getCookie("settings", "closedwidth", _this.width);
            _this.options = getCookie("settings", "options", _this.options);
        };
        this.save = function () {
            var data = {
                closed: _this.closed,
                //width: this.width, // not resizable yet
                options: _this.options
            };
            $.cookie("settings", data, { expires: 365 });
        };
        // TODO: Clear cookies UI
        //$.removeCookie("settings");
        this.load();
        if (this.closed)
            $("#settingsLabel").show();
else
            $("#settings").show();
        this.rulesList = new UI.ListBox(this.options.rulesList);

        ko.es5.mapping.track(this);

        this.subscriptions.add(ko.getObservable(this, "width"), function (data) {
            if (_this.closed)
                // don't save the closed width
                return;

            _this.save();
        }, true, true);

        this.subscriptions.add(ko.getObservable(this, "closed"), function (data) {
            _this.save();
        }, true, true);
        this.subscriptions.add(this.options, function (data) {
            _this.save();
        }, true, true);
    }
    return Settings;
})();
//# sourceMappingURL=settings.js.map
