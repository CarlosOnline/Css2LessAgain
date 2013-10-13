/// <reference path="Scripts/references.ts"

interface String {
    endsWith: (searchString: string, position?: number) => number;
};

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

interface Array<T> {
    unique(): T[];
}

Array.prototype.unique = function () {
    var unique = [];
    for (var i = 0; i < this.length; i += 1) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i])
        }
    }
    return unique;
};

class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }

    stop() {
        clearTimeout(this.timerToken);
    }
}

window.onload = () => {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
    convert();
};

function convert() {
    var src = <any>document.getElementById("css");
    var converter = new css2less(src.value, {});
    var less = converter.processLess();
    document.getElementById("less").innerText = less;
    document.getElementById("resources").innerText = converter.resources;
}

var DefaultRules = [
    "font-size",
];

var BetterListModel = function () {
    this.itemToAdd = ko.observable("");
    this.allItems = ko.observableArray(DefaultRules); // Initial items
    this.selectedItems = ko.observableArray(); // Initial selection

    this.addItem = function () {
        if ((this.itemToAdd() != "") && (this.allItems.indexOf(this.itemToAdd()) < 0)) // Prevent blanks and duplicates
            this.allItems.push(this.itemToAdd());
        this.itemToAdd(""); // Clear the text box
    };

    this.removeSelected = function () {
        this.allItems.removeAll(this.selectedItems());
        this.selectedItems([]); // Clear selection
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