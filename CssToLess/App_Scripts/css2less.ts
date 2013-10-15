class ValueLists {
    private index = 0;
    keys = {};
    values = {};
    shareValues = true;

    private getUniqueKey = (key: string, value: string) => {
        var unique = key;
        while (this.keys[unique] != undefined && this.keys[unique] != value) {
            this.index++;
            unique = key + "-" + this.index;
        }
        return unique;
    }

    private add = (key: string, value: string) => {
        var uniqueKey = this.getUniqueKey(key, value);
        this.keys[uniqueKey] = value;
        this.values[value] = uniqueKey;
        return uniqueKey;
    }

    getValue = (key: string) => {
        if (key == undefined)
            return undefined;

        return this.keys[key];
    }

    getKey = (value: string): string => {
        if (value == undefined)
            return undefined;

        return this.values[value];
    }

    hash = (key: string, value: string) => {
        var hashKey = this.getKey(value);
        if (hashKey != undefined) {
            // already hashed
            if (this.shareValues)
                return hashKey;
        }

        // not in list or not unique
        return this.add(key, value);
    }
}

class css2less {
    variables = new ValueLists();
    css = ""
    less = [];
    mixins = {};
    tree = {};
    resources = "";

    options = {
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
        updateColors: true,
        vendorMixins: true,
    };

    constructor(css: string, options = {}) {
        this.css = css || "";

        for (var i in this.options) {
            if (typeof options[i] == "undefined") {
                continue;
            }

            this.options[i] = options[i];
        }
    }

    processLess = () => {
        this.cleanup();

        if (!this.css) {
            return null;
        }

        this.generateTree();
        this.renderLess();
        this.renderResources();
        return this.less.join("");
    };

    cleanup = () => {
        this.tree = {};
        this.less = [];
    };

    convertRules = (data) => {
        return data.split(/[;]/gi).select("val=>val.trim()").where("val=>val");
    };

    isColor = (value) => {
        value = value.trim();

        if (this.options.cssColors.indexOf(value) >= 0 || /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/gi.test(value) || /(rgba?)\(.*\)/gi.test(value)) {
            return true;
        }

        return false;
    };

    isKeyReplaceable = (key: string) => {
        switch (key) {
            case "font-size":
                return true;
        }
        return false;
    }

    makeVariable = (style: string, key: string, value: string) => {
        var name = "@" + this.makeVariableName(key);
        if (!name.endsWith("-" + style))
            name += "-" + style;
        return this.variables.hash(name, value);
    }

    convertIfColor = (color: string, parent: string) => {
        color = color.trim();
        if (!this.isColor(color))
            return color;

        var name = "@" + this.makeVariableName(parent);
        if (!name.endsWith("-color"))
            name += "-color";
        return this.variables.hash(name, color);
    }

    matchColor = (style: string, parent: string) => {
        var rules = this.convertRules(style);
        var result = [];

        rules.forEach((r, i) => {
            var parts = r.split(/[:]/gi);
            var key = parts[0].trim();
            var value = parts[1].trim();

            result.push(i > 0 ? "\n" : "", key);

            if (!value) {
                return;
            }

            var oldValues = value.split(/\s+/gi);
            var newValues = oldValues.select((v) => {
                return this.convertIfColor(v, parent + "-" + key);
            });

            result.push(":", newValues.join(" "), ";");
        });

        return result.join("");
    };

    matchRules = (style: string, parent: string) => {
        var rules = this.convertRules(style);
        var result = [];

        rules.forEach((r, i) => {
            var parts = r.split(/[:]/gi);
            var key = parts[0].trim();

            result.push(i > 0 ? "\n" : "", key);

            var value = parts[1];
            if (!value) {
                return;
            }
            value = value.trim();

            var oldValues = value.split(/\s+/gi);
            var newValues = oldValues.select((v) => {
                v = v.trim();
                if (this.isKeyReplaceable(key))
                    return this.makeVariable(key, parent + "-" + key, v);
                return v;
            });

            result.push(":", newValues.join(" "), ";");
        });

        return result.join("");
    };

