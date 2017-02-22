/**
 * This file is part of the @cyberalien/simple-svg package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * This is not open source library.
 * This library can be used only with products available on artodia.com
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

"use strict";

/**
 * Default values for attributes
 *
 * @type {object}
 */
var itemDefaults = {
    rotate: 0,
    vFlip: false,
    hFlip: false
};

/**
 * List of attributes to check
 *
 * @type {[string]}
 */
var itemAttributes = ['body', 'rotate', 'vFlip', 'hFlip', 'width', 'height'];

/**
 * Normalize icon, return new object
 *
 * @param {object} item Item data
 * @param {object} [defaults] Default values for missing attributes
 * @return {object|null}
 */
function normalizeIcon(item, defaults) {
    var error = false,
        result = {};

    itemAttributes.forEach(function(attr) {
        if (error) {
            return;
        }
        if (item[attr] === void 0) {
            if (defaults[attr] === void 0) {
                error = true;
                return;
            }
            result[attr] = defaults[attr];
        } else {
            result[attr] = normalizeValue(attr, item[attr]);
            if (result[attr] === null) {
                error = true;
            }
        }
    });
    return error ? null : result;
}

/**
 * Normalize alias, return new object
 *
 * @param {object} item Alias data
 * @param {object} items List of available items
 * @return {object|null}
 */
function normalizeAlias(item, items) {
    var parent, result, error;

    if (typeof item.parent !== 'string' || items[item.parent] === void 0) {
        return null;
    }

    parent = items[item.parent];
    result = {
        parent: item.parent
    };
    error = false;

    itemAttributes.forEach(function(attr) {
        if (error) {
            return;
        }

        if (item[attr] === void 0) {
            result[attr] = parent[attr];
        } else {
            switch (attr) {
                case 'rotate':
                    result[attr] = mergeRotation(parent[attr], item[attr]);
                    break;

                case 'hFlip':
                case 'vFlip':
                    result[attr] = mergeFlip(parent[attr], item[attr]);
                    break;

                default:
                    result[attr] = normalizeValue(attr, item[attr]);
            }
            if (result[attr] === null) {
                error = true;
            }
        }
    });
    return error ? null : result;
}

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
            while (value < 0) {
                value += 4;
            }
            while (value > 3) {
                value -= 4;
            }
            return value;

        case 'width':
        case 'height':
            value = parseFloat(value);
            return isNaN(value) ? null : value;

        case 'vFlip':
        case 'hFlip':
            return !!value;

        case 'body':
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
 * Returns new instance of storage object
 *
 * @return {object}
 * @constructor
 */
function Storage() {
    this.items = {};

    /**
     * Function to add library
     *
     * @param {object} json JSON data
     * @return {number} Number of added items
     */
    this.addLibrary = function(json) {
        // Get default values
        var defaults = {},
            items = this.items,
            added = 0;

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
                var item = normalizeIcon(json.icons[key], defaults);
                if (item !== null) {
                    items[key] = item;
                    added ++;
                }
            });
        }

        // Parse aliases
        if (json.aliases !== void 0) {
            Object.keys(json.aliases).forEach(function(key) {
                var item = normalizeAlias(json.aliases[key], items);
                if (item !== null) {
                    items[key] = item;
                    added ++;
                }
            });
        }

        return added;
    };

    /**
     * Add icon
     *
     * @param {string} name Icon name
     * @param {object} data Icon data
     * @return {boolean} True if icon was added, false on error
     */
    this.addIcon = function(name, data) {
        if (data.parent !== void 0) {
            data = normalizeAlias(data, this.items);
        } else {
            data = normalizeIcon(data, itemDefaults);
        }
        return !!(this.items[name] = data);
    };

    /**
     * Check if icon exists
     *
     * @param {string} name Icon name
     * @return {boolean}
     */
    this.exists = function(name) {
        return !!this.items[name];
    };

    /**
     * Get list of available items
     *
     * @return {Array}
     */
    this.list = function() {
        return Object.keys(this.items);
    };

    /**
     * Get item data
     *
     * @param {string} name
     * @param {boolean} [copy] True if object should be copied. Default = true
     * @return {null}
     */
    this.get = function(name, copy) {
        var result, item;

        if (this.items[name] === void 0) {
            return null;
        }

        if (copy === false) {
            return this.items[name];
        }

        result = {};
        item = this.items[name];

        itemAttributes.forEach(function(key) {
            result[key] = item[key];
        });

        return result;
    };

    return this;
}

// Export static functions used by SVG object
Storage.mergeFlip = mergeFlip;
Storage.mergeRotation = mergeRotation;

module.exports = Storage;
