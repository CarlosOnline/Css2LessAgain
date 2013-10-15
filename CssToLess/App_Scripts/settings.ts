class Settings {
    closed = true;
    options = {
        blockFromNewLine: true,
        blockSeparatorText: "\\n",
        blockSeparator: ko.es5.mapping.computed(() => {
            return this.options.blockSeparatorText.replace("\\n", String.fromCharCode(13));
        }),
        combineVariables: false,
        indentSize: 4,
        indentSymbol: " ",
        rulesList: [
            "font-size",
            "background-color",
        ],
        selectorSeparatorText: ",\\n",
        selectorSeparator: ko.es5.mapping.computed(() => {
            return this.options.selectorSeparatorText.replace("\\n", String.fromCharCode(13));
        }),
        vendorPrefixesListText: "-moz,-o,-ms,-webkit",
        vendorPrefixesList: ko.es5.mapping.computed(() => {
            return this.options.vendorPrefixesListText.split(",");
        })
    };
    rulesList: UI.ListBox = null;
    subscriptions = new SubscriptionList();
    width = 200;

    close = () => {
        this.closed = true;
        $("#settings").animate({ width: 'toggle' });
        $("#settingsCell").width($("#settingsLabel").height());
        $("#settingsLabel").fadeIn();
    };

    show = () => {
        this.closed = false;
        $("#settingsLabel").fadeOut();
        $("#settings").animate({ width: 'toggle' });
        $("#settingsCell").width($("#settings").width());
    }

    clearCookies = () => {
        eraseAllCookies();
    };

    displayContents = ko.es5.mapping.computed<string>(() => {
        return this.closed ? "none" : "block";
    });

    displayLabel = ko.es5.mapping.computed<string>(() => {
        // Label must be displayed block, not inline
        return this.closed ? "block" : "none";
    });

    load = () => {
        this.closed = getCookie("settings", "closed", this.closed);
        this.width = getCookie("settings", "closedwidth", this.width);
        this.options = getCookie("settings", "options", this.options);
    }

    save = () => {
        var data = {
            closed: this.closed,
            //width: this.width, // not resizable yet
            options: this.options,
        };
        $.cookie("settings", data, { expires: 365 });
    }

    constructor() {
        // TODO: Clear cookies UI
        //$.removeCookie("settings");
        this.load();
        if (this.closed)
            $("#settingsLabel").show();
        else
            $("#settings").show();
        this.rulesList = new UI.ListBox(this.options.rulesList);

        ko.es5.mapping.track(this);

        this.subscriptions.add(ko.getObservable(this, "width"), (data) => {
            if (this.closed)
                // don't save the closed width
                return;

            this.save();
        }, true, true);

        this.subscriptions.add(ko.getObservable(this, "closed"), (data) => {
            this.save();
        }, true, true);
        this.subscriptions.add(this.options, (data) => {
            this.save();
        }, true, true);
    }
}