    matchVendorPrefixMixin = (style) => {
        var normal_rules = {};
        var prefixed_rules = {};
        var rules = this.convertRules(style);

        for (var i = 0; i < rules.length; i++) {
            var e = rules[i].trim();
            var parts = e.split(/[:]/gi);
            var key = parts[0].trim();
            var value = parts[1].trim();

            if (!value) {
                normal_rules[key] = "";
            } else if (this.options.vendorPrefixesReg.test(key)) {
                var rule_key = key.replace(this.options.vendorPrefixesReg, "");
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

            if (!this.mixins[key]) {
                this.mixins[key] = value.length;
            }

            if (normal_rules[key]) {
                delete normal_rules[key];
                normal_rules[".vp-" + key + "(" + value.join(", ") + ")"] = "";
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

    addRule = (tree: any, selectors, style, parent: string) => {
        if (!style) {
            return;
        }

        if (!selectors || !selectors.length) {
            if (this.options.updateColors) {
                style = this.matchColor(style, parent)
            }

            if (this.options.vendorMixins) {
                style = this.matchVendorPrefixMixin(style);
            }

            style = this.matchRules(style, parent);

            if (!tree.style) {
                tree.style = style;
            } else {
                tree.style += style;
            }
        } else {
            var first = selectors[0].split(/\s*[,]\s*/gi).select("val=>val.trim()").where("val=>val").join(this.options.selectorSeparator);

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
            this.addRule(node, selectors, style, parent);
        }
    };

    generateTree = () => {
        var csss = this.css.split(/\n/gi);
        var temp = (<any>csss).select("val=>val.trim()").where("val=>val");

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
                this.addRule(this.tree, [], import_rule, "unknown#1");
            }

            if (rules.indexOf(",") >= 0) {
                this.addRule(this.tree, [rules], style[1], style[0].trim());
            } else {
                var rules_split = rules.replace(/[:]/gi, " :").split(/\s+/gi).select("val=>val.trim()").where("val=>val").select((it, i) => {
                    return it.replace(/[&][>]/gi, "& > ");
                });

                // create a name - slapping on the child types:
                // .foo a => foo-a
                this.addRule(this.tree, rules_split, style[1], this.makeVariableName(style[0]));
            }
        }
    };

    makeVariableName(selector: string) {
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
        name = name.replace(/[ ]/g, ",");
        name = name.replace(/[,][,]+/g, ",");

        var parts = <Array<String>> name.split(",");
        var unique = parts.unique().join("-");
        if (unique != name)
            name = unique + "-combined";
        else
            name = unique;
        name += final;
        name = name.replace(/[-][-]+/g, "-");
        name = name.replace(/[ ]/g, "-");
        return name;
    }

    buildMixinList = (indent) => {
        var less = [];

        for (var key in this.mixins) {
            var value = this.mixins[key];
            var args = [];

            for (var i = 0; i < value; i++) {
                args.push("@p" + i);
            }

            less.push(".vp-", key, "(", args.join(", "), ")");

            if (this.options.blockFromNewLine) {
                less.push("\n");
            } else {
                less.push(" ");
            }

            less.push("{\n");

            this.options.vendorPrefixesList.forEach((vp, i) => {
                less.push(this.getIndent(indent + this.options.indentSize));
                less.push(vp, "-", key, ":", args.join(" "), ";\n");
            });

            less.push(this.getIndent(indent + this.options.indentSize), key, ":", args.join(" "), ";\n");
            less.push(this.getIndent(indent), "}\n");
        }

        if ((<any>less).any()) {
            less.push("\n");
        }

        return less.join("");
    };

    renderResources = (tree?: {}, indent?: number) => {
        var resources = []
        indent = indent || 0;

        if (!tree) {
            for (var key in this.variables.keys) {
                var value = this.variables.getValue(key);
                resources.push(key, ": ", value, ";\n");
            }

            resources.push("\n");

            if (this.options.vendorMixins) {
                resources.push(this.buildMixinList(indent));
            }
        }
        this.resources = resources.join("").trim();
    };

    renderLess = (tree?: {}, indent?: number) => {
        indent = indent || 0;

        if (!tree) {
            for (var key in this.variables.keys) {
                var value = this.variables.getValue(key);
                this.less.push(key, ": ", value, ";\n");
            }

            this.less.push("\n");

            if (this.options.vendorMixins) {
                this.less.push(this.buildMixinList(indent));
            }

            tree = this.tree;
        }

        var index = 0;

        for (var i in tree) {
            if (i == "children") {
                continue;
            }

            var element = tree[i];
            var children = element.children;

            if (i == "style") {
                this.less.push(this.convertRules(element).join(";\n"), "\n");
            } else {
                if (index > 0) {
                    this.less.push(this.options.blockSeparator);
                }

                this.less.push(this.getIndent(indent), i);

                if (this.options.blockFromNewLine) {
                    this.less.push("\n", this.getIndent(indent));
                } else {
                    this.less.push(" ");
                }

                this.less.push("{\n");

                var style = element.style;
                delete element.style;

                if (style) {
                    var temp = this.convertRules(style);

                    temp = temp.select((it, i) => {
                        return this.getIndent(indent + this.options.indentSize) + it + ";";
                    });

                    this.less.push(temp.join("\n"), "\n");

                    if (children && children.length) {
                        this.less.push(this.options.blockSeparator);
                    }
                }

                this.renderLess(element, indent + this.options.indentSize);
                this.less.push(this.getIndent(indent), "}\n");
                index++;
            }
        }
    };

    getIndent = (size) => {
        typeof size == "undefined" ? this.options.indentSize : size;
        return (new Array(size)).join(this.options.indentSymbol);
    };
}