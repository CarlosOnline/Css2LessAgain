/// <reference path="references.ts" />
var UI;
(function (UI) {
    (function (Effects) {
        function flash(elem) {
            var jq = $(elem);

            jq.toggleClass("highlight", true, 1000, "swing", function () {
                jq.toggleClass("highlight", false, 1000);
            });
        }
        Effects.flash = flash;
    })(UI.Effects || (UI.Effects = {}));
    var Effects = UI.Effects;

    var ListBox = (function () {
        function ListBox(values) {
            var _this = this;
            this.values = [];
            this.selected = null;
            this.add = {
                value: "",
                click: function () {
                    if ((_this.add.value != "") && (_this.values.indexOf(_this.add.value) < 0))
                        _this.values.push(_this.add.value);
                    _this.add.value = "";
                },
                enabled: ko.es5.mapping.computed(function () {
                    return _this.add.value.length > 0 && _this.values.indexOf(_this.add.value) == -1 ? true : false;
                })
            };
            this.remove = {
                click: function () {
                    ko.utils.arrayForEach(_this.selected(), function (value) {
                        var idx = _this.values.indexOf(value);
                        if (idx > -1)
                            _this.values.splice(idx, 1);
                    });
                    _this.selected.removeAll();
                },
                enabled: ko.es5.mapping.computed(function () {
                    return _this.selected().length > 0 ? true : false;
                })
            };
            this.sort = {
                click: function () {
                    _this.values.sort();
                },
                enabled: ko.es5.mapping.computed(function () {
                    return _this.values.length > 0 ? true : false;
                })
            };
            this.values = values;

            // selected doesn't work with es5 for some reason
            this.selected = ko.observableArray([]);
            ko.es5.mapping.track(this);
        }
        return ListBox;
    })();
    UI.ListBox = ListBox;

    (function (QTip) {
        function add(target, tipContents, status, callback) {
            callback = callback || function () {
            };
            status = status || "";

            target = $(target);
            var container = getTag(getTag(target[0], "table"), "div");
            tipContents = $(tipContents);
            target.qtip({
                prerender: true,
                content: tipContents,
                position: {
                    my: "top left",
                    at: "bottom center",
                    of: target,
                    corner: {
                        target: 'middleRight',
                        tooltip: 'topLeft',
                        hide: true
                    },
                    adjust: {
                        y: -($(target).height()),
                        screen: true,
                        method: "shift none"
                    },
                    container: $(container),
                    viewport: $(container)
                },
                show: {
                    ready: 'false',
                    event: false
                },
                hide: {
                    event: false,
                    fixed: false
                },
                events: {
                    render: function (event, api) {
                        callback(event, api);
                    }
                },
                style: {
                    classes: ""
                }
            });

            // target.qtip('option', 'hide.event', false);
            //target.qtip('option', 'hide.fixed', true);
            return target.qtip();
        }
        QTip.add = add;

        function showAll(state) {
            state = state != undefined ? state : true;
            var show = state ? 'show' : 'hide';
            $('.qtip').each(function () {
                $(this).qtip(show);
            });
        }
        QTip.showAll = showAll;
    })(UI.QTip || (UI.QTip = {}));
    var QTip = UI.QTip;

    (function (Tabs) {
        function load() {
            $("#tabs").tabs({
                select: function (event, ui) {
                    //g_ViewModel.onTabSelect(ui.index);
                },
                selected: 0
            });
        }
        Tabs.load = load;

        function visible() {
            return $("#tabs").is(":visible");
        }
        Tabs.visible = visible;

        function show(done) {
            $("#tabs").fadeIn("fast", done);
            return;
            $("#tabs").show();
            if (done != undefined)
                done();
            return;
        }
        Tabs.show = show;

        function hide(done) {
            // Timing issues with show.  fadeOut without callback can interfere with fadeIn with callback.
            // Until I use a callback, continue to use hide
            $("#tabs").fadeOut("fast", done);
        }
        Tabs.hide = hide;

        function select(index) {
            $("#tabs").tabs("select", index);
        }
        Tabs.select = select;
    })(UI.Tabs || (UI.Tabs = {}));
    var Tabs = UI.Tabs;

    var Select = (function () {
        function Select(value, list, display, callback) {
            if (typeof list === "undefined") { list = []; }
            var _this = this;
            this.display = display;
            this.callback = callback;
            this.value = "";
            this.list = [];
            this.idx = ko.es5.mapping.property(function () {
                return _this.list.indexOf(_this.value);
            }, function (idx) {
                _this.value = _this.list[idx];
            });
            this.dispose = method(function () {
                if (_this.subscription != null) {
                    _this.subscription.dispose();
                }
            });
            this.subscribe = method(function () {
                _this.dispose();
                if (_this.callback == null) {
                    return;
                }

                if (_this.subscription == null)
                    _this.subscription = new Subscription(ko.getObservable(_this, "value"), _this.callback, false);

                _this.subscription.subscribe();
            });
            this.value = value;
            this.list = list;
            this.display = this.display || function () {
                return true;
            };
            this.callback = this.callback || null;

            ko.es5.mapping.track(this);
        }
        return Select;
    })();
    UI.Select = Select;
})(UI || (UI = {}));
//# sourceMappingURL=ui.js.map
