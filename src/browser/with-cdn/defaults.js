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
 * Default configuration when CDN module is included
 */
(function(config) {
    "use strict";

    // CDN callback script
    config.defaultCDN = '//icons.simplesvg.com/{prefix}.js?icons={icons}';

    // Custom CDN list. Key = prefix, value = CDN URL
    config._cdn = {};

    // Maximum URL size for CDN
    config.loaderMaxURLSize = 500;

    // Custom event to call when new set of images is added
    config._loaderEvent = 'SimpleSVGAddedIcons';

})(local.config);
