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

let SVG = require('../common/svg');

SVG.prototype.svgString = function(props) {
    let data = this.svgObject(props),
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

    return html + '>' + data.body + '</svg>';
};

module.exports = SVG;