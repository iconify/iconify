/**
 * This file is part of the @iconify/iconify package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license.gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
 */

"use strict";

var Storage = require('./storage');
var config = {};

/**
 * Regular expressions for calculating dimensions
 *
 * @type {RegExp}
 */
var unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g,
    unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;

/**
 * List of attributes used in generating SVG code that should not be passed to SVG object
 *
 * @type {Array}
 */
var reservedAttributes = ['width', 'height', 'inline'];

/**
 * Unique id counter
 *
 * @type {number}
 */
var idCounter = 0;

/**
 * Calculate second dimension when only 1 dimension is set
 *
 * @param {string|number} size One dimension (such as width)
 * @param {number} ratio Width/height ratio.
 *      If size is width, ratio = height/width
 *      If size is height, ratio = width/height
 * @param {number} [precision] Floating number precision in result to minimize output. Default = 100
 * @return {string|number} Another dimension
 */
function calculateDimension(size, ratio, precision) {
    var split, number, results, code, isNumber, num;

    if (ratio === 1) {
        return size;
    }

    precision = precision === void 0 ? 100 : precision;
    if (typeof size === 'number') {
        return Math.ceil(size * ratio * precision) / precision;
    }

    if (typeof size !== 'string') {
        return size;
    }

    // Split code into sets of strings and numbers
    split = size.split(unitsSplit);
    if (split === null || !split.length) {
        return size;
    }

    results = [];
    code = split.shift();
    isNumber = unitsTest.test(code);

    while (true) {
        if (isNumber) {
            num = parseFloat(code);
            if (isNaN(num)) {
                results.push(code);
            } else {
                results.push(Math.ceil(num * ratio * precision) / precision);
            }
        } else {
            results.push(code);
        }

        // next
        code = split.shift();
        if (code === void 0) {
            return results.join('');
        }
        isNumber = !isNumber;
    }
}

/**
 * Replace IDs in SVG output with unique IDs
 * Fast replacement without parsing XML, assuming commonly used patterns.
 *
 * @param body
 * @return {*}
 */
function replaceIDs(body) {
    var regex = /\sid="(\S+)"/g,
        ids = [],
        match, prefix;

    function strReplace(search, replace, subject) {
        var pos = 0;

        while ((pos = subject.indexOf(search, pos)) !== -1) {
            subject = subject.slice(0, pos) + replace + subject.slice(pos + search.length);
            pos += replace.length;
        }

        return subject;
    }

    // Find all IDs
    while (match = regex.exec(body)) {
        ids.push(match[1]);
    }
    if (!ids.length) {
        return body;
    }

    prefix = 'IconifyId-' + Date.now().toString(16) + '-' + (Math.random() * 0x1000000 | 0).toString(16) + '-';

    // Replace with unique ids
    ids.forEach(function(id) {
        var newID = prefix + idCounter;
        idCounter ++;
        body = strReplace('="' + id + '"', '="' + newID + '"', body);
        body = strReplace('="#' + id + '"', '="#' + newID + '"', body);
        body = strReplace('(#' + id + ')', '(#' + newID + ')', body);
    });

    return body;
}


/**
 * Get boolean attribute value
 *
 * @param {object} attributes
 * @param {Array} properties
 * @param {*} defaultValue
 * @return {*}
 */
function getBooleanValue(attributes, properties, defaultValue) {
    var i, prop, value;

    for (i = 0; i < properties.length; i++) {
        prop = properties[i];
        if (attributes[prop] !== void 0) {
            value = attributes[prop];
            switch (typeof value) {
                case 'boolean':
                    return value;

                case 'number':
                    return !!value;

                case 'string':
                    switch (value.toLowerCase()) {
                        case '1':
                        case 'true':
                        case prop:
                            return true;

                        case '0':
                        case 'false':
                        case '':
                            return false;
                    }
            }
        }
    }

    return defaultValue;
}

/**
 * Get boolean attribute value
 *
 * @param {object} attributes
 * @param {Array} properties
 * @param {*} defaultValue
 * @return {*}
 */
function getValue(attributes, properties, defaultValue) {
    var i, prop;

    for (i = 0; i < properties.length; i++) {
        prop = properties[i];
        if (attributes[prop] !== void 0) {
            return attributes[prop];
        }
    }

    return defaultValue;

}

/**
 * SVG object constructor
 *
 * @param {object} item Item from storage
 * @return {SVG}
 * @constructor
 */
