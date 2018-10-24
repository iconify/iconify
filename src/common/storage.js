/**
 * This file is part of the @iconify/iconify package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt
 * file that was distributed with this source code.
 * @license MIT
 */

"use strict";

var getPrefix = require('./prefix');

/**
 * Default values for attributes
 *
 * @type {object}
 */
var itemDefaults = {
    left: 0,
    top: 0,
    width: 16,
    height: 16,
    rotate: 0,
    vFlip: false,
    hFlip: false
};

/**
 * List of attributes to check
 *
 * @type {[string]}
 */
var itemAttributes = [
    // Dimensions
    'left', 'top', 'width', 'height',
    // Content
    'body',
    // Transformations
    'rotate', 'vFlip', 'hFlip',
    // Inline mode data
    'inlineTop', 'inlineHeight', 'verticalAlign'
];

/**
 * Convert value to appropriate type
 *
 * @param {string} attr Attribute name
 * @param {*} value Value
 * @return {*}
 */
function normalizeValue(attr, value) {
    switch (attr) {
        case 'rotate':
            value = parseInt(value);
            if (isNaN(value)) {
                return null;
            }
            return value;

        case 'width':
        case 'height':
        case 'inlineHeight':
        case 'inlineTop':
        case 'verticalAlign':
            value = parseFloat(value);
            return isNaN(value) ? null : value;

        case 'vFlip':
        case 'hFlip':
            return !!value;

        case 'body':
        case 'parent':
            return typeof value === 'string' ? value : null;
    }
    return value;
}

/**
 * Merge and normalize rotate values
 *
 * @param value1
 * @param value2
 * @return {*}
 */
function mergeRotation(value1, value2) {
    return normalizeValue('rotate', value1 + value2);
}

/**
 * Merge and normalize flip values
 *
 * @param value1
 * @param value2
 * @return {boolean}
 */
function mergeFlip(value1, value2) {
    return (!!value1) !== (!!value2);
}

/**
 * Assign default values to item
 *
 * @param {object} item
 * @returns {object}
 */
function setDefaults(item) {
    var result = {};

    (item._defaults === void 0 ? [item, itemDefaults] : [item, item._defaults, itemDefaults]).forEach(function(values) {
        Object.keys(values).forEach(function(attr) {
            if (typeof values[attr] !== 'object' && result[attr] === void 0) {
                result[attr] = values[attr];
            }
        });
    });

    if (result.inlineTop === void 0) {
        result.inlineTop = result.top;
    }
    if (result.inlineHeight === void 0) {
        result.inlineHeight = result.height;
    }
    if (result.verticalAlign === void 0) {
        if (result.height % 7 === 0 && result.height % 8 !== 0) {
            // Icons designed for 14px height
            result.verticalAlign = -0.143;
        } else {
            // Assume icon is designed for 16px height
            result.verticalAlign = -0.125;
        }
    }

    return result;
}


/**
 * Returns new instance of storage object
 *
 * @return {object}
 * @constructor
 */
