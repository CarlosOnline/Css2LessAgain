/// <reference path="references.ts" />

interface JQuery {
    qtip: any;
}

module UI {
    export module Effects {
        export function flash(elem) {
            var jq = $(elem);

            jq.toggleClass("highlight", true, 1000, "swing", function () {
                jq.toggleClass("highlight", false, 1000);
            });
        }
    }

    export class ListBox {
        values: Array<string> = [];
        selected: KnockoutObservableArray<string> = null;

        add = {
            value: "",
            click: () => {
                if ((this.add.value != "") && (this.values.indexOf(this.add.value) < 0)) // Prevent blanks and duplicates
                    this.values.push(this.add.value);
                this.add.value = ""; // Clear the text box};
            },
            enabled: ko.es5.mapping.computed(() => {
                return this.add.value.length > 0 && this.values.indexOf(this.add.value) == -1 ? true : false;
            }),
        };

        remove = {
            click: () => {
                ko.utils.arrayForEach(this.selected(), (value) => {
                    var idx = this.values.indexOf(value);
                    if (idx > -1)
                        this.values.splice(idx, 1);
                });
                this.selected.removeAll();
            },
            enabled: ko.es5.mapping.computed(() => {
                return this.selected().length > 0 ? true : false;
            }),
        }

        sort = {
            click: () => {
                this.values.sort();
            },
            enabled: ko.es5.mapping.computed(() => {
                return this.values.length > 0 ? true : false;
            }),
        };

        constructor(values: Array<string>) {
            this.values = values;
            // selected doesn't work with es5 for some reason
            this.selected = ko.observableArray<string>([]);
            ko.es5.mapping.track(this);
        }
    } // ListBox

    export module QTip {
        export function add(target: any, tipContents: any, status?: string, callback?: Function) {
            callback = callback || function () { };
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
                        y: - ($(target).height()),
                        screen: true,
                        method: "shift none",
                    },
                    container: $(container),
                    viewport: $(container),
                },
                show: {
                    ready: 'false',
                    event: false, // disable show on mouseEnter
                },
                hide: {
                    event: false, // disable hide on mouseLeave
                    fixed: false,
                },
                events: {
                    render: function (event, api) {
                        callback(event, api);
                    }
                },
                style: {
                    classes: "",
                },
            });
            // target.qtip('option', 'hide.event', false);
            //target.qtip('option', 'hide.fixed', true);
            return target.qtip();
        }

        export function showAll(state: boolean) {
            state = state != undefined ? state : true;
            var show = state ? 'show' : 'hide';
            $('.qtip').each(function () {
                $(this).qtip(show);
            });
        }
    } // QTip

    export module Tabs {
        export function load() {
            $("#tabs").tabs({
                select: function (event, ui) {
                    //g_ViewModel.onTabSelect(ui.index);
                },
                selected: 0, //g_ViewModel.tabIndex,
            });
        }

        export function visible() {
            return $("#tabs").is(":visible");
        }

        export function show(done?: () => any) {
            $("#tabs").fadeIn("fast", done); return;
            $("#tabs").show();
            if (done != undefined)
                done();
            return;
        }

        export function hide(done?: () => any) {
            // Timing issues with show.  fadeOut without callback can interfere with fadeIn with callback.
            // Until I use a callback, continue to use hide
            $("#tabs").fadeOut("fast", done);
        }

        export function select(index) {
            $("#tabs").tabs("select", index);
        }
    } // Tabs

    export class Select {
        public value = "";
        public list = [];
        public subscription: Subscription;

        public idx = ko.es5.mapping.property(() => { return this.list.indexOf(this.value); },
            (idx: number) => { this.value = this.list[idx]; }
            );

        dispose = method(() => {
            if (this.subscription != null) {
                this.subscription.dispose();
            }
        });

        subscribe = method(() => {
            this.dispose();
            if (this.callback == null) {
                return;
            }

            if (this.subscription == null)
                this.subscription = new Subscription(ko.getObservable(this, "value"), this.callback, false);

            this.subscription.subscribe();
        });

        constructor(value: string, list = [], public display?: Function, public callback?: (newValue) => void) {
            this.value = value;
            this.list = list;
            this.display = this.display || () => { return true };
            this.callback = this.callback || null;

            ko.es5.mapping.track(this);
        }
    } // UI.select
} // UI
