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
 * @return {string|number|null} Another dimension, null on error
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
                return null;
            }
            results.push(Math.ceil(num * ratio * precision) / precision);
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
 * Get transformation string
 *
 * @param {object} attr Attributes
 * @return {string} Result is never empty. If no transformation is applied, returns rotate(360deg) that fixes
 *  rendering issue for small icons in Firefox
 */
function calculateTransformation(attr) {
    var rotate = attr.rotate;

    function rotation() {
        while (rotate < 1) {
            rotate += 4;
        }
        while (rotate > 4) {
            rotate -= 4;
        }
        return 'rotate(' + (rotate * 90) + 'deg)';
    }

    if (attr.vFlip && attr.hFlip) {
        rotate += 2;
        return rotation();
    }

    if (attr.vFlip || attr.hFlip) {
        return (rotate ? rotation() + ' ' : '') + 'scale(' + (attr.hFlip ? '-' : '') + '1, ' + (attr.vFlip ? '-' : '') + '1)';
    }
    return rotation();
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

    prefix = 'SimpleSVGId-' + Math.round(Math.random() * 65536).toString(16) + '-';

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
        item = Storage.normalizeIcon({
            body: '',
            width: 16,
            height: 16
        });
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
        return calculateDimension(height, this.item.width / (inline ? this.item.inlineHeight : this.item.height), precision);
    };

    /**
     * Get transformation string for icon
     *
     * @param {object} [props] Custom properties to merge with icon properties
     * @return {string|null}
     */
    this.transformation = function(props) {
        var data;

        if (props !== void 0) {
            data = {
                vFlip: props.vFlip === void 0 ? this.item.vFlip : Storage.mergeFlip(this.item.vFlip, props.vFlip),
                hFlip: props.hFlip === void 0 ? this.item.hFlip : Storage.mergeFlip(this.item.hFlip, props.hFlip),
                rotate: props.rotate === void 0 ? this.item.rotate : Storage.mergeRotation(this.item.rotate, props.rotate)
            };
        } else {
            data = this.item;
        }

        return calculateTransformation(data);
    };

    /**
     * Get default SVG attributes
     *
     * @return {object}
     */
    this.defaultAttributes = function() {
        return {
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink'
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
        var box = {
            left: item.left,
            top: item.top,
            width: item.width,
            height: item.height
        };
        var transform = {
            rotate: item.rotate,
            hFlip: item.hFlip,
            vFlip: item.vFlip
        };
        var style = '';
        var result = this.defaultAttributes();

        var customWidth, customHeight, width, height, inline, body, value, split, append, extraAttributes;

        attributes = typeof attributes === 'object' ? attributes : {};

        // Check mode
        inline = getBooleanValue(attributes, [config._inlineModeAttribute, 'inline'], null);
        append = getBooleanValue(attributes, [config._appendAttribute], false);

        // Calculate dimensions
        // Values for width/height: null = default, 'auto' = from svg, false = do not set
        // Default: if both values aren't set, height defaults to '1em', width is calculated from height
        customWidth = getValue(attributes, ['data-width', 'width'], null);
        customHeight = getValue(attributes, ['data-height', 'height'], null);

        if (customWidth === null && customHeight === null) {
            inline = inline === null ? true : inline;
            height = '1em';
            width = this.width(height, inline);
        } else if (customWidth !== null && customHeight !== null) {
            inline = inline === null ? (customHeight === false) : inline;
            width = customWidth;
            height = customHeight;
        } else if (customWidth !== null) {
            inline = inline === null ? false : inline;
            width = customWidth;
            height = this.height(width, inline);
        } else {
            inline = inline === null ? (customHeight === false) : inline;
            height = customHeight;
            width = this.width(height, inline);
        }

        if (width !== false) {
            result.width = width === 'auto' ? this.item.width : width;
        }

        if (height !== false) {
            result.height = height === 'auto' ? (inline ? this.item.inlineHeight : this.item.height) : height;
        }

        // Apply inline mode to offsets
        if (inline) {
            box.top = item.inlineTop;
            box.height = item.inlineHeight;
            if (item.verticalAlign !== 0) {
                style += 'vertical-align: ' + item.verticalAlign + 'em;';
            }
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
                transform.rotate = Storage.mergeRotation(transform.rotate, value);
            } else if (typeof value === 'string') {
                split = value.split(unitsSplit);
                value = 0;
                switch (split.length) {
                    case 2:
                        value = split[0] !== '' ? 0 : parseInt(split[0]);
                        break;

                    case 3:
                        if (split[0] !== '') {
                            break;
                        }
                        switch (split[2].toLowerCase()) {
                            case '%':
                                // 25% -> 1, 50% -> 2, ...
                                split = 25;
                                break;

                            case 'deg':
                                // 90deg -> 1, 180deg -> 2, ...
                                split = 90;
                                break;

                            default:
                                split = null;
                        }
                        if (split !== null) {
                            value = parseInt(split[1]);
                            value = !isNaN(value) && value % split === 0 ? value / split : 0;
                        }
                }
                if (!isNaN(value) && value !== 0) {
                    transform.rotate = Storage.mergeRotation(transform.rotate, value);
                }
            }
        }

        // Add transformation to style
        transform = calculateTransformation(transform);
        style += '-ms-transform: ' + transform + ';' +
            ' -webkit-transform: ' + transform + ';' +
            ' transform: ' + transform + ';';

        // Generate style
        result.style = style + (attributes.style === void 0 ? '' : attributes.style);

        // Generate viewBox and preserveAspectRatio attributes
        result.preserveAspectRatio = this.preserveAspectRatio(align.horizontal, align.vertical, align.crop);
        result.viewBox = box.left + ' ' + box.top + ' ' + box.width + ' ' + box.height;

        // Generate body
        body = replaceIDs(this.item.body);

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