function SVG(item) {
    if (!item) {
        // Set empty icon
        item = Storage.blankIcon();
    }

    this.item = item;

    /**
     * Get icon height
     *
     * @param {string|number} [width] Width to calculate height for. If missing, default icon height will be returned.
     * @param {boolean} [inline] Inline mode. If missing, assumed to be false
     * @param {number} [precision] Precision for calculating height. Result is rounded to 1/precision. Default = 100
     * @return {number|null}
     */
    this.height = function(width, inline, precision) {
        if (width === void 0) {
            return inline ? this.item.inlineHeight : this.item.height;
        }
        return calculateDimension(width, (inline ? this.item.inlineHeight : this.item.height) / this.item.width, precision);
    };

    /**
     * Get icon width
     *
     * @param {string|number} [height] Height to calculate width for. If missing, default icon width will be returned.
     * @param {boolean} [inline] Inline mode. If missing, assumed to be false
     * @param {number} [precision] Precision for calculating width. Result is rounded to 1/precision. Default = 100
     * @return {number|null}
     */
    this.width = function(height, inline, precision) {
        if (height === void 0) {
            return this.item.width;
        }
        return calculateDimension(height, this.item.width / (inline ? this.item.inlineHeight : this.item.height), precision);
    };

    /**
     * Get default SVG attributes
     *
     * @return {object}
     */
    this.defaultAttributes = function() {
        return {
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            'aria-hidden': 'true'
        };
    };

    /**
     * Get preserveAspectRatio attribute value
     *
     * @param {*} [horizontal] Horizontal alignment: left, center, right. Default = center
     * @param {*} [vertical] Vertical alignment: top, middle, bottom. Default = middle
     * @param {boolean} [slice] Slice: true or false. Default = false
     * @return {string}
     */
    this.preserveAspectRatio = function(horizontal, vertical, slice) {
        var result = '';
        switch (horizontal) {
            case 'left':
                result += 'xMin';
                break;

            case 'right':
                result += 'xMax';
                break;

            default:
                result += 'xMid';
        }
        switch (vertical) {
            case 'top':
                result += 'YMin';
                break;

            case 'bottom':
                result += 'YMax';
                break;

            default:
                result += 'YMid';
        }
        result += slice === true ? ' slice' : ' meet';
        return result;
    };

    /**
     * Generate SVG attributes from attributes list
     *
     * @param {object} [attributes] Element attributes
     * @return {object|null}
     */
    this.attributes = function(attributes) {
        var align = {
            horizontal: 'center',
            vertical: 'middle',
            crop: false
        };

        var transform = {
            rotate: item.rotate,
            hFlip: item.hFlip,
            vFlip: item.vFlip
        };
        var style = '';
        var result = this.defaultAttributes();

        var box, customWidth, customHeight, width, height, inline, body, value, split, append, units, extraAttributes;
        var transformations = [], tempValue;

        attributes = typeof attributes === 'object' ? attributes : {};

        // Check mode and get dimensions
        inline = getBooleanValue(attributes, [config._inlineModeAttribute, 'inline'], true);
        append = getBooleanValue(attributes, [config._appendAttribute], false);

        box = {
            left: item.left,
            top: inline ? item.inlineTop : item.top,
            width: item.width,
            height: inline ? item.inlineHeight : item.height
        };

        // Transformations
        if (typeof attributes[config._flipAttribute] === 'string') {
            attributes[config._flipAttribute].split(/[\s,]+/).forEach(function(value) {
                value = value.toLowerCase();
                switch (value) {
                    case 'horizontal':
                        transform.hFlip = !transform.hFlip;
                        break;

                    case 'vertical':
                        transform.vFlip = !transform.vFlip;
                        break;
                }
            });
        }
        if (attributes[config._rotateAttribute] !== void 0) {
            value = attributes[config._rotateAttribute];
            if (typeof value === 'number') {
                transform.rotate += value;
            } else if (typeof value === 'string') {
                units = value.replace(/^-?[0-9.]*/, '');
                if (units === '') {
                    value = parseInt(value);
                    if (!isNaN(value)) {
                        transform.rotate += value;
                    }
                } else if (units !== value) {
                    split = false;
                    switch (units) {
                        case '%':
                            // 25% -> 1, 50% -> 2, ...
                            split = 25;
                            break;

                        case 'deg':
                            // 90deg -> 1, 180deg -> 2, ...
                            split = 90;
                    }
                    if (split) {
                        value = parseInt(value.slice(0, value.length - units.length));
                        if (!isNaN(value)) {
                            transform.rotate += Math.round(value / split);
                        }
                    }
                }
            }
        }

        // Apply transformations to box
        if (transform.hFlip) {
            if (transform.vFlip) {
                transform.rotate += 2;
            } else {
                // Horizontal flip
                transformations.push('translate(' + (box.width + box.left) + ' ' + (0 - box.top) + ')');
                transformations.push('scale(-1 1)');
                box.top = box.left = 0;
            }
        } else if (transform.vFlip) {
            // Vertical flip
            transformations.push('translate(' + (0 - box.left) + ' ' + (box.height + box.top) + ')');
            transformations.push('scale(1 -1)');
            box.top = box.left = 0;
        }
        switch (transform.rotate % 4) {
            case 1:
                // 90deg
                tempValue = box.height / 2 + box.top;
                transformations.unshift('rotate(90 ' + tempValue + ' ' + tempValue + ')');
                // swap width/height and x/y
                if (box.left !== 0 || box.top !== 0) {
                    tempValue = box.left;
                    box.left = box.top;
                    box.top = tempValue;
                }
                if (box.width !== box.height) {
                    tempValue = box.width;
                    box.width = box.height;
                    box.height = tempValue;
                }
                break;

            case 2:
                // 180deg
                transformations.unshift('rotate(180 ' + (box.width / 2 + box.left) + ' ' + (box.height / 2 + box.top) + ')');
                break;

            case 3:
                // 270deg
                tempValue = box.width / 2 + box.left;
                transformations.unshift('rotate(-90 ' + tempValue + ' ' + tempValue + ')');
                // swap width/height and x/y
                if (box.left !== 0 || box.top !== 0) {
                    tempValue = box.left;
                    box.left = box.top;
                    box.top = tempValue;
                }
                if (box.width !== box.height) {
                    tempValue = box.width;
                    box.width = box.height;
                    box.height = tempValue;
                }
                break;
        }

        // Calculate dimensions
        // Values for width/height: null = default, 'auto' = from svg, false = do not set
        // Default: if both values aren't set, height defaults to '1em', width is calculated from height
        customWidth = getValue(attributes, ['data-width', 'width'], null);
        customHeight = getValue(attributes, ['data-height', 'height'], null);

        if (customWidth === null && customHeight === null) {
            customHeight = '1em';
        }
        if (customWidth !== null && customHeight !== null) {
            width = customWidth;
            height = customHeight;
        } else if (customWidth !== null) {
            width = customWidth;
            height = calculateDimension(width, box.height / box.width);
        } else {
            height = customHeight;
            width = calculateDimension(height, box.width / box.height);
        }

        if (width !== false) {
            result.width = width === 'auto' ? box.width : width;
        }
        if (height !== false) {
            result.height = height === 'auto' ? box.height : height;
        }

        // Apply inline mode to offsets
        if (inline && item.verticalAlign !== 0) {
            style += 'vertical-align: ' + item.verticalAlign + 'em;';
        }

        // Check custom alignment
        if (typeof attributes[config._alignAttribute] === 'string') {
            attributes[config._alignAttribute].toLowerCase().split(/[\s,]+/).forEach(function(value) {
                switch (value) {
                    case 'left':
                    case 'right':
                    case 'center':
                        align.horizontal = value;
                        break;

                    case 'top':
                    case 'bottom':
                    case 'middle':
                        align.vertical = value;
                        break;

                    case 'crop':
                        align.crop = true;
                        break;

                    case 'meet':
                        align.crop = false;
                }
            });
        }

        // Add 360deg transformation to style to prevent subpixel rendering bug
        style += '-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);';

        // Generate style
        result.style = style + (attributes.style === void 0 ? '' : attributes.style);

        // Generate viewBox and preserveAspectRatio attributes
        result.preserveAspectRatio = this.preserveAspectRatio(align.horizontal, align.vertical, align.crop);
        result.viewBox = box.left + ' ' + box.top + ' ' + box.width + ' ' + box.height;

        // Generate body
        body = replaceIDs(this.item.body);

        if (transformations.length) {
            body = '<g transform="' + transformations.join(' ') + '">' + body + '</g>';
        }

        // Add misc attributes
        extraAttributes = {};
        Object.keys(attributes).forEach(function(attr) {
            if (result[attr] === void 0 && reservedAttributes.indexOf(attr) === -1) {
                extraAttributes[attr] = attributes[attr];
            }
        });

        return {
            attributes: result,
            elementAttributes: extraAttributes,
            body: body,
            append: append
        };
    };

    return this;
}

// Node.js only
SVG._config = config;
module.exports = SVG;
