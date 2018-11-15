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

/**
 * Find prefix for icon
 *
 * @param {string} icon Icon name
 * @param {string} [prefix] Collection prefix
 * @returns {{prefix, icon}}
 */
function getPrefix(icon, prefix) {
    var split;

    if (typeof prefix === 'string' && prefix !== '') {
        return {
            prefix: prefix,
            icon: icon
        };
    }

    // Check for fa-pro:home
    split = icon.split(':');
    if (split.length === 2) {
        return {
            prefix: split[0],
            icon: split[1]
        };
    }

    // Check for fa-home
    split = icon.split('-');
    if (split.length > 1) {
        prefix = split.shift();
        return {
            prefix: prefix,
            icon: split.join('-')
        }
    }

    return {
        prefix: '',
        icon: icon
    };
}

module.exports = getPrefix;
