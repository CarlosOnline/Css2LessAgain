/// <reference path="Scripts/references.ts"
;

if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || this.length;
            position = position - searchString.length;
            var lastIndex = this.lastIndexOf(searchString);
            return lastIndex !== -1 && lastIndex === position;
        }
    });
}

Array.prototype.unique = function () {
    var unique = [];
    for (var i = 0; i < this.length; i += 1) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i]);
        }
    }
    return unique;
};

var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    Greeter.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () {
            return _this.span.innerHTML = new Date().toUTCString();
        }, 500);
    };

    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
})();

window.onload = function () {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
    convert();
};

function convert() {
    var src = document.getElementById("css");
    var converter = new css2less(src.value, {});
    var less = converter.processLess();
    document.getElementById("less").innerText = less;
    document.getElementById("resources").innerText = converter.resources;
}

var DefaultRules = [
    "font-size"
];

var BetterListModel = function () {
    this.itemToAdd = ko.observable("");
    this.allItems = ko.observableArray(DefaultRules);
    this.selectedItems = ko.observableArray();

    this.addItem = function () {
        if ((this.itemToAdd() != "") && (this.allItems.indexOf(this.itemToAdd()) < 0))
            this.allItems.push(this.itemToAdd());
        this.itemToAdd("");
    };

    this.removeSelected = function () {
        this.allItems.removeAll(this.selectedItems());
        this.selectedItems([]);
    };

    this.sortItems = function () {
        this.allItems.sort();
    };
};

var cssRules = null;
$(function setuplist() {
    cssRules = new BetterListModel();
    ko.applyBindings(cssRules);
});
//# sourceMappingURL=app.js.map
