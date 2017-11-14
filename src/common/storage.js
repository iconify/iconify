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

var getPrefix = require('./prefix');

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
    inlineTop: 0
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

    defaults = defaults === void 0 ? itemDefaults : defaults;

    itemAttributes.forEach(function(attr) {
        if (error) {
            return;
        }
        if (item[attr] === void 0) {
            if (defaults[attr] === void 0) {
                switch (attr) {
                    case 'inlineHeight':
                        result[attr] = result.height;
                        break;

                    case 'verticalAlign':
                        if (item.height % 7 === 0 && item.height % 8 !== 0) {
                            // Icons designed for 14px height
                            result[attr] = -0.143;
                        } else {
                            // Assume icon is designed for 16px height
                            result[attr] = -0.125;
                        }
                        break;

                    default:
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
    var parentIcon, parent, result, error;

    if (typeof item.parent !== 'string') {
        return null;
    }

    parentIcon = getPrefix(item.parent);
    if (!items[parentIcon.prefix] || items[parentIcon.prefix][parentIcon.icon] === void 0) {
        return null;
    }

    parent = items[parentIcon.prefix][parentIcon.icon];
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
            if (value > 3) {
                value %= 4;
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
     * @return {number} Number of added items
     */
    this.addCollection = function(json) {
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
                    iconData;

                if (item !== null) {
                    iconData = getPrefix(key);
                    if (items[iconData.prefix] === void 0) {
                        items[iconData.prefix] = {};
                    }

                    items[iconData.prefix][iconData.icon] = item;
                    added ++;
                }
            });
        }

        // Parse aliases
        if (json.aliases !== void 0) {
            Object.keys(json.aliases).forEach(function(key) {
                var item = normalizeAlias(json.aliases[key], items),
                    iconData;

                if (item !== null) {
                    iconData = getPrefix(key);
                    if (items[iconData.prefix] === void 0) {
                        items[iconData.prefix] = {};
                    }

                    items[iconData.prefix][iconData.icon] = item;
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
        var iconData = getPrefix(name);

        if (data.parent !== void 0) {
            data = normalizeAlias(data, this.items);
        } else {
            data = normalizeIcon(data, itemDefaults);
            if (this.items[iconData.prefix] === void 0) {
                this.items[iconData.prefix] = {};
            }
        }
        return !!(this.items[iconData.prefix][iconData.icon] = data);
    };

    /**
     * Check if icon exists
     *
     * @param {string} name Icon name
     * @return {boolean}
     */
    this.exists = function(name) {
        var iconData = getPrefix(name);
        return this.items[iconData.prefix] !== void 0 && this.items[iconData.prefix][iconData.icon] !== void 0;
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
            results = results.concat(Object.keys(items[prefix]).map(function(key) {
                return prefix === '' && key.indexOf('-') === -1 ? key : prefix + ':' + key;
            }));
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
        var iconData = getPrefix(name),
            result, item;

        if (!this.items[iconData.prefix] || this.items[iconData.prefix][iconData.icon] === void 0) {
            return null;
        }

        if (copy === false) {
            return this.items[iconData.prefix][iconData.icon];
        }

        result = {};
        item = this.items[iconData.prefix][iconData.icon];

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
Storage.normalizeIcon = normalizeIcon;

module.exports = Storage;
