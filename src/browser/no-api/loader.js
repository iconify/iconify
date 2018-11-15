/**
 * This file is part of the @iconify/iconify package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license-gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
 */

/**
 * Replacement for loader module when API is disabled
 * Only icons stored locally or bundled will be used
 */

local.loadImage = function(image, checkQueue) {
    var icon = local.getPrefix(image.icon);

    return Iconify.iconExists(icon.icon, icon.prefix);
};