function Storage() {
    // Raw data
    this._icons = {};
    this._aliases = {};

    // Normalized data (both icons and aliases). false = pending, null = cannot be resolved, object = resolved
    this._resolved = {};

    /**
     * Add icon or alias to storage
     *
     * @param {boolean} alias
     * @param {object} icon
     * @param {object} data
     * @private
     */
    this._add = function(alias, icon, data) {
        var key = alias ? '_aliases' : '_icons';

        if (this._resolved[icon.prefix] === void 0) {
            // Add resolved object to mark prefix as usable
            this._resolved[icon.prefix] = {};
            this._icons[icon.prefix] = {};
            this._aliases[icon.prefix] = {};
        } else {
            // Delete old item with same name
            delete this._icons[icon.prefix][icon.icon];
            delete this._aliases[icon.prefix][icon.icon];
        }

        // Mark that item exists for quick lookup
        this._resolved[icon.prefix][icon.icon] = false;
        this[key][icon.prefix][icon.icon] = data;
    };

    /**
     * Resolve icon
     *
     * @param {object} icon
     * @returns {object|null}
     * @private
     */
    this._resolveIcon = function(icon) {
        var item, counter, result, parentIcon, isAlias, parent;

        // Check if icon exists
        if (this._resolved[icon.prefix] === void 0 || this._resolved[icon.prefix][icon.icon] === void 0) {
            return null;
        }

        // Already resolved?
        if (this._resolved[icon.prefix][icon.icon] !== false) {
            return this._resolved[icon.prefix][icon.icon];
        }

        // Icon - set defaults, store resolved value, return
        if (this._icons[icon.prefix][icon.icon] !== void 0) {
            return this._resolved[icon.prefix][icon.icon] = setDefaults(this._icons[icon.prefix][icon.icon]);
        }

        // Resolve alias
        counter = 0;
        item = this._aliases[icon.prefix][icon.icon];
        result = {};
        Object.keys(item).forEach(function(attr) {
            if (attr !== 'parent') {
                result[attr] = item[attr];
            }
        });
        parentIcon = item.parent;

        while (true) {
            counter ++;
            if (counter > 5 || this._resolved[icon.prefix][parentIcon] === void 0) {
                return this._resolved[icon.prefix][icon.icon] = null;
            }

            isAlias = this._icons[icon.prefix][parentIcon] === void 0;
            parent = this[isAlias ? '_aliases' : '_icons'][icon.prefix][parentIcon];

            // Merge data
            Object.keys(parent).forEach(function(attr) {
                if (result[attr] === void 0) {
                    if (attr !== 'parent') {
                        result[attr] = parent[attr];
                    }
                    return;
                }
                switch (attr) {
                    case 'rotate':
                        result[attr] = mergeRotation(result[attr], parent[attr]);
                        break;

                    case 'hFlip':
                    case 'vFlip':
                        result[attr] = mergeFlip(result[attr], parent[attr]);
                }
            });

            if (!isAlias) {
                break;
            }
            parentIcon = parent.parent;
        }

        return this._resolved[icon.prefix][icon.icon] = setDefaults(result);
    };

    /**
     * Function to add collection
     *
     * @param {object} json JSON data
     */
    this.addCollection = function(json) {
        // Get default values
        var that = this,
            defaults = {};

        // Get default values for icons
        itemAttributes.forEach(function(attr) {
            if (json[attr] !== void 0) {
                defaults[attr] = json[attr];
            } else if (itemDefaults[attr] !== void 0) {
                defaults[attr] = itemDefaults[attr];
            }
        });

        // Parse icons
        if (json.icons !== void 0) {
            Object.keys(json.icons).forEach(function(key) {
                var icon = getPrefix(key, json.prefix),
                    item = json.icons[key];
                if (item.body === void 0) {
                    return;
                }
                item._defaults = defaults;
                that._add(false, icon, item);
            });
        }

        // Parse aliases
        if (json.aliases !== void 0) {
            Object.keys(json.aliases).forEach(function(key) {
                var icon = getPrefix(key, json.prefix),
                    item = json.aliases[key];
                if (item.parent === void 0) {
                    return;
                }
                if (json.prefix === void 0) {
                    // Remove prefix from parent item
                    if (item.parent.slice(0, icon.prefix.length) !== icon.prefix) {
                        return;
                    }
                    item.parent = item.parent.slice(icon.prefix.length + 1);
                }
                that._add(true, icon, item);
            });
        }
    };

    /**
     * Add icon
     *
     * @param {string} name Icon name
     * @param {object} data Icon data
     * @param {string} [prefix] Icon prefix
     */
    this.addIcon = function(name, data, prefix) {
        var alias = data.parent !== void 0,
            icon = getPrefix(name, prefix);

        if (alias && prefix === void 0) {
            // Remove prefix from parent item
            if (data.parent.slice(0, icon.prefix.length) !== icon.prefix) {
                return;
            }
            data.parent = data.parent.slice(icon.prefix.length + 1);
        }

        this._add(alias, icon, data);
    };

    /**
     * Check if icon exists
     *
     * @param {string} name Icon name
     * @param {string} [prefix] Icon prefix. If prefix is set, name should not include prefix
     * @return {boolean}
     */
    this.exists = function(name, prefix) {
        var icon = getPrefix(name, prefix);

        return this._resolved[icon.prefix] !== void 0 && this._resolved[icon.prefix][icon.icon] !== void 0;
    };

    /**
     * Get item data as object reference (changing it will change original object)
     *
     * @param {string} name Icon name
     * @param {string} [prefix] Optional icon prefix
     * @return {object|null}
     */
    this.getIcon = function(name, prefix) {
        var icon = getPrefix(name, prefix);

        return this._resolveIcon(icon);
    };

    /**
     * Get item data as copy of object
     *
     * @param {string} name Icon name
     * @param {string} [prefix] Optional icon prefix
     * @return {object|null}
     */
    this.copyIcon = function(name, prefix) {
        var item = this.getIcon(name, prefix),
            result;

        if (item === null) {
            return null;
        }

        result = {};
        Object.keys(item).forEach(function(attr) {
            result[attr] = item[attr];
        });

        return result;
    };

    /**
     * Get list of available items
     *
     * @param {string} [prefix] Optional prefix
     * @return {Array}
     */
    this.list = function(prefix) {
        var results, items;

        if (prefix !== void 0) {
            return this._resolved[prefix] === void 0 ? [] : Object.keys(this._resolved[prefix]);
        }

        results = [];
        items = this._resolved;
        Object.keys(items).forEach(function(prefix) {
            results = results.concat(Object.keys(items[prefix]).map(function(key) {
                return prefix === '' && key.indexOf('-') === -1 ? key : prefix + ':' + key;
            }));
        });
        return results;
    };

    return this;
}

Storage.mergeFlip = mergeFlip;
Storage.mergeRotation = mergeRotation;
Storage.blankIcon = function() {
    var item = {
        body: '',
        width: 16,
        height: 16
    };
    return setDefaults(item);
};

module.exports = Storage;
