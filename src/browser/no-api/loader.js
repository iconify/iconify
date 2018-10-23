/**
 * This file is part of the @iconify/iconify package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt
 * file that was distributed with this source code.
 * @license MIT
 */

/**
 * Replacement for loader module when API is disabled
 * Only icons stored locally or bundled will be used
 */

local.loadImage = function(image, checkQueue) {
    var icon = local.getPrefix(image.icon);

    return Iconify.iconExists(icon.icon, icon.prefix);
};
