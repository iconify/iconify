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
 * Find prefix for icon
 *
 * @param icon
 * @returns {{prefix, icon}}
 */
function getPrefix(icon) {
    var split, prefix;

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
