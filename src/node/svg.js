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

let SVG = require('../common/svg');

let config = SVG._config;

// Attribute for rotation
config._rotateAttribute = 'data-rotate';

// Attribute for flip
config._flipAttribute = 'data-flip';

// Attribute for inline mode
config._inlineModeAttribute = 'data-icon-inline';

// Attribute for alignment
config._alignAttribute = 'data-align';
/**
 * Function to convert SVG to string
 *
 * @param props
 * @return {string|null}
 */
SVG.prototype.toString = function(props) {
    let data = this.attributes(props),
        html;

    function htmlspecialchars(value) {
        switch (typeof value) {
            case 'boolean':
            case 'number':
                return value + '';

            case 'string':
                return value.
                replace(/&/g, "&amp;").
                replace(/</g, "&lt;").
                replace(/>/g, "&gt;").
                replace(/"/g, "&quot;").
                replace(/'/g, "&#039;");
        }
        return '';
    }

    if (data === null) {
        return null;
    }

    html = '<svg';
    Object.keys(data.attributes).forEach(function(attr) {
        html += ' ' + htmlspecialchars(attr) + '="' + htmlspecialchars(data.attributes[attr]) + '"';
    });
    Object.keys(data.elementAttributes).forEach(function(attr) {
        html += ' ' + htmlspecialchars(attr) + '="' + htmlspecialchars(data.elementAttributes[attr]) + '"';
    });

    return html + '>' + data.body + '</svg>';
};

module.exports = SVG;