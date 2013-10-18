var ValueLists = (function () {
    function ValueLists() {
        var _this = this;
        this.index = 0;
        this.keys = {};
        this.values = {};
        this.shareValues = true;
        this.getUniqueKey = function (key, value) {
            var unique = key;
            while (_this.keys[unique] != undefined && _this.keys[unique] != value) {
                _this.index++;
                unique = key + "-" + _this.index;
            }
            return unique;
        };
        this.add = function (key, value) {
            var uniqueKey = _this.getUniqueKey(key, value);
            _this.keys[uniqueKey] = value;
            _this.values[value] = uniqueKey;
            return uniqueKey;
        };
        this.getValue = function (key) {
            if (key == undefined)
                return undefined;

            return _this.keys[key];
        };
        this.getKey = function (value) {
            if (value == undefined)
                return undefined;

            return _this.values[value];
        };
        this.hash = function (key, value) {
            var hashKey = _this.getKey(value);
            if (hashKey != undefined) {
                if (_this.shareValues)
                    return hashKey;
            }

            // not in list or not unique
            return _this.add(key, value);
        };
    }
    return ValueLists;
})();

var css2less = (function () {
    function css2less(css, options) {
        if (typeof options === "undefined") { options = {}; }
        var _this = this;
        this.variables = new ValueLists();
        this.css = "";
        this.less = [];
        this.mixins = {};
        this.tree = {};
        this.resources = "";
        this.options = {
            combineVariables: false,
            cssColors: ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgrey", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgrey", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"],
            rulesList: [],
            vendorPrefixesList: ["-moz", "-o", "-ms", "-webkit"],
            vendorPrefixesReg: /^(-moz|-o|-ms|-webkit)-/gi,
            indentSymbol: " ",
            indentSize: 4,
            selectorSeparator: ",\n",
            blockFromNewLine: true,
            blockSeparator: "\n",
            matchUrl: true,
            updateColors: true,
            vendorMixins: true
        };
        this.processLess = function () {
            _this.cleanup();

            if (!_this.css) {
                return null;
            }

            _this.generateTree();
            _this.renderLess();
            _this.renderResources();
            return _this.less.join("");
        };
        this.cleanup = function () {
            _this.tree = {};
            _this.less = [];
        };
        this.convertRules = function (data) {
            return data.split(/[;]/gi).select("val=>val.trim()").where("val=>val");
        };
        this.isColor = function (value) {
            value = value.trim();

            if (_this.options.cssColors.indexOf(value) >= 0 || /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/gi.test(value) || /(rgba?)\(.*\)/gi.test(value)) {
                return true;
            }

            return false;
        };
        this.isUrl = function (value) {
            value = value.trim();

            if (/^url\((.+)\)$/gi.test(value)) {
                return true;
            }

            return false;
        };
        this.isKeyReplaceable = function (key) {
            return _this.options.rulesList.indexOf(key) != -1 ? true : false;
        };
        this.makeVariable = function (style, key, value) {
            var name = "@" + _this.makeVariableName(key);
            if (!name.endsWith("-" + style))
                name += "-" + style;
            return _this.variables.hash(name, value);
        };
        this.convertIfColor = function (color, parent) {
            color = color.trim();
            if (!_this.isColor(color))
                return color;

            var name = "@" + _this.makeVariableName(parent);
            if (!name.endsWith("-color"))
                name += "-color";
            return _this.variables.hash(name, color);
        };
        this.matchColor = function (style, parent) {
            var rules = _this.convertRules(style);
            var result = [];

            rules.forEach(function (r, i) {
                var parts = r.split(/[:]/gi);
                var key = parts[0].trim();
                var value = parts[1].trim();

                result.push(i > 0 ? "\n" : "", key);

                if (!value) {
                    return;
                }

                var oldValues = value.split(/\s+/gi);
                var newValues = oldValues.select(function (v) {
                    return _this.convertIfColor(v, parent + "-" + key);
                });

                result.push(":", newValues.join(" "), ";");
            });

            return result.join("");
        };
        this.matchRules = function (style, parent) {
            var rules = _this.convertRules(style);
            var result = [];

            rules.forEach(function (r, i) {
                var parts = r.split(/[:]/gi);
                var key = parts[0].trim();

                result.push(i > 0 ? ";\n" : "", key);

                var value = parts[1];
                if (!value) {
                    return;
                }
                value = value.trim();

                var oldValues = value.split(/\s+/gi);
                var newValues = oldValues.select(function (v) {
                    v = v.trim();
                    if (_this.isKeyReplaceable(key))
                        return _this.makeVariable(key, parent + "-" + key, v);
                    return v;
                });

                result.push(":", newValues.join(" "), ";");
            });

            return result.join("");
        };
        this.convertIfUrl = function (value, parent) {
            value = value.trim();
            if (!_this.isUrl(value))
                return value;

            var url = '"' + value.replace("url(", "").replace(")", "").replace('"', "").replace("'", "") + '"';
            var name = "@" + _this.makeVariableName(parent) + "-url";
            return "url(" + _this.variables.hash(name, url) + ")";
        };
        this.matchUrl = function (style, parent) {
            var rules = _this.convertRules(style);
            var result = [];

            rules.forEach(function (r, i) {
                var parts = r.split(/[:]/gi);
                var key = parts[0].trim();
                var value = parts[1].trim();

                result.push(i > 0 ? "\n" : "", key);

                if (!value) {
                    return;
                }

                var oldValues = value.split(/\s+/gi);
                var newValues = oldValues.select(function (v) {
                    return _this.convertIfUrl(v, parent + "-" + key);
                });

                result.push(":", newValues.join(" "), ";");
            });

            return result.join("");
        };
        this.matchVendorPrefixMixin = function (style) {
            var normal_rules = {};
            var prefixed_rules = {};
            var rules = _this.convertRules(style);

            for (var i = 0; i < rules.length; i++) {
                var e = rules[i].trim();
                var parts = e.split(/[:]/gi);
                var key = parts[0].trim();
                var value = parts[1].trim();

                if (!value) {
                    normal_rules[key] = "";
                } else if (_this.options.vendorPrefixesReg.test(key)) {
                    console.log("vp", key);
                    var rule_key = key.replace(_this.options.vendorPrefixesReg, "");
                    var values = value.split(/\s+/gi);
                    var newValues = [];

                    for (var j = 0; j < values.length; j++) {
                        newValues.push(values[j].trim());
                    }

                    var newValue = newValues.join(" ");

                    if (prefixed_rules[rule_key] && prefixed_rules[rule_key] != newValue) {
                        return style;
                    }

                    prefixed_rules[rule_key] = newValue;
                } else {
                    normal_rules[key] = value;
                }
            }

            for (var key in prefixed_rules) {
                var value = prefixed_rules[key];

                value = value.split(/\s+/gi).select("val=>val.trim()").where("val=>val");

                if (!_this.mixins[key]) {
                    _this.mixins[key] = value.length;
                }

                if (normal_rules[key]) {
                    delete normal_rules[key];
                    normal_rules[".mixin-" + key + "(" + value.join(", ") + ");"] = "";
                }
            }

            var result = [];

            for (var key in normal_rules) {
                var value = normal_rules[key];
                var r = [key];

                if (value) {
                    r.push(":", value, ";\n");
                }

                result.push(r.join(""));
            }

            return result.join("");
        };
        this.addRule = function (tree, selectors, style, parent) {
            if (!style) {
                return;
            }

            if (!selectors || !selectors.length) {
                if (_this.options.updateColors) {
                    style = _this.matchColor(style, parent);
                }

                if (_this.options.matchUrl) {
                    style = _this.matchUrl(style, parent);
                }

                if (_this.options.vendorMixins) {
                    style = _this.matchVendorPrefixMixin(style);
                }

                style = _this.matchRules(style, parent);

                if (!tree.style) {
                    tree.style = style;
                } else {
                    tree.style += style;
                }
            } else {
                var first = selectors[0].split(/\s*[,]\s*/gi).select("val=>val.trim()").where("val=>val").join(_this.options.selectorSeparator);

                if (!tree.children) {
                    tree.children = [];
                }

                if (!tree[first]) {
                    tree[first] = {};
                }

                var node = tree[first];

                var selectorParent = selectors[0];
                selectors.splice(0, 1);
                tree.children.push(node);
                _this.addRule(node, selectors, style, parent);
            }
        };
        this.generateTree = function () {
            var csss = _this.css.split(/\n/gi);
            var temp = (csss).select("val=>val.trim()").where("val=>val");

            temp = temp.join("");
            temp = temp.replace(/[/][*]+.*?[*]+[/]/gi, "");
            temp = temp.replace(/[^{}]+[{]\s*[}]/ig, " ");
            temp = temp.split(/[{}]/gi).where("val=>val");

            var styles = [];

            for (var i = 0; i < temp.length; i++) {
                if (i % 2 == 0) {
                    styles.push([temp[i]]);
                } else {
                    styles[styles.length - 1].push(temp[i]);
                }
            }

            for (var i = 0; i < styles.length; i++) {
                var style = styles[i];
                var rules = style[0];

                if (rules.indexOf(">") >= 0) {
                    rules = rules.replace(/\s*>\s*/gi, " &>");
                }

                if (rules.indexOf("@import") >= 0) {
                    var import_rule = rules.match(/@import.*;/gi)[0];
                    rules = rules.replace(/@import.*;/gi, "");
                    _this.addRule(_this.tree, [], import_rule, "unknown#1");
                }

                if (rules.indexOf(",") >= 0) {
                    _this.addRule(_this.tree, [rules], style[1], style[0].trim());
                } else {
                    var rules_split = rules.replace(/[:]/gi, " :").split(/\s+/gi).select("val=>val.trim()").where("val=>val").select(function (it, i) {
                        return it.replace(/[&][>]/gi, "& > ");
                    });

                    // create a name - slapping on the child types:
                    // .foo a => foo-a
                    _this.addRule(_this.tree, rules_split, style[1], _this.makeVariableName(style[0]));
                }
            }
        };
        this.buildMixinList = function (indent) {
            var less = [];

            for (var key in _this.mixins) {
                var value = _this.mixins[key];
                var args = [];

                for (var i = 0; i < value; i++) {
                    args.push("@p" + i);
                }

                less.push(".mixin-", key, "(", args.join(", "), ")");

                if (_this.options.blockFromNewLine) {
                    less.push("\n");
                } else {
                    less.push(" ");
                }

                less.push("{\n");

                _this.options.vendorPrefixesList.forEach(function (vp, i) {
                    less.push(_this.getIndent(indent + _this.options.indentSize));
                    less.push(vp, "-", key, ":", args.join(" "), ";\n");
                });

                var cssName = _this.convertVendorToCssMixin(key);
                less.push(_this.getIndent(indent + _this.options.indentSize), cssName, ":", args.join(" "), ";\n");
                less.push(_this.getIndent(indent), "}\n");
            }

            if ((less).any()) {
                less.push("\n");
            }

            return less.join("");
        };
        /*
        Turn following border-radius-topleft into border-top-left-radius
        border-radius-topleft
        border-radius-top-left
        border-top-left-radius
        */
        this.convertVendorToCssMixin = function (key) {
            var name = key.replace("top", "top-").replace("bottom", "bottom-").replace("left", "left-").replace("right", "right-");
            var parts = name.split("-");
            if (parts.length == 5 && parts[4] == "")
                return parts[0] + "-" + parts[2] + "-" + parts[3] + "-" + parts[1];
            return key;
        };
        this.renderResources = function (tree, indent) {
            var resources = [];
            indent = indent || 0;

            if (!tree) {
                for (var key in _this.variables.keys) {
                    var value = _this.variables.getValue(key);
                    resources.push(key, ": ", value, ";\n");
                }

                resources.push("\n");

                if (_this.options.vendorMixins) {
                    resources.push(_this.buildMixinList(indent));
                }
            }
            _this.resources = resources.join("").trim();
        };
        this.renderLess = function (tree, indent) {
            indent = indent || 0;

            if (!tree) {
                for (var key in _this.variables.keys) {
                    var value = _this.variables.getValue(key);
                    _this.less.push(key, ": ", value, ";\n");
                }

                _this.less.push("\n");

                if (_this.options.vendorMixins) {
                    _this.less.push(_this.buildMixinList(indent));
                }

                tree = _this.tree;
            }

            var index = 0;

            for (var i in tree) {
                if (i == "children") {
                    continue;
                }

                var element = tree[i];
                var children = element.children;

                if (i == "style") {
                    _this.less.push(_this.convertRules(element).join(";\n"), "\n");
                } else {
                    if (index > 0) {
                        _this.less.push(_this.options.blockSeparator);
                    }

                    _this.less.push(_this.getIndent(indent), i);

                    if (_this.options.blockFromNewLine) {
                        _this.less.push("\n", _this.getIndent(indent));
                    } else {
                        _this.less.push(" ");
                    }

                    _this.less.push("{\n");

                    var style = element.style;
                    delete element.style;

                    if (style) {
                        var temp = _this.convertRules(style);

                        temp = temp.select(function (it, i) {
                            return _this.getIndent(indent + _this.options.indentSize) + it + ";";
                        });

                        _this.less.push(temp.join("\n"), "\n");

                        if (children && children.length) {
                            _this.less.push(_this.options.blockSeparator);
                        }
                    }

                    _this.renderLess(element, indent + _this.options.indentSize);
                    _this.less.push(_this.getIndent(indent), "}\n");
                    index++;
                }
            }
        };
        this.getIndent = function (size) {
            typeof size == "undefined" ? _this.options.indentSize : size;
            return (new Array(size)).join(_this.options.indentSymbol);
        };
        this.css = css || "";

        for (var i in this.options) {
            if (typeof options[i] == "undefined") {
                continue;
            }

            this.options[i] = options[i];
        }
    }
    css2less.prototype.makeVariableName = function (selector) {
        var name = selector.trim();
        var final = "";
        var last = selector.lastIndexOf("-");
        if (last != -1) {
            name = selector.substring(0, last);
            final = selector.substring(last);
        }
        name = name.replace(/[\[\]:><=]/g, "-");
        name = name.replace(/[*]/g, "__asterisks__");
        name = name.replace(/[^a-zA-Z0-9 \-\,]/g, "");
        name = name.replace(/[-][-]+/g, "-");
        name = name.replace(/[ ][ ]+/g, " ");
        name = name.replace(/[ ,]/g, "-");
        name = name.replace(/[-][-]+/g, "-");

        var parts = name.split("-");
        var unique = parts.unique().join("-");
        if (unique != name)
            name = unique + "-combined";
else
            name = unique;
        name += final;
        name = name.replace(/[-][-]+/g, "-");
        name = name.replace(/[ ]/g, "-");
        return name;
    };
    return css2less;
})();
//# sourceMappingURL=css2less.js.map
