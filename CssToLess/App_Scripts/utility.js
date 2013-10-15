/// <reference path="references.ts" />
var MAX_INT = 4294967295;

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

Array.prototype.clear = function () {
    this.length = 0;
};

Array.prototype.unique = function () {
    var unique = [];
    for (var i = 0; i < this.length; i += 1) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i]);
        }
    }
    return unique;
};

ko.bindingHandlers.numericValue = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var underlyingObservable = valueAccessor();
        var interceptor = ko.computed({
            read: underlyingObservable,
            write: function (value) {
                if (!isNaN(value)) {
                    underlyingObservable(parseFloat(value));
                }
            }
        });
        ko.bindingHandlers.value.init(element, function () {
            return interceptor;
        }, allBindingsAccessor, viewModel, bindingContext);
    },
    update: ko.bindingHandlers.value.update
};

// TODO: Remove
function method(func) {
    return func;
}

function documentOffsetTop(elem) {
    return this.offsetTop + (this.offsetParent ? this.offsetParent.documentOffsetTop() : 0);
}

function scrollToMiddle(elem) {
    var top = documentOffsetTop(elem) - (window.innerHeight / 2);
    window.scrollTo(0, top);
}

function hasVerticalScrollBar(elem) {
    return (elem.clientHeight < elem.scrollHeight);
}

function hasHorizontalScrollBar(elem) {
    return (elem.clientWidth < elem.scrollWidth);
}

function ko_MergeArray(src, tgt) {
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

function ko_MergeArrayES5(src, tgt) {
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

function getElement(target, tag, id) {
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

function getPosition(obj) {
    var curleft = 0;
    var curtop = 0;
    var elem = obj;
    var objx = obj;
    if (elem.offsetLeft)
        curleft += elem.offsetLeft;
    if (elem.offsetTop)
        curtop += elem.offsetTop;
    if (obj.scrollTop && obj.scrollTop > 0)
        curtop -= obj.scrollTop;
    if (elem.offsetParent) {
        var pos = getPosition(elem.offsetParent);
        curleft += pos[0];
        curtop += pos[1];
    } else if (objx.ownerDocument) {
        var thewindow = objx.ownerDocument.defaultView;
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

function getCookie(entry, key, defaultValue) {
    var cookie = $.cookie(entry);
    if (cookie != null) {
        if (cookie[key] != undefined)
            return cookie[key];
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
//# sourceMappingURL=utility.js.map
