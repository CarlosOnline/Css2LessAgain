/// <reference path="references.ts" />

class ViewModel {
    css = "";
    less = "";
    settings = new Settings();
    subscriptions = new SubscriptionList();
    variables = "";

    convert = () => {
        console.log("converting");
        this.less = "";
        this.variables = "";
        if (this.css.length == 0)
            return;

        var xform = new css2less(this.css, this.settings.options);
        this.less = xform.processLess();
        this.variables = xform.resources;
    };

    go = {
        click: () => {
            this.convert();
        },
        enabled: ko.es5.mapping.computed(() => {
            return this.less.length > 0 ? true : false;
        }),
    };

    load = () => {
        this.css = getCookie("view", "css", this.css);
    };

    save = () => {
        var data = {
            css: this.css,
            //width: this.width, // not resizable yet
        };
        $.cookie("view", data, { expires: 365 });
    }

    constructor() {
        this.load();
        this.convert();
        ko.es5.mapping.track(this);
        this.subscriptions.add(this.settings.options, (newValue) => {
            this.convert();
        });
        //this.subscriptions.add(ko.getObservable(this.settings.rulesList, "values"), (newValue) => {
        //    this.convert();
        //});
        this.subscriptions.add(ko.getObservable(this, "css"), (newValue) => {
            this.convert();
            this.save();
        }, true, true);
    }
}
