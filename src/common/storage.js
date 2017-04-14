/**
 * This file is part of the simple-svg package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt
 * file that was distributed with this source code.
 * @license MIT
 */

"use strict";

/**
 * Default values for attributes
 *
 * @type {object}
 */
var itemDefaults = {
    left: 0,
    top: 0,
    rotate: 0,
    vFlip: false,
    hFlip: false,
    inlineTop: 0,
    verticalAlign: -0.125
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
                if (attr === 'inlineHeight') {
                    result[attr] = result.height;
                } else {
                    error = true;
                }
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
    var parent, result, error, prefix;

    if (typeof item.parent !== 'string') {
        return null;
    }

    prefix = item.parent.split('-').shift();
    if (!items[prefix] || items[prefix][item.parent] === void 0) {
        return null;
    }

    parent = items[prefix][item.parent];
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
        case 'inlineHeight':
        case 'inlineTop':
        case 'verticalAlign':
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
     * Function to add collection
     *
     * @param {object} json JSON data
     * @param {string} [collectionPrefix] Common prefix used in collection
     * @return {number} Number of added items
     */
    this.addCollection = function(json, collectionPrefix) {
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
                var item = normalizeIcon(json.icons[key], defaults),
                    prefix;

                if (item !== null) {
                    prefix = collectionPrefix ? collectionPrefix : key.split('-').shift();
                    if (items[prefix] === void 0) {
                        items[prefix] = {};
                    }

                    items[prefix][key] = item;
                    added ++;
                }
            });
        }

        // Parse aliases
        if (json.aliases !== void 0) {
            Object.keys(json.aliases).forEach(function(key) {
                var item = normalizeAlias(json.aliases[key], items),
                    prefix;

                if (item !== null) {
                    prefix = collectionPrefix ? collectionPrefix : key.split('-').shift();
                    if (items[prefix] === void 0) {
                        items[prefix] = {};
                    }

                    items[prefix][key] = item;
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
        var prefix = name.split('-').shift();

        if (data.parent !== void 0) {
            data = normalizeAlias(data, this.items);
        } else {
            data = normalizeIcon(data, itemDefaults);
            if (this.items[prefix] === void 0) {
                this.items[prefix] = {};
            }
        }
        return !!(this.items[prefix][name] = data);
    };

    /**
     * Check if icon exists
     *
     * @param {string} name Icon name
     * @param {string} [prefix] Icon prefix
     * @return {boolean}
     */
    this.exists = function(name, prefix) {
        prefix = prefix === void 0 ? name.split('-').shift() : prefix;
        return this.items[prefix] !== void 0 && this.items[prefix][name] !== void 0;
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
            return this.items[prefix] === void 0 ? [] : Object.keys(this.items[prefix]);
        }

        results = [];
        items = this.items;
        Object.keys(items).forEach(function(prefix) {
            results = results.concat(Object.keys(items[prefix]));
        });
        return results;
    };

    /**
     * Get item data
     *
     * @param {string} name
     * @param {boolean} [copy] True if object should be copied. Default = true
     * @return {null}
     */
    this.get = function(name, copy) {
        var prefix = name.split('-').shift(),
            result, item;

        if (!this.items[prefix] || this.items[prefix][name] === void 0) {
            return null;
        }

        if (copy === false) {
            return this.items[prefix][name];
        }

        result = {};
        item = this.items[prefix][name];

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
