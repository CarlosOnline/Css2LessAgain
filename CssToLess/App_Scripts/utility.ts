/// <reference path="references.ts" />

var MAX_INT = 4294967295;

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
    remove(item: T); // for ko.es5.mapping.tracked items
    removeAll(); // for ko.es5.mapping.tracked items
    unique(): T[];
    clear();
}

Array.prototype.clear = function () {
    this.length = 0;
};

Array.prototype.unique = function () {
    var unique = [];
    for (var i = 0; i < this.length; i += 1) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i])
        }
    }
    return unique;
};

// TODO: Remove
function method<T>(func: (...args: any[]) => T) {
    return func;
}

function documentOffsetTop(elem: Element) {
    return this.offsetTop + (this.offsetParent ? this.offsetParent.documentOffsetTop() : 0);
}

function scrollToMiddle(elem: Element) {
    var top = documentOffsetTop(elem) - (window.innerHeight / 2);
    window.scrollTo(0, top);
}

function hasVerticalScrollBar(elem: Element) {
    return (elem.clientHeight < elem.scrollHeight);
}

function hasHorizontalScrollBar(elem: Element) {
    return (elem.clientWidth < elem.scrollWidth);
}

function ko_MergeArray(src: KnockoutObservableArray<any>, tgt) {
    var newItems = _.difference(tgt, src());
    newItems.forEach(function (item) {
        src.push(item);
    });

    var deletedItems = _.difference(src(), tgt);
    deletedItems.forEach(function (item) {
        src.remove(item);
    });
    return this;
}

function ko_MergeArrayES5(src: Array, tgt) {
    var newItems = _.difference(tgt, src);
    newItems.forEach(function (item) {
        src.push(item);
    });

    var deletedItems = _.difference(src, tgt);
    deletedItems.forEach(function (item) {
        src.unshift(item);
    });
    return this;
}

function getTag(target, tag) {
    tag = tag.toLowerCase();
    while (target != null) {
        if (target.tagName.toLowerCase() == tag)
            return target;
        target = target.parentElement;
    }
    return null;
}

function getElement(target: HTMLElement, tag: string, id?: string): any {
    tag = tag.toLowerCase();
    while (target != null) {
        if (target.tagName.toLowerCase() == tag)
            return target;
        target = target.parentElement;
    }

    id = id || null;
    if (id != null) {
        return document.getElementById(id);
    }
    return null;
}

function getPosition(obj: Element) {
    var curleft = 0;
    var curtop = 0;
    var elem = <HTMLElement> obj;
    var objx = <any> obj;
    if (elem.offsetLeft) curleft += elem.offsetLeft;
    if (elem.offsetTop) curtop += elem.offsetTop;
    if (obj.scrollTop && obj.scrollTop > 0) curtop -= obj.scrollTop;
    if (elem.offsetParent) {
        var pos = getPosition(elem.offsetParent);
        curleft += pos[0];
        curtop += pos[1];
    } else if (objx.ownerDocument) {
        var thewindow = <Window> objx.ownerDocument.defaultView;
        if (!thewindow && objx.ownerDocument.parentWindow)
            thewindow = objx.ownerDocument.parentWindow;
        if (thewindow) {
            if (thewindow.frameElement) {
                var pos2 = getPosition(thewindow.frameElement);
                curleft += pos2[0];
                curtop += pos2[1];
            }
        }
    }

    return [curleft, curtop];
}

function getCookie<T>(entry: string, key: string, defaultValue: T) {
    var cookie = $.cookie(entry);
    if (cookie != null) {
        if (cookie[key] != undefined)
            return <T> cookie[key];
    }
    return defaultValue;
}

function eraseAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var equals = cookies[i].indexOf("=");
        var name = equals > -1 ? cookies[i].substr(0, equals) : cookies[i];
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}