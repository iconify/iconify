/**
 * This file is part of the simple-svg package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt
 * file that was distributed with this source code.
 * @license MIT
 */

/**
 * Replacement for loader module when CDN is disabled
 */

local.loadImage = function(image, checkQueue) {
    var icon = local.getPrefix(image.icon);

    return SimpleSVG.iconExists(icon.icon, icon.prefix);
};
