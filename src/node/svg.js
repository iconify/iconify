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

let SVG = require('../common/svg');

let config = SVG._config;

// Attribute for rotation
config._rotateAttribute = 'data-rotate';

// Attribute for flip
config._flipAttribute = 'data-flip';

// Attribute for inline mode
config._inlineModeAttribute = 'data-inline';

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

    if (data === null) {
        return null;
    }

    html = '<svg';
    Object.keys(data.attributes).forEach(attr => {
        html += ' ' + this.htmlspecialchars(attr) + '="' + this.htmlspecialchars(data.attributes[attr]) + '"';
    });
    Object.keys(data.elementAttributes).forEach(attr => {
        html += ' ' + this.htmlspecialchars(attr) + '="' + this.htmlspecialchars(data.elementAttributes[attr]) + '"';
    });

    return html + '>' + data.body + '</svg>';
};

module.exports = SVG;